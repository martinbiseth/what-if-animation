// Thumbnail compositions (one frame each), named in a series' youtube.thumbnail.composition.
import React from 'react';
import { Iphone1926Thumb } from './iphone-1926/thumb';
import { InternetGoneThumb } from './internet-gone/thumb';
import { BankBalanceThumb } from './bank-balance/thumb';
import { GtaWantedLevelThumb } from './gta-wanted-level/thumb';
import { EveryoneGoneThumb } from './everyone-gone/thumb';

export const THUMBS: { id: string; component: React.FC }[] = [
  { id: 'Iphone1926Thumb', component: Iphone1926Thumb },
  { id: 'InternetGoneThumb', component: InternetGoneThumb },
  { id: 'BankBalanceThumb', component: BankBalanceThumb },
  { id: 'GtaWantedLevelThumb', component: GtaWantedLevelThumb },
  { id: 'EveryoneGoneThumb', component: EveryoneGoneThumb },
];
