import React from 'react';
import { clamp, rnd } from './anim';
import { FONT } from './fonts';

// Props for the period episodes ("What if you had an iPhone 100 years ago?"): a modern phone that is generic on
// purpose (no maker's logo, no maker's shapes), its screens, a hand holding it, a battery readout, newspapers,
// an envelope of money, street lamps and a period car. All flat fills, a darker side away from the light, a warm rim.

export type ScreenMode =
  | 'off' | 'home' | 'camera' | 'photo' | 'city' | 'music' | 'nosignal' | 'map' | 'battery' | 'calc' | 'video'
  | 'flash' | 'message' | 'photos' | 'record' | 'chip' | 'pharmacy' | 'signal';

export const PHONE = { w: 300, h: 620, r: 46 };
const SCR = { x: -136, y: -296, w: 272, h: 592, r: 34 };

/** The status bar: the time, the signal bars (none, or `bars`), the battery with its percentage. */
const StatusBar: React.FC<{ battery: number; bars?: number; time?: string }> = ({ battery, bars = 0, time = '10:26' }) => {
  const low = battery <= 20;
  return (
    <g fontFamily={FONT.ui} fill="#F6EFE3">
      <text x={SCR.x + 30} y={SCR.y + 44} fontSize={22}>{time}</text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={SCR.x + 150 + i * 9} y={SCR.y + 40 - (i + 1) * 5} width={6} height={(i + 1) * 5} rx={1} fill={i < bars ? '#F6EFE3' : '#F6EFE3'} opacity={i < bars ? 1 : 0.25} />
      ))}
      {bars === 0 ? <text x={SCR.x + 192} y={SCR.y + 42} fontSize={15} opacity={0.8}>NO SIGNAL</text> : null}
      <rect x={SCR.x + 196} y={SCR.y + 50} width={46} height={20} rx={5} fill="none" stroke="#F6EFE3" strokeWidth={2} opacity={0} />
    </g>
  );
};

/** A big battery icon with its percentage: the episode's clock. Use it on screen or as a HUD. */
export const BatteryIcon: React.FC<{ x: number; y: number; p: number; s?: number; label?: boolean }> = ({ x, y, p, s = 1, label = true }) => {
  const v = clamp(p / 100);
  const col = v <= 0.1 ? '#FF4A3D' : v <= 0.3 ? '#FFB13D' : '#5BE08A';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-70} y={-32} width={140} height={64} rx={14} fill="#0B0816" stroke="#F6EFE3" strokeWidth={6} />
      <rect x={72} y={-12} width={12} height={24} rx={4} fill="#F6EFE3" />
      <rect x={-62} y={-24} width={124 * v} height={48} rx={8} fill={col} />
      {label ? (
        <text x={0} y={78} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill={col} stroke="#0B0816" strokeWidth={8} paintOrder="stroke">
          {`${Math.round(p)}%`}
        </text>
      ) : null}
    </g>
  );
};

/** A colour photo of a modern city at night: the thing nobody in 1926 has seen. Drawn in screen space. */
const CityPhoto: React.FC<{ x: number; y: number; w: number; h: number; seed?: number }> = ({ x, y, w, h, seed = 3 }) => (
  <g>
    <defs>
      <linearGradient id="cityNight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#141A4A" />
        <stop offset="0.6" stopColor="#5A2E7A" />
        <stop offset="1" stopColor="#FF7A4A" />
      </linearGradient>
    </defs>
    <rect x={x} y={y} width={w} height={h} fill="url(#cityNight)" />
    {Array.from({ length: 14 }).map((_, i) => {
      const bw = w / 9 + rnd(seed, i) * w / 10;
      const bx = x + (i / 14) * w * 1.05 - bw / 3;
      const bh = h * (0.35 + rnd(seed + 1, i) * 0.55);
      return (
        <g key={i}>
          <rect x={bx} y={y + h - bh} width={bw} height={bh} fill={i % 2 ? '#1A1838' : '#24204A'} />
          {Array.from({ length: Math.floor(bh / 14) }).map((__, k) =>
            rnd(seed + i, k) > 0.45 ? <rect key={k} x={bx + 4 + (k % 3) * (bw / 3.2)} y={y + h - bh + 6 + Math.floor(k / 1) * 12} width={bw / 5} height={5} fill={rnd(seed, k + i) > 0.5 ? '#FFD86A' : '#7FD4FF'} opacity={0.9} /> : null,
          )}
        </g>
      );
    })}
    <rect x={x} y={y + h * 0.86} width={w} height={h * 0.14} fill="#0B0A1E" opacity={0.8} />
  </g>
);

