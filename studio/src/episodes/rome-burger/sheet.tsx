import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ShotFrame, Hero, basePose, Look } from '../../engine';
import { RomeStreet, ShopInside, ShopCounter, CircusMaximus, RomeAlley, RomeMap, romeHip, SHOP, BurgerBasket, Burger, WaxTablet, Token } from './sets';
import { YOU, ELLIE, TULLIA, FELIX, OFFICIAL, SOLDIER, GLADIATOR, SENATOR, BAKER, CITIZENS } from './common';

// A dev sheet: every set of the episode in a 3x3 grid, with the cast standing in.
const P = (look: Look, x: number, y: number, s = 1, yaw = 0) => <Hero look={look} pose={{ ...basePose, x, y, scale: s, yaw }} />;
const cells: React.ReactNode[] = [
  <g key="a"><RomeStreet t={40} />{P(YOU, 1000, romeHip(1), 1, -0.3)}{P(ELLIE, 1150, romeHip(0.7), 0.7, -0.3)}</g>,
  <g key="b"><RomeStreet t={40} mode="dusk" />{[0, 1, 2, 3, 4].map((k) => P(CITIZENS[k], 860 + k * 150, romeHip(0.85), 0.85, -0.6))}</g>,
  <g key="c"><RomeStreet t={40} mode="night" fire={1} />{P(OFFICIAL, 1000, romeHip(1), 1, -0.3)}{P(SOLDIER, 1200, romeHip(1), 1, -0.3)}</g>,
  <g key="d"><ShopInside t={40} />{P(TULLIA, 700, SHOP.hip, 1, 0.2)}{P(YOU, 960, SHOP.hip, 1, 0)}{P(FELIX, 1220, SHOP.hip, 1, -0.2)}<ShopCounter burgers={3} tokens /></g>,
  <g key="e"><ShopInside t={40} night />{P(OFFICIAL, 960, SHOP.hip, 1, 0)}<ShopCounter night /><WaxTablet x={960} y={680} s={0.8} /></g>,
  <g key="f"><CircusMaximus t={40} race={0.3} cheer={1} />{P(FELIX, 960, 900 - 230, 1, 0.3)}<BurgerBasket x={1080} y={720} s={0.9} /></g>,
  <g key="g"><RomeAlley t={40} />{P(YOU, 900, 860 - 230, 1, 0.2)}{P(ELLIE, 1060, 860 - 230 * 0.7, 0.7, -0.2)}</g>,
  <g key="h"><RomeMap t={80} burn={0.7} /></g>,
  <g key="i"><rect width={1920} height={1080} fill="#3A3048" />{[YOU, ELLIE, TULLIA, FELIX, OFFICIAL, SENATOR, SOLDIER, GLADIATOR, BAKER].map((l, k) => P(l, 120 + k * 210, 600, l === ELLIE ? 0.7 : l === GLADIATOR ? 1.2 : 0.9, 0.2))}<Burger x={960} y={1000} s={1} /><Token x={1300} y={980} n="VII" /></g>,
];
export const RomeSets: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <ShotFrame>
      {cells.map((c, i) => (
        <g key={i} transform={`translate(${(i % 3) * 640} ${Math.floor(i / 3) * 360}) scale(${1 / 3})`}>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" overflow="hidden">{c}</svg>
        </g>
      ))}
    </ShotFrame>
  </AbsoluteFill>
);
