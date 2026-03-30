import { StyleSheet, View, ViewProps, Pressable, Platform } from 'react-native';
import Colors from '../constants/Colors';

type GlassCardProps = ViewProps & {
  children: React.ReactNode;
  depth?: 0 | 1 | 2 | 3;
  onPress?: () => void;
  noPadding?: boolean;
};

/**
 * Tactile glass card with layered depth.
 * depth 0 = subtle, 3 = elevated and bold.
 */
export default function GlassCard({
  children,
  style,
  depth = 1,
  onPress,
  noPadding,
  ...props
}: GlassCardProps) {
  const surfaces = [Colors.surface0, Colors.surface1, Colors.surface2, Colors.surface3];
  const borders = [Colors.border0, Colors.border0, Colors.border1, Colors.border2];
  const radii = [16, 20, 24, 28];

  const cardStyles = [
    styles.card,
    {
      backgroundColor: surfaces[depth],
      borderColor: borders[depth],
      borderRadius: radii[depth],
    },
    depth >= 2 && styles.elevated,
    noPadding && { padding: 0 },
    Platform.OS === 'web' && styles.webBlur,
    style,
  ];

  const inner = (
    <View style={cardStyles} {...props}>
      {/* Top edge highlight - tactile feel */}
      <View style={[styles.edgeLight, { borderRadius: radii[depth] }]} />
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressed,
        ]}
      >
        {inner}
      </Pressable>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  elevated: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  edgeLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  webBlur: {
    // @ts-ignore
    backdropFilter: 'blur(40px) saturate(150%)',
    WebkitBackdropFilter: 'blur(40px) saturate(150%)',
  },
  pressable: {
    // Tactile: button rests elevated, presses down
    transform: [{ translateY: 0 }],
  },
  pressed: {
    transform: [{ translateY: 2 }, { scale: 0.97 }],
    opacity: 0.9,
  },
});