/** What a screen shows, in screen space (SCR). `t` animates spinners, bars and waveforms. */
const Screen: React.FC<{ mode: ScreenMode; t: number; battery: number; text?: string; bars?: number }> = ({ mode, t, battery, text, bars = 0 }) => {
  const cx = SCR.x + SCR.w / 2;
  const cy = SCR.y + SCR.h / 2;
  const bg = (c: string) => <rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx={SCR.r} fill={c} />;
  const title = (s: string, y = SCR.y + 110) => (
    <text x={cx} y={y} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={30} fill="#F6EFE3">{s}</text>
  );
  switch (mode) {
    case 'off':
      return bg('#07060B');
    case 'home': {
      const cols = ['#FF8A3D', '#5BE08A', '#7FD4FF', '#FFD86A', '#E46AD2', '#FF5A4A', '#6A8CFF', '#3DD6C8'];
      return (
        <g>
          {bg('#2A2060')}
          <circle cx={cx + 60} cy={SCR.y + 160} r={180} fill="#6A3EA0" opacity={0.6} />
          <circle cx={cx - 80} cy={SCR.y + 470} r={200} fill="#FF7A4A" opacity={0.35} />
          {Array.from({ length: 16 }).map((_, i) => (
            <rect key={i} x={SCR.x + 30 + (i % 4) * 58} y={SCR.y + 90 + Math.floor(i / 4) * 70} width={44} height={44} rx={12} fill={cols[i % 8]} />
          ))}
          <rect x={SCR.x + 20} y={SCR.y + SCR.h - 96} width={SCR.w - 40} height={70} rx={24} fill="#FFFFFF" opacity={0.18} />
        </g>
      );
    }
    case 'camera':
      return (
        <g>
          {bg('#111')}
          <CityPhoto x={SCR.x} y={SCR.y + 60} w={SCR.w} h={SCR.h - 200} seed={9} />
          <circle cx={cx} cy={SCR.y + SCR.h - 70} r={36} fill="#F6EFE3" stroke="#888" strokeWidth={6} />
          <path d={`M ${cx - 70} ${cy - 40} h -20 v 20 M ${cx + 70} ${cy - 40} h 20 v 20 M ${cx - 70} ${cy + 60} h -20 v -20 M ${cx + 70} ${cy + 60} h 20 v -20`} stroke="#FFD86A" strokeWidth={4} fill="none" />
        </g>
      );
    case 'photo':
    case 'city':
      return (
        <g>
          {bg('#000')}
          <CityPhoto x={SCR.x} y={SCR.y + 90} w={SCR.w} h={SCR.h - 180} />
        </g>
      );
    case 'photos':
      return (
        <g>
          {bg('#0E0D14')}
          {title('Photos', SCR.y + 90)}
          {Array.from({ length: 15 }).map((_, i) => {
            const hue = [
              '#E9A86A', '#6AA8E9', '#8AD07A', '#E96A8A', '#C9A0F0', '#F0D27A', '#7AD0C8', '#E9C86A', '#A86A4A', '#6A7AE9', '#F09A6A', '#9AE96A', '#E96AD2', '#6AE9B8', '#D2D2D2',
            ][i];
            const off = (t * 3) % 72;
            return <rect key={i} x={SCR.x + 14 + (i % 3) * 84} y={SCR.y + 120 + Math.floor(i / 3) * 84 - off} width={78} height={78} rx={6} fill={hue} />;
          })}
        </g>
      );
    case 'music': {
      return (
        <g>
          {bg('#1A1030')}
          <rect x={cx - 100} y={SCR.y + 110} width={200} height={200} rx={20} fill="#FF8A3D" />
          <circle cx={cx} cy={SCR.y + 210} r={60} fill="#1A1030" />
          <circle cx={cx} cy={SCR.y + 210} r={14} fill="#FF8A3D" />
          {Array.from({ length: 22 }).map((_, i) => {
            const hgt = 10 + Math.abs(Math.sin(t * 0.5 + i * 0.9)) * 50;
            return <rect key={i} x={SCR.x + 30 + i * 10} y={SCR.y + 400 - hgt / 2} width={6} height={hgt} rx={3} fill="#F6EFE3" opacity={0.85} />;
          })}
          <circle cx={cx} cy={SCR.y + 510} r={34} fill="#F6EFE3" />
          <rect x={cx - 12} y={SCR.y + 494} width={8} height={32} fill="#1A1030" />
          <rect x={cx + 4} y={SCR.y + 494} width={8} height={32} fill="#1A1030" />
        </g>
      );
    }
    case 'video':
      return (
        <g>
          {bg('#000')}
          <rect x={SCR.x} y={cy - 110} width={SCR.w} height={220} fill="#3A6AA8" />
          <rect x={SCR.x} y={cy + 40} width={SCR.w} height={70} fill="#5A9A4A" />
          {/* a cat leaping for a toy, looping */}
          {(() => {
            const k = (t % 40) / 40;
            const jx = SCR.x + 40 + k * 190;
            const jy = cy + 40 - Math.sin(k * Math.PI) * 90;
            return (
              <g transform={`translate(${jx} ${jy})`}>
                <ellipse cx={0} cy={-14} rx={28} ry={14} fill="#F0A040" />
                <circle cx={24} cy={-26} r={12} fill="#F0A040" />
                <path d="M 18 -36 l 4 -10 l 6 8 M 28 -36 l 6 -8 l 2 10" fill="#F0A040" />
              </g>
            );
          })()}
          <rect x={SCR.x + 20} y={cy + 140} width={SCR.w - 40} height={6} rx={3} fill="#555" />
          <rect x={SCR.x + 20} y={cy + 140} width={((t % 120) / 120) * (SCR.w - 40)} height={6} rx={3} fill="#FF4A3D" />
        </g>
      );
    case 'nosignal':
    case 'message':
    case 'signal': {
      const spin = (t * 12) % 360;
      return (
        <g>
          {bg('#101018')}
          {title(mode === 'nosignal' ? 'Messages' : 'Unknown', SCR.y + 100)}
          {mode === 'nosignal' ? (
            <g>
              <rect x={SCR.x + 90} y={SCR.y + 160} width={160} height={54} rx={22} fill="#3A7AFF" />
              <text x={SCR.x + 170} y={SCR.y + 195} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#fff">{text ?? 'Hello??'}</text>
              <g transform={`translate(${SCR.x + 60} ${SCR.y + 187}) rotate(${spin})`}>
                <path d="M 0 -14 A 14 14 0 1 1 -14 0" stroke="#F6EFE3" strokeWidth={4} fill="none" strokeLinecap="round" />
              </g>
              <text x={cx} y={SCR.y + 270} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fill="#FF6A5A">Not delivered</text>
            </g>
          ) : (
            <g opacity={clamp(t / 6)}>
              <rect x={SCR.x + 20} y={SCR.y + 160} width={232} height={92} rx={24} fill="#2A2A36" />
              <text x={SCR.x + 40} y={SCR.y + 200} fontFamily={FONT.ui} fontSize={21} fill="#fff">{(text ?? "Don't give it").split('|')[0]}</text>
              <text x={SCR.x + 40} y={SCR.y + 230} fontFamily={FONT.ui} fontSize={21} fill="#fff">{(text ?? '|to him.').split('|')[1] ?? ''}</text>
            </g>
          )}
        </g>
      );
    }
    case 'map':
      return (
        <g>
          {bg('#D8D8D8')}
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d={`M ${SCR.x} ${SCR.y + i * 52} H ${SCR.x + SCR.w} M ${SCR.x + i * 26} ${SCR.y} V ${SCR.y + SCR.h}`} stroke="#C4C4C4" strokeWidth={2} />
          ))}
          <circle cx={cx + Math.sin(t / 9) * 30} cy={cy + Math.cos(t / 11) * 40} r={30} fill="#3A7AFF" opacity={0.2} />
          <circle cx={cx + Math.sin(t / 9) * 30} cy={cy + Math.cos(t / 11) * 40} r={13} fill="#3A7AFF" stroke="#fff" strokeWidth={4} />
          <rect x={SCR.x + 30} y={SCR.y + SCR.h - 120} width={SCR.w - 60} height={56} rx={14} fill="#fff" />
          <text x={cx} y={SCR.y + SCR.h - 84} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fill="#888">Searching for GPS...</text>
        </g>
      );
    case 'battery':
      return (
        <g>
          {bg('#07060B')}
          <BatteryIcon x={cx} y={cy - 30} p={battery} s={1.3} />
        </g>
      );
    case 'calc': {
      const shown = text ?? String(Math.floor(t * 137911) % 99999999);
      return (
        <g>
          {bg('#000')}
          <text x={SCR.x + SCR.w - 24} y={SCR.y + 200} textAnchor="end" fontFamily={FONT.ui} fontSize={48} fill="#fff">{shown}</text>
          {Array.from({ length: 16 }).map((_, i) => (
            <circle key={i} cx={SCR.x + 44 + (i % 4) * 62} cy={SCR.y + 280 + Math.floor(i / 4) * 70} r={26} fill={i % 4 === 3 ? '#FF9A2A' : '#333'} />
          ))}
        </g>
      );
    }
    case 'flash':
      return bg('#FFFFFF');
    case 'record':
      return (
        <g>
          {bg('#140E10')}
          {title('Voice memo', SCR.y + 100)}
          <circle cx={cx} cy={SCR.y + 470} r={40} fill="#FF4A3D" />
          {Array.from({ length: 26 }).map((_, i) => {
            const hgt = 6 + Math.abs(Math.sin(t * 0.7 + i * 1.3)) * 80 * (i < (t % 60) / 2 ? 1 : 0.1);
            return <rect key={i} x={SCR.x + 20 + i * 9.5} y={SCR.y + 280 - hgt / 2} width={5} height={hgt} rx={2} fill="#FF6A5A" />;
          })}
        </g>
      );
    case 'chip':
      return (
        <g>
          {bg('#0B1020')}
          <rect x={cx - 80} y={cy - 80} width={160} height={160} rx={14} fill="#2A3A5A" stroke="#7FD4FF" strokeWidth={4} />
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i} stroke="#7FD4FF" strokeWidth={3}>
              <path d={`M ${cx - 70 + i * 20} ${cy - 80} v -20 M ${cx - 70 + i * 20} ${cy + 80} v 20 M ${cx - 80} ${cy - 70 + i * 20} h -20 M ${cx + 80} ${cy - 70 + i * 20} h 20`} />
            </g>
          ))}
        </g>
      );
    case 'pharmacy':
      return (
        <g>
          {bg('#F4F4F0')}
          {Array.from({ length: 4 }).map((_, r) => (
            <g key={r}>
              <rect x={SCR.x} y={SCR.y + 120 + r * 110} width={SCR.w} height={10} fill="#B8B0A0" />
              {Array.from({ length: 6 }).map((__, i) => (
                <g key={i}>
                  <rect x={SCR.x + 12 + i * 43} y={SCR.y + 50 + r * 110} width={34} height={70} rx={4} fill={['#FFFFFF', '#E9F0FF', '#FFF2E0'][(i + r) % 3]} stroke="#999" strokeWidth={2} />
                  <rect x={SCR.x + 12 + i * 43} y={SCR.y + 72 + r * 110} width={34} height={14} fill={['#3A7AFF', '#E9504A', '#4AB86A'][(i * 2 + r) % 3]} />
                </g>
              ))}
            </g>
          ))}
        </g>
      );
  }
  return null;
};

