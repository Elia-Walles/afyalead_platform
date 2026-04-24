import {
  type BritamFamilyMemberInput,
  type BritamPaymentFrequency,
  type BritamQuoteProduct,
  britamPackageLabel,
  calculateBritamPremium,
} from '@/constants/britam-quote-products';
import {
  type BritamAddOn,
  type BritamCoverageDetails,
  type BritamFamilyMember,
  type BritamMobileProduct,
  type BritamPolicy,
  type BritamQuote,
  BRITAM_ADD_ONS,
  BRITAM_MOBILE_PRODUCTS,
  PAYMENT_FREQUENCY_MULTIPLIERS,
  calculateBritamPremium as calculateMobilePremium,
} from '@/constants/britam-mobile-products';
import React, { createContext, useContext, useMemo, useState } from 'react';

export type InsuranceProviderId = 'nhif' | 'jubilee' | 'britam' | 'assemble';

export type InsurancePackage = {
  id: string;
  name: string;
  monthlyPremium: number;
  annualLimit: number;
  membersAllowed: number;
  benefits: string[];
};

export type InsuranceProvider = {
  id: InsuranceProviderId;
  name: string;
  shortDescription: string;
  themeColor: string;
  packages: InsurancePackage[];
};

export type QuoteStatus = 'draft' | 'pending_payment' | 'paid' | 'active';
export type PaymentStatus = 'pending' | 'completed';
export type ClaimStatus = 'submitted' | 'processing' | 'approved';

export type InsuranceQuote = {
  id: string;
  providerId: InsuranceProviderId;
  packageId: string;
  packageName: string;
  /** Monthly premium (generic quotes) or display baseline; see amountDue for payment. */
  monthlyPremium: number;
  membersCount: number;
  status: QuoteStatus;
  reference: string;
  createdAt: string;
  /** Amount to collect at payment (Britam wizard uses calculated period premium). */
  amountDue?: number;
  sumInsured?: number;
  paymentFrequency?: BritamPaymentFrequency;
  productName?: string;
  productVariant?: string;
  britamAddOns?: string[];
  britamFamilyMembers?: BritamFamilyMemberInput[];
};

export type InsurancePayment = {
  id: string;
  quoteId: string;
  amount: number;
  method: 'mobile_money' | 'card' | 'bank';
  status: PaymentStatus;
  paidAt: string;
};

export type InsurancePolicy = {
  id: string;
  quoteId: string;
  providerId: InsuranceProviderId;
  packageName: string;
  policyNumber: string;
  memberName: string;
  startDate: string;
  endDate: string;
  virtualCardNumber: string;
  kycCompleted: boolean;
};

export type InsuranceClaim = {
  id: string;
  policyNumber: string;
  amount: number;
  reason: string;
  status: ClaimStatus;
};

/** Display order on Pamoja Bima home: NHIF → BRITAM → ASSEMBLE → JUBILEE */
export const PAMOJA_PROVIDER_ORDER: InsuranceProviderId[] = ['nhif', 'britam', 'assemble', 'jubilee'];

const providers: InsuranceProvider[] = [
  {
    id: 'nhif',
    name: 'NHIF',
    shortDescription: 'Affordable public coverage with wide facility access.',
    themeColor: '#2B8A3E',
    packages: [
      { id: 'basic', name: 'Basic Family', monthlyPremium: 42000, annualLimit: 3000000, membersAllowed: 4, benefits: ['OPD', 'IPD', 'Maternity'] },
      { id: 'plus', name: 'Plus Family', monthlyPremium: 67000, annualLimit: 6000000, membersAllowed: 6, benefits: ['OPD', 'IPD', 'Dental', 'Optical'] },
    ],
  },
  {
    id: 'britam',
    name: 'BRITAM',
    shortDescription: 'Flexible plans with rich post-purchase self-service.',
    themeColor: '#0A7C3A',
    packages: [
      { id: 'afya-smart', name: 'Afya Smart', monthlyPremium: 76000, annualLimit: 10000000, membersAllowed: 5, benefits: ['OPD', 'IPD', 'Maternity', 'Wellness'] },
      { id: 'afya-premium', name: 'Afya Premium', monthlyPremium: 128000, annualLimit: 25000000, membersAllowed: 8, benefits: ['OPD', 'IPD', 'Dental', 'Optical', 'Overseas Referral'] },
    ],
  },
  {
    id: 'assemble',
    name: 'ASSEMBLE',
    shortDescription: 'Modern digital-first insurance plans for all segments.',
    themeColor: '#2F9E44',
    packages: [
      { id: 'starter', name: 'Starter Care', monthlyPremium: 59000, annualLimit: 7000000, membersAllowed: 5, benefits: ['OPD', 'IPD', 'Emergency'] },
      { id: 'max', name: 'Max Care', monthlyPremium: 98000, annualLimit: 17000000, membersAllowed: 7, benefits: ['OPD', 'IPD', 'Dental', 'Optical', 'Chronic Support'] },
    ],
  },
  {
    id: 'jubilee',
    name: 'JUBILEE',
    shortDescription: 'Comprehensive private plans for family and business.',
    themeColor: '#1D9B5B',
    packages: [
      { id: 'silver', name: 'Silver Cover', monthlyPremium: 83000, annualLimit: 12000000, membersAllowed: 6, benefits: ['OPD', 'IPD', 'Emergency', 'Maternity'] },
      { id: 'gold', name: 'Gold Cover', monthlyPremium: 115000, annualLimit: 20000000, membersAllowed: 8, benefits: ['OPD', 'IPD', 'Dental', 'Optical', 'International Referral'] },
    ],
  },
];

