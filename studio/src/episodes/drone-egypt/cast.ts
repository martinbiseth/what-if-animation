import { LOOKS, Look } from '../../engine';

// The cast of "What if you brought a drone to ancient Egypt?": you in the orange hoodie (the only modern thing on
// screen besides the drone), and Giza's people in linen, bead collars and headcloths, all on the ink rig.
const INK = '#26232F';
const INK2 = '#1C1A24';
const base: Look = { skin: INK, skinShade: INK2, hand: INK, jacket: '#EDE4D0', jacketShade: '#D2C6AC', accent: '#C89A3A', limb: '#3B3646', line: '#100E16', shoe: '#8A6A44', face: '#F6EFE3', hair: '#141118' };

export const YOU = LOOKS.you;
/** Nefer, a worker's daughter: a black bob, a linen dress, a turquoise collar. Draw at about 0.72. */
export const NEFER: Look = { ...base, jacket: '#F0E6CE', jacketShade: '#D8CAA8', extra: 'bob', collar: '#2FA8A0', accent: '#E8B83A', shoe: '#B8864A' };
/** Hemiunu, the architect: white linen, a gold and lapis collar, a short black wig. */
export const HEMIUNU: Look = { ...base, jacket: '#F2EEE4', jacketShade: '#D8D0C0', extra: 'bob', collar: '#E8B83A', accent: '#2A5AA8', kilt: '#F2EEE4' };
/** King Khufu: the striped nemes, a broad gold collar, a gold-banded kilt. */
export const KING: Look = { ...base, jacket: '#3A3246', jacketShade: '#2E2838', collar: '#E8B83A', accent: '#2A5AA8', kilt: '#F4F0E6', hat: 'nemes', hatColor: '#E8B83A', hatStripe: '#2A4A9A', shoe: '#C89A3A' };
/** Djedi, the king's magician: shaved head, a deep red robe, a gold collar. */
export const DJEDI: Look = { ...base, jacket: '#7A2A3A', jacketShade: '#5E1E2C', bald: true, collar: '#E8B83A', accent: '#1A1418', kilt: '#7A2A3A' };
/** A builder: bare chest, white kilt, a white headcloth. */
export const WORKER: Look = { ...base, jacket: '#3A3444', jacketShade: '#2E2A38', accent: '#C8B48A', kilt: '#EDE4D0', hat: 'khat', hatColor: '#EDE4D0' };
export const WORKER2: Look = { ...WORKER, hatColor: '#C8A06A', kilt: '#E2D6BC' };
export const WORKER3: Look = { ...WORKER, hat: undefined, kilt: '#D8CCB0' };
/** Nefer's father: a worker with a blue-striped headcloth. */
export const FATHER: Look = { ...WORKER, hatStripe: '#2A5AA8' };
/** A guard: tan headcloth, a kilt with a red belt. */
export const GUARD: Look = { ...WORKER, kilt: '#E8DCC0', accent: '#A83A2A', hatColor: '#C8A86A', hatStripe: '#A83A2A' };
export const CROWD = [WORKER, WORKER2, WORKER3, GUARD, WORKER, WORKER2, NEFER];
