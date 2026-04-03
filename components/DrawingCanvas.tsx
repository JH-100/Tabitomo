import { useState, useRef } from 'react';
import { StyleSheet, View, PanResponder, Platform } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import Colors from '../constants/Colors';

type Point = { x: number; y: number };

type Props = {
  referenceChar: string;
  width: number;
  height: number;
};

function pointsToPath(points: Point[]): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  let d = `M ${first.x} ${first.y}`;
  for (const p of rest) {
    d += ` L ${p.x} ${p.y}`;
  }
  return d;
}

export default function DrawingCanvas({ referenceChar, width, height }: Props) {
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const currentStroke = useRef<Point[]>([]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        currentStroke.current = [{ x: locationX, y: locationY }];
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        currentStroke.current.push({ x: locationX, y: locationY });
        // Force re-render by updating strokes with current in progress
        setStrokes((prev) => [...prev]);
      },
      onPanResponderRelease: () => {
        if (currentStroke.current.length > 1) {
          setStrokes((prev) => [...prev, currentStroke.current]);
        }
        currentStroke.current = [];
      },
    })
  ).current;

  const allPaths = [...strokes];
  if (currentStroke.current.length > 1) {
    allPaths.push(currentStroke.current);
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.canvas, { width, height }]} {...panResponder.panHandlers}>
        <Svg width={width} height={height}>
          {/* Reference character */}
          <SvgText
            x={width / 2}
            y={height / 2 + 40}
            textAnchor="middle"
            fontSize={180}
            fontWeight="300"
            fill="rgba(255, 255, 255, 0.08)"
          >
            {referenceChar}
          </SvgText>

          {/* Drawn strokes */}
          {allPaths.map((points, i) => (
            <Path
              key={i}
              d={pointsToPath(points)}
              stroke={Colors.primary}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
        </Svg>
      </View>
    </View>
  );
}

export function useDrawingControls() {
  const [key, setKey] = useState(0);

  return {
    key,
    clear: () => setKey((k) => k + 1),
  };
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  canvas: {
    backgroundColor: Colors.surface1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border1,
    overflow: 'hidden',
    // Prevent scroll interference on web
    ...(Platform.OS === 'web' ? { cursor: 'crosshair' as any, touchAction: 'none' as any } : {}),
  },
});
