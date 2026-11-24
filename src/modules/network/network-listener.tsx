import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useNetworkStore } from './network.store';

export function NetworkListener() {
  const setIsOnline = useNetworkStore((state) => state.setIsOnline);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleOnline = () => {
        setIsOnline(true);
      };

      const handleOffline = () => {
        setIsOnline(false);
      };

      const handleShowModal = (e: any) => {
        useNetworkStore.getState().showOfflineModal(e.detail);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('jobhub:network-error', handleShowModal);

      // Initial check
      if (typeof navigator !== 'undefined') {
        setIsOnline(navigator.onLine);
      }

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('jobhub:network-error', handleShowModal);
      };
    }
  }, [setIsOnline]);

  return null;
}
