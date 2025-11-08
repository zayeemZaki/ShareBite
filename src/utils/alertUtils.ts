import { Alert, AlertButton } from 'react-native';

/**
 * Shows a success alert with a consistent style
 */
export const showSuccessAlert = (
  title: string,
  message?: string,
  onOk?: () => void
): void => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'OK',
        onPress: onOk,
      },
    ]
  );
};

/**
 * Shows an error alert with a consistent style
 */
export const showErrorAlert = (
  title: string,
  message?: string,
  onOk?: () => void
): void => {
  Alert.alert(
    title,
    message || 'An unexpected error occurred. Please try again.',
    [
      {
        text: 'OK',
        onPress: onOk,
      },
    ]
  );
};

/**
 * Shows a confirmation alert with Yes/No options
 */
export const showConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText: string = 'Yes',
  cancelText: string = 'No'
): void => {
  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: confirmText,
        style: 'destructive',
        onPress: onConfirm,
      },
    ]
  );
};

/**
 * Shows a destructive confirmation alert (for delete actions, etc.)
 */
export const showDestructiveAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText: string = 'Delete',
  cancelText: string = 'Cancel'
): void => {
  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: confirmText,
        style: 'destructive',
        onPress: onConfirm,
      },
    ]
  );
};

/**
 * Shows an info alert with a consistent style
 */
export const showInfoAlert = (
  title: string,
  message?: string,
  onOk?: () => void
): void => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'OK',
        onPress: onOk,
      },
    ]
  );
};

/**
 * Shows a validation error alert
 */
export const showValidationAlert = (message: string): void => {
  Alert.alert('Validation Error', message);
};

/**
 * Shows a custom alert with custom buttons
 */
export const showCustomAlert = (
  title: string,
  message: string,
  buttons: AlertButton[]
): void => {
  Alert.alert(title, message, buttons);
};

/**
 * Shows a network error alert
 */
export const showNetworkErrorAlert = (onRetry?: () => void): void => {
  const buttons: AlertButton[] = [
    {
      text: 'Cancel',
      style: 'cancel',
    },
  ];

  if (onRetry) {
    buttons.push({
      text: 'Retry',
      onPress: onRetry,
    });
  }

  Alert.alert(
    'Network Error',
    'Unable to connect to the server. Please check your internet connection and try again.',
    buttons
  );
};
