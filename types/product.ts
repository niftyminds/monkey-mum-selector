export type ProductType = 'Premium' | 'Popular' | 'Economy' | 'Cestovní';

export type Activity = 'Spánek' | 'Cestování';

export type Period =
  | 'Šestinedělí'
  | 'První rok s miminkem'
  | 'Dva až tři roky s batoletem'
  | 'Starší než 3 roky';

export interface ProductParams {
  length: number;
  type: ProductType;
  activity: Activity[];
  periods: Period[];
  supportsMultipleSides: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  price: number;
  currency: string;
  params: ProductParams;
}
