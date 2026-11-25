// Thumbnail compositions (one frame each), named in a series' youtube.thumbnail.composition.
import React from 'react';
import { Iphone1926Thumb } from './iphone-1926/thumb';
import { ElectricityThumb } from './electricity/thumb';
import { ElecSets } from './electricity/sheet';
import { GravityThumb } from './gravity/thumb';
import { GtaSets } from './gta-physics/sheet';
import { GtaPhysicsThumb } from './gta-physics/thumb';
import { MoonGoneThumb } from './moon-gone/thumb';

export const THUMBS: { id: string; component: React.FC }[] = [
  { id: 'Iphone1926Thumb', component: Iphone1926Thumb },
  { id: 'ElectricityThumb', component: ElectricityThumb },
  { id: 'ElecSets', component: ElecSets },
  { id: 'GravityThumb', component: GravityThumb },
  { id: 'GtaSets', component: GtaSets },
  { id: 'GtaPhysicsThumb', component: GtaPhysicsThumb },
  { id: 'MoonGoneThumb', component: MoonGoneThumb },
];
