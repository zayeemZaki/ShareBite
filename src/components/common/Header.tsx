import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  title: string;
  showLogo?: boolean;
  showShareButton?: boolean;
  currentScreen?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showLogo = false,
  showShareButton = false,
}) => {
  const navigation = useNavigation();
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const handleLogoPress = () => {
    // Navigate back to dashboard/home tab when logo is pressed
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleSharePress = () => {
    navigation.navigate('ShareFood' as never);
  };

  return (
    <View style={styles.header}>
      {showLogo && (
        <TouchableOpacity
          onPress={handleLogoPress}
          activeOpacity={0.7}
          style={styles.leftSection}
        >
          <Image
            source={require('../../../ShareBiteLogo.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      
      {!showLogo && <View style={styles.leftSection} />}

      <View style={styles.centerSection}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection}>
        {showShareButton && (
          <TouchableOpacity
            onPress={handleSharePress}
            style={styles.shareButton}
            activeOpacity={0.7}
          >
            <Plus size={20} color={colors.surface} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const getStyles = (isDarkMode: boolean, colors: any, typography: any, borderRadius: any, spacing: any, shadows: any) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      ...shadows,
    },
    leftSection: {
      width: 110,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    centerSection: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.sm,
    },
    rightSection: {
      width: 110,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    title: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.fontWeightBold,
      color: colors.textPrimary,
      textAlign: 'center',
    },
    logoImage: {
      width: 110,
      height: 40,
    },
    shareButton: {
      width: 36,
      height: 36,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    shareButtonText: {
      fontSize: 24,
      fontWeight: typography.fontWeightBold,
      color: colors.surface,
      lineHeight: 28,
    },
  });
