/** Mirrors britam2 `/app/quote/new` product catalog and pricing rules. */

export type BritamPaymentFrequency = 'annual' | 'semi-annual' | 'quarterly' | 'monthly';

export type BritamQuoteProduct = {
  id: string;
  name: string;
  variant: string;
  description: string;
  basePremium: number;
  baseSumInsured: number;
  features: string[];
};

export const BRITAM_QUOTE_PRODUCTS: BritamQuoteProduct[] = [
  {
    id: 'poa-essential',
    name: 'Poa Plan',
    variant: 'Essential',
    description:
      'Essential coverage at affordable rates - Perfect for individuals and small families',
    basePremium: 300_000,
    baseSumInsured: 5_000_000,
    features: [
      'Inpatient coverage up to TZS 5M',
      'Outpatient consultations',
      'Maternity benefits',
      'Emergency services',
      'Basic dental care',
    ],
  },
  {
    id: 'imara-comprehensive',
    name: 'Imara Plan',
    variant: 'Comprehensive',
    description: 'Comprehensive coverage for families - Enhanced benefits and wider network',
    basePremium: 600_000,
    baseSumInsured: 10_000_000,
    features: [
      'Inpatient coverage up to TZS 10M',
      'Outpatient consultations',
      'Maternity benefits with higher limits',
      'Emergency services',
      'Dental and optical care',
      'Wellness programs',
    ],
  },
  {
    id: 'super-premium',
    name: 'Super Plan',
    variant: 'Premium',
    description: 'Premium coverage with enhanced benefits - Maximum protection for you and your family',
    basePremium: 1_200_000,
    baseSumInsured: 20_000_000,
    features: [
      'Inpatient coverage up to TZS 20M',
      'Unlimited outpatient consultations',
      'Comprehensive maternity benefits',
      'Emergency services worldwide',
      'Full dental and optical coverage',
      'Wellness and preventive care',
      'International coverage',
    ],
  },
];

export type BritamFamilyMemberInput = {
  name: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
};

const FREQUENCY_MULTIPLIER: Record<BritamPaymentFrequency, number> = {
  annual: 1.0,
  'semi-annual': 1.05,
  quarterly: 1.1,
  monthly: 1.15,
};

export function calculateBritamPremium(input: {
  product: BritamQuoteProduct;
  paymentFrequency: BritamPaymentFrequency;
  familyMembers: BritamFamilyMemberInput[];
  addOnIds: string[];
}): { premium: number; sumInsured: number } {
  const { product, paymentFrequency, familyMembers, addOnIds } = input;

  let premium = product.basePremium;
  let sumInsured = product.baseSumInsured;

  const additionalMembers = familyMembers.length;
  if (additionalMembers > 0) {
    premium += product.basePremium * 0.5 * additionalMembers;
    sumInsured += product.baseSumInsured * 0.3 * additionalMembers;
  }

  premium *= FREQUENCY_MULTIPLIER[paymentFrequency];

  if (addOnIds.length > 0) {
    premium += product.basePremium * 0.1 * addOnIds.length;
  }

  return {
    premium: Math.round(premium),
    sumInsured: Math.round(sumInsured),
  };
}

export function britamPackageLabel(product: BritamQuoteProduct): string {
  return `${product.name} · ${product.variant}`;
}

export const BRITAM_ADD_ONS: { id: string; name: string; description: string }[] = [
  { id: 'dental', name: 'Enhanced Dental Coverage', description: '+10% premium' },
  { id: 'optical', name: 'Optical Care Coverage', description: '+10% premium' },
  { id: 'wellness', name: 'Wellness & Preventive Care', description: '+10% premium' },
];
