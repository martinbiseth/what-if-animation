// Thumbnail compositions (one frame each), named in a series' youtube.thumbnail.composition.
import React from 'react';
import { Iphone1926Thumb } from './iphone-1926/thumb';
import { ElectricityThumb } from './electricity/thumb';
import { ElecSets } from './electricity/sheet';
import { AgingBackwardsThumb } from './aging-backwards/thumb';
import { AgingSets } from './aging-backwards/common';

export const THUMBS: { id: string; component: React.FC }[] = [
  { id: 'Iphone1926Thumb', component: Iphone1926Thumb },
  { id: 'ElectricityThumb', component: ElectricityThumb },
  { id: 'ElecSets', component: ElecSets },
  { id: 'AgingBackwardsThumb', component: AgingBackwardsThumb },
  { id: 'AgingSets', component: AgingSets },
];
