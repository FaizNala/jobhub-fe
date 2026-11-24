import { create } from 'zustand';
import { Platform } from 'react-native';

export interface NetworkModalConfig {
  title: string;
  message: string;
  onRetry?: () => Promise<void> | void;
}

interface NetworkState {
  isOnline: boolean;
  isModalVisible: boolean;
  modalConfig: NetworkModalConfig | null;
  isRetrying: boolean;
  setIsOnline: (online: boolean) => void;
  showOfflineModal: (config?: Partial<NetworkModalConfig>) => void;
  hideOfflineModal: () => void;
  retryConnection: () => Promise<boolean>;
  checkConnection: () => Promise<boolean>;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  isOnline: true,
  isModalVisible: false,
  modalConfig: null,
  isRetrying: false,

  setIsOnline: (online: boolean) => {
    set({ isOnline: online });
    if (online && get().isModalVisible) {
      // Auto-dismiss modal when connection is restored
      set({ isModalVisible: false, modalConfig: null });
    }
  },

  showOfflineModal: (config) =>
    set({
      isModalVisible: true,
      modalConfig: {
        title: config?.title || 'No internet connection',
        message:
          config?.message ||
          'Unable to reach JobHub servers. Please check your Wi-Fi or cellular network and try again.',
        onRetry: config?.onRetry,
      },
    }),

  hideOfflineModal: () => set({ isModalVisible: false, modalConfig: null, isRetrying: false }),

  checkConnection: async () => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      const online = navigator.onLine;
      get().setIsOnline(online);
      return online;
    }

    try {
      // Direct lightweight connectivity probe
      const res = await fetch('https://httpbin.org/status/200', {
        method: 'HEAD',
        cache: 'no-store',
      });
      const online = res.ok;
      get().setIsOnline(online);
      return online;
    } catch {
      get().setIsOnline(false);
      return false;
    }
  },

  retryConnection: async () => {
    set({ isRetrying: true });
    try {
      const { modalConfig, checkConnection } = get();
      const online = await checkConnection();

      if (online) {
        if (modalConfig?.onRetry) {
          await modalConfig.onRetry();
        }
        set({ isModalVisible: false, modalConfig: null, isRetrying: false });
        return true;
      }
    } catch {
      // Remain in offline state
    } finally {
      set({ isRetrying: false });
    }
    return false;
  },
}));
