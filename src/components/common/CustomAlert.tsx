import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

export type AlertType = 'success' | 'error' | 'confirm' | 'info';

interface CustomAlertProps {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
}) => {
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return { IconComponent: CheckCircle, color: colors.success, bgColor: colors.successLight };
      case 'error':
        return { IconComponent: XCircle, color: colors.error, bgColor: colors.errorLight };
      case 'confirm':
        return { IconComponent: AlertCircle, color: colors.warning, bgColor: colors.warningLight };
      case 'info':
        return { IconComponent: Info, color: colors.info, bgColor: isDarkMode ? 'rgba(44, 95, 111, 0.15)' : 'rgba(44, 95, 111, 0.1)' };
      default:
        return { IconComponent: Info, color: colors.info, bgColor: isDarkMode ? 'rgba(44, 95, 111, 0.15)' : 'rgba(44, 95, 111, 0.1)' };
    }
  };

  const { IconComponent, color, bgColor } = getIconAndColor();

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Icon Circle */}
          <View style={[styles.iconCircle, { backgroundColor: bgColor, borderColor: color }]}>
            <IconComponent size={32} color={color} strokeWidth={2} />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {type === 'confirm' && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                type === 'error' && styles.errorButton,
                type === 'success' && styles.successButton,
                type === 'confirm' && styles.warningButton,
              ]}
              onPress={handleConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (isDarkMode: boolean, colors: any, typography: any, borderRadius: any, spacing: any, shadows: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    container: {
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      width: '100%',
      maxWidth: 380,
      alignItems: 'center',
      ...shadows.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    title: {
      fontSize: typography.sizes.h2,
      fontWeight: typography.fontWeights?.semibold || '600',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    message: {
      fontSize: typography.sizes.body,
      color: colors.textSecondary,
      marginBottom: spacing.md,
      textAlign: 'center',
      lineHeight: 20,
      paddingHorizontal: spacing.xs,
    },
    buttonContainer: {
      flexDirection: 'row',
      width: '100%',
      gap: spacing.xs,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    cancelButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      fontSize: typography.sizes.bodyLarge,
      fontWeight: typography.fontWeights?.medium || '500',
      color: colors.textPrimary,
      lineHeight: 22,
    },
    confirmButton: {
      ...shadows.sm,
      elevation: 2,
    },
    successButton: {
      backgroundColor: colors.success,
    },
    errorButton: {
      backgroundColor: colors.error,
    },
    warningButton: {
      backgroundColor: colors.warning,
    },
    confirmButtonText: {
      fontSize: typography.sizes.bodyLarge,
      fontWeight: typography.fontWeights?.medium || '500',
      color: '#FFFFFF',
      lineHeight: 22,
    },
  });