/**
 * The phone from the front, centred on x, y, `s` its scale (1 = 300 x 620). Generic on purpose: a dark slab, thin
 * bezel, a small round front camera, no logo. `glow` spills its light round it (on a dark set).
 */
export const Smartphone: React.FC<{ x: number; y: number; s?: number; rot?: number; mode?: ScreenMode; t?: number; battery?: number; text?: string; bars?: number; glow?: number; buzz?: number; status?: boolean }> = ({
  x, y, s = 1, rot = 0, mode = 'home', t = 0, battery = 100, text, bars = 0, glow = 1, buzz = 0, status = true,
}) => {
  const jx = buzz > 0 ? Math.sin(t * 9.1) * 6 * buzz : 0;
  const lit = mode !== 'off';
  return (
    <g transform={`translate(${x + jx} ${y}) rotate(${rot}) scale(${s})`}>
      {lit && glow > 0 ? <circle cx={0} cy={0} r={520} fill="url(#g3cool)" opacity={0.5 * glow} style={{ mixBlendMode: 'screen' }} /> : null}
      <rect x={-PHONE.w / 2 + 10} y={-PHONE.h / 2 + 16} width={PHONE.w} height={PHONE.h} rx={PHONE.r} fill="#000" opacity={0.35} />
      <rect x={-PHONE.w / 2} y={-PHONE.h / 2} width={PHONE.w} height={PHONE.h} rx={PHONE.r} fill="#1A1922" stroke="#4A4858" strokeWidth={5} />
      <rect x={PHONE.w / 2 - 2} y={-150} width={6} height={70} rx={3} fill="#4A4858" />
      <clipPath id={`scr${mode}`}>
        <rect x={SCR.x} y={SCR.y} width={SCR.w} height={SCR.h} rx={SCR.r} />
      </clipPath>
      <g clipPath={`url(#scr${mode})`}>
        <Screen mode={mode} t={t} battery={battery} text={text} bars={bars} />
        {lit && status && mode !== 'flash' && mode !== 'battery' ? <StatusBar battery={battery} bars={bars} /> : null}
        {/* a soft diagonal reflection on the glass */}
        <path d={`M ${SCR.x} ${SCR.y + 40} L ${SCR.x + 150} ${SCR.y} L ${SCR.x + 200} ${SCR.y} L ${SCR.x} ${SCR.y + 260} Z`} fill="#FFFFFF" opacity={0.06} />
      </g>
      <circle cx={0} cy={SCR.y + 22} r={9} fill="#05050A" />
      {buzz > 0
        ? [-1, 1].map((sd) => (
            <g key={sd} stroke="#CFE6FF" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.8 * buzz}>
              <path d={`M ${sd * 190} -90 q ${sd * 20} 60 0 120`} />
              <path d={`M ${sd * 230} -130 q ${sd * 30} 100 0 200`} />
            </g>
          ))
        : null}
    </g>
  );
};

