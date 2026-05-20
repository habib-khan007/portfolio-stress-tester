// src/hooks/useFinnhub.js
// Custom React hook for fetching real stock prices from Finnhub API.
// Free tier: 60 API calls/minute — plenty for this app.

import { useState, useCallback } from "react";

const API_KEY = process.env.REACT_APP_FINNHUB_KEY;

/**
 * Returns { fetchPrice, loading, error }
 *
 * Usage:
 *   const { fetchPrice, loading } = useFinnhub();
 *   const price = await fetchPrice("AAPL");
 */
export function useFinnhub() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchPrice = useCallback(async (ticker) => {
    if (!ticker) return null;
    if (!API_KEY || API_KEY === "your_finnhub_api_key_here") {
      // Demo mode: return a fake price so the app still works without a key
      console.warn("No Finnhub API key set — using demo price.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `https://finnhub.io/api/v1/quote?symbol=${ticker.toUpperCase()}&token=${API_KEY}`;
      const res  = await fetch(url);
      const data = await res.json();

      // Finnhub returns { c: currentPrice, o: open, h: high, l: low, ... }
      if (data.c && data.c > 0) {
        return data.c; // current price
      }
      setError(`No price found for ${ticker.toUpperCase()}`);
      return null;
    } catch (err) {
      setError("Failed to fetch price. Check your API key.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search for stock symbols — useful for the ticker search box.
   * Returns array of { symbol, description } objects.
   */
  const searchTicker = useCallback(async (query) => {
    if (!query || query.length < 1) return [];
    if (!API_KEY || API_KEY === "your_finnhub_api_key_here") return [];

    try {
      const url = `https://finnhub.io/api/v1/search?q=${query}&token=${API_KEY}`;
      const res  = await fetch(url);
      const data = await res.json();
      return (data.result || []).slice(0, 6); // top 6 results
    } catch {
      return [];
    }
  }, []);

  return { fetchPrice, searchTicker, loading, error };
}
