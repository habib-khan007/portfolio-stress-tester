// src/hooks/usePortfolioStorage.js
// Saves and loads portfolios to/from Firebase Firestore.
// Each portfolio is stored under a user-chosen name as a simple document.

import { useState } from "react";
import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";

/**
 * Returns { savePortfolio, loadPortfolio, listPortfolios, saving, loadError }
 */
export function usePortfolioStorage() {
  const [saving,    setSaving]    = useState(false);
  const [loadError, setLoadError] = useState(null);

  /**
   * Save a portfolio with a given name.
   * portfolioName: string  e.g. "My Main Portfolio"
   * holdings: array of holding objects
   */
  const savePortfolio = async (portfolioName, holdings) => {
    if (!portfolioName.trim()) return;
    setSaving(true);
    try {
      // Store under /portfolios/{portfolioName}
      await setDoc(doc(db, "portfolios", portfolioName.trim()), {
        name:      portfolioName.trim(),
        holdings,
        savedAt:   new Date().toISOString(),
      });
      return true;
    } catch (err) {
      console.error("Save failed:", err);
      return false;
    } finally {
      setSaving(false);
    }
  };

  /**
   * Load a saved portfolio by name.
   * Returns the holdings array, or null if not found.
   */
  const loadPortfolio = async (portfolioName) => {
    setLoadError(null);
    try {
      const snap = await getDoc(doc(db, "portfolios", portfolioName.trim()));
      if (snap.exists()) {
        return snap.data().holdings;
      }
      setLoadError(`Portfolio "${portfolioName}" not found.`);
      return null;
    } catch (err) {
      setLoadError("Failed to load portfolio.");
      return null;
    }
  };

  /**
   * List all saved portfolio names.
   */
  const listPortfolios = async () => {
    try {
      const snap = await getDocs(collection(db, "portfolios"));
      return snap.docs.map((d) => d.data().name);
    } catch {
      return [];
    }
  };

  return { savePortfolio, loadPortfolio, listPortfolios, saving, loadError };
}
