import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Image,
    ImageStyle,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';

interface LazyImageProps {
  source: string | { uri: string };
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

const LazyImage: React.FC<LazyImageProps> = ({
  source,
  style,
  containerStyle,
  resizeMode = 'cover',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  // Material UI 风格的动画效果
  const startShimmerAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (isLoading || hasError) {
      startShimmerAnimation();
    } else {
      shimmerAnimation.setValue(0);
    }
  }, [isLoading, hasError]);

  // 计算动画效果的透明度
  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.4, 1], 
  });

  const uri = typeof source === 'string' ? source : source.uri;

  return (
    <View style={[styles.container, containerStyle]}>
      {(isLoading || hasError) && (
        <View style={[styles.skeleton, style]}>
          <Animated.View
            style={[
              styles.shimmer,
              {
                opacity,
              },
            ]}
          />
        </View>
      )}
      <Image
        source={{ uri }}
        style={[
          styles.image,
          style,
          { display: isLoading || hasError ? 'none' : 'flex' },
        ]}
        resizeMode={resizeMode}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  skeleton: {
    width: '100%',
    height: '100%',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    position: 'absolute',
  },
});

export default LazyImage;
