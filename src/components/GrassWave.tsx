import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme/theme';

/** Franja decorativa ondulada tipus gespa, s'estira a tot l'ample del contenidor. */
export function GrassWave({ height = 18 }: { height?: number }) {
  const theme = useTheme();

  return (
    <Svg
      width="100%"
      height={height}
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
    >
      <Path
        d="M0,12 Q 8,2 16,12 T 32,12 T 48,12 T 64,12 T 80,12 T 96,12 L100,12 L100,20 L0,20 Z"
        fill={theme.grassWave}
      />
    </Svg>
  );
}
