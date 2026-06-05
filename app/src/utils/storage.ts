/**
 * Swappable local persistence layer.
 *
 * The whole app talks to THIS module, never to AsyncStorage directly.
 * Today it is backed by AsyncStorage (works in Expo Go, keeps the fast
 * cable/hot-reload dev loop). When we ship a native dev/production build
 * (Phase 8), swap the three impl functions below to react-native-mmkv —
 * nothing else in the app needs to change.
 *
 * MMKV swap reference:
 *   import { MMKV } from 'react-native-mmkv';
 *   const mmkv = new MMKV();
 *   getString = (k) => mmkv.getString(k) ?? null;   // sync
 *   setString = (k, v) => mmkv.set(k, v);
 *   remove    = (k) => mmkv.delete(k);
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async getString(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },

  async setString(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async getJSON<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async setJSON<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
};

export type Storage = typeof storage;
