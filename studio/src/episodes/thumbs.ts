// Thumbnail compositions (one frame each), named in a series' youtube.thumbnail.composition.
import React from 'react';
import { Iphone1926Thumb } from './iphone-1926/thumb';
import { ElectricityThumb } from './electricity/thumb';
import { ElecSets } from './electricity/sheet';
import { GravityThumb } from './gravity/thumb';
import { Gta24HoursThumb } from './gta-24-hours/thumb';
import { Year3000Thumb } from './year-3000/thumb';

export const THUMBS: { id: string; component: React.FC }[] = [
  { id: 'Iphone1926Thumb', component: Iphone1926Thumb },
  { id: 'ElectricityThumb', component: ElectricityThumb },
  { id: 'ElecSets', component: ElecSets },
  { id: 'GravityThumb', component: GravityThumb },
  { id: 'Gta24HoursThumb', component: Gta24HoursThumb },
  { id: 'Year3000Thumb', component: Year3000Thumb },
];