/** The phone's back: a dark slab with a square camera bump (two lenses and a flash) and no logo. */
export const SmartphoneBack: React.FC<{ x: number; y: number; s?: number; rot?: number; flash?: number }> = ({ x, y, s = 1, rot = 0, flash = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-PHONE.w / 2} y={-PHONE.h / 2} width={PHONE.w} height={PHONE.h} rx={PHONE.r} fill="#2A2834" stroke="#4A4858" strokeWidth={5} />
    <rect x={-PHONE.w / 2 + 22} y={-PHONE.h / 2 + 22} width={120} height={120} rx={28} fill="#1E1D26" stroke="#4A4858" strokeWidth={4} />
    <circle cx={-PHONE.w / 2 + 58} cy={-PHONE.h / 2 + 58} r={24} fill="#0A0A10" stroke="#5A5868" strokeWidth={5} />
    <circle cx={-PHONE.w / 2 + 58} cy={-PHONE.h / 2 + 108} r={24} fill="#0A0A10" stroke="#5A5868" strokeWidth={5} />
    <circle cx={-PHONE.w / 2 + 108} cy={-PHONE.h / 2 + 58} r={10} fill={flash > 0 ? '#FFFFFF' : '#C9B880'} />
    {flash > 0 ? <circle cx={-PHONE.w / 2 + 108} cy={-PHONE.h / 2 + 58} r={260 * flash} fill="url(#kitBloom)" opacity={flash} /> : null}
    <path d={`M ${-PHONE.w / 2 + 30} ${PHONE.h / 2 - 40} L ${PHONE.w / 2 - 40} ${-PHONE.h / 2 + 200}`} stroke="#FFFFFF" strokeOpacity={0.06} strokeWidth={60} />
  </g>
);

