import React from 'react';
import { ShotProps, kf, clamp, FONT, Glow, KITCHEN, stand, TOWN, Hero, basePose, rnd } from '../../../engine';
import words from './words.json';
import timeline from './timeline.json';
import {
  YOU, ELLIE, MUM, EG, TownSet, KitchenSet, BedroomSet, BridgeSet, scene, faceCU, insert, cueAt, egCard, bigWord, Walkie, ArmIn, DigitalClock, BeachPhoto, Bubble,
  TreeHouse, TREE, TorchBeam, Noodle, run, sitFloor, SetC, handAt,
} from '../common';

// Chapter 6, the choice: packing to leave, the photo on the fridge; the walkie-talkie hisses back on: Ellie, missed
// too, calling for days from your hiding place. It's 2:40. One more person, not two. You put the photo in your pocket,
// grab a torch and run the other way, Noodle at your heels.

type W = { w: string; s: number; e: number };
const WORDS = words as W[];
const startOf = (id: string) => ((timeline as { shots: { id: string; first: number }[] }).shots.find((s) => s.id === id)?.first ?? 0) / 30;
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
const line = (id: string, a: string, b: string): [number, number] => {
  const t0 = startOf(id) - 0.4;
  const i = WORDS.findIndex((w) => w.s >= t0 && norm(w.w) === norm(a));
  if (i < 0) return [0, 0];
  const j = WORDS.findIndex((w, k) => k > i && norm(w.w) === norm(b));
  return [WORDS[i].s, WORDS[j >= 0 ? j : i].e + 0.05];
};

const KIT = KitchenSet({ veil: 0.3, dark: 0.45 });
const ROOM = BedroomSet({ clock: '02:31', veil: 0.4, lamp: 0, dark: 0.5 });
const NIGHT = TownSet('night', { dark: 0.45 });
const PARK: SetC = ({ t, id }) => <TreeHouse t={t} id={id} lamp={0} window={1} />;
const Static: React.FC<{ t: number; o?: number }> = ({ t, o = 0.2 }) => (
  <g opacity={o}>
    {Array.from({ length: 60 }).map((_, i) => (
      <rect key={i} x={rnd(Math.floor(t / 2) * 7 + i, 1) * 1920} y={rnd(Math.floor(t / 2) * 7 + i, 2) * 1080} width={40 + rnd(i, 3) * 200} height={3} fill="#F6EFE3" />
    ))}
  </g>
);

// ---------- S1: you run home to pack a bag ----------
export const S1 = egCard({ kicker: 'DAY 12, NIGHT', title: 'THE VOICE', Bg: KIT });

// a backpack on the worktop
const Bag: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -110 0 L -120 -200 Q -110 -260 0 -260 Q 110 -260 120 -200 L 110 0 Z" fill="#3A6AB8" stroke="#14121C" strokeWidth={8} />
    <rect x={-80} y={-110} width={160} height={90} rx={20} fill="#2E5698" stroke="#14121C" strokeWidth={6} />
    <path d="M -50 -260 Q 0 -320 50 -260" stroke="#14121C" strokeWidth={12} fill="none" />
  </g>
);

// ---------- S2: you don't need much. Just ----------
const youK = stand(KITCHEN, 0.55, 0.6);
export const S2 = scene({
  Set: KIT, cam: { from: [960, 540, 1.3], to: [960, 540, 1.38] }, day: 12,
  cast: [{ look: YOU, pose: { ...youK, yaw: 0.2, armR: { a: -40, b: -50 } }, faces: [[0, 'worried']] }],
  front: () => <Bag x={youK.x + 230} y={youK.y - 20} s={0.45} />,
});

// ---------- S3: the photo on the fridge: Mum, Ellie and you, at the beach, last summer ----------
export const S3 = insert({
  bgColor: '#B8BCC8', push: 0.1,
  draw: (t) => (
    <g>
      <rect x={-100} y={-100} width={2200} height={1300} fill="#C8CCD6" />
      <rect x={1700} y={-100} width={40} height={1300} fill="#A8ACB8" />
      <circle cx={420} cy={300} r={40} fill={EG.red} />
      <circle cx={1480} cy={820} r={36} fill="#4AA8E0" />
      <BeachPhoto x={960} y={520} s={2.2} rot={-4} />
      {[[-70, 'Mum'], [0, 'you'], [60, 'Ellie']].map(([dx, l], i) => (
        <text key={i} x={960 + (dx as number) * 2.2} y={900} textAnchor="middle" fontFamily={FONT.hand} fontSize={48} fill="#1A2A6A" opacity={clamp((t - 30 - i * 10) / 8)}>{l}</text>
      ))}
    </g>
  ),
});

