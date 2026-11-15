// Thumbnail compositions (one frame each), named in a series' youtube.thumbnail.composition.
import React from 'react';
import { Iphone1926Thumb } from './iphone-1926/thumb';
import { VikingsWinterThumb } from './vikings-winter/thumb';
import { VWThumbA, VWThumbB, VWThumbC, VWThumbAClean, VWThumbBClean, VWThumbCClean } from './vikings-winter/thumbs2';
import { VWSheet } from './vikings-winter/sheet';

export const THUMBS: { id: string; component: React.FC }[] = [{ id: 'Iphone1926Thumb', component: Iphone1926Thumb }, { id: 'VikingsWinterThumb', component: VikingsWinterThumb }, { id: 'VWSheet', component: VWSheet }, { id: 'VWThumbA', component: VWThumbA as React.FC }, { id: 'VWThumbB', component: VWThumbB as React.FC }, { id: 'VWThumbC', component: VWThumbC as React.FC }, { id: 'VWThumbAClean', component: VWThumbAClean }, { id: 'VWThumbBClean', component: VWThumbBClean }, { id: 'VWThumbCClean', component: VWThumbCClean }];
