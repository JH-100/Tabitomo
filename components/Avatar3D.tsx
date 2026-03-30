import { StyleSheet, View, Text } from 'react-native';
import Colors from '../constants/Colors';

type Avatar3DProps = {
  size?: number;
  showGlow?: boolean;
  accessory?: 'passport' | 'ticket' | 'luggage' | 'plane' | 'flag' | null;
};

/**
 * Tactile 3D-style avatar built with layered Views.
 * Soft-light editorial feel with sculpted depth.
 */
export default function Avatar3D({ size = 90, showGlow = false, accessory }: Avatar3DProps) {
  const s = size / 90; // scale factor

  return (
    <View style={[styles.root, { width: size * 1.1, height: size * 1.5 }]}>
      {/* Glow */}
      {showGlow && (
        <View style={[styles.glow, {
          width: size * 1.8,
          height: size * 1.8,
          borderRadius: size * 0.9,
          top: -size * 0.15,
        }]} />
      )}

      {/* Ground shadow */}
      <View style={[styles.groundShadow, {
        width: size * 0.45,
        height: size * 0.08,
        borderRadius: size * 0.04,
        bottom: size * 0.02,
      }]} />

      {/* Legs */}
      <View style={[styles.legs, { bottom: size * 0.05 }]}>
        <View style={[styles.leg, {
          width: size * 0.14,
          height: size * 0.2,
          borderRadius: size * 0.06,
          marginHorizontal: size * 0.02,
        }]} />
        <View style={[styles.leg, {
          width: size * 0.14,
          height: size * 0.2,
          borderRadius: size * 0.06,
          marginHorizontal: size * 0.02,
        }]} />
      </View>

      {/* Body */}
      <View style={[styles.body, {
        width: size * 0.48,
        height: size * 0.42,
        borderRadius: size * 0.16,
        bottom: size * 0.18,
      }]}>
        {/* Body highlight */}
        <View style={[styles.bodyHighlight, { borderRadius: size * 0.16 }]} />
        {/* Collar */}
        <View style={[styles.collar, {
          width: size * 0.2,
          height: size * 0.06,
          borderRadius: size * 0.03,
          top: size * 0.02,
        }]} />
      </View>

      {/* Backpack */}
      <View style={[styles.backpack, {
        width: size * 0.18,
        height: size * 0.28,
        borderRadius: size * 0.07,
        bottom: size * 0.22,
        right: size * 0.08,
      }]}>
        <View style={[styles.backpackStrap, {
          width: size * 0.04,
          height: size * 0.12,
          top: size * 0.02,
          left: size * 0.02,
          borderRadius: size * 0.02,
        }]} />
      </View>

      {/* Head */}
      <View style={[styles.head, {
        width: size * 0.56,
        height: size * 0.56,
        borderRadius: size * 0.28,
        bottom: size * 0.5,
      }]}>
        {/* Head highlight - 3D lighting */}
        <View style={[styles.headHighlight, {
          width: size * 0.45,
          height: size * 0.35,
          borderRadius: size * 0.2,
          top: size * 0.04,
          left: size * 0.03,
        }]} />

        {/* Face */}
        <View style={styles.face}>
          {/* Eyes */}
          <View style={styles.eyes}>
            <View style={[styles.eye, {
              width: size * 0.09,
              height: size * 0.12,
              borderRadius: size * 0.045,
            }]}>
              <View style={[styles.eyePupil, {
                width: size * 0.065,
                height: size * 0.085,
                borderRadius: size * 0.035,
              }]}>
                <View style={[styles.eyeShine, {
                  width: size * 0.03,
                  height: size * 0.03,
                  borderRadius: size * 0.015,
                }]} />
              </View>
            </View>
            <View style={{ width: size * 0.1 }} />
            <View style={[styles.eye, {
              width: size * 0.09,
              height: size * 0.12,
              borderRadius: size * 0.045,
            }]}>
              <View style={[styles.eyePupil, {
                width: size * 0.065,
                height: size * 0.085,
                borderRadius: size * 0.035,
              }]}>
                <View style={[styles.eyeShine, {
                  width: size * 0.03,
                  height: size * 0.03,
                  borderRadius: size * 0.015,
                }]} />
              </View>
            </View>
          </View>

          {/* Mouth */}
          <View style={[styles.mouth, {
            width: size * 0.08,
            height: size * 0.04,
            borderBottomLeftRadius: size * 0.04,
            borderBottomRightRadius: size * 0.04,
            marginTop: size * 0.025,
          }]} />

          {/* Blush */}
          <View style={[styles.blush, styles.blushL, {
            width: size * 0.09,
            height: size * 0.04,
            borderRadius: size * 0.02,
            bottom: size * 0.12,
          }]} />
          <View style={[styles.blush, styles.blushR, {
            width: size * 0.09,
            height: size * 0.04,
            borderRadius: size * 0.02,
            bottom: size * 0.12,
          }]} />
        </View>
      </View>

      {/* Cap */}
      <View style={[styles.cap, {
        width: size * 0.6,
        height: size * 0.2,
        borderTopLeftRadius: size * 0.15,
        borderTopRightRadius: size * 0.15,
        borderBottomLeftRadius: size * 0.06,
        borderBottomRightRadius: size * 0.06,
        bottom: size * 0.92,
      }]}>
        <View style={[styles.capHighlight, {
          width: size * 0.35,
          height: size * 0.08,
          borderRadius: size * 0.04,
          top: size * 0.03,
          left: size * 0.06,
        }]} />
        <View style={[styles.visor, {
          width: size * 0.65,
          height: size * 0.07,
          borderRadius: size * 0.035,
          bottom: -size * 0.01,
        }]} />
        <View style={[styles.capBand, {
          height: size * 0.035,
          bottom: size * 0.04,
        }]} />
      </View>

      {/* Accessory floating bubble */}
      {accessory && (
        <View style={[styles.accBubble, {
          width: size * 0.34,
          height: size * 0.34,
          borderRadius: size * 0.17,
          right: -size * 0.18,
          top: size * 0.08,
        }]}>
          <Text style={{ fontSize: size * 0.18 }}>
            {accessory === 'passport' ? '📋' :
             accessory === 'ticket' ? '🎫' :
             accessory === 'luggage' ? '🧳' :
             accessory === 'plane' ? '✈️' :
             accessory === 'flag' ? '🇯🇵' : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    backgroundColor: Colors.primaryGlow,
    alignSelf: 'center',
  },
  groundShadow: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignSelf: 'center',
  },

  // Legs
  legs: {
    position: 'absolute',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  leg: {
    backgroundColor: '#3B4A6B',
  },

  // Body
  body: {
    position: 'absolute',
    backgroundColor: '#4A72B8',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  bodyHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: '40%',
    bottom: '50%',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  collar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
  },

  // Backpack
  backpack: {
    position: 'absolute',
    backgroundColor: '#E05A3A',
    zIndex: -1,
    overflow: 'hidden',
  },
  backpackStrap: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  // Head
  head: {
    position: 'absolute',
    backgroundColor: '#FFDBB4',
    alignSelf: 'center',
    overflow: 'hidden',
    zIndex: 2,
  },
  headHighlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.12)',
    zIndex: 0,
  },

  face: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    zIndex: 1,
  },
  eyes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eye: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyePupil: {
    backgroundColor: '#2C2C2C',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 2,
    paddingRight: 3,
  },
  eyeShine: {
    backgroundColor: '#FFFFFF',
  },
  mouth: {
    backgroundColor: '#E88A7B',
  },
  blush: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 160, 140, 0.35)',
  },
  blushL: { left: '12%' },
  blushR: { right: '12%' },

  // Cap
  cap: {
    position: 'absolute',
    backgroundColor: '#2A3F6B',
    alignSelf: 'center',
    zIndex: 3,
    overflow: 'visible',
  },
  capHighlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  visor: {
    position: 'absolute',
    backgroundColor: '#1E2F55',
    alignSelf: 'center',
  },
  capBand: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    left: 0,
    right: 0,
  },

  // Accessory
  accBubble: {
    position: 'absolute',
    backgroundColor: Colors.surface3,
    borderWidth: 1,
    borderColor: Colors.border1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
