import { FormStep } from '@/types/form';

export const FORM_STEPS: FormStep[] = [
  {
    id: 'bedType',
    label: 'Jaký typ postele máte?',
    type: 'radio',
    required: true,
    options: [
      { value: 'detska-postel', label: 'Dětská postel' },
      { value: 'manzelska-postel', label: 'Manželská postel' },
      { value: 'jednoluzko', label: 'Jednolůžko pro dospělého' },
      { value: 'jiny-typ', label: 'Jiný typ / nejsem si jistý' },
    ],
  },
  {
    id: 'length',
    label: 'Jaká je délka strany k ochraně?',
    type: 'select',
    required: true,
    options: [
      { value: '80', label: '80 cm' },
      { value: '90', label: '90 cm' },
      { value: '100', label: '100 cm' },
      { value: '120', label: '120 cm' },
      { value: '130', label: '130 cm' },
      { value: '140', label: '140 cm' },
      { value: '150', label: '150 cm' },
      { value: '160', label: '160 cm' },
      { value: '180', label: '180 cm' },
      { value: '190', label: '190 cm' },
      { value: '200', label: '200 cm' },
      { value: 'nevim', label: 'Nevím přesně' },
    ],
  },
  {
    id: 'sides',
    label: 'Kolik stran postele chcete chránit?',
    type: 'radio',
    required: true,
    options: [
      { value: 'jedna', label: '1 strana' },
      { value: 'dve', label: '2 strany' },
      { value: 'vice', label: 'Více stran / okolo celé postele' },
    ],
  },
  {
    id: 'period',
    label: 'V jakém období se nachází vaše dítě?',
    type: 'select',
    required: true,
    options: [
      { value: 'sestinedeli', label: 'Šestinedělí' },
      { value: 'prvni-rok', label: 'První rok s miminkem' },
      { value: 'dva-tri-roky', label: 'Dva až tři roky s batoletem' },
      { value: 'starsi-3-roky', label: 'Starší než 3 roky' },
    ],
  },
  {
    id: 'activity',
    label: 'Jak budete zábranu používat?',
    type: 'radio',
    required: true,
    options: [
      { value: 'doma', label: 'Pouze doma (spánek)', description: 'Zábrana bude pevně nainstalovaná' },
      { value: 'cestovani', label: 'Často na cestách', description: 'Potřebuji snadnou přenosnost' },
    ],
  },
  {
    id: 'preference',
    label: 'Jaký typ zábrany preferujete?',
    type: 'radio',
    required: true,
    options: [
      { value: 'necham-poradit', label: 'Nechám si poradit', description: 'Doporučíme nejlepší řešení' },
      { value: 'premium', label: 'Prémiové řešení', description: 'Nejvyšší kvalita a komfort' },
      { value: 'popular', label: 'Poměr cena / výkon', description: 'Nejoblíbenější volba' },
      { value: 'economy', label: 'Co nejnižší cena', description: 'Základní ochrana za skvělou cenu' },
    ],
  },
  {
    id: 'budget',
    label: 'Jaký máte rozpočet?',
    type: 'radio',
    required: true,
    options: [
      { value: 'neresim', label: 'Neřeším cenu' },
      { value: 'do-1500', label: 'Do 1 500 Kč' },
      { value: 'nad-1500', label: 'Nad 1 500 Kč' },
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

export const PERIOD_MAP: Record<string, string> = {
  'sestinedeli': 'Šestinedělí',
  'prvni-rok': 'První rok s miminkem',
  'dva-tri-roky': 'Dva až tři roky s batoletem',
  'starsi-3-roky': 'Starší než 3 roky',
};
