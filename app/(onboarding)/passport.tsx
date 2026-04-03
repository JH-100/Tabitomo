import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import ScreenContainer from '../../components/ScreenContainer';
import GlassCard from '../../components/GlassCard';
import PassportScene from '../../components/scenes/PassportScene';
import Colors from '../../constants/Colors';
import { useUserStore } from '../../store/useUserStore';

type Gender = 'male' | 'female' | 'other';

export default function PassportScreen() {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [isStamped, setIsStamped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { setProfile, completeOnboarding } = useUserStore();

  const canSubmit = name.trim().length > 0 && birthdate.length > 0 && gender !== null;

  const handleSubmit = async () => {
    if (!canSubmit || isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      // Save profile locally (Supabase integration later)
      setProfile({
        id: 'local-' + Date.now(),
        displayName: name.trim(),
        birthdate,
        gender,
        email: null,
        phone: null,
      });

      // Show stamp animation
      setIsStamped(true);
    } catch (e) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoading(false);
    }
  };

  const handleStampComplete = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const genderOptions: { value: Gender; label: string }[] = [
    { value: 'male', label: '남성' },
    { value: 'female', label: '여성' },
    { value: 'other', label: '기타' },
  ];

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Title */}
          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.titleArea}>
            <Text style={styles.title}>여권 만들기</Text>
            <Text style={styles.subtitle}>パスポート作成</Text>
            <Text style={styles.desc}>일본 여행을 위한 첫 번째 단계!</Text>
          </Animated.View>

          {/* Passport visual */}
          <Animated.View entering={FadeInDown.delay(400).duration(800)} style={styles.passportWrap}>
            <PassportScene
              displayName={name || undefined}
              birthdate={birthdate || undefined}
              gender={gender || undefined}
              isStamped={isStamped}
              onStampComplete={handleStampComplete}
            />
          </Animated.View>

          {/* Form */}
          {!isStamped && (
            <Animated.View entering={FadeInDown.delay(800).duration(600)}>
              <GlassCard depth={1} style={styles.formCard}>
                {/* Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>이름 / NAME</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="홍길동"
                    placeholderTextColor={Colors.textDim}
                    autoCapitalize="words"
                  />
                </View>

                {/* Birthdate */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>생년월일 / DATE OF BIRTH</Text>
                  <TextInput
                    style={styles.input}
                    value={birthdate}
                    onChangeText={setBirthdate}
                    placeholder="1990-01-01"
                    placeholderTextColor={Colors.textDim}
                    keyboardType="numbers-and-punctuation"
                  />
                </View>

                {/* Gender */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>성별 / GENDER</Text>
                  <View style={styles.genderRow}>
                    {genderOptions.map((opt) => (
                      <Pressable
                        key={opt.value}
                        onPress={() => setGender(opt.value)}
                        style={[styles.genderPill, gender === opt.value && styles.genderPillActive]}
                      >
                        <Text
                          style={[
                            styles.genderText,
                            gender === opt.value && styles.genderTextActive,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}
              </GlassCard>

              {/* Submit button */}
              <Pressable
                onPress={handleSubmit}
                disabled={!canSubmit || isLoading}
                style={({ pressed }) => [
                  styles.submitBtn,
                  canSubmit && styles.submitBtnActive,
                  pressed && canSubmit && styles.submitBtnPressed,
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitText}>여권 발급</Text>
                    <Text style={styles.submitJa}>パスポート発行</Text>
                  </>
                )}
              </Pressable>
            </Animated.View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 20,
  },

  // Title
  titleArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.amber,
    marginTop: 4,
    letterSpacing: 2,
  },
  desc: {
    fontSize: 13,
    color: Colors.textSub,
    marginTop: 8,
  },

  // Passport
  passportWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },

  // Form
  formCard: {
    gap: 18,
  },
  inputGroup: {},
  inputLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },

  // Gender
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface1,
    borderWidth: 1,
    borderColor: Colors.border0,
    alignItems: 'center',
  },
  genderPillActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  genderTextActive: {
    color: Colors.primary,
  },

  error: {
    fontSize: 13,
    color: Colors.primary,
    textAlign: 'center',
  },

  // Submit
  submitBtn: {
    marginTop: 20,
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: Colors.surface2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border0,
  },
  submitBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  submitBtnPressed: {
    transform: [{ translateY: 2 }, { scale: 0.98 }],
    opacity: 0.9,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  submitJa: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    letterSpacing: 2,
  },
});
