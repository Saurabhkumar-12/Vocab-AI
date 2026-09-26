import { Image, StyleSheet, View } from 'react-native';

interface SparkleProps {
  size: number;
  color: string;
}

function SparkleStar({ size, color }: SparkleProps) {
  const armWidth = size * 0.26;
  const cornerRadius = armWidth * 0.5;

  return (
    <View style={[styles.sparkleContainer, { width: size, height: size }]}>
      {/* Horizontal Bar */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: armWidth,
          backgroundColor: color,
          borderRadius: cornerRadius,
        }}
      />
      {/* Vertical Bar */}
      <View
        style={{
          position: 'absolute',
          width: armWidth,
          height: size,
          backgroundColor: color,
          borderRadius: cornerRadius,
        }}
      />
      {/* Diamond Center */}
      <View
        style={{
          position: 'absolute',
          width: size * 0.55,
          height: size * 0.55,
          backgroundColor: color,
          borderRadius: cornerRadius * 0.8,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

export function AuthMascot() {
  return (
    <View style={styles.container}>
      {/* Left Golden Sparkle */}
      <View style={styles.sparkleLeft}>
        <SparkleStar size={18} color="#FFB800" />
      </View>

      {/* Top-Right Sky-Blue Sparkle */}
      <View style={styles.sparkleTopRight}>
        <SparkleStar size={18} color="#4D8BFF" />
      </View>

      {/* Lower-Right Golden Sparkle */}
      <View style={styles.sparkleBottomRight}>
        <SparkleStar size={14} color="#FFC800" />
      </View>

      {/* Waving Fox Peeking */}
      <Image
        source={require('../../assets/images/mascot-auth.png')}
        style={styles.mascotImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 155,
    marginBottom: -4,
    zIndex: 2,
  },
  mascotImage: {
    width: 200,
    height: 150,
  },
  sparkleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleLeft: {
    position: 'absolute',
    top: 36,
    left: '18%',
    zIndex: 3,
  },
  sparkleTopRight: {
    position: 'absolute',
    top: 38,
    right: '22%',
    zIndex: 3,
  },
  sparkleBottomRight: {
    position: 'absolute',
    top: 76,
    right: '16%',
    zIndex: 3,
  },
});
