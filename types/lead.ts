export interface FormAnswers {
  bedType: string;
  length: string;
  sides: string;
  period: string;
  activity: string;
  preference: string;
  budget: string;
}

export interface Lead {
  id: string;
  email: string;
  createdAt: string;
  recommendedProductId: string;
  alternativeProductIds: string[];
  formAnswers: FormAnswers;
  marketingConsent: boolean;
  gdprConsentAt: string;
  source?: string;
  utmCampaign?: string;
  utmMedium?: string;
}

export interface LeadFormData {
  email: string;
  marketingConsent: boolean;
}

export interface LeadSubmissionData {
  email: string;
  marketingConsent: boolean;
  recommendedProductId: string;
  alternativeProductIds: string[];
  formAnswers: FormAnswers;
  tags: string[];
}
