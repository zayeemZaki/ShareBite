import React, { useState } from 'react';
import { SafeAreaView, StatusBar, useColorScheme, StyleSheet } from 'react-native';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';

  const styles = getStyles(isDarkMode);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {isLogin ? (
        <LoginForm
          onSwitchToRegister={() => setIsLogin(false)}
          isDarkMode={isDarkMode}
        />
      ) : (
        <RegisterForm
          onSwitchToLogin={() => setIsLogin(true)}
          isDarkMode={isDarkMode}
        />
      )}
    </SafeAreaView>
  );
};

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
  },
});
