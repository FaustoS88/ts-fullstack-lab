import { useState, useEffect } from 'react';

// Define the shape of your search results
interface SearchResult {
  id: string;
  // Add other fields returned by your backend
}

// Custom hook to fetch and return search results with debouncing and cancellation
export function useSearch(query: string, delay = 300) {
  const [results, setResults] = useState<SearchResult[]>([]);   
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      return;
    }

    // Debounce the fetch
    const handler = setTimeout(() => {
      const controller = new AbortController();
      setLoading(true);
      
      fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then(res => {
          if (!res.ok) throw new Error(res.statusText);
          return res.json();
        })
        .then((data: SearchResult[]) => {
          setResults(data);
          setError(null);
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
        })
        .finally(() => setLoading(false));

      // Cleanup to abort fetch if query changes
      return () => controller.abort();
    }, delay);

    // Cleanup debounce timer on query change
    return () => clearTimeout(handler);
  }, [query, delay]);

  return { results, error, loading };
}