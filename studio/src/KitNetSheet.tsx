import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  ShotFrame, Suburb, Shop, RadioRoom, BroadcastMic, Router, Laptop, TVSet, CardTerminal, CashMachine, PetrolPump, Notice, Inhaler, OldRadio, PotSpeaker,
  Barbecue, Football, PaperMap, BoardGame, Jet, ServerRack, SeaCable, BlackCarFront, PinnedPage, CarKey, WifiIcon, Smartphone, BankCard,
} from './engine';

// A contact sheet of the internet episode's kit: frame 0 street (day), 1 street (night), 2 shop, 3 radio, 4 props, 5 sea, 6 phone screens.
export const KitNetSheet: React.FC = () => {
  const f = useCurrentFrame();
  const t = 40;
  return (
    <AbsoluteFill style={{ background: '#111' }}>
      <ShotFrame>
        {f === 0 ? <Suburb t={t} tod="morning" /> : null}
        {f === 1 ? <Suburb t={t} tod="night" cars={false} /> : null}
        {f === 2 ? <Shop t={t} empty={0.6} /> : null}
        {f === 3 ? <g><RadioRoom t={t} onAir={1} /><BroadcastMic x={760} y={600} /></g> : null}
        {f === 4 ? (
          <g>
            <rect width={1920} height={1080} fill="#3A3448" />
            <Router x={200} y={200} state="red" t={t} />
            <Laptop x={620} y={360} s={0.6} />
            <TVSet x={1150} y={200} s={0.4} t={t} />
            <CardTerminal x={1550} y={380} s={0.8} state="error" t={t} />
            <CashMachine x={1800} y={560} s={0.5} t={t} />
            <PetrolPump x={150} y={760} s={0.6} sign="CASH ONLY" />
            <Notice x={450} y={800} s={0.5} lines={['BOIL', 'YOUR', 'WATER']} />
            <Inhaler x={700} y={800} s={0.6} />
            <OldRadio x={980} y={820} s={0.6} on={1} t={t} />
            <PotSpeaker x={1300} y={820} s={0.5} t={t} />
            <Barbecue x={1600} y={850} s={0.6} t={t} />
            <Football x={1800} y={900} />
            <PaperMap x={420} y={1000} s={0.4} />
            <BoardGame x={800} y={1010} s={0.3} />
            <CarKey x={1100} y={980} s={0.4} />
            <PinnedPage x={1400} y={1000} s={0.4} title="FIRST AID" />
            <WifiIcon x={1750} y={1000} s={0.5} off />
            <BankCard x={1100} y={600} s={0.6} rot={-10} />
          </g>
        ) : null}
        {f === 5 ? (
          <g>
            <SeaCable t={t} pulse={1} />
            <Jet x={600} y={300} s={0.6} rot={-8} />
            <ServerRack x={1400} y={900} t={t} />
            <BlackCarFront x={1000} y={1000} s={0.6} />
          </g>
        ) : null}
        {f === 6 ? (
          <g>
            <rect width={1920} height={1080} fill="#2A2438" />
            {(['offline', 'mapblank', 'wiki', 'wikihome', 'lock', 'download', 'clock'] as const).map((m, i) => (
              <Smartphone key={m} x={150 + i * 270} y={540} s={0.7} mode={m} t={45} battery={70} glow={0} />
            ))}
          </g>
        ) : null}
      </ShotFrame>
    </AbsoluteFill>
  );
};
