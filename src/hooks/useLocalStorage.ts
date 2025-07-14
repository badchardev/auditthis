import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T, companyId?: string) {
  // Use company-specific key if companyId is provided
  const storageKey = companyId ? `${key}-${companyId}` : key;
  
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(storageKey);
      if (item) {
        const parsedItem = JSON.parse(item);
        // Merge parsed data with initialValue to ensure all properties exist
        return typeof initialValue === 'object' && initialValue !== null && !Array.isArray(initialValue)
          ? { ...initialValue, ...parsedItem }
          : parsedItem;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${storageKey}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(storageKey, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${storageKey}":`, error);
    }
  };

  // Update stored value when companyId changes
  useEffect(() => {
    try {
      const newStorageKey = companyId ? `${key}-${companyId}` : key;
      const item = window.localStorage.getItem(newStorageKey);
      let newValue;
      if (item) {
        const parsedItem = JSON.parse(item);
        // Merge parsed data with initialValue to ensure all properties exist
        newValue = typeof initialValue === 'object' && initialValue !== null && !Array.isArray(initialValue)
          ? { ...initialValue, ...parsedItem }
          : parsedItem;
      } else {
        newValue = initialValue;
      }
      setStoredValue(newValue);
    } catch (error) {
      console.error(`Error reading localStorage key "${storageKey}":`, error);
      setStoredValue(initialValue);
    }
  }, [companyId, key, initialValue, storageKey]);

  return [storedValue, setValue] as const;
}