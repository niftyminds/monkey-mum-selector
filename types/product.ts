export type ProductType =
  | 'Popular'       // 1
  | 'Premium'       // 2
  | 'Economy'       // 3
  | 'Flip'          // 4
  | 'Smart'         // 5
  | 'Short'         // 6
  | 'Bed Bumper'    // 7 (Cestovní mantinel)
  | 'Nová Zábrana'  // 8
  | 'Ohrádka'       // 9
  | 'Safety Gate'   // 10
  | 'Postel'        // 11 (Postel se zábranou)
  | 'Postýlka'      // 12 (Dětská postýlka)
  | 'Cestovní Vak'  // 13 (Cestovní vak velký)
  | 'Cestovní Vak Malý'     // 14
  | 'Cestovní Vak Bumper'   // 15
  | 'Židlička';     // 16 (Jídelní židlička)

export type Activity = 'Spánek' | 'Cestování';

export type Period =
  | 'Šestinedělí'
  | 'První rok s miminkem'
  | 'Dva až tři roky s batoletem'
  | 'Starší než 3 roky';

export interface ProductParams {
  length: number;
  type: ProductType;
  typeId: number;
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
  additionalImages: string[];
  price: number;
  currency: string;
  params: ProductParams;
}
