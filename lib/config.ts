import { FormStep } from '@/types/form';
import { ProductType } from '@/types/product';

export const LENGTH_OPTIONS = [80, 90, 100, 120, 130, 140, 150, 160, 180, 190, 200];

export const SLEEP_POSITION_SIDES_MAP: Record<string, number> = {
  'u-zdi': 1,
  'uprostred': 2,
  'aktivni': 3,
  'bez-cela': 4,
  'nevim': 1,
};

// ─── Product type ID legend ─────────────────────────────────────
// 1=Popular, 2=Premium, 3=Economy, 4=Flip, 5=Smart, 6=Short,
// 7=Bed Bumper, 8=Nová Zábrana, 9=Ohrádka, 10=Safety Gate,
// 11=Postel se zábranou, 12=Dětská postýlka,
// 13=Cestovní vak velký, 14=Cestovní vak malý,
// 15=Cestovní vak na bed bumper, 16=Jídelní židlička

export const TYPE_ID_MAP: Record<ProductType, number> = {
  'Popular': 1,
  'Premium': 2,
  'Economy': 3,
  'Flip': 4,
  'Smart': 5,
  'Short': 6,
  'Bed Bumper': 7,
  'Nová Zábrana': 8,
  'Ohrádka': 9,
  'Safety Gate': 10,
  'Postel': 11,
  'Postýlka': 12,
  'Cestovní Vak': 13,
  'Cestovní Vak Malý': 14,
  'Cestovní Vak Bumper': 15,
  'Židlička': 16,
};

// All type IDs for "any" / wildcard
const ALL_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

// ─── Answer → allowed type IDs (from screenshot mapping) ────────
export const ANSWER_ALLOWED_TYPES: Record<string, Record<string, number[]>> = {
  bedType: {
    'klasicka': [1, 2, 3, 4, 5, 7, 8],
    'vyklopna': [1, 2, 3, 4, 5, 7, 8],
    'boxspring': [1, 2, 3, 4, 5, 6, 7, 8],
    'valenda': [11, 12],
    'jiny': [1, 2, 3, 4, 5, 6, 7, 8],
  },
  // Q2 (sleepPosition) and Q3 (lengths) don't filter types
  age: {
    '0-3': [1, 2, 3, 4, 5, 6, 7, 8, 12],
    '3-plus': [1, 2, 6, 7, 12],
    'jine': ALL_IDS,
  },
  usage: {
    'pouze-doma': [1, 2, 3, 4, 5, 6, 7, 8],
    'doma-i-cesty': [1, 2, 6, 7, 8, 13, 14, 15],
    'pouze-cesty': [7, 8, 13, 14, 15],
    'jine': ALL_IDS,
  },
  priority: {
    'bez-vrtani': [1, 2, 6, 7, 8],
    'stabilita': [3, 4, 5],
    'premium': [1, 2],
    'pomer-cena-vykon': [1],
    'nejnizsi-cena': [3, 5, 6],
  },
};

// ─── Cross-sell: answer → product type IDs to recommend ─────────
export const CROSS_SELL_TYPE_IDS: Record<string, number[]> = {
  'schodiste': [10],
  'dvere': [10],
  'ohradka': [9],
  'stolovani': [16],
};

// ─── Priority ordering within eligible types ────────────────────
// When multiple types are eligible, prefer this order
export const TYPE_PRIORITY_ORDER: number[] = [1, 2, 8, 4, 5, 7, 3, 6];

