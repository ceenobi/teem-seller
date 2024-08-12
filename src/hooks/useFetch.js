import { useEffect, useState } from "react";

const useFetch = (api, dependency, extraDep) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      if (typeof api === "function") {
        setIsLoading(true);
        try {
          const res = await api(dependency, extraDep, { signal });
          if (!signal.aborted) {
            setData(res.data);
            setError(null);
          }
        } catch (error) {
          if (!signal.aborted) {
            setError(error);
          }
          console.error(error);
        } finally {
          if (!signal.aborted) {
            setIsLoading(false);
          }
        }
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [api, dependency, extraDep]);

  return { data, isLoading, error, setData };
};

export default useFetch;