/**
 * An insert of a hand holding the phone up to camera: the orange sleeve from the bottom of frame, a dark mitten
 * round the phone's lower edge. x, y the phone's centre; the arm enters from `from` (bottom-left or bottom-right).
 */
export const PhoneInHand: React.FC<{ x: number; y: number; s?: number; rot?: number; mode?: ScreenMode; t?: number; battery?: number; text?: string; bars?: number; from?: 'left' | 'right'; sleeve?: string; buzz?: number; glow?: number }> = ({
  x, y, s = 1, rot = 0, from = 'right', sleeve = '#F07A2A', ...rest
}) => {
  const sd = from === 'right' ? 1 : -1;
  // the wrist sits under the mitten at the phone's lower corner; the sleeve runs from there off the bottom of frame
  const wx = x + sd * 130 * s;
  const wy = y + 300 * s;
  const hw = 75 * s;
  return (
    <g>
      <path d={`M ${wx - hw} ${wy} Q ${wx - hw + sd * 60 * s} ${wy + 300 * s} ${wx + sd * 200 * s - hw} 1300 L ${wx + sd * 200 * s + hw * 1.6} 1300 Q ${wx + hw + sd * 90 * s} ${wy + 260 * s} ${wx + hw} ${wy - 10 * s} Z`} fill={sleeve} stroke="#100E16" strokeWidth={8 * s} />
      <path d={`M ${wx - hw} ${wy + 6 * s} Q ${wx} ${wy + 30 * s} ${wx + hw} ${wy - 4 * s}`} stroke="#100E16" strokeWidth={6 * s} fill="none" opacity={0.6} />
      <Smartphone x={x} y={y} s={s} rot={rot} {...rest} />
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        <ellipse cx={sd * 120} cy={210} rx={70} ry={95} fill="#26232F" stroke="#100E16" strokeWidth={8} />
        <ellipse cx={-sd * 152} cy={150} rx={26} ry={60} fill="#26232F" stroke="#100E16" strokeWidth={8} transform={`rotate(${sd * 12} ${-sd * 152} 150)`} />
      </g>
    </g>
  );
};

