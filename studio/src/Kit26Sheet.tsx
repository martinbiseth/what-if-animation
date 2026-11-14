import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KitDefs } from './engine/kit';
import { SetDefs } from './engine/light';
import { Hero, LOOKS, basePose, CastName } from './engine/rig';
import { Street26, street26Hip } from './engine/sets/street26';
import { JazzClub, clubStand } from './engine/sets/jazzclub';
import { Smartphone, ScreenMode, Newspaper, Envelope, PhoneInHand, BatteryHud } from './engine/props26';

// The period kit at a glance: frame 0 the street with the ink cast, 1 the jazz club, 2 every phone screen,
// 3 newspaper, envelope and the phone in a hand.  npx remotion still src/index.ts Kit26 out/kit26-0.png --frame 0
const MODES: ScreenMode[] = ['home', 'camera', 'photo', 'music', 'nosignal', 'map', 'battery', 'calc', 'video', 'photos', 'record', 'pharmacy', 'signal', 'off'];

export const Kit26Sheet: React.FC = () => {
  const f = useCurrentFrame();
  const cast: CastName[] = ['gent', 'lady', 'you', 'worker', 'mo26', 'suit26'];
  return (
    <AbsoluteFill style={{ backgroundColor: '#14101C', filter: f < 2 ? 'sepia(0.25) saturate(0.9)' : undefined }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <KitDefs />
        <SetDefs />
        {f === 0 ? (
          <g>
            <Street26 t={40} />
            {cast.map((c, i) => (
              <Hero key={c} look={LOOKS[c]} pose={{ ...basePose, x: 300 + i * 270, y: street26Hip(1), yaw: i % 2 ? -0.4 : 0.4, expr: c === 'you' ? 'smug' : 'shock' }} />
            ))}
          </g>
        ) : null}
        {f === 1 ? (
          <g>
            <JazzClub t={40} />
            {[0.35, 0.5, 0.65].map((u, i) => {
              const s = clubStand(u, 0.6);
              return <Hero key={u} look={LOOKS[(['lady', 'you', 'gent'] as CastName[])[i]]} pose={{ ...basePose, ...s, yaw: 0.2 }} />;
            })}
          </g>
        ) : null}
        {f === 2
          ? MODES.map((m, i) => <Smartphone key={m} x={140 + (i % 7) * 270} y={290 + Math.floor(i / 7) * 520} s={0.7} mode={m} t={30} battery={i === 6 ? 9 : 62} text={m === 'signal' ? "Don't give it|to him." : undefined} bars={m === 'signal' ? 1 : 0} glow={0.2} />)
          : null}
        {f === 3 ? (
          <g>
            <rect width={1920} height={1080} fill="#3A2C2A" />
            <Newspaper x={420} y={560} w={560} rot={-4} />
            <Envelope x={1000} y={760} />
            <PhoneInHand x={1450} y={460} s={0.9} mode="music" t={20} battery={62} />
            <BatteryHud p={41} t={20} />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
