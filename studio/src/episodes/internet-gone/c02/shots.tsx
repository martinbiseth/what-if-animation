import React from 'react';
import { Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, FONT, Hero, factCard, Globe, OldRadio, Schematic, SCH, TitleCard, Smartphone, CitySkyline } from '../../../engine';
import { YOU, StreetSet, KitchenSet, phoneCU, propCU, faceCU, bigWord, talkShot, netCard, listCard, HeldPhone, at, Soft } from '../common';

// Chapter 2, the premise: Tuesday 7:42, every connection stops; what's gone; the scale (the 2021 outage, 5.5 billion
// people); the rules (power, devices, saved files and GPS still work); the planted rule: radio still works; the title.

const MORNING = StreetSet('morning');
const KIT = KitchenSet(0.3);

export const S1 = netCard({ kicker: 'CHAPTER 2', title: 'THE DAY IT STOPPED' });
export const S2 = phoneCU({ mode: 'clock', text: '7:42', Bg: KIT, push: 0.1 });

// ---------- S3: the network on the schematic: nodes and links, pulses running, then every link snaps ----------
const NODES = Array.from({ length: 22 }).map((_, i) => ({ x: 200 + ((i * 677) % 1520), y: 160 + ((i * 389) % 760) }));
const LINKS = NODES.flatMap((a, i) => NODES.slice(i + 1).map((b, k) => ({ a, b, i, k: i + k + 1 })).filter(({ a, b }) => Math.hypot(a.x - b.x, a.y - b.y) < 430));
export const S3: React.FC<ShotProps> = ({ t }) => {
  const cut = 62;
  return (
    <g>
      <Schematic t={t} id="net" />
      {LINKS.map(({ a, b, i, k }, n) => {
        const dead = t > cut + (n % 7);
        const p = ((t * 0.04 + n * 0.37) % 1);
        return (
          <g key={n}>
            <path d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke={dead ? '#3A2A3A' : SCH.live} strokeWidth={dead ? 3 : 5} strokeDasharray={dead ? '10 14' : undefined} opacity={dead ? 0.6 : 0.8} />
            {!dead ? <circle cx={a.x + (b.x - a.x) * p} cy={a.y + (b.y - a.y) * p} r={8} fill="#FFE2A8" /> : null}
          </g>
        );
      })}
      {NODES.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={22} fill="#101A2A" stroke={t > cut ? '#7E8DA6' : SCH.line} strokeWidth={6} />
          {t > cut + 4 ? <path d={`M ${n.x - 10} ${n.y - 10} L ${n.x + 10} ${n.y + 10} M ${n.x + 10} ${n.y - 10} L ${n.x - 10} ${n.y + 10}`} stroke="#FF3A2A" strokeWidth={5} /> : null}
        </g>
      ))}
      {t > cut && t < cut + 4 ? <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.25} /> : null}
    </g>
  );
};

// ---------- S4: what's gone, crossed out word by word ----------
export const S4 = listCard({
  items: [
    { at: 3, text: 'WEBSITES', ok: false }, { at: 36, text: 'APPS', ok: false }, { at: 60, text: 'EMAIL', ok: false },
    { at: 90, text: 'VIDEO CALLS', ok: false }, { at: 123, text: 'STREAMING', ok: false }, { at: 156, text: 'ONLINE GAMES', ok: false },
  ],
});

// ---------- S5: NOT SLOW. -> GONE. ----------
export const S5: React.FC<ShotProps> = (p) => {
  const A = bigWord({ word: 'NOT SLOW.', color: '#F6EFE3', size: 200 });
  const B = bigWord({ word: 'GONE.', color: '#FF3A2A', size: 260 });
  return p.t < 30 ? <A {...p} /> : <B {...p} t={p.t - 30} />;
};

