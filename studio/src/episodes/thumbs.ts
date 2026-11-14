// Thumbnail compositions (one frame each), named in a series' youtube.thumbnail.composition.
import React from 'react';
import { Iphone1926Thumb } from './iphone-1926/thumb';
import { Iphone1926P2Thumb } from './iphone-1926/thumb2';

export const THUMBS: { id: string; component: React.FC }[] = [{ id: 'Iphone1926Thumb', component: Iphone1926Thumb },
  { id: 'Iphone1926P2Thumb', component: Iphone1926P2Thumb }];
