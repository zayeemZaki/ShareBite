import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { useTheme } from '../../context/ThemeContext';

export const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { colors, isDarkMode } = useTheme();

  const styles = getStyles(colors);

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

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
