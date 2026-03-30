import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import GlassCard from '../../components/GlassCard';
import Colors from '../../constants/Colors';

export default function LessonsScreen() {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>レッスン</Text>
        <Text style={styles.sub}>Lessons</Text>
      </View>
      <GlassCard depth={2} style={styles.card}>
        <View style={[styles.iconBg, { backgroundColor: Colors.blueMuted }]}>
          <Text style={styles.icon}>📚</Text>
        </View>
        <Text style={styles.cardTitle}>Coming Soon</Text>
        <Text style={styles.cardSub}>일본어 레슨이 곧 추가됩니다</Text>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 16, marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: Colors.textSub, marginTop: 4 },
  card: { alignItems: 'center', paddingVertical: 44 },
  iconBg: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  icon: { fontSize: 34 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  cardSub: { fontSize: 14, color: Colors.textSub, marginTop: 8 },
});