// ---------- S4: that's when you hear it, from Ellie's room ----------
export const S4 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'neutral'], [8, 'shock']], yaw: -0.4, look_: -0.8, zoom: [2.9, 3.05], pose: { headTilt: -8 } });

// ---------- S5: hissing. The walkie-talkie. The one you switched off on the very first day ----------
export const S5 = scene({
  Set: ROOM, setT: 200, cam: { from: [940, 600, 1.1], to: [940, 680, 1.6] },
  front: (t) => (
    <g>
      <Walkie x={940} y={760} s={0.4} rot={-8} on={1} hiss={1} t={t} />
      <Glow x={920} y={720} r={180} kind="red" o={0.4} />
    </g>
  ),
});

// ---------- S5B: it's on again ----------
export const S5B = insert({ Bg: ROOM, push: 0.12, dim: 0.5, draw: (t) => <Walkie x={960} y={940} s={1.8} rot={-6} on={1} hiss={1} t={t} /> });

// ---------- S6: through the static: 'Hello? Is anybody there? It's really dark.' ----------
export const S6: React.FC<ShotProps> = (p) => {
  const c = (w: string) => cueAt(words, p.f, p.t, w);
  const I = insert({
    Bg: ROOM, push: 0.06, dim: 0.55,
    draw: (t) => (
      <g>
        <Walkie x={700} y={1000} s={1.7} rot={-6} on={1} hiss={1} t={t} />
        <Static t={t} o={0.12} />
        <Bubble x={1300} y={300} t={t} at={c('Hello')} text="Hello?" italic />
        <Bubble x={1300} y={480} t={t} at={c('Is')} text="Is anybody there?" italic />
        <Bubble x={1300} y={660} t={t} at={c('really')} text="It's really dark." italic />
      </g>
    ),
  });
  return <I {...p} />;
};

// ---------- S7: it's Ellie. She's here ----------
export const S7 = faceCU({ look: YOU, Bg: ROOM, faces: [[0, 'shock']], yaw: 0.2, zoom: [3.0, 3.25], shake: 3 });

// ---------- S8: somewhere in this city. Missed, just like you ----------
export const S8 = scene({ Set: NIGHT, setT: 600, cam: { from: [960, 520, 1.3], to: [960, 500, 1.0] } });

// ---------- S9: you grab the walkie-talkie. 'Ellie! Where are you?' ----------
const L9 = line('S9', 'Ellie', 'you');
export const S9 = faceCU({
  look: YOU, Bg: ROOM, faces: [[0, 'shock']], yaw: 0.35, zoom: [2.8, 2.95], words, talk: [L9], side: -160,
  over: (t) => <Walkie x={1380} y={1180} s={1.5} rot={-14} on={1} t={t} />,
});

// ---------- S10: 'In the hiding place,' she whispers. 'Our place. I've been calling for days. Nobody answered.' ----------
export const S10: React.FC<ShotProps> = (p) => {
  const c = (w: string) => cueAt(words, p.f, p.t, w);
  const I = insert({
    Bg: ROOM, push: 0.06, dim: 0.55,
    draw: (t) => (
      <g>
        <Walkie x={700} y={1000} s={1.7} rot={-6} on={1} hiss={1} t={t} />
        <Static t={t} o={0.1} />
        <Bubble x={1300} y={240} t={t} at={c('In')} text="In the hiding place." italic size={44} />
        <Bubble x={1300} y={410} t={t} at={c('Our')} text="Our place." italic size={44} />
        <Bubble x={1300} y={580} t={t} at={c('calling')} text="I've been calling for days." italic size={44} />
        <Bubble x={1300} y={750} t={t} at={c('Nobody')} text="Nobody answered." italic size={44} />
      </g>
    ),
  });
  return <I {...p} />;
};

