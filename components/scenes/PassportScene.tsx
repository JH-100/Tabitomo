import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Avatar3D from '../Avatar3D';
import Colors from '../../constants/Colors';

type PassportSceneProps = {
  displayName?: string;
  birthdate?: string;
  gender?: string;
  isStamped?: boolean;
  onStampComplete?: () => void;
};

export default function PassportScene({
  displayName,
  birthdate,
  gender,
  isStamped = false,
  onStampComplete,
}: PassportSceneProps) {
  const onStampCompleteRef = useRef(onStampComplete);
  onStampCompleteRef.current = onStampComplete;

  // Entrance animation
  const flipY = useSharedValue(90);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  // Stamp animation
  const stampScale = useSharedValue(0);
  const stampRotate = useSharedValue(-15);
  const stampOpacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    flipY.value = withSpring(0, { damping: 15, stiffness: 80 });
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, []);

  useEffect(() => {
    if (isStamped) {
      stampOpacity.value = withDelay(200, withTiming(1, { duration: 100 }));
      stampScale.value = withDelay(
        200,
        withSequence(
          withSpring(1.3, { damping: 6, stiffness: 200 }),
          withSpring(1, { damping: 10, stiffness: 150 })
        )
      );
      stampRotate.value = withDelay(200, withSpring(-5, { damping: 8, stiffness: 120 }));

      // Callback after animation
      const timer = setTimeout(() => onStampCompleteRef.current?.(), 1200);
      return () => clearTimeout(timer);
    }
  }, [isStamped]);

  const passportStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ perspective: 1000 }, { rotateY: `${flipY.value}deg` }, { scale: scale.value }],
  }));

  const stampStyle = useAnimatedStyle(() => ({
    opacity: stampOpacity.value,
    transform: [{ scale: stampScale.value }, { rotate: `${stampRotate.value}deg` }],
  }));

  const genderLabel =
    gender === 'male'
      ? '남 / M'
      : gender === 'female'
        ? '여 / F'
        : gender === 'other'
          ? '기타 / X'
          : '';

  return (
    <Animated.View style={[styles.passport, passportStyle]}>
      {/* Gold border accent */}
      <View style={styles.innerBorder}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSub}>REPUBLIC OF KOREA</Text>
          <Text style={styles.headerTitle}>PASSPORT</Text>
          <Text style={styles.headerJa}>여권 / パスポート</Text>
        </View>

        {/* Photo + Info row */}
        <View style={styles.body}>
          {/* Photo area */}
          <View style={styles.photoArea}>
            <View style={styles.photoFrame}>
              <Avatar3D size={70} />
            </View>
          </View>

          {/* Info fields */}
          <View style={styles.fields}>
            <PassportField label="NAME / 성명" value={displayName} />
            <PassportField label="DATE OF BIRTH / 생년월일" value={birthdate} />
            <PassportField label="GENDER / 성별" value={genderLabel || undefined} />
          </View>
        </View>

        {/* MRZ-like bottom strip */}
        <View style={styles.mrz}>
          <Text style={styles.mrzText}>
            {'P<KOR' +
              (displayName ? `<${displayName.toUpperCase()}` : '<<<<<<<<<<').padEnd(30, '<')}
          </Text>
        </View>

        {/* Stamp overlay */}
        <Animated.View style={[styles.stampContainer, stampStyle]}>
          <View style={styles.stamp}>
            <Text style={styles.stampText}>承認</Text>
            <Text style={styles.stampSub}>APPROVED</Text>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

function PassportField({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={[styles.fieldValue, !value && styles.fieldEmpty]}>{value || '미입력'}</Text>
      <View style={styles.fieldLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  passport: {
    backgroundColor: '#1A2744',
    borderRadius: 16,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
  },
  innerBorder: {
    borderWidth: 1.5,
    borderColor: Colors.amber,
    borderRadius: 13,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 209, 102, 0.2)',
  },
  headerSub: {
    fontSize: 9,
    color: 'rgba(255, 209, 102, 0.5)',
    letterSpacing: 3,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.amber,
    letterSpacing: 6,
    marginTop: 4,
  },
  headerJa: {
    fontSize: 11,
    color: 'rgba(255, 209, 102, 0.4)',
    marginTop: 4,
    letterSpacing: 2,
  },

  // Body
  body: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  photoArea: {
    alignItems: 'center',
  },
  photoFrame: {
    width: 88,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 209, 102, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },

  // Fields
  fields: {
    flex: 1,
    gap: 10,
  },
  field: {},
  fieldLabel: {
    fontSize: 8,
    color: 'rgba(255, 209, 102, 0.45)',
    letterSpacing: 1,
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    marginTop: 2,
  },
  fieldEmpty: {
    color: 'rgba(255, 255, 255, 0.15)',
    fontStyle: 'italic',
  },
  fieldLine: {
    height: 1,
    backgroundColor: 'rgba(255, 209, 102, 0.12)',
    marginTop: 4,
  },

  // MRZ strip
  mrz: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  mrzText: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: 'rgba(255, 255, 255, 0.2)',
    letterSpacing: 1.5,
  },

  // Stamp
  stampContainer: {
    position: 'absolute',
    right: 20,
    bottom: 50,
  },
  stamp: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FF3B30',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FF3B30',
  },
  stampSub: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FF3B30',
    letterSpacing: 2,
    marginTop: 2,
  },
});
