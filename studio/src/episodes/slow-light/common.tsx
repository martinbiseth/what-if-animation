import { LOOKS, Look } from '../../engine';

// Shared by every chapter of "What if light kept getting slower every hour?": the cast. The shot builders (faceCU,
// bigWord, Soft, span, wordF...) come from the electricity episode's common file, re-exported here.
export { faceCU, bigWord, Soft, span, wordF, DarkBg, handAt, Handheld, iconBoard, Icon, Cross } from '../electricity/common';

export const YOU = LOOKS.you;
export const ELLIE = LOOKS.ellie;
export const MOM = LOOKS.mom26;
/** Mo: curls, a teal hoodie this time, sneakers. */
export const MO: Look = { ...LOOKS.mo26, jacket: '#2E7A8A', jacketShade: '#24626F', accent: '#F2C14E', limb: '#3B3646', shoe: '#E9E2D2', noPhones: false, hat: undefined };
/** Mo's dad: a brown work coat and a beard-dark face. */
export const MODAD: Look = { ...LOOKS.worker, jacket: '#6A4E36', jacketShade: '#553E2A', accent: '#C9B48A', hat: undefined };
/** The man in the suit, with the megaphone. */
export const SUIT: Look = { ...LOOKS.suit26, hat: undefined };
/** The scientist in the lab. */
export const SCI: Look = { ...LOOKS.doctor, jacket: '#E9E4DA', jacketShade: '#CFC8BA', accent: '#3A6A9A', hair: '#3A2620', extra: 'bob' };