// ---------- S10B: then the static swallows her ----------
export const S10B = insert({
  Bg: ROOM, push: 0.04, dim: 0.6,
  draw: (t) => (
    <g>
      <Walkie x={960} y={1000} s={1.7} rot={-6} on={1} hiss={1} t={t} />
      <Static t={t} o={0.45} />
    </g>
  ),
});

// ---------- S11: your stomach drops ----------
export const S11 = faceCU({ look: YOU, Bg: ROOM, faces: [[0, 'worried']], yaw: 0.1, zoom: [3.2, 2.9], shake: 4, pose: { headTilt: 6 } });

// ---------- S12: you switched it off on day one. She has been calling ever since ----------
export const S12 = insert({
  Bg: BedroomSet({ clock: '18:40', veil: 0.4, lamp: 1 }), push: 0.06, dim: 0.4, day: 1,
  draw: (t) => {
    const off = 22;
    return (
      <g>
        <path d="M -100 820 Q 960 700 2100 820 L 2100 1200 L -100 1200 Z" fill="#3A4A8A" />
        <Walkie x={960} y={900} s={1.6} rot={-8} on={t < off ? 1 : 0} hiss={t < off ? 1 : 0} t={t} />
        <ArmIn from={[2100, 300]} to={[kf(t, [[0, 1500], [off - 2, 1060]]), kf(t, [[0, 420], [off - 2, 560]])]} w={130} />
        <rect width={1920} height={1080} fill="#C8A060" opacity={0.2} />
        {Array.from({ length: 4 }).map((_, i) => (
          <text key={i} x={300 + i * 420} y={240 + (i % 2) * 120} fontFamily={FONT.hand} fontSize={44} fill="#F6EFE3" opacity={clamp((t - 40 - i * 15) / 8) * 0.8}>{`day ${[2, 5, 8, 11][i]}: "hello?"`}</text>
        ))}
      </g>
    );
  },
});

// ---------- S13: you look at the clock. It's 2:40 in the morning ----------
export const S13 = insert({ Bg: ROOM, push: 0.1, draw: (t) => <DigitalClock x={960} y={540} s={1.3} text="2:40" t={t} /> });

// a door of light, swinging shut over `k` 0..1, someone waiting inside
const LightDoor: React.FC<{ t: number; k: number; who?: boolean }> = ({ t, k, who }) => (
  <g>
    <rect x={-100} y={-100} width={2200} height={1300} fill="#060A1A" />
    <Glow x={960} y={560} r={700} kind="warm" o={0.6 * (1 - k * 0.7)} />
    <rect x={760} y={180} width={400} height={800} fill="#FFE7A8" />
    {who ? (
      <g opacity={0.9}>
        <Hero look={MUM} pose={{ ...basePose, x: 960, y: 980 - 280 * 1.0, scale: 0.95, yaw: 0, expr: 'happy', armR: { a: -130, b: -20 }, headTilt: Math.sin(t / 20) * 4 }} />
      </g>
    ) : null}
    <path d={`M 760 180 L ${760 + 400 * (1 - k * 0.92)} ${180 + 40 * (1 - k)} L ${760 + 400 * (1 - k * 0.92)} ${980 - 40 * (1 - k)} L 760 980 Z`} fill="#8A6A44" stroke="#14121C" strokeWidth={8} opacity={k > 0.01 ? 1 : 0} />
    <rect x={740} y={160} width={440} height={840} fill="none" stroke="#3A3E52" strokeWidth={24} />
  </g>
);

// ---------- S14: the door closes at 3:07, and the man said ----------
export const S14 = insert({
  bgColor: '#060A1A', push: 0.06,
  draw: (t, len) => (
    <g>
      <LightDoor t={t} k={clamp((t - 10) / Math.max(1, len - 20))} />
      <g transform="translate(1520 260) scale(0.5)"><DigitalClock x={0} y={0} text="3:07" t={t} /></g>
    </g>
  ),
});

// ---------- S15: one more person. One. Not two ----------
export const S15 = bigWord({ kicker: 'ONE MORE PERSON', word: 'ONE. NOT TWO.', color: EG.red, size: 170 });

