export type BedType = 'klasicka' | 'vyklopna' | 'boxspring' | 'valenda' | 'jiny';

export type SleepPosition = 'u-zdi' | 'uprostred' | 'aktivni' | 'bez-cela' | 'nevim';

export interface SideLength {
  sideIndex: number;
  length: number | 'jine';
  customLength?: number;
}

export type Age = '0-3' | '3-plus' | 'jine';

export type Usage = 'pouze-doma' | 'doma-i-cesty' | 'pouze-cesty' | 'jine';

export type Priority = 'bez-vrtani' | 'stabilita' | 'premium' | 'pomer-cena-vykon' | 'nejnizsi-cena';

export type CrossSell = 'schodiste' | 'dvere' | 'ohradka' | 'stolovani';

export interface FormData {
  bedType: BedType | '';
  sleepPosition: SleepPosition | '';
  lengths: SideLength[];
  age: Age | '';
  usage: Usage | '';
  priority: Priority | '';
  crossSell: CrossSell[];
}

export interface FormStep {
  id: keyof FormData;
  label: string;
  type: 'radio' | 'select' | 'multi-length' | 'checkbox';
  options: FormOption[];
  required: boolean;
  multiSelect?: boolean;
}

export interface FormOption {
  value: string;
  label: string;
  description?: string;
}
