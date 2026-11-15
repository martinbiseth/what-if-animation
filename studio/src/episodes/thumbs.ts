// Thumbnail compositions (one frame each), named in a series' youtube.thumbnail.composition.
import React from 'react';
import { Iphone1926Thumb } from './iphone-1926/thumb';
import { InternetGoneThumb } from './internet-gone/thumb';
import { ElectricityThumb } from './electricity/thumb';
import { ElecSets } from './electricity/sheet';

export const THUMBS: { id: string; component: React.FC }[] = [
  { id: 'Iphone1926Thumb', component: Iphone1926Thumb },
  { id: 'InternetGoneThumb', component: InternetGoneThumb },
  { id: 'ElectricityThumb', component: ElectricityThumb },
  { id: 'ElecSets', component: ElecSets },
];
