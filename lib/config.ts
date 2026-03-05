import { FormStep } from '@/types/form';

export const LENGTH_OPTIONS = [80, 90, 100, 120, 130, 140, 150, 160, 180, 190, 200];

export const SLEEP_POSITION_SIDES_MAP: Record<string, number> = {
  'u-zdi': 1,
  'uprostred': 2,
  'aktivni': 3,
  'bez-cela': 4,
  'nevim': 1,
};

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
    label: 'Jak budete zábranu používat?',
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
      { value: 'bez-vrtani', label: 'Bez vrtání', description: 'Snadná instalace bez poškození postele' },
      { value: 'stabilita', label: 'Maximální stabilita', description: 'Nejpevnější uchycení' },
      { value: 'premium', label: 'Prémiová kvalita', description: 'Nejlepší materiály a design' },
      { value: 'pomer-cena-vykon', label: 'Poměr cena/výkon', description: 'Nejlepší hodnota za peníze' },
      { value: 'nejnizsi-cena', label: 'Nejnižší cena', description: 'Co nejlevnější řešení' },
    ],
  },
  {
    id: 'crossSell',
    label: 'Zajímá vás ještě něco dalšího? (volitelné)',
    type: 'checkbox',
    required: false,
    multiSelect: true,
    options: [
      { value: 'schodiste', label: 'Zábrana na schodiště' },
      { value: 'dvere', label: 'Zábrana do dveří' },
      { value: 'ohradka', label: 'Dětská ohrádka' },
      { value: 'stolovani', label: 'Židlička na stolování' },
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