type MockAppContextValue = {
  providers: InsuranceProvider[];
  quotes: InsuranceQuote[];
  policies: InsurancePolicy[];
  payments: InsurancePayment[];
  claims: InsuranceClaim[];
  /** Demo sign-in PIN (default 1234; registration overwrites). */
  memberPin: string;
  setMemberPin: (pin: string) => void;
  selectedRole: 'group' | 'admin' | 'officer';
  setSelectedRole: (role: 'group' | 'admin' | 'officer') => void;
  createQuote: (providerId: InsuranceProviderId, packageId: string, membersCount: number) => InsuranceQuote | null;
  createBritamQuote: (input: {
    product: BritamQuoteProduct;
    paymentFrequency: BritamPaymentFrequency;
    familyMembers: BritamFamilyMemberInput[];
    addOnIds: string[];
    /** `draft` = saved for later; `pending_payment` = ready to pay */
    outcome: 'draft' | 'pending_payment';
  }) => InsuranceQuote | null;
  payQuote: (quoteId: string, method: 'mobile_money' | 'card' | 'bank') => InsurancePolicy | null;
  completeKyc: (policyId: string) => void;
  submitClaim: (policyNumber: string, amount: number, reason: string) => void;
  // BRITAM Mobile-specific functions
  britamMobileQuotes: BritamQuote[];
  britamMobilePolicies: BritamPolicy[];
  createBritamMobileQuote: (input: {
    product: BritamMobileProduct;
    coverageDetails: BritamCoverageDetails;
    status: 'draft' | 'pending';
  }) => BritamQuote | null;
  saveBritamMobileDraft: (quoteId: string) => void;
  loadBritamMobileDraft: (quoteId: string) => BritamQuote | null;
  submitBritamMobileQuote: (quoteId: string) => void;
  processBritamMobilePayment: (quoteId: string, method: 'mobile_money' | 'card') => BritamPolicy | null;
  getBritamMobileDrafts: () => BritamQuote[];
  getBritamMobilePolicies: () => BritamPolicy[];
};

const MockAppContext = createContext<MockAppContextValue | null>(null);

