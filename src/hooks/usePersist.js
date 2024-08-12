import { useState, useEffect, useMemo } from "react";

const usePersist = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const persistedState = localStorage.getItem(key); //retrieve item from localstorage
    return persistedState ? JSON.parse(persistedState) : defaultValue;
  });

  //save item to localstorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  const memoizedState = useMemo(() => state, [state]); //prevent rerender by memorizing state value

  return [memoizedState, setState];
};

export default usePersist;
