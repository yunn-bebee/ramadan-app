// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Read from storage once on mount
  const readValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Write to storage whenever value changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Force write
      const jsonValue = JSON.stringify(valueToStore);
      window.localStorage.setItem(key, jsonValue);

      console.log(`Saved to localStorage "${key}":`, valueToStore); // debug

      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  };

  // Listen for changes from other tabs (sync across tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        console.log(`Storage event for "${key}":`, e.newValue);
        setStoredValue(readValue());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}