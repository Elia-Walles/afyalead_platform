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
  monthlyPremium: number;
  membersCount: number;
  status: QuoteStatus;
  reference: string;
  createdAt: string;
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

const providers: InsuranceProvider[] = [
  {
    id: 'nhif',
    name: 'IDNHIF',
    shortDescription: 'Affordable public coverage with wide facility access.',
    themeColor: '#2B8A3E',
    packages: [
      { id: 'basic', name: 'Basic Family', monthlyPremium: 42000, annualLimit: 3000000, membersAllowed: 4, benefits: ['OPD', 'IPD', 'Maternity'] },
      { id: 'plus', name: 'Plus Family', monthlyPremium: 67000, annualLimit: 6000000, membersAllowed: 6, benefits: ['OPD', 'IPD', 'Dental', 'Optical'] },
    ],
  },
  {
    id: 'jubilee',
    name: 'Jubilee',
    shortDescription: 'Comprehensive private plans for family and business.',
    themeColor: '#1D9B5B',
    packages: [
      { id: 'silver', name: 'Silver Cover', monthlyPremium: 83000, annualLimit: 12000000, membersAllowed: 6, benefits: ['OPD', 'IPD', 'Emergency', 'Maternity'] },
      { id: 'gold', name: 'Gold Cover', monthlyPremium: 115000, annualLimit: 20000000, membersAllowed: 8, benefits: ['OPD', 'IPD', 'Dental', 'Optical', 'International Referral'] },
    ],
  },
  {
    id: 'britam',
    name: 'Britam',
    shortDescription: 'Flexible plans with rich post-purchase self-service.',
    themeColor: '#0A7C3A',
    packages: [
      { id: 'afya-smart', name: 'Afya Smart', monthlyPremium: 76000, annualLimit: 10000000, membersAllowed: 5, benefits: ['OPD', 'IPD', 'Maternity', 'Wellness'] },
      { id: 'afya-premium', name: 'Afya Premium', monthlyPremium: 128000, annualLimit: 25000000, membersAllowed: 8, benefits: ['OPD', 'IPD', 'Dental', 'Optical', 'Overseas Referral'] },
    ],
  },
  {
    id: 'assemble',
    name: 'Assemble',
    shortDescription: 'Modern digital-first insurance plans for all segments.',
    themeColor: '#2F9E44',
    packages: [
      { id: 'starter', name: 'Starter Care', monthlyPremium: 59000, annualLimit: 7000000, membersAllowed: 5, benefits: ['OPD', 'IPD', 'Emergency'] },
      { id: 'max', name: 'Max Care', monthlyPremium: 98000, annualLimit: 17000000, membersAllowed: 7, benefits: ['OPD', 'IPD', 'Dental', 'Optical', 'Chronic Support'] },
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
  payQuote: (quoteId: string, method: 'mobile_money' | 'card' | 'bank') => InsurancePolicy | null;
  completeKyc: (policyId: string) => void;
  submitClaim: (policyNumber: string, amount: number, reason: string) => void;
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

  const payQuote: MockAppContextValue['payQuote'] = (quoteId, method) => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return null;

    setQuotes((prev) => prev.map((q) => (q.id === quoteId ? { ...q, status: 'paid' } : q)));
    setPayments((prev) => [
      {
        id: makeRef('PAY'),
        quoteId,
        amount: quote.monthlyPremium,
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
      payQuote,
      completeKyc,
      submitClaim,
    }),
    [claims, memberPin, payments, policies, quotes, selectedRole]
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
