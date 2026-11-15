import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ShotFrame, Hero, basePose, camT } from '../../engine';
import { Longhouse, Farmyard, Lake, HearthFront, YOU, YOU_WOOL, KETIL, KETIL_OUT, GUDRUN, ASA, ASA_OUT, hipAt, LH, FEET, Bowl, Stockfish, Tafl, FireKit, OilLamp, Mittens, Bucket, Axe } from './norse';

// A check sheet for the sets and the household (not part of the episode).
const P = (look: any, x: number, feet: number, s = 1, yaw = 0, expr: any = 'neutral') => <Hero look={look} pose={{ ...basePose, x, y: hipAt(feet, s), scale: s, yaw, expr }} />;
export const VWSheet: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <ShotFrame>
      <defs><clipPath id="vwq"><rect x={0} y={0} width={1920} height={1080} /></clipPath></defs>
      <g transform="scale(0.5)">
        <g clipPath="url(#vwq)"><g transform={camT(960, 540, 1)}>
          <Longhouse t={20} />
          {P(KETIL, 700, LH.back, 0.95, 0.3, 'happy')}{P(GUDRUN, 900, LH.back, 0.92, 0.1)}{P(ASA, 1060, LH.back, 0.7, -0.2, 'happy')}{P(YOU, 1260, LH.back, 0.95, -0.4, 'shock')}
          <HearthFront t={20} />
        </g></g>
      </g>
      <g transform="translate(960 0) scale(0.5)">
        <g clipPath="url(#vwq)"><g transform={camT(960, 540, 1)}>
          <Farmyard t={20} tod="day" />
          {P(KETIL_OUT, 700, FEET, 1, 0.4)}{P(YOU_WOOL, 1000, FEET, 1, -0.3, 'happy')}{P(ASA_OUT, 1200, FEET, 0.72, -0.4)}{P(YOU, 1400, FEET, 1, 0, 'worried')}
        </g></g>
      </g>
      <g transform="translate(0 540) scale(0.5)">
        <g clipPath="url(#vwq)"><g transform={camT(960, 540, 1)}>
          <Longhouse t={20} mode="dark" fire={0.05} />
        </g></g>
      </g>
      <g transform="translate(960 540) scale(0.5)">
        <g clipPath="url(#vwq)"><g transform={camT(960, 540, 1)}>
          <Lake t={20} />
          <Bowl x={300} y={900} t={10} /><Stockfish x={700} y={900} /><Tafl x={1100} y={860} s={0.6} /><FireKit x={1500} y={900} s={0.6} glow={1} />
          <OilLamp x={300} y={1040} t={4} /><Mittens x={700} y={1030} s={0.6} /><Bucket x={1100} y={1060} water={0.8} /><Axe x={1500} y={1000} rot={-30} />
        </g></g>
      </g>
    </ShotFrame>
  </AbsoluteFill>
);
