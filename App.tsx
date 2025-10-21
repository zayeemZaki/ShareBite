/**
 * ShareBite - Food Sharing App
 * @format
 */

import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { ReactAppNavigator } from './src/navigation/ReactAppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';

function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ReactAppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
