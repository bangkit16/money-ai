import { useRef, useState, useCallback } from "react";
import { Dimensions, View } from "react-native";

function useKeyboardAwareOffset(keyboardHeight: number) {
  const fieldRef = useRef<View>(null);
  const [offset, setOffset] = useState(0);

  const measureAndAdjust = useCallback(() => {
    if (!fieldRef.current) return;

    fieldRef.current.measureInWindow((x, y, width, height) => {
      const screenHeight = Dimensions.get("window").height;
      const keyboardTopY = screenHeight - keyboardHeight;
      const fieldBottomY = y + height;

      const overlap = fieldBottomY - keyboardTopY;
      setOffset(overlap > 0 ? overlap : 0); // +12 buat sedikit jarak/padding
    });
  }, [keyboardHeight]);

  return { fieldRef, offset, measureAndAdjust };
}

export default useKeyboardAwareOffset;