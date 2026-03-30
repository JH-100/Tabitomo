import { StyleSheet, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';

type ScreenContainerProps = ViewProps & {
  children: React.ReactNode;
};

export default function ScreenContainer({ children, style, ...props }: ScreenContainerProps) {
  return (
    <LinearGradient
      colors={[Colors.gradientTop, Colors.gradientMid, Colors.gradientBottom]}
      style={styles.gradient}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.7, y: 1 }}
    >
      {/* Sci-fi ambient glow orbs */}
      <View style={styles.orbPrimary} />
      <View style={styles.orbBlue} />
      <View style={styles.orbPurple} />

      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, style]} {...props}>
          {children}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  orbPrimary: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(255, 107, 107, 0.04)',
    top: -120,
    right: -120,
  },
  orbBlue: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(108, 159, 255, 0.03)',
    bottom: 60,
    left: -100,
  },
  orbPurple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(179, 136, 255, 0.03)',
    top: '40%',
    right: -60,
  },
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
