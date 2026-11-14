"""Publish: uploads a finished long-form episode to YouTube with its title, description, chapters, tags, captions and
thumbnail, as written by `long.py youtube`. Uploads are private unless series.json says otherwise, so you can watch
the video on YouTube before anyone else does.

    python <skill>/scripts/upload.py auth                 once per machine: sign in to the channel in a browser
    python <skill>/scripts/upload.py <slug> [--publish-at 2026-11-20T17:00:00Z] [--again]

Needs a Google Cloud project with the YouTube Data API v3 turned on and an OAuth client of type "Desktop app". Put
its id and secret in the environment or the .env above the studio (by name only, never in a file you commit):
    YT_CLIENT_ID=...    YT_CLIENT_SECRET=...
`auth` stores the channel's refresh token in .youtube-token.json next to that .env (keep it out of git).

Limits worth knowing: an upload costs 1,600 of the project's 10,000 daily quota units (about six uploads a day).
Videos uploaded through an API project Google hasn't audited yet are locked to private: watch them, then make
them public in YouTube Studio, or apply for the audit. A custom thumbnail needs a phone-verified channel.
"""
import http.server, io, json, os, pathlib, secrets, sys, threading, urllib.parse, urllib.request, webbrowser

from wi import STUDIO, load_json, load_series, out_dir, read_env, save_json

SCOPES = 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl'


def env(name):
    if os.environ.get(name):
        return os.environ[name]
    for d in [STUDIO, *STUDIO.parents]:
        p = d / '.env'
        if p.exists():
            for line in read_env(p).splitlines():
                if line.strip().startswith(name + '='):
                    return line.split('=', 1)[1].strip().strip('"').strip("'")
    raise SystemExit(f'No {name}: set it in the environment or a .env file (see the top of upload.py).')


def token_file():
    for d in [STUDIO, *STUDIO.parents]:
        if (d / '.env').exists():
            return d / '.youtube-token.json'
    return STUDIO / '.youtube-token.json'


def post_form(url, data):
    req = urllib.request.Request(url, data=urllib.parse.urlencode(data).encode())
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())


