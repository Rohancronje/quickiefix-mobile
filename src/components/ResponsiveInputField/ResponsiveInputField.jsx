import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";

const ResponsiveInputField = ({
  icon: Icon,
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  scrollViewRef,
  multiline = false,
  numberOfLines = 1,
  style,
  containerStyle,
  error,
  ...props
}) => {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [screenData, setScreenData] = React.useState(Dimensions.get("window"));

  // Update screen dimensions on orientation change
  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  const handleFocus = (event) => {
    // Auto-scroll to this input when focused
    if (scrollViewRef?.current && containerRef.current) {
      setTimeout(() => {
        containerRef.current.measureLayout(
          scrollViewRef.current._component || scrollViewRef.current,
          (x, y, width, height) => {
            const screenHeight = screenData.height;
            const keyboardHeight = Platform.OS === "ios" ? 280 : 250;
            const availableHeight = screenHeight - keyboardHeight;
            const inputBottom = y + height + 50; // Add some padding

            if (inputBottom > availableHeight) {
              const scrollOffset = inputBottom - availableHeight + 50;
              scrollViewRef.current.scrollTo({
                y: scrollOffset,
                animated: true,
              });
            }
          },
          () => {},
        );
      }, 300);
    }

    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event) => {
    if (onBlur) {
      onBlur(event);
    }
  };

  // Calculate responsive styles
  const inputHeight = multiline ? Math.max(numberOfLines * 20 + 20, 80) : 48;
  const fontSize = screenData.width < 360 ? 14 : 16;
  const padding = screenData.width < 360 ? 12 : 16;

  return (
    <View ref={containerRef} style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { fontSize: fontSize - 2 }]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            paddingHorizontal: padding,
            paddingVertical: multiline ? padding : padding * 0.75,
            minHeight: inputHeight,
          },
          error && styles.inputWrapperError,
          style,
        ]}
      >
        {Icon && (
          <Icon
            size={fontSize + 4}
            color="#6B7280"
            style={[styles.inputIcon, multiline && styles.inputIconMultiline]}
          />
        )}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              fontSize,
              minHeight: multiline ? inputHeight - padding * 2 : undefined,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#9CA3AF"
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? "top" : "center"}
          {...props}
        />
      </View>
      {error && (
        <Text style={[styles.errorText, { fontSize: fontSize - 3 }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputWrapperError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  inputIcon: {
    marginTop: 2,
    marginRight: 12,
    opacity: 0.6,
  },
  inputIconMultiline: {
    marginTop: 8,
  },
  input: {
    flex: 1,
    color: "#1F2937",
    ...Platform.select({
      web: {
        outline: "none",
      },
    }),
  },
  errorText: {
    color: "#EF4444",
    marginTop: 4,
    fontWeight: "500",
  },
});

export default ResponsiveInputField;