// ─── Form steps ─────────────────────────────────────────────────
export const FORM_STEPS: FormStep[] = [
  {
    id: 'bedType',
    label: 'Jaký typ postele máte?',
    type: 'radio',
    required: true,
    options: [
      { value: 'klasicka', label: 'Klasická postel', description: 'Standardní postel s rámem a matrací' },
      { value: 'vyklopna', label: 'Výklopná postel', description: 'Postel s úložným prostorem pod matrací' },
      { value: 'boxspring', label: 'Boxspring', description: 'Vysoká postel s pružinovým základem' },
      { value: 'valenda', label: 'Valenda / gauč', description: 'Rozkládací řešení' },
      { value: 'jiny', label: 'Jiný typ', description: 'Žádná z výše uvedených možností' },
    ],
  },
  {
    id: 'sleepPosition',
    label: 'Kde v posteli dítě spí?',
    type: 'radio',
    required: true,
    options: [
      { value: 'u-zdi', label: 'U zdi', description: 'Potřebuji chránit 1 stranu' },
      { value: 'uprostred', label: 'Uprostřed', description: 'Potřebuji chránit 2 strany' },
      { value: 'aktivni', label: 'Aktivní spáč — všude', description: 'Potřebuji chránit 3 strany' },
      { value: 'bez-cela', label: 'Postel bez čela', description: 'Potřebuji chránit 4 strany' },
      { value: 'nevim', label: 'Nevím / nechám si poradit', description: 'Doporučíme 1 stranu' },
    ],
  },
  {
    id: 'lengths',
    label: 'Jaká je délka strany (stran) k ochraně?',
    description: 'Změřte prosím vnitřní rám postele, přesně tam, kam zapadá matrace.',
    type: 'multi-length',
    required: true,
    options: [
      ...LENGTH_OPTIONS.map((l) => ({ value: String(l), label: `${l} cm` })),
      { value: 'jine', label: 'Jiné' },
    ],
  },
  {
    id: 'age',
    label: 'Kolik je vašemu dítěti?',
    type: 'radio',
    required: true,
    options: [
      { value: '0-3', label: '0–3 roky', description: 'Miminko nebo batole' },
      { value: '3-plus', label: '3+ roky', description: 'Předškolák a starší' },
      { value: 'jine', label: 'Jiné / nevím' },
    ],
  },
  {
    id: 'usage',
    label: 'Kde budete zábrany používat?',
    type: 'radio',
    required: true,
    options: [
      { value: 'pouze-doma', label: 'Pouze doma', description: 'Zábrana bude pevně nainstalovaná' },
      { value: 'doma-i-cesty', label: 'Doma i na cesty', description: 'Občas potřebuji vzít s sebou' },
      { value: 'pouze-cesty', label: 'Pouze na cesty', description: 'Potřebuji přenosné řešení' },
      { value: 'jine', label: 'Jiné / nevím' },
    ],
  },
  {
    id: 'priority',
    label: 'Co je pro vás nejdůležitější?',
    type: 'radio',
    required: true,
    options: [
      { value: 'bez-vrtani', label: 'Montáž bez vrtání / šroubování', description: 'Snadná instalace bez poškození postele' },
      { value: 'stabilita', label: 'Maximální stabilita', description: 'Pevné uchycení šroubováním k posteli' },
      { value: 'premium', label: 'Prémiové zpracování a dlouhá životnost', description: 'Nejlepší materiály a design' },
      { value: 'pomer-cena-vykon', label: 'Nejlepší poměr cena/výkon', description: 'Nejlepší hodnota za peníze' },
      { value: 'nejnizsi-cena', label: 'Nejnižší cena a základní ochrana', description: 'Co nejlevnější řešení' },
    ],
  },
  {
    id: 'crossSell',
    label: 'Řešíte ještě jiné zabezpečení doma? (volitelné)',
    type: 'checkbox',
    required: false,
    multiSelect: true,
    options: [
      { value: 'schodiste', label: 'Zábranu ke schodišti' },
      { value: 'dvere', label: 'Zábranu do dveří' },
      { value: 'ohradka', label: 'Bezpečný prostor (dětská ohrádka)' },
      { value: 'stolovani', label: 'Bezpečné stolování' },
    ],
  },
];

export const LEAD_CAPTURE_TEXTS = {
  headline: 'Uložte si výběr na později',
  description: 'Pošleme vám doporučení na e-mail, ať se k němu můžete kdykoli vrátit.',
  emailPlaceholder: 'vas@email.cz',
  marketingLabel: 'Nechci dostávat tipy pro rodiče a novinky',
  submitButton: 'Odeslat na e-mail',
  gdprNote: 'Vaše data jsou v bezpečí. Zpracováváme je dle GDPR.',
  gdprLink: 'Zásady ochrany osobních údajů',
  successMessage: 'Hotovo! Doporučení je na cestě do vaší schránky.',
  errorMessage: 'Něco se pokazilo. Zkuste to prosím znovu.',
};