function makeRef(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 900000 + 100000)}`;
}

function toIsoDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
}

const DEFAULT_MEMBER_PIN = '1234';

export function MockAppProvider({ children }: { children: React.ReactNode }) {
  const [memberPin, setMemberPin] = useState(DEFAULT_MEMBER_PIN);
  const [selectedRole, setSelectedRole] = useState<'group' | 'admin' | 'officer'>('group');
  const [quotes, setQuotes] = useState<InsuranceQuote[]>([]);
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [payments, setPayments] = useState<InsurancePayment[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([
    { id: 'cl-1', policyNumber: 'POL-948222', amount: 280000, reason: 'Outpatient reimbursement', status: 'processing' },
  ]);
  // BRITAM Mobile-specific state
  const [britamMobileQuotes, setBritamMobileQuotes] = useState<BritamQuote[]>([
    {
      id: 'britam-quote-1',
      productName: 'Poa',
      productVariant: 'Individual',
      status: 'draft',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      expiresAt: null,
      customerId: 'customer-1',
      coverageDetails: {
        productName: 'Poa',
        productVariant: 'Individual',
        familyMembers: [],
        addOns: ['dental', 'optical'],
        paymentFrequency: 'annual',
      },
      premium: 120000,
      sumInsured: 5000000,
    },
    {
      id: 'britam-quote-2',
      productName: 'Imara',
      productVariant: 'Family',
      status: 'pending',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      expiresAt: null,
      customerId: 'customer-1',
      coverageDetails: {
        productName: 'Imara',
        productVariant: 'Family',
        familyMembers: [
          { id: 'mem-1', name: 'Jane Smith', relationship: 'spouse', dateOfBirth: '1985-05-20', gender: 'female' },
          { id: 'mem-2', name: 'Tom Smith', relationship: 'spouse', dateOfBirth: '1987-08-10', gender: 'male' },
          { id: 'mem-3', name: 'Lily Smith', relationship: 'child', dateOfBirth: '2015-03-12', gender: 'female' },
        ],
        addOns: ['maternity'],
        paymentFrequency: 'semi-annual',
      },
      premium: 450000,
      sumInsured: 15000000,
    },
  ]);
  const [britamMobilePolicies, setBritamMobilePolicies] = useState<BritamPolicy[]>([
    {
      id: 'britam-policy-1',
      policyNumber: 'BRITAM-2024-001234',
      productName: 'Poa',
      productVariant: 'Individual',
      status: 'active',
      issueDate: new Date(Date.now() - 86400000 * 30).toISOString(),
      startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 335).toISOString(),
      premium: 120000,
      sumInsured: 5000000,
      paymentFrequency: 'annual',
      paymentMethod: 'mobile_money',
      familyMembers: [
        { id: 'mem-1', name: 'Demo Customer', relationship: 'self', dateOfBirth: '1990-01-15', membershipNumber: 'BRITAM-001', status: 'active' },
      ],
      benefits: [
        { name: 'Inpatient', limit: 'TZS 5,000,000', used: 'TZS 0', remaining: 'TZS 5,000,000' },
        { name: 'Outpatient', limit: 'TZS 500,000', used: 'TZS 50,000', remaining: 'TZS 450,000' },
        { name: 'Dental', limit: 'TZS 100,000', used: 'TZS 20,000', remaining: 'TZS 80,000' },
        { name: 'Optical', limit: 'TZS 100,000', used: 'TZS 0', remaining: 'TZS 100,000' },
      ],
      customerId: 'customer-1',
      quoteId: 'britam-quote-1',
    },
    {
      id: 'britam-policy-2',
      policyNumber: 'BRITAM-2024-005678',
      productName: 'Imara',
      productVariant: 'Family',
      status: 'active',
      issueDate: new Date(Date.now() - 86400000 * 90).toISOString(),
      startDate: new Date(Date.now() - 86400000 * 90).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 275).toISOString(),
      premium: 450000,
      sumInsured: 15000000,
      paymentFrequency: 'semi-annual',
      paymentMethod: 'mobile_money',
      familyMembers: [
        { id: 'mem-1', name: 'Alice Johnson', relationship: 'self', dateOfBirth: '1982-03-25', membershipNumber: 'BRITAM-002', status: 'active' },
        { id: 'mem-2', name: 'Bob Johnson', relationship: 'spouse', dateOfBirth: '1984-07-14', membershipNumber: 'BRITAM-003', status: 'active' },
        { id: 'mem-3', name: 'Charlie Johnson', relationship: 'child', dateOfBirth: '2012-09-01', membershipNumber: 'BRITAM-004', status: 'active' },
        { id: 'mem-4', name: 'Diana Johnson', relationship: 'child', dateOfBirth: '2016-04-15', membershipNumber: 'BRITAM-005', status: 'active' },
      ],
      benefits: [
        { name: 'Inpatient', limit: 'TZS 15,000,000', used: 'TZS 200,000', remaining: 'TZS 14,800,000' },
        { name: 'Outpatient', limit: 'TZS 1,000,000', used: 'TZS 150,000', remaining: 'TZS 850,000' },
        { name: 'Maternity', limit: 'TZS 500,000', used: 'TZS 0', remaining: 'TZS 500,000' },
        { name: 'Dental', limit: 'TZS 200,000', used: 'TZS 30,000', remaining: 'TZS 170,000' },
      ],
      customerId: 'customer-1',
      quoteId: 'britam-quote-2',
    },
    {
      id: 'britam-policy-3',
      policyNumber: 'BRITAM-2023-009999',
      productName: 'Super',
      productVariant: 'Family',
      status: 'expired',
      issueDate: new Date(Date.now() - 86400000 * 400).toISOString(),
      startDate: new Date(Date.now() - 86400000 * 400).toISOString(),
      endDate: new Date(Date.now() - 86400000 * 35).toISOString(),
      premium: 800000,
      sumInsured: 30000000,
      paymentFrequency: 'annual',
      paymentMethod: 'card',
      familyMembers: [
        { id: 'mem-1', name: 'Mark Wilson', relationship: 'self', dateOfBirth: '1978-11-30', membershipNumber: 'BRITAM-006', status: 'inactive' },
        { id: 'mem-2', name: 'Sarah Wilson', relationship: 'spouse', dateOfBirth: '1980-02-28', membershipNumber: 'BRITAM-007', status: 'inactive' },
      ],
      benefits: [
        { name: 'Inpatient', limit: 'TZS 30,000,000', used: 'TZS 5,000,000', remaining: 'TZS 25,000,000' },
        { name: 'Outpatient', limit: 'TZS 2,000,000', used: 'TZS 800,000', remaining: 'TZS 1,200,000' },
      ],
      customerId: 'customer-1',
      quoteId: 'britam-quote-3',
    },
  ]);

  const createQuote: MockAppContextValue['createQuote'] = (providerId, packageId, membersCount) => {
    const provider = providers.find((p) => p.id === providerId);
    const selectedPackage = provider?.packages.find((p) => p.id === packageId);
    if (!provider || !selectedPackage) return null;

    const quote: InsuranceQuote = {
      id: makeRef('Q'),
      providerId,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      monthlyPremium: selectedPackage.monthlyPremium,
      membersCount,
      status: 'pending_payment',
      reference: makeRef('QT'),
      createdAt: toIsoDate(),
    };
    setQuotes((prev) => [quote, ...prev]);
    return quote;
  };

  const createBritamQuote: MockAppContextValue['createBritamQuote'] = ({
    product,
    paymentFrequency,
    familyMembers,
    addOnIds,
    outcome,
  }) => {
    const { premium, sumInsured } = calculateBritamPremium({
      product,
      paymentFrequency,
      familyMembers,
      addOnIds,
    });
    const membersCount = 1 + familyMembers.length;
    const quote: InsuranceQuote = {
      id: makeRef('Q'),
      providerId: 'britam',
      packageId: product.id,
      packageName: britamPackageLabel(product),
      monthlyPremium: Math.round(premium / 12),
      membersCount,
      status: outcome === 'draft' ? 'draft' : 'pending_payment',
      reference: makeRef('QT'),
      createdAt: toIsoDate(),
      amountDue: premium,
      sumInsured,
      paymentFrequency,
      productName: product.name,
      productVariant: product.variant,
      britamAddOns: addOnIds,
      britamFamilyMembers: familyMembers,
    };
    setQuotes((prev) => [quote, ...prev]);
    return quote;
  };

  const payQuote: MockAppContextValue['payQuote'] = (quoteId, method) => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return null;

    const payAmount = quote.amountDue ?? quote.monthlyPremium;

    setQuotes((prev) => prev.map((q) => (q.id === quoteId ? { ...q, status: 'paid' } : q)));
    setPayments((prev) => [
      {
        id: makeRef('PAY'),
        quoteId,
        amount: payAmount,
        method,
        status: 'completed',
        paidAt: toIsoDate(),
      },
      ...prev,
    ]);

    const policy: InsurancePolicy = {
      id: makeRef('POLID'),
      quoteId,
      providerId: quote.providerId,
      packageName: quote.packageName,
      policyNumber: makeRef('POL'),
      memberName: 'Demo Customer',
      startDate: toIsoDate(1),
      endDate: toIsoDate(365),
      virtualCardNumber: makeRef('VC'),
      kycCompleted: false,
    };

    setPolicies((prev) => [policy, ...prev]);
    setQuotes((prev) => prev.map((q) => (q.id === quoteId ? { ...q, status: 'active' } : q)));
    return policy;
  };

  const completeKyc: MockAppContextValue['completeKyc'] = (policyId) => {
    setPolicies((prev) => prev.map((p) => (p.id === policyId ? { ...p, kycCompleted: true } : p)));
  };

  const submitClaim: MockAppContextValue['submitClaim'] = (policyNumber, amount, reason) => {
    setClaims((prev) => [
      { id: makeRef('CLM'), policyNumber, amount, reason, status: 'submitted' },
      ...prev,
    ]);
  };

  // BRITAM Mobile-specific functions
  const createBritamMobileQuote: MockAppContextValue['createBritamMobileQuote'] = ({
    product,
    coverageDetails,
    status,
  }) => {
    const { premium, sumInsured } = calculateMobilePremium(product, coverageDetails);
    const quote: BritamQuote = {
      id: makeRef('BMQ'),
      productName: product.name,
      productVariant: product.variant,
      premium,
      sumInsured,
      coverageDetails,
      status,
      createdAt: toIsoDate(),
      expiresAt: status === 'draft' ? toIsoDate(30) : null,
      customerId: 'demo-customer',
    };
    setBritamMobileQuotes((prev) => [quote, ...prev]);
    return quote;
  };

  const saveBritamMobileDraft: MockAppContextValue['saveBritamMobileDraft'] = (quoteId) => {
    setBritamMobileQuotes((prev) =>
      prev.map((q) =>
        q.id === quoteId ? { ...q, status: 'draft', expiresAt: toIsoDate(30) } : q
      )
    );
  };

  const loadBritamMobileDraft: MockAppContextValue['loadBritamMobileDraft'] = (quoteId) => {
    return britamMobileQuotes.find((q) => q.id === quoteId) || null;
  };

  const submitBritamMobileQuote: MockAppContextValue['submitBritamMobileQuote'] = (quoteId) => {
    setBritamMobileQuotes((prev) =>
      prev.map((q) =>
        q.id === quoteId ? { ...q, status: 'pending', expiresAt: null } : q
      )
    );
  };

  const processBritamMobilePayment: MockAppContextValue['processBritamMobilePayment'] = (
    quoteId,
    method
  ) => {
    const quote = britamMobileQuotes.find((q) => q.id === quoteId);
    if (!quote) return null;

    // Create policy from quote
    const policy: BritamPolicy = {
      id: makeRef('BMP'),
      policyNumber: makeRef('POL'),
      productName: quote.productName,
      productVariant: quote.productVariant,
      status: 'active',
      issueDate: toIsoDate(),
      startDate: toIsoDate(1),
      endDate: toIsoDate(365),
      sumInsured: quote.sumInsured,
      premium: quote.premium,
      paymentFrequency: quote.coverageDetails.paymentFrequency,
      paymentMethod: method === 'mobile_money' ? 'Mobile Money' : 'Card',
      familyMembers: quote.coverageDetails.familyMembers.map((m) => ({
        id: makeRef('MEM'),
        name: m.name,
        relationship: m.relationship,
        dateOfBirth: m.dateOfBirth,
        membershipNumber: makeRef('MEM'),
        status: 'active',
      })),
      benefits: [
        { name: 'Inpatient', limit: `${quote.sumInsured}`, used: '0', remaining: `${quote.sumInsured}` },
        { name: 'Outpatient', limit: 'Unlimited', used: '0', remaining: 'Unlimited' },
      ],
      customerId: quote.customerId,
      quoteId,
    };

    setBritamMobilePolicies((prev) => [policy, ...prev]);
    setBritamMobileQuotes((prev) => prev.map((q) => (q.id === quoteId ? { ...q, status: 'approved' } : q)));

    return policy;
  };

  const getBritamMobileDrafts: MockAppContextValue['getBritamMobileDrafts'] = () => {
    return britamMobileQuotes.filter((q) => q.status === 'draft');
  };

  const getBritamMobilePolicies: MockAppContextValue['getBritamMobilePolicies'] = () => {
    return britamMobilePolicies;
  };

  const value = useMemo(
    () => ({
      providers,
      quotes,
      policies,
      payments,
      claims,
      memberPin,
      setMemberPin,
      selectedRole,
      setSelectedRole,
      createQuote,
      createBritamQuote,
      payQuote,
      completeKyc,
      submitClaim,
      // BRITAM Mobile
      britamMobileQuotes,
      britamMobilePolicies,
      createBritamMobileQuote,
      saveBritamMobileDraft,
      loadBritamMobileDraft,
      submitBritamMobileQuote,
      processBritamMobilePayment,
      getBritamMobileDrafts,
      getBritamMobilePolicies,
    }),
    [claims, memberPin, payments, policies, quotes, selectedRole, britamMobileQuotes, britamMobilePolicies]
  );

  return <MockAppContext.Provider value={value}>{children}</MockAppContext.Provider>;
}

export function useMockApp() {
  const ctx = useContext(MockAppContext);
  if (!ctx) {
    throw new Error('useMockApp must be used within MockAppProvider');
  }
  return ctx;
}
