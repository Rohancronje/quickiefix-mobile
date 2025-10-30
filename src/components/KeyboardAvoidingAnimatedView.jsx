import React, { useRef, useEffect, useState } from "react";
import {
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const KeyboardAvoidingAnimatedView = (props, ref) => {
  const {
    children,
    behavior = Platform.OS === "ios" ? "padding" : "height",
    keyboardVerticalOffset = 0,
    style,
    contentContainerStyle,
    enabled = true,
    onLayout,
    autoScroll = true,
    scrollViewRef,
    ...leftoverProps
  } = props;

  const animatedViewRef = useRef(null);
  const initialHeightRef = useRef(0);
  const bottomRef = useRef(0);
  const bottomHeight = useSharedValue(0);
  const [screenData, setScreenData] = useState(Dimensions.get("window"));
  const activeInputRef = useRef(null);

  // Update screen dimensions on orientation change
  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onKeyboardShow = (event) => {
      const { duration, endCoordinates } = event;
      const animatedView = animatedViewRef.current;

      if (!animatedView) return;

      let height = 0;
      const keyboardY = endCoordinates.screenY - keyboardVerticalOffset;
      height = Math.max(animatedView.y + animatedView.height - keyboardY, 0);

      bottomHeight.value = withTiming(height, {
        duration: duration > 10 ? duration : 300,
      });
      bottomRef.current = height;

      // Auto-scroll to active input if enabled
      if (autoScroll && activeInputRef.current && scrollViewRef?.current) {
        setTimeout(() => {
          scrollViewRef.current.scrollTo({
            y: activeInputRef.current.measureScrollOffset || 0,
            animated: true,
          });
        }, 100);
      }
    };

    const onKeyboardHide = () => {
      bottomHeight.value = withTiming(0, { duration: 250 });
      bottomRef.current = 0;
      activeInputRef.current = null;
    };

    // Enhanced keyboard event listeners for better cross-platform support
    const showEventName =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEventName =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showListener = Keyboard.addListener(showEventName, onKeyboardShow);
    const hideListener = Keyboard.addListener(hideEventName, onKeyboardHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [
    keyboardVerticalOffset,
    enabled,
    bottomHeight,
    autoScroll,
    scrollViewRef,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    if (behavior === "height") {
      return {
        height: Math.max(screenData.height - bottomHeight.value, 200),
        flex: bottomHeight.value > 0 ? 0 : 1,
      };
    }
    if (behavior === "padding") {
      return {
        paddingBottom: bottomHeight.value,
      };
    }
    return {};
  });

  const positionAnimatedStyle = useAnimatedStyle(() => ({
    bottom: bottomHeight.value,
  }));

  const handleLayout = (event) => {
    const layout = event.nativeEvent.layout;
    animatedViewRef.current = layout;

    if (!initialHeightRef.current) {
      initialHeightRef.current = layout.height;
    }

    if (onLayout) {
      onLayout(event);
    }
  };

  // Method to track active input for auto-scrolling
  const setActiveInput = (inputRef, scrollOffset) => {
    if (autoScroll) {
      activeInputRef.current = {
        ref: inputRef,
        measureScrollOffset: scrollOffset,
      };
    }
  };

  const renderContent = () => {
    if (behavior === "position") {
      return (
        <Animated.View style={[contentContainerStyle, positionAnimatedStyle]}>
          {children}
        </Animated.View>
      );
    }
    return children;
  };

  // Web fallback
  if (Platform.OS === "web") {
    return (
      <KeyboardAvoidingView
        behavior={behavior}
        style={[style, { minHeight: screenData.height * 0.6 }]}
        contentContainerStyle={contentContainerStyle}
        {...leftoverProps}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  return (
    <Animated.View
      ref={ref}
      style={[
        style,
        animatedStyle,
        { minHeight: screenData.height * 0.6 }, // Ensure minimum height for small screens
      ]}
      onLayout={handleLayout}
      {...leftoverProps}
    >
      {renderContent()}
    </Animated.View>
  );
};

KeyboardAvoidingAnimatedView.displayName = "KeyboardAvoidingAnimatedView";

export default KeyboardAvoidingAnimatedView;
