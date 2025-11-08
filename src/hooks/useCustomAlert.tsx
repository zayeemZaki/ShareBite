import React, { useState, useCallback } from 'react';
import { CustomAlert, AlertType } from '../components/common/CustomAlert';

interface AlertConfig {
  type: AlertType;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertConfig(config);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig(null);
  }, []);

  const showSuccessAlert = useCallback((title: string, message: string, onOk?: () => void) => {
    showAlert({
      type: 'success',
      title,
      message,
      onConfirm: onOk,
      confirmText: 'OK',
    });
  }, [showAlert]);

  const showErrorAlert = useCallback((title: string, message: string, onOk?: () => void) => {
    showAlert({
      type: 'error',
      title,
      message,
      onConfirm: onOk,
      confirmText: 'OK',
    });
  }, [showAlert]);

  const showConfirmAlert = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      confirmText: string = 'Yes',
      cancelText: string = 'No'
    ) => {
      showAlert({
        type: 'confirm',
        title,
        message,
        onConfirm,
        confirmText,
        cancelText,
      });
    },
    [showAlert]
  );

  const showInfoAlert = useCallback((title: string, message: string, onOk?: () => void) => {
    showAlert({
      type: 'info',
      title,
      message,
      onConfirm: onOk,
      confirmText: 'OK',
    });
  }, [showAlert]);

  const AlertComponent = alertConfig ? (
    <CustomAlert
      visible={!!alertConfig}
      type={alertConfig.type}
      title={alertConfig.title}
      message={alertConfig.message}
      onClose={hideAlert}
      onConfirm={alertConfig.onConfirm}
      confirmText={alertConfig.confirmText}
      cancelText={alertConfig.cancelText}
    />
  ) : null;

  return {
    showSuccessAlert,
    showErrorAlert,
    showConfirmAlert,
    showInfoAlert,
    AlertComponent,
  };
};
