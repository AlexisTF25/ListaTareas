import React from "react";
import {
    Platform,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  accessibilityLabel?: string;
};

export default function Touchable({
  children,
  onPress,
  style,
  accessibilityLabel,
}: Props) {
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(
          "rgba(255,255,255,0.3)",
          false,
        )}
        accessibilityLabel={accessibilityLabel}
      >
        <View style={style}>{children}</View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </TouchableOpacity>
  );
}
