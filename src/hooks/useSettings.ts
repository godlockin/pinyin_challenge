/**
 * 设置状态管理 Hook
 * 包含本地存储持久化功能
 */

import { useState, useEffect, useCallback } from 'react';
import type { Settings } from '../types';
import { defaultSettings } from '../types';

const STORAGE_KEY = 'pinyin-challenge-settings';

/**
 * 从 localStorage 读取设置
 */
function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 合并默认设置，确保新增字段有默认值
      return {
        ...defaultSettings,
        ...parsed,
        style: {
          ...defaultSettings.style,
          ...parsed.style,
        },
      };
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return defaultSettings;
}

/**
 * 保存设置到 localStorage
 */
function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
}

export interface UseSettingsReturn {
  /** 当前设置 */
  settings: Settings;
  /** 更新设置 */
  setSettings: (settings: Settings) => void;
  /** 更新单个设置项 */
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  /** 重置为默认设置 */
  resetSettings: () => void;
  /** 设置是否已从存储加载 */
  isLoaded: boolean;
}

/**
 * 设置状态管理 Hook
 * - 自动从 localStorage 加载设置
 * - 设置变化时自动保存到 localStorage
 */
export function useSettings(): UseSettingsReturn {
  const [settings, setSettingsInternal] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // 组件挂载时从 localStorage 加载设置
  useEffect(() => {
    const loaded = loadSettings();
    setSettingsInternal(loaded);
    setIsLoaded(true);
  }, []);

  // 设置变化时保存到 localStorage
  useEffect(() => {
    if (isLoaded) {
      saveSettings(settings);
    }
  }, [settings, isLoaded]);

  const setSettings = useCallback((newSettings: Settings) => {
    setSettingsInternal(newSettings);
  }, []);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettingsInternal((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsInternal(defaultSettings);
  }, []);

  return {
    settings,
    setSettings,
    updateSetting,
    resetSettings,
    isLoaded,
  };
}
