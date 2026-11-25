// Thumbnail compositions (one frame each), named in a series' youtube.thumbnail.composition.
import React from 'react';
import { Iphone1926Thumb } from './iphone-1926/thumb';
import { InternetGoneThumb } from './internet-gone/thumb';
import { BankBalanceThumb } from './bank-balance/thumb';
import { GtaHospitalBillThumb } from './gta-hospital-bill/thumb';
import { HearThoughtsThumb } from './hear-thoughts/thumb';

export const THUMBS: { id: string; component: React.FC }[] = [
  { id: 'Iphone1926Thumb', component: Iphone1926Thumb },
  { id: 'InternetGoneThumb', component: InternetGoneThumb },
  { id: 'BankBalanceThumb', component: BankBalanceThumb },
  { id: 'GtaHospitalBillThumb', component: GtaHospitalBillThumb },
  { id: 'HearThoughtsThumb', component: HearThoughtsThumb },
];
