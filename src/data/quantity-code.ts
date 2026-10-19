import { QuantityCodeItem } from './types.ts';

export const QUANTITY_CODES: QuantityCodeItem[] = [
  { uqc: 'KGS', name: 'Kilograms', standardUnit: 'Weight' },
  { uqc: 'NOS', name: 'Numbers / Pieces', standardUnit: 'Quantity' },
  { uqc: 'PCS', name: 'Pieces', standardUnit: 'Quantity' },
  { uqc: 'MTR', name: 'Meters', standardUnit: 'Length' },
  { uqc: 'SQM', name: 'Square Meters', standardUnit: 'Area' },
  { uqc: 'CBM', name: 'Cubic Meters', standardUnit: 'Volume' },
  { uqc: 'LTR', name: 'Liters', standardUnit: 'Liquid Volume' },
  { uqc: 'TON', name: 'Metric Tonnes', standardUnit: 'Weight' },
  { uqc: 'SET', name: 'Sets', standardUnit: 'Quantity' },
  { uqc: 'PRS', name: 'Pairs', standardUnit: 'Quantity' },
  { uqc: 'DOZ', name: 'Dozens', standardUnit: 'Quantity' },
  { uqc: 'BAG', name: 'Bags', standardUnit: 'Packaging' },
  { uqc: 'BOX', name: 'Boxes', standardUnit: 'Packaging' },
  { uqc: 'PAC', name: 'Packs', standardUnit: 'Packaging' },
  { uqc: 'ROL', name: 'Rolls', standardUnit: 'Quantity' },
  { uqc: 'BTL', name: 'Bottles', standardUnit: 'Packaging' },
  { uqc: 'DRM', name: 'Drums', standardUnit: 'Packaging' },
];
