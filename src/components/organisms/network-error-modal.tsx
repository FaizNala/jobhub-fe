import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { RefreshCw, WifiOff } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';
import { useNetworkStore } from '@/modules/network';
import { OfflineStorysetIllustration } from '@/components/atoms/offline-storyset-illustration';

export function NetworkErrorModal() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const {
    isModalVisible,
    modalConfig,
    isRetrying,
    hideOfflineModal,
    retryConnection,
  } = useNetworkStore();

  useEffect(() => {
    if (Platform.OS !== 'web' || !isModalVisible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isRetrying) {
        event.preventDefault();
        hideOfflineModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [hideOfflineModal, isModalVisible, isRetrying]);

  const handleRetry = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const success = await retryConnection();
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    }
  };

  const handleDismiss = () => {
    Haptics.selectionAsync().catch(() => {});
    hideOfflineModal();
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleDismiss}>
      <View
        style={[
          styles.overlay,
          isDesktop ? styles.overlayDesktop : styles.overlayMobile,
        ]}>
        <View style={isDesktop ? styles.dialogCard : styles.bottomSheetCard}>
          {/* Drag Handle (Mobile Bottom Sheet) */}
          {!isDesktop ? <View style={styles.dragHandle} /> : null}

          <OfflineStorysetIllustration
            width={isDesktop ? 260 : 220}
            height={isDesktop ? 185 : 160}
          />

          <View style={styles.textGroup}>
            <Text style={styles.title}>
              {modalConfig?.title || 'No internet connection'}
            </Text>
            <Text style={styles.message}>
              {modalConfig?.message ||
                'Unable to reach JobHub servers. Please check your Wi-Fi or mobile network and try again.'}
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <Pressable
              onPress={handleRetry}
              disabled={isRetrying}
              style={state => [
                styles.retryButton,
                isRetrying && styles.disabledButton,
                state.pressed && !isRetrying && styles.pressedFade,
                Platform.OS === 'web' && (state as { focused?: boolean }).focused
                  ? styles.webFocusRing
                  : null,
              ]}
              accessibilityRole="button"
              accessibilityState={{ busy: isRetrying, disabled: isRetrying }}
              accessibilityLabel="Retry connection">
              {isRetrying ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color="#121212" />
                  <Text style={styles.retryButtonText}>Checking network...</Text>
                </View>
              ) : (
                <View style={styles.loadingRow}>
                  <RefreshCw size={15} color="#121212" strokeWidth={2.2} />
                  <Text style={styles.retryButtonText}>Try again</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={handleDismiss}
              disabled={isRetrying}
              style={state => [
                styles.dismissButton,
                state.pressed && styles.pressedFade,
                Platform.OS === 'web' && (state as { focused?: boolean }).focused
                  ? styles.webFocusRing
                  : null,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Dismiss network alert">
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function OfflineAmbientBanner() {
  const isOnline = useNetworkStore(state => state.isOnline);

  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerContent}>
        <WifiOff size={13} color="#991B1B" strokeWidth={2.2} />
        <Text style={styles.bannerText}>Offline mode · Attempting to reconnect</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.5)',
  },
  overlayMobile: {
    justifyContent: 'flex-end',
  },
  overlayDesktop: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  bottomSheetCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: Colors.light.border,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 42 : 28,
    alignItems: 'center',
    gap: 16,
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D6DBD0',
    alignSelf: 'center',
    marginBottom: 6,
  },
  dialogCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 28,
    alignItems: 'center',
    gap: 18,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  textGroup: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#121212',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    color: '#5A5D54',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  buttonGroup: {
    width: '100%',
    gap: 8,
    marginTop: 4,
  },
  retryButton: {
    minHeight: 48,
    backgroundColor: '#B8F23E',
    borderRadius: Radius.full,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  disabledButton: {
    opacity: 0.65,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#121212',
    letterSpacing: 0.2,
  },
  dismissButton: {
    minHeight: 44,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
  },
  dismissButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5A5D54',
  },
  bannerContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 8 : 46,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
  pressedFade: {
    opacity: 0.8,
  },
  webFocusRing: {
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: '#121212',
    outlineOffset: 2,
  } as any,
});
