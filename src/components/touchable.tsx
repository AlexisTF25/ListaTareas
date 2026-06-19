import React from "react";
import {
  Platform,
  StyleProp,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export default function Touchable({
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  style,
  accessibilityLabel,
}: Props) {
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
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
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      style={style}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </TouchableOpacity>
  );
}
