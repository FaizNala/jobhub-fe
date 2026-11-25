import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { Radius } from '@/constants/theme';
import { useNetworkStore } from '@/modules/network';
import { OfflineStorysetIllustration } from '@/components/atoms/offline-storyset-illustration';

export function NetworkErrorModal() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const { isModalVisible, modalConfig, isRetrying, hideOfflineModal, retryConnection } =
    useNetworkStore();

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
      <View style={[styles.overlay, isDesktop ? styles.overlayDesktop : styles.overlayMobile]}>
        <View style={isDesktop ? styles.dialogCard : styles.bottomSheetCard}>
          {/* Drag Handle (Only on Mobile Bottom Sheet) */}
          {!isDesktop && <View style={styles.dragHandle} />}

          {/* Storyset Offline Character Illustration */}
          <OfflineStorysetIllustration
            width={isDesktop ? 260 : 220}
            height={isDesktop ? 185 : 160}
          />

          {/* Text Content */}
          <View style={styles.textGroup}>
            <Text style={styles.title}>
              {modalConfig?.title || 'No internet connection'}
            </Text>
            <Text style={styles.message}>
              {modalConfig?.message ||
                'Unable to reach JobHub servers. Please check your Wi-Fi or mobile network and try again.'}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={handleRetry}
              disabled={isRetrying}
              style={[
                styles.retryButton,
                Platform.OS === 'web' && ({ outline: 'none' } as any),
              ]}
              activeOpacity={0.88}
              accessibilityRole="button"
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
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDismiss}
              style={styles.dismissButton}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Dismiss network alert">
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function OfflineAmbientBanner() {
  const isOnline = useNetworkStore((state) => state.isOnline);

  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerContent}>
        <WifiOff size={13} color="#991B1B" strokeWidth={2.2} />
        <Text style={styles.bannerText}>Offline mode • Attempting to reconnect</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.45)',
  },
  overlayMobile: {
    justifyContent: 'flex-end',
  },
  overlayDesktop: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  /* Mobile Bottom Sheet Card */
  bottomSheetCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: '#E2E6DC',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 42 : 28,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  dragHandle: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#D6DBD0',
    alignSelf: 'center',
    marginBottom: 6,
  },

  /* Desktop Centered Dialog Card */
  dialogCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 28,
    alignItems: 'center',
    gap: 18,
    borderWidth: 1,
    borderColor: '#E2E6DC',
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },

  iconBadge: {
    width: 58,
    height: 58,
    borderRadius: Radius.full,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
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

  /* Primary Action Button - STRICTLY NO BORDER */
  retryButton: {
    backgroundColor: '#B8F23E',
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    borderColor: 'transparent',
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
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#73786B',
  },

  /* Ambient Top Banner */
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
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
});
