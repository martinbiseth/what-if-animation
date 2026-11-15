// Thumbnail compositions (one frame each), named in a series' youtube.thumbnail.composition.
import React from 'react';
import { Iphone1926Thumb } from './iphone-1926/thumb';
import { InternetGoneThumb } from './internet-gone/thumb';
import { BackTo2010Thumb } from './back-to-2010/thumb';

export const THUMBS: { id: string; component: React.FC }[] = [
  { id: 'Iphone1926Thumb', component: Iphone1926Thumb },
  { id: 'InternetGoneThumb', component: InternetGoneThumb },
  { id: 'BackTo2010Thumb', component: BackTo2010Thumb },
];