// ---------- S6: wide, you on the doorstep in your socks, phone up, the street waking ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = at(1180, { yaw: -0.2, expr: 'worried', armR: { a: 140, b: 14 }, blink: idleBlink(t, 3), look: -0.3, headTilt: Math.sin(t / 20) * 3 });
  return (
    <g transform={camT(kf(t, [[0, 1150], [len, 1130]]), 560, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <MORNING t={t + 600} id="s6" />
      <Hero look={YOU} pose={me} />
      <HeldPhone pose={me} t={t} />
    </g>
  );
};

export const S7 = phoneCU({ mode: 'lock', text: 'Your order has shipped|Arriving Wednesday', Bg: MORNING, push: 0.1 });
export const S8 = faceCU({ look: YOU, Bg: MORNING, faces: [[0, 'neutral'], [10, 'oops']], yaw: 0.3, zoom: [3.0, 3.25] });

export const S9 = factCard({ value: 6, suffix: ' HOURS', label: 'FACEBOOK, INSTAGRAM, WHATSAPP: DOWN', sub: '4 OCTOBER 2021', format: (v) => String(Math.round(v)) });

// ---------- S10: the globe: every light out ----------
export const S10: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#0B0920" />
    <Globe x={960} y={560} r={380} t={t} marks={18} spin={0.004} />
    <g transform={`translate(960 1000) scale(${backOut(clamp((t - 24) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">EVERYTHING. FOREVER.</text>
    </g>
  </g>
);

export const S11 = factCard({ value: 5.5, suffix: ' BILLION', label: 'PEOPLE WHO USE THE INTERNET', sub: '68% OF EVERYONE ON EARTH · ITU 2024', format: (v) => v.toFixed(1) });

export const S12 = bigWord({ word: 'THE RULES', color: '#FFB15A', size: 200 });
export const S13 = listCard({
  title: 'STILL WORKS',
  items: [{ at: 2, text: 'ELECTRICITY', ok: true }, { at: 50, text: 'YOUR DEVICES', ok: true }, { at: 98, text: 'SAVED FILES', ok: true }],
});

// ---------- S14: GPS: a satellite circling the globe; a beam down to a dot ----------
export const S14: React.FC<ShotProps> = ({ t }) => {
  const a = t / 40;
  const sx = 960 + Math.cos(a) * 520;
  const sy = 540 + Math.sin(a) * 300 - 80;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0920" />
      <Globe x={960} y={600} r={320} t={t} spin={0.002} />
      <path d={`M ${sx} ${sy} L 1020 520`} stroke="#7FE8FF" strokeWidth={4} strokeDasharray="12 10" opacity={0.8} />
      <circle cx={1020} cy={520} r={16} fill="#3A7AFF" stroke="#fff" strokeWidth={5} />
      <circle cx={1020} cy={520} r={30 + (t % 30)} fill="none" stroke="#3A7AFF" strokeWidth={4} opacity={1 - (t % 30) / 30} />
      <g transform={`translate(${sx} ${sy})`}>
        <rect x={-30} y={-24} width={60} height={48} rx={6} fill="#C8CCD6" stroke="#100E16" strokeWidth={4} />
        <rect x={-130} y={-16} width={90} height={32} fill="#3A6AB8" stroke="#100E16" strokeWidth={4} />
        <rect x={40} y={-16} width={90} height={32} fill="#3A6AB8" stroke="#100E16" strokeWidth={4} />
      </g>
      <text x={960} y={1010} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#5BE08A" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">GPS STILL WORKS</text>
    </g>
  );
};

export const S15 = phoneCU({ mode: 'mapblank', Bg: MORNING, push: 0.08 });

// ---------- S16: the old radio on the kitchen shelf, aerial up, glowing ----------
export const S16 = propCU({ Bg: KIT, push: 0.1, draw: (t) => <OldRadio x={900} y={760} s={1.5} on={1} t={t} /> });

// ---------- S17: the planted rule, underlined ----------
export const S17 = listCard({ title: 'REMEMBER THIS', items: [{ at: 2, text: 'RADIO STILL WORKS', ok: true, hot: true }] });

// ---------- S18: the title over the city, its lights going out left to right ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1.08], [len, 1.0]]))}>
      <CitySkyline t={t} id="title" lit={0.6} spread={clamp(t / 50)} />
    </g>
    <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.25} />
    <TitleCard t={t} lines={['WHAT IF THE INTERNET', 'DISAPPEARED FOREVER?']} accent="#FF3A2A" accentT={20} y={420} size={120} />
  </g>
);
