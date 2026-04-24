export interface BritamMobileProduct {
  id: string;
  name: string;
  variant: string;
  description: string;
  basePremium: number;
  baseSumInsured: number;
  features: string[];
}

export interface BritamAddOn {
  id: string;
  name: string;
  description: string;
  premiumMultiplier: number; // Multiplier of base premium
}

export type BritamPaymentFrequency = 'annual' | 'semi-annual' | 'quarterly' | 'monthly';

export const BRITAM_MOBILE_PRODUCTS: BritamMobileProduct[] = [
  {
    id: 'poa-essential',
    name: 'Poa Plan',
    variant: 'Essential',
    description: 'Essential coverage at affordable rates - Perfect for individuals and small families',
    basePremium: 300000,
    baseSumInsured: 5000000,
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
    basePremium: 600000,
    baseSumInsured: 10000000,
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
    basePremium: 1200000,
    baseSumInsured: 20000000,
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

export const BRITAM_ADD_ONS: BritamAddOn[] = [
  {
    id: 'dental',
    name: 'Enhanced Dental Coverage',
    description: '+10% premium',
    premiumMultiplier: 0.1,
  },
  {
    id: 'optical',
    name: 'Optical Care Coverage',
    description: '+10% premium',
    premiumMultiplier: 0.1,
  },
  {
    id: 'wellness',
    name: 'Wellness & Preventive Care',
    description: '+10% premium',
    premiumMultiplier: 0.1,
  },
];

export const PAYMENT_FREQUENCY_MULTIPLIERS: Record<BritamPaymentFrequency, number> = {
  annual: 1.0,
  'semi-annual': 1.05,
  quarterly: 1.1,
  monthly: 1.15,
};

export const PAYMENT_FREQUENCY_LABELS: Record<BritamPaymentFrequency, string> = {
  annual: 'Annual',
  'semi-annual': 'Semi-Annual',
  quarterly: 'Quarterly',
  monthly: 'Monthly',
};

export interface BritamFamilyMember {
  id: string;
  name: string;
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
}

export interface BritamCoverageDetails {
  productName: string;
  productVariant: string;
  familyMembers: BritamFamilyMember[];
  addOns: string[];
  paymentFrequency: BritamPaymentFrequency;
}

export interface BritamQuote {
  id: string;
  productName: string;
  productVariant: string;
  premium: number;
  sumInsured: number;
  coverageDetails: BritamCoverageDetails;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  expiresAt: string | null;
  customerId: string;
}

export interface BritamPolicy {
  id: string;
  policyNumber: string;
  productName: string;
  productVariant: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  issueDate: string;
  startDate: string;
  endDate: string;
  sumInsured: number;
  premium: number;
  paymentFrequency: BritamPaymentFrequency;
  paymentMethod: string;
  renewalDate?: string;
  familyMembers: Array<{
    id: string;
    name: string;
    relationship: string;
    dateOfBirth: string;
    membershipNumber: string;
    status: string;
  }>;
  benefits?: Array<{
    name: string;
    limit: string;
    used: string;
    remaining: string;
  }>;
  customerId: string;
  quoteId: string;
}

export const calculateBritamPremium = (
  product: BritamMobileProduct,
  coverageDetails: BritamCoverageDetails
): { premium: number; sumInsured: number } => {
  let premium = product.basePremium;
  let sumInsured = product.baseSumInsured;

  // Add premium for family members (50% of base for each additional member)
  const additionalMembers = coverageDetails.familyMembers.length;
  if (additionalMembers > 0) {
    premium += product.basePremium * 0.5 * additionalMembers;
    sumInsured += product.baseSumInsured * 0.3 * additionalMembers;
  }

  // Apply payment frequency multiplier
  const frequencyMultiplier = PAYMENT_FREQUENCY_MULTIPLIERS[coverageDetails.paymentFrequency];
  premium = premium * frequencyMultiplier;

  // Add-ons (10% of base premium per add-on)
  if (coverageDetails.addOns.length > 0) {
    premium += product.basePremium * 0.1 * coverageDetails.addOns.length;
  }

  return {
    premium: Math.round(premium),
    sumInsured: Math.round(sumInsured),
  };
};