/** A folded broadsheet seen from the front: masthead, a date line, a headline, a drawing box. */
export const Newspaper: React.FC<{ x: number; y: number; w?: number; rot?: number; date?: string; headline?: string; drawing?: React.ReactNode; t?: number }> = ({
  x, y, w = 520, rot = 0, date = 'TUESDAY, OCTOBER 12, 1926', headline = 'CITY SWELTERS', drawing, t = 0,
}) => {
  const h = w * 1.25;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 + 10} y={-h / 2 + 14} width={w} height={h} fill="#000" opacity={0.3} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#EDE3CC" stroke="#8A7E66" strokeWidth={3} />
      <text x={0} y={-h / 2 + w * 0.13} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700} fontSize={w * 0.09} fill="#1E1A14">THE DAILY HERALD</text>
      <path d={`M ${-w * 0.45} ${-h / 2 + w * 0.17} H ${w * 0.45} M ${-w * 0.45} ${-h / 2 + w * 0.23} H ${w * 0.45}`} stroke="#1E1A14" strokeWidth={3} />
      <text x={0} y={-h / 2 + w * 0.213} textAnchor="middle" fontFamily={FONT.ui} fontSize={w * 0.034} fill="#1E1A14" letterSpacing={2}>{date}</text>
      <text x={0} y={-h / 2 + w * 0.34} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700} fontSize={Math.min(w * 0.075, (w * 0.9) / (headline.length * 0.62))} fill="#1E1A14">{headline}</text>
      <rect x={-w * 0.42} y={-h / 2 + w * 0.4} width={w * 0.5} height={w * 0.45} fill="#D8CDB2" stroke="#8A7E66" strokeWidth={2} />
      {drawing ? <g transform={`translate(${-w * 0.17} ${-h / 2 + w * 0.62})`}>{drawing}</g> : null}
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={i < 8 ? w * 0.12 : -w * 0.42} y={-h / 2 + w * (i < 8 ? 0.42 + i * 0.055 : 0.9 + (i - 8) * 0.055)} width={i < 8 ? w * 0.3 : w * 0.84 * (i % 3 === 2 ? 0.6 : 1)} height={w * 0.016} fill="#9A8E76" />
      ))}
      {t > 0 ? null : null}
    </g>
  );
};

