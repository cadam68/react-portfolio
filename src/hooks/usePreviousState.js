import { useEffect, useRef, useState } from "react";

const usePreviousState = initialValue => {
  const [state, setState] = useState(initialValue);
  const prevStateRef = useRef();

  useEffect(() => {
    prevStateRef.current = state;
  }, [state]);

  const previousState = prevStateRef.current;
  return [previousState, state, setState];
};

export default usePreviousState;
