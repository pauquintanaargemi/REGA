import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { PlantStatus } from '../utils/plantStatus';

interface Props {
  status: PlantStatus;
  size?: number;
}

const POT_COLOR = '#B5651D';
const POT_RIM_COLOR = '#C97B3F';

const PALETTE: Record<PlantStatus, { leaf: string; stem: string }> = {
  healthy: { leaf: '#4CAF50', stem: '#2E7D32' },
  wilting: { leaf: '#D99A2B', stem: '#8C6D1F' },
  critical: { leaf: '#8B3A2A', stem: '#5C2A1E' },
};

export function PlantIllustration({ status, size = 40 }: Props) {
  const { leaf, stem } = PALETTE[status];

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {status === 'healthy' && (
        <>
          <Path d="M32 46 L32 18" stroke={stem} strokeWidth={3} strokeLinecap="round" fill="none" />
          <Path d="M32 34 C 20 30, 14 18, 20 10 C 28 14, 30 26, 32 34 Z" fill={leaf} />
          <Path d="M32 34 C 44 30, 50 18, 44 10 C 36 14, 34 26, 32 34 Z" fill={leaf} />
          <Path d="M32 26 C 30 16, 32 8, 32 4 C 34 8, 36 16, 32 26 Z" fill={leaf} />
        </>
      )}

      {status === 'wilting' && (
        <>
          <Path
            d="M32 46 C 32 36, 30 30, 28 24"
            stroke={stem}
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
          <Path d="M28 24 C 18 26, 12 34, 14 42 C 22 40, 27 32, 28 24 Z" fill={leaf} />
          <Path d="M30 30 C 40 30, 46 36, 45 42 C 37 41, 31 36, 30 30 Z" fill={leaf} />
        </>
      )}

      {status === 'critical' && (
        <>
          <Path
            d="M32 46 C 30 38, 34 30, 26 24 C 22 21, 20 18, 22 14"
            stroke={stem}
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
          <Path d="M22 14 C 16 12, 14 6, 18 4 C 22 6, 24 10, 22 14 Z" fill={leaf} />
          <Path d="M27 30 C 18 32, 14 38, 17 44 C 24 42, 28 36, 27 30 Z" fill={leaf} />
          <Path d="M40 50 C 46 48, 50 50, 48 54 C 44 55, 40 53, 40 50 Z" fill={leaf} opacity={0.85} />
        </>
      )}

      <Path d="M20 46 L44 46 L40 58 L24 58 Z" fill={POT_COLOR} />
      <Path d="M18 42 L46 42 L44 47 L20 47 Z" fill={POT_RIM_COLOR} />
    </Svg>
  );
}