/** A fat envelope with banknotes showing at the open end. */
export const Envelope: React.FC<{ x: number; y: number; s?: number; rot?: number; open?: number }> = ({ x, y, s = 1, rot = 0, open = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={8} cy={58} rx={150} ry={14} fill="#000" opacity={0.3} />
    {open > 0
      ? [0, 1, 2].map((i) => <rect key={i} x={-110 + i * 8} y={-60 - open * 26 + i * 6} width={200} height={90} rx={4} fill={i === 2 ? '#9FC08A' : '#86A874'} stroke="#4E6A42" strokeWidth={3} />)
      : null}
    <rect x={-140} y={-50} width={280} height={104} rx={8} fill="#D9C49A" stroke="#7A6644" strokeWidth={4} />
    <path d="M -140 -50 L 0 20 L 140 -50" fill="none" stroke="#B8A27A" strokeWidth={4} />
  </g>
);

/** A cast-iron street lamp with its pool of warm light; x the post, y the ground. */
export const StreetLamp: React.FC<{ x: number; y: number; s?: number; on?: number }> = ({ x, y, s = 1, on = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {on > 0 ? <ellipse cx={0} cy={0} rx={220} ry={30} fill="#FFD9A0" opacity={0.18 * on} /> : null}
    <rect x={-10} y={-420} width={20} height={420} fill="#1C1A22" />
    <rect x={-22} y={-40} width={44} height={40} fill="#1C1A22" />
    <path d="M -34 -470 L 34 -470 L 24 -420 L -24 -420 Z" fill={on > 0 ? '#FFE2A8' : '#5A5460'} stroke="#1C1A22" strokeWidth={6} />
    <path d="M -40 -470 L 0 -500 L 40 -470 Z" fill="#1C1A22" />
    {on > 0 ? <circle cx={0} cy={-445} r={130} fill="url(#kitBloom)" opacity={0.7 * on} /> : null}
  </g>
);

/** A boxy 1920s motor car in profile, facing right; x its centre, y the ground. `wheel` turns the spokes. */
export const OldCar: React.FC<{ x: number; y: number; s?: number; color?: string; wheel?: number; flip?: boolean }> = ({ x, y, s = 1, color = '#1E2230', wheel = 0, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={0} rx={250} ry={16} fill="#000" opacity={0.3} />
    <path d="M -220 -60 L -220 -150 L -60 -150 L -40 -240 L 110 -240 L 120 -150 L 200 -140 L 230 -110 L 230 -60 Z" fill={color} stroke="#0C0D12" strokeWidth={6} strokeLinejoin="round" />
    <path d="M -30 -228 L 100 -228 L 106 -158 L -46 -158 Z" fill="#8EA6B8" opacity={0.55} />
    <rect x={190} y={-128} width={30} height={40} fill="#2A2E3C" stroke="#0C0D12" strokeWidth={4} />
    <circle cx={224} cy={-120} r={12} fill="#FFE2A8" />
    <path d="M -230 -60 H 240" stroke="#0C0D12" strokeWidth={10} />
    {[-140, 150].map((wx) => (
      <g key={wx} transform={`translate(${wx} -46)`}>
        <circle r={46} fill="#14151A" />
        <circle r={30} fill="#3A3C46" />
        {[0, 45, 90, 135].map((a) => (
          <path key={a} d="M -28 0 H 28" stroke="#14151A" strokeWidth={4} transform={`rotate(${a + wheel})`} />
        ))}
      </g>
    ))}
  </g>
);

/** The battery as a HUD chip, top right: the episode's countdown. Drawn in screen space over the picture. */
export const BatteryHud: React.FC<{ p: number; t: number; pulse?: boolean }> = ({ p, t, pulse = false }) => {
  const k = pulse ? 1 + 0.06 * Math.max(0, Math.sin(t / 4)) : 1;
  const pop = clamp(t / 6);
  return (
    <g transform={`translate(1700 120) scale(${0.62 * k * pop})`} opacity={pop}>
      <rect x={-110} y={-60} width={250} height={210} rx={30} fill="#0B0816" opacity={0.7} />
      <BatteryIcon x={10} y={10} p={p} />
    </g>
  );
};
