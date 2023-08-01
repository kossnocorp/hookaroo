import { useEffect, useRef } from "react";

export default function useUnmounted() {
  const unmountedRef = useRef(false);
  useEffect(
    () => () => {
      unmountedRef.current = true;
    },
    []
  );
  return unmountedRef;
}
