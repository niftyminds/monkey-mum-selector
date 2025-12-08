export type BedType =
  | 'detska-postel'
  | 'manzelska-postel'
  | 'jednoluzko'
  | 'jiny-typ';

export type Sides = 'jedna' | 'dve' | 'vice';

export type Period =
  | 'sestinedeli'
  | 'prvni-rok'
  | 'dva-tri-roky'
  | 'starsi-3-roky';

export type Activity = 'doma' | 'cestovani';

export type Preference =
  | 'necham-poradit'
  | 'premium'
  | 'popular'
  | 'economy';

export type Budget = 'neresim' | 'do-1500' | 'nad-1500';

export interface FormData {
  bedType: BedType | '';
  length: string;
  sides: Sides | '';
  period: Period | '';
  activity: Activity | '';
  preference: Preference | '';
  budget: Budget | '';
}

export interface FormStep {
  id: keyof FormData;
  label: string;
  type: 'radio' | 'select';
  options: FormOption[];
  required: boolean;
}

export interface FormOption {
  value: string;
  label: string;
  description?: string;
}
