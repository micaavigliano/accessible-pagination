import { useEffect, useState } from "react"

const useFetch = <T,>(url: string, currentPage: number = 0, pageSize: number = 20) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('network response failed')
        }
        const result: T = await response.json() as T;
        setData(result)
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false);
      }
    };

    fetchData()
  }, [url, currentPage, pageSize]);

  return {
    data,
    loading,
    error,
  }
};

export default useFetch;
