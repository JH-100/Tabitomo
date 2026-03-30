import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import TRAVEL_STAGES from '../constants/TravelStages';
import Avatar3D from './Avatar3D';

type JourneyMapProps = {
  currentLevel: number;
};

const ACCESSORIES: Record<number, 'passport' | 'ticket' | 'luggage' | 'plane' | 'flag' | null> = {
  0: 'passport', 1: 'ticket', 2: 'luggage', 3: null, 4: 'plane', 5: 'flag',
};

export default function JourneyMap({ currentLevel }: JourneyMapProps) {
  return (
    <View style={styles.map}>
      {TRAVEL_STAGES.map((stage, i) => {
        const done = currentLevel > stage.level;
        const current = currentLevel === stage.level;
        const locked = currentLevel < stage.level;
        const isLeft = i % 2 === 0;

        return (
          <View key={stage.level}>
            {/* Dotted path */}
            {i > 0 && (
              <View style={styles.dots}>
                {[0, 1, 2].map(d => (
                  <View key={d} style={[
                    styles.dot,
                    (done || current) ? styles.dotActive : styles.dotDim,
                  ]} />
                ))}
              </View>
            )}

            {/* Stage */}
            <View style={[styles.row, isLeft ? styles.rowL : styles.rowR]}>
              {/* Circle node */}
              <View style={[
                styles.circle,
                current && styles.circleCurrent,
                done && styles.circleDone,
                locked && styles.circleLocked,
              ]}>
                {current ? (
                  <Avatar3D size={52} showGlow accessory={ACCESSORIES[stage.level] ?? null} />
                ) : (
                  <Text style={[styles.circleText, locked && { opacity: 0.4 }]}>
                    {done ? '✓' : locked ? '🔒' : stage.icon}
                  </Text>
                )}
              </View>

              {/* Info pill */}
              <View style={[
                styles.pill,
                current && styles.pillCurrent,
                locked && styles.pillLocked,
              ]}>
                {/* Lv badge */}
                <View style={[styles.lv, current && styles.lvActive, done && styles.lvDone]}>
                  <Text style={[styles.lvText, current && styles.lvTextActive, done && styles.lvTextDone]}>
                    Lv.{stage.level}{stage.level >= 6 ? '+' : ''}
                  </Text>
                </View>

                <Text style={[styles.loc, current && styles.locCurrent, locked && styles.locLocked]}>
                  {stage.location}
                </Text>
                <Text style={[styles.locJa, locked && styles.locJaLocked]}>
                  {stage.locationJa}
                </Text>

                <View style={styles.reqRow}>
                  <View style={[styles.reqDot, done && styles.reqDotDone, current && styles.reqDotCurrent]} />
                  <Text style={[styles.req, locked && styles.reqLocked]}>
                    {done ? '완료!' : stage.requirement}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { paddingVertical: 8 },

  dots: { alignItems: 'center', gap: 5, paddingVertical: 6 },
  dot: { width: 4, height: 4, borderRadius: 2 },
  dotActive: { backgroundColor: Colors.primary },
  dotDim: { backgroundColor: Colors.border0 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 4 },
  rowL: { flexDirection: 'row' },
  rowR: { flexDirection: 'row-reverse' },

  // Node
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface1,
    borderWidth: 1,
    borderColor: Colors.border0,
  },
  circleCurrent: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
    borderWidth: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'visible',
  },
  circleDone: {
    backgroundColor: Colors.mintMuted,
    borderColor: Colors.mint,
  },
  circleLocked: { opacity: 0.3 },
  circleText: { fontSize: 24 },

  // Pill
  pill: {
    flex: 1,
    backgroundColor: Colors.surface1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border0,
    padding: 14,
  },
  pillCurrent: {
    backgroundColor: 'rgba(255, 107, 107, 0.06)',
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  pillLocked: { opacity: 0.35 },

  lv: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface2,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  lvActive: { backgroundColor: Colors.primary },
  lvDone: { backgroundColor: Colors.mintMuted },
  lvText: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },
  lvTextActive: { color: '#fff' },
  lvTextDone: { color: Colors.mint },

  loc: { fontSize: 15, fontWeight: '700', color: Colors.text },
  locCurrent: { color: Colors.primary },
  locLocked: { color: Colors.textDim },
  locJa: { fontSize: 11, color: Colors.textSub, marginTop: 1 },
  locJaLocked: { color: Colors.textDim },

  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  reqDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.textDim },
  reqDotDone: { backgroundColor: Colors.mint },
  reqDotCurrent: { backgroundColor: Colors.primary },
  req: { fontSize: 11, color: Colors.textMuted },
  reqLocked: { color: Colors.textDim },
});