// ---------- S16: you look at the photo. Mum, smiling ----------
export const S16 = insert({
  Bg: KIT, push: 0.12, dim: 0.5,
  draw: (t) => (
    <g>
      <ArmIn from={[-100, 1200]} to={[700, 760]} w={130} />
      <ArmIn from={[2100, 1200]} to={[1220, 760]} w={130} />
      <BeachPhoto x={960} y={560} s={2.3} rot={kf(t, [[0, -2], [80, 1]])} />
      <Glow x={960} y={560} r={500} kind="cool" o={0.25} />
    </g>
  ),
});

// ---------- S16B: through the door, you could see her by breakfast ----------
export const S16B = insert({ bgColor: '#060A1A', push: 0.1, draw: (t) => <LightDoor t={t} k={0} who /> });

// ---------- S16C: and Ellie would be here, in the dark, alone ----------
export const S16C = scene({
  Set: PARK, setT: 300, cam: { from: [960, 520, 1.5], to: [960, 540, 1.65] },
  cast: [{ look: ELLIE, pose: sitFloor(900, TREE.floor, 1, 0.55, { headTilt: 18, armR: { a: 40, b: -90 }, armL: { a: 40, b: -90 } }), faces: [[0, 'worried']] }],
  front: (t) => <Walkie x={1000} y={TREE.floor} s={0.18} on={1} t={t} />,
});

// ---------- S17: if you go to the bridge, you get your whole life back ----------
export const S17 = scene({
  Set: BridgeSet({ dark: 0.35 }), setT: 400, cam: { from: [960, 520, 1.0], to: [1000, 500, 1.1] },
  over: (t) => (
    <g>
      <Glow x={1440} y={300} r={200} kind="warm" o={0.7} />
      <rect x={1428} y={286} width={24} height={30} fill="#FFD88A" />
    </g>
  ),
});

// ---------- S18: if you go to find Ellie, you might never get out ----------
export const S18 = scene({
  Set: PARK, setT: 400, cam: { from: [960, 540, 0.95], to: [960, 540, 1.05] },
  over: () => <rect width={1920} height={1080} fill="#060A1A" opacity={0.35} />,
});

// ---------- S19: you put it in your pocket, grab a torch, and ----------
export const S19 = faceCU({
  look: YOU, Bg: NIGHT, faces: [[0, 'cool']], yaw: -0.3, zoom: [2.8, 2.95], side: 120,
  over: (t) => <TorchBeam x={760 - clamp((t - 20) / 10) * 0} y={900} a={-160} len={900} w={340} o={clamp((t - 24) / 4) * 0.7} />,
});

// ---------- S20: run. Not towards the bridge. The other way ----------
export const S20 = scene({
  Set: NIGHT, setT: 700, cam: { from: [960, 540, 1.0], to: [800, 540, 1.0] },
  cast: (t) => [{ look: YOU, pose: run(t, 1500, 300, 0, 88, TOWN.feet, 0.95), faces: [[0, 'cool']] }],
  front: (t) => {
    const h = handAt(run(t, 1500, 300, 0, 88, TOWN.feet, 0.95));
    return <TorchBeam x={h.x} y={h.y} a={170} len={800} w={300} o={0.6} />;
  },
});

// ---------- S21: through streets with no lights, the torch beam over stopped cars, Noodle at your heels ----------
export const S21: React.FC<ShotProps> = (p) => {
  const x = (t: number) => kf(t, [[0, 2000], [p.len, -200]]);
  const S = scene({
    Set: TownSet('night', { dark: 0.6 }), setT: 800,
    cam: [[0, 1500, 560, 1.15], [-1, 300, 560, 1.15]],
    cast: (t) => [{ look: YOU, pose: run(t, 2000, -200, 0, p.len, TOWN.feet, 0.95), faces: [[0, 'cool']] }],
    front: (t) => {
      const h = handAt(run(t, 2000, -200, 0, p.len, TOWN.feet, 0.95));
      return (
        <g>
          <TorchBeam x={h.x} y={h.y} a={165 + Math.sin(t / 3) * 8} len={900} w={320} o={0.6} />
          <Noodle x={x(t) + 260} y={TOWN.feet + 8} s={0.55} t={t} walk={1.8} flip />
        </g>
      );
    },
  });
  return <S {...p} />;
};
