// Thumbnail compositions (one frame each), named in a series' youtube.thumbnail.composition.
import React from 'react';
import { Iphone1926Thumb } from './iphone-1926/thumb';
import { VikingsWinterThumb } from './vikings-winter/thumb';
import { VWSheet } from './vikings-winter/sheet';

export const THUMBS: { id: string; component: React.FC }[] = [{ id: 'Iphone1926Thumb', component: Iphone1926Thumb }, { id: 'VikingsWinterThumb', component: VikingsWinterThumb }, { id: 'VWSheet', component: VWSheet }];
