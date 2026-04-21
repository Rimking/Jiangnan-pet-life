export const theme = {
  primary: {
    main: '#6B73FF',
    light: '#EEF0FF',
  },
  background: {
    default: '#F7F8FC',
    card: '#FFFFFF',
  },
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    tertiary: '#9CA3AF',
  },
  success: {
    main: '#22C55E',
  },
  status: {
    danger: '#EF4444',
  },
} as const;

export const gradients = {
  primary: 'linear-gradient(135deg, #6B73FF 0%, #8A7DFF 100%)',
  pageBg: 'linear-gradient(180deg, #F9FAFF 0%, #F3F5FF 100%)',
  cardBg: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFF 100%)',
  pink: 'linear-gradient(135deg, #FB7185 0%, #F472B6 100%)',
  cyan: 'linear-gradient(135deg, #22D3EE 0%, #38BDF8 100%)',
  orange: 'linear-gradient(135deg, #FB923C 0%, #F59E0B 100%)',
  blueGreen: 'linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%)',
  purplePink: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
} as const;

export const shadows = {
  soft: '0 2px 10px rgba(15, 23, 42, 0.06)',
  card: '0 6px 18px rgba(15, 23, 42, 0.08)',
  medium: '0 8px 24px rgba(15, 23, 42, 0.12)',
  strong: '0 12px 28px rgba(15, 23, 42, 0.18)',
} as const;

export const borderRadius = {
  small: '12rpx',
  medium: '20rpx',
  lg: '28rpx',
  large: '28rpx',
  xl: '36rpx',
  full: '9999rpx',
} as const;

export const typography = {
  fontSize: {
    xs: '20rpx',
    sm: '24rpx',
    md: '28rpx',
    lg: '32rpx',
    xl: '40rpx',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;
