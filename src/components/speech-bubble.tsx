import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { fontFamilies } from '../theme/typography';

interface SpeechBubbleProps {
  text: string;
  backgroundColor: string;
  textColor: string;
  rotation?: string;
  tailPosition?: 'bottom-left' | 'bottom-right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function SpeechBubble({
  text,
  backgroundColor,
  textColor,
  rotation = '0deg',
  tailPosition = 'bottom-left',
  style,
  textStyle,
}: SpeechBubbleProps) {
  return (
    <View
      style={[
        styles.container,
        { transform: [{ rotate: rotation }] },
        style,
      ]}
    >
      <View style={[styles.bubble, { backgroundColor }]}>
        <Text style={[styles.text, { color: textColor }, textStyle]}>
          {text}
        </Text>

        {/* Pointer Tail */}
        <View
          style={[
            styles.tail,
            tailPosition === 'bottom-left' ? styles.tailLeft : styles.tailRight,
            { borderTopColor: backgroundColor },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
  },
  bubble: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    position: 'relative',
    shadowColor: '#0D132B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    textAlign: 'center',
    includeFontPadding: false,
  },
  tail: {
    position: 'absolute',
    bottom: -7,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  tailLeft: {
    left: 18,
    transform: [{ rotate: '12deg' }],
  },
  tailRight: {
    right: 18,
    transform: [{ rotate: '-12deg' }],
  },
});
