import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ScreenName } from '../types/navigation';

interface NavigationContextType {
  currentScreen: ScreenName;
  navigate: (screen: ScreenName) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  initialScreen: ScreenName;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  initialScreen 
}) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(initialScreen);

  const navigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
  };

  const value = {
    currentScreen,
    navigate,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