def auth():
    """The installed-app OAuth flow on a loopback port: opens the consent page, catches the code, stores the token."""
    cid, secret = env('YT_CLIENT_ID'), env('YT_CLIENT_SECRET')
    state = secrets.token_urlsafe(16)
    got = {}

    class H(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            if q.get('state', [''])[0] == state and 'code' in q:
                got['code'] = q['code'][0]
                msg = 'Signed in. You can close this tab.'
            else:
                msg = 'Sign-in failed: ' + q.get('error', ['unknown'])[0]
            self.send_response(200)
            self.end_headers()
            self.wfile.write(msg.encode())

        def log_message(self, *a):
            pass

    srv = http.server.HTTPServer(('127.0.0.1', 0), H)
    redirect = f'http://127.0.0.1:{srv.server_port}'
    url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urllib.parse.urlencode({
        'client_id': cid, 'redirect_uri': redirect, 'response_type': 'code', 'scope': SCOPES,
        'access_type': 'offline', 'prompt': 'consent', 'state': state})
    print('Opening the Google sign-in page. If it does not open, paste this into a browser:\n' + url)
    webbrowser.open(url)
    t = threading.Thread(target=srv.handle_request)
    t.start()
    t.join(timeout=300)
    srv.server_close()
    if 'code' not in got:
        raise SystemExit('No sign-in within 5 minutes.')
    tok = post_form('https://oauth2.googleapis.com/token', {'code': got['code'], 'client_id': cid, 'client_secret': secret,
                                                            'redirect_uri': redirect, 'grant_type': 'authorization_code'})
    if 'refresh_token' not in tok:
        raise SystemExit('Google returned no refresh token: remove the app at myaccount.google.com/permissions and run auth again.')
    f = token_file()
    save_json(f, {'refresh_token': tok['refresh_token']})
    print(f'Saved the channel token to {f} (keep it out of git).')


def access_token():
    f = token_file()
    t = load_json(f)
    if not t:
        raise SystemExit('Not signed in: run `upload.py auth` first.')
    return post_form('https://oauth2.googleapis.com/token', {'client_id': env('YT_CLIENT_ID'), 'client_secret': env('YT_CLIENT_SECRET'),
                                                             'refresh_token': t['refresh_token'], 'grant_type': 'refresh_token'})['access_token']


def call(method, url, tok, body=None, headers=None):
    h = {'Authorization': f'Bearer {tok}', **(headers or {})}
    req = urllib.request.Request(url, data=body, method=method, headers=h)
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, dict(r.headers), r.read()
    except urllib.error.HTTPError as e:
        if method == 'PUT' and e.code == 308:  # resumable upload: "keep going"
            return 308, dict(e.headers), b''
        raise SystemExit(f'YouTube said {e.code}: {e.read().decode(errors="ignore")[:600]}')


def upload(slug, args):
    yd = out_dir(slug) / 'youtube'
    meta = load_json(yd / 'metadata.json')
    if not meta:
        raise SystemExit('No youtube/metadata.json: run `long.py youtube <slug>` first.')
    log = yd / 'upload.json'
    if log.exists() and '--again' not in args:
        raise SystemExit(f'Already uploaded ({load_json(log)["url"]}). Pass --again to upload a second copy.')
    video = pathlib.Path(meta['video'])
    if not video.exists():
        raise SystemExit(f'No video at {video}: run `long.py render <slug>` first.')
    if meta['seconds'] < 480:
        print(f"note: {meta['length']} is under 8:00, so this video can't carry mid-roll ads")
    status = {'privacyStatus': meta.get('privacy', 'private'), 'selfDeclaredMadeForKids': bool(meta.get('made_for_kids')),
              'containsSyntheticMedia': bool(meta.get('synthetic_media'))}
    if '--publish-at' in args:
        status['privacyStatus'] = 'private'  # YouTube publishes a scheduled video itself at publishAt
        status['publishAt'] = args[args.index('--publish-at') + 1]
    body = {'snippet': {'title': meta['title'][:100], 'description': (yd / meta['description_file']).read_text(encoding='utf-8'),
                        'tags': meta.get('tags', []), 'categoryId': str(meta.get('category', 27)),
                        'defaultLanguage': meta.get('language', 'en'), 'defaultAudioLanguage': meta.get('language', 'en')},
            'status': status}
    tok = access_token()
    size = video.stat().st_size
    _, h, _ = call('POST', 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', tok,
                   json.dumps(body).encode(), {'Content-Type': 'application/json; charset=UTF-8', 'X-Upload-Content-Type': 'video/mp4',
                                               'X-Upload-Content-Length': str(size)})
    where = h.get('Location') or h.get('location')
    CH = 16 * 1024 * 1024
    sent = 0
    with open(video, 'rb') as fh:
        while sent < size:
            fh.seek(sent)
            chunk = fh.read(CH)
            code, hh, out = call('PUT', where, tok, chunk, {'Content-Length': str(len(chunk)), 'Content-Range': f'bytes {sent}-{sent + len(chunk) - 1}/{size}'})
            if code == 308:
                rng = hh.get('Range') or hh.get('range')
                sent = int(rng.split('-')[1]) + 1 if rng else sent
            else:
                sent = size
            print(f'\r{sent / size * 100:5.1f}% of {size / 1e6:.0f} MB', end='', flush=True)
    vid = json.loads(out)['id']
    url = f'https://youtu.be/{vid}'
    print(f'\nuploaded: {url} ({status["privacyStatus"]})')
    save_json(log, {'id': vid, 'url': url, 'privacy': status['privacyStatus'], 'publishAt': status.get('publishAt')})

    if meta.get('captions') and (yd / meta['captions']).exists():
        boundary = 'wi' + secrets.token_hex(8)
        snip = json.dumps({'snippet': {'videoId': vid, 'language': meta.get('language', 'en'), 'name': ''}})
        srt = (yd / meta['captions']).read_bytes()
        mp = (f'--{boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n{snip}\r\n'
              f'--{boundary}\r\nContent-Type: application/octet-stream\r\n\r\n').encode() + srt + f'\r\n--{boundary}--\r\n'.encode()
        call('POST', 'https://www.googleapis.com/upload/youtube/v3/captions?uploadType=multipart&part=snippet', tok, mp,
             {'Content-Type': f'multipart/related; boundary={boundary}'})
        print('captions uploaded')
    if meta.get('thumbnail') and (yd / meta['thumbnail']).exists():
        from PIL import Image
        buf = io.BytesIO()
        Image.open(yd / meta['thumbnail']).convert('RGB').resize((1280, 720)).save(buf, 'JPEG', quality=88)  # under YouTube's 2 MB
        call('POST', f'https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId={vid}&uploadType=media', tok, buf.getvalue(),
             {'Content-Type': 'image/jpeg'})
        print('thumbnail set')
    mids = (yd / 'midrolls.txt').read_text(encoding='utf-8') if (yd / 'midrolls.txt').exists() else ''
    if mids and meta['seconds'] >= 480:
        print('Mid-roll ads: the API cannot place them. In YouTube Studio > the video > Monetization > Ad breaks, put them at:\n' + mids)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    if sys.argv[1] == 'auth':
        auth()
    else:
        load_series(sys.argv[1])
        upload(sys.argv[1], sys.argv[2:])
