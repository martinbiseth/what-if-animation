// Thumbnail compositions (one frame each), named in a series' youtube.thumbnail.composition.
import React from 'react';
import { Iphone1926Thumb } from './iphone-1926/thumb';
import { ElectricityThumb } from './electricity/thumb';
import { ElecSets } from './electricity/sheet';
import { RomeSets, RomeCast } from './rome-car/sheet';
import { RomeCarThumb } from './rome-car/thumb';

export const THUMBS: { id: string; component: React.FC }[] = [
  { id: 'Iphone1926Thumb', component: Iphone1926Thumb },
  { id: 'ElectricityThumb', component: ElectricityThumb },
  { id: 'ElecSets', component: ElecSets },
  { id: 'RomeCarThumb', component: RomeCarThumb },
  { id: 'RomeSets', component: RomeSets },
  { id: 'RomeCast', component: RomeCast },
];
