import React from 'react';
import { rnd } from '../anim';
import { Box, makeRoom, S3 } from '../room';
import { RoomShell, FloorShadow, stand } from '../furnish';
import { Cone, Dust, Glow, LightVeil } from '../light';

// A 1920s jazz club, built with the room kit: a raised stage across the back with a red curtain, a band in
// silhouette (piano, double bass, trumpet, drums), warm spotlights from the ceiling, round tables with little lamps
// in the middle of the room. Characters stand on the dance floor at w 0.45 to 0.7 (clubStand(u, w)). `dance` (0..1)
// sets the band and the dancers' bounce; `stop` freezes the band (the moment the music from the phone plays).
export const CLUB = makeRoom({ x: 960, y: 470 }, { x0: 380, x1: 1540, y0: 220, y1: 720 }, 3.3);
export const clubStand = (u: number, w: number) => stand(CLUB, u, w);
const STAGE_V = 0.86;

const Player: React.FC<{ x: number; y: number; s: number; kind: 'piano' | 'bass' | 'trumpet' | 'drums'; t: number; play: number }> = ({ x, y, s, kind, t, play }) => {
  const bob = Math.sin(t / 5) * 6 * play;
  const ink = '#140E16';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={ink}>
      {kind === 'piano' ? <path d="M -150 0 L -150 -110 L 60 -110 L 120 -150 L 140 -110 L 140 0 Z" /> : null}
      {kind === 'drums' ? (
        <g>
          <ellipse cx={0} cy={-40} rx={70} ry={40} />
          <ellipse cx={-80} cy={-100} rx={40} ry={10} />
          <path d="M -80 -100 L -80 0" stroke={ink} strokeWidth={6} />
        </g>
      ) : null}
      <g transform={`translate(${kind === 'piano' ? -40 : 0} ${bob})`}>
        <circle cx={0} cy={-230} r={34} />
        <path d="M -36 -190 Q 0 -200 36 -190 L 30 -80 L -30 -80 Z" />
        <path d="M -22 -80 L -26 0 M 22 -80 L 26 0" stroke={ink} strokeWidth={18} strokeLinecap="round" />
      </g>
      {kind === 'bass' ? <path d={`M 50 -10 Q 20 -60 40 -110 Q 20 -150 50 -190 L 56 -300 L 66 -300 L 62 -190 Q 96 -150 76 -110 Q 98 -60 68 -10 Z`} transform={`rotate(${Math.sin(t / 7) * 3 * play} 60 -10)`} /> : null}
      {kind === 'trumpet' ? <path d={`M 20 ${-210 + bob} L 110 ${-240 + bob} L 140 ${-262 + bob} L 140 ${-214 + bob} L 112 ${-226 + bob} L 22 ${-198 + bob} Z`} /> : null}
    </g>
  );
};

export const JazzClub: React.FC<{ t: number; id?: string; play?: number; veil?: number }> = ({ t, id = 'club', play = 1, veil = 0.46 }) => {
  const R = CLUB;
  const { P } = R;
  const spots = [0.28, 0.5, 0.72];
  const tables = [
    [0.12, 0.62], [0.3, 0.74], [0.7, 0.74], [0.88, 0.62], [0.2, 0.9], [0.8, 0.9],
  ];
  return (
    <g>
      <RoomShell r={R} id={id} floor="boards" wall="#3A2430" side="#2C1B26" floorC="#2A1A1E" ceiling="#140C12" />
      {/* the curtain: deep red folds across the back wall, gathered at the sides */}
      {Array.from({ length: 22 }).map((_, i) => {
        const a = P(i / 22, 0.06, 0);
        const b = P((i + 1) / 22, 0.06, 0);
        const c = P(0, STAGE_V, 0);
        return <rect key={i} x={a.x} y={a.y} width={b.x - a.x + 1} height={c.y - a.y} fill={i % 2 ? '#7A1A26' : '#921F2E'} />;
      })}
      <path d={`M ${P(0, 0.06, 0).x} ${P(0, 0.06, 0).y} H ${P(1, 0.06, 0).x}`} stroke="#E9B85A" strokeWidth={10} />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={`sc${i}`} cx={P(i / 11, 0.03, 0).x} cy={P(i / 11, 0.03, 0).y} r={9} fill="#FFE2A0" />
      ))}
      {/* the band on the stage */}
      <Player x={P(0.2, STAGE_V, 0.05).x} y={P(0.2, STAGE_V, 0.05).y} s={0.8} kind="piano" t={t} play={play} />
      <Player x={P(0.42, STAGE_V, 0.05).x} y={P(0.42, STAGE_V, 0.05).y} s={0.8} kind="bass" t={t + 7} play={play} />
      <Player x={P(0.6, STAGE_V, 0.05).x} y={P(0.6, STAGE_V, 0.05).y} s={0.8} kind="trumpet" t={t + 13} play={play} />
      <Player x={P(0.8, STAGE_V, 0.05).x} y={P(0.8, STAGE_V, 0.05).y} s={0.8} kind="drums" t={t + 3} play={play} />
      {/* the stage front */}
      <Box r={R} u={[0, 1]} v={[STAGE_V, 1]} w={[0, 0.16]} front="#3A2422" top="#5A3A30" side="#2A1A18" rim />
      {spots.map((u, i) => {
        const top = P(u, -0.2, 0.1);
        const a = P(u - 0.08, STAGE_V, 0.06);
        const b = P(u + 0.08, STAGE_V, 0.06);
        return <Cone key={i} d={`M ${top.x - 10} ${top.y} L ${top.x + 10} ${top.y} L ${b.x} ${b.y} L ${a.x} ${a.y} Z`} o={0.45 + 0.1 * Math.sin(t / 30 + i)} />;
      })}
      {/* round tables with lamps */}
      {tables.map(([u, w], i) => {
        const p = P(u, 1, w);
        const k = R.s(w);
        return (
          <g key={`tb${i}`}>
            <FloorShadow r={R} u={[u - 0.05, u + 0.05]} w={[w - 0.03, w + 0.03]} />
            <rect x={p.x - 6 * k} y={p.y - 60 * k} width={12 * k} height={60 * k} fill="#1A1014" />
            <ellipse cx={p.x} cy={p.y - 62 * k} rx={46 * k} ry={12 * k} fill="#E9DCC0" />
            <rect x={p.x - 6 * k} y={p.y - 92 * k} width={12 * k} height={28 * k} fill="#5A3A30" />
            <path d={`M ${p.x - 18 * k} ${p.y - 92 * k} L ${p.x + 18 * k} ${p.y - 92 * k} L ${p.x + 12 * k} ${p.y - 110 * k} L ${p.x - 12 * k} ${p.y - 110 * k} Z`} fill="#FFC870" />
            <Glow x={p.x} y={p.y - 100 * k} r={90 * k} o={0.5} />
          </g>
        );
      })}
      <LightVeil id={`${id}veil`} lights={[...spots.map((u) => [P(u, 0.7, 0.05).x, P(u, 0.7, 0.05).y, 230] as [number, number, number]), [960, 900, 380]]} o={veil} />
      {spots.map((u, i) => (
        <Glow key={`sg${i}`} x={P(u, 0.75, 0.05).x} y={P(u, 0.75, 0.05).y} r={200} o={0.35} />
      ))}
      <Dust t={t} seed={5} x0={500} y0={180} w={900} h={500} n={50} o={0.5} />
      {rnd(1, 1) > 2 ? <rect fill={S3.warm} /> : null}
    </g>
  );
};
