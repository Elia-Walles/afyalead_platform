import type { ImageSourcePropType } from 'react-native';

import type { InsuranceProviderId } from '@/context/mock-app-context';

/** Local logos under `assets/images/` — filenames as supplied. */
export const PAMOJA_PROVIDER_LOGOS: Record<InsuranceProviderId, ImageSourcePropType> = {
  nhif: require('@/assets/images/NHIF.jpg'),
  britam: require('@/assets/images/BRITAM.png'),
  assemble: require('@/assets/images/ASSEMBLE.png'),
  jubilee: require('@/assets/images/JUBELEE.jpg'),
};
