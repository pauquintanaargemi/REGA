import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

function useLoopingValue(duration: number, delay = 0) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(value, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [value, duration, delay]);

  return value;
}

function useBobbingValue(duration: number) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [value, duration]);

  return value;
}

function Cloud({
  top,
  duration,
  delay,
  size,
  opacity,
}: {
  top: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}) {
  const { width } = useWindowDimensions();
  const progress = useLoopingValue(duration, delay);
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, width + 60],
  });

  return (
    <Animated.Text
      style={[
        styles.cloud,
        { top, fontSize: size, opacity, transform: [{ translateX }] },
      ]}
    >
      ☁️
    </Animated.Text>
  );
}

function Butterfly() {
  const { width } = useWindowDimensions();
  const flight = useLoopingValue(9000, 1500);
  const flap = useBobbingValue(500);

  const translateX = flight.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, width + 30],
  });
  const translateY = flap.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  return (
    <Animated.Text
      style={[
        styles.butterfly,
        { transform: [{ translateX }, { translateY }] },
      ]}
    >
      🦋
    </Animated.Text>
  );
}

export function SkyDecoration() {
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour < 20;

  return (
    <View style={styles.container} pointerEvents="none">
      <Cloud top={4} duration={22000} delay={0} size={26} opacity={0.8} />
      <Cloud top={20} duration={30000} delay={4000} size={20} opacity={0.6} />
      <Butterfly />
      <Text style={styles.celestial}>{isDaytime ? '☀️' : '🌙'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  cloud: {
    position: 'absolute',
  },
  butterfly: {
    position: 'absolute',
    top: 12,
    fontSize: 20,
  },
  celestial: {
    position: 'absolute',
    top: 2,
    right: 4,
    fontSize: 24,
  },
});
