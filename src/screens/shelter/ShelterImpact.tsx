import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { useTheme } from '../../context/ThemeContext';

export const ShelterImpact: React.FC = () => {
  const { colors, typography, borderRadius, spacing, shadows, isDarkMode } = useTheme();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);

  const impactStats = [
    { label: 'People Fed', value: '1,250', icon: '👥' },
    { label: 'Waste Avoided (lbs)', value: '500', icon: '♻️' },
    { label: 'Food Items Received', value: '2,300', icon: '🍽️' },
    { label: 'Active Partnerships', value: '15', icon: '🤝' },
  ];

  const recentActivities = [
    { id: '1', activity: 'Received 50 meals from Downtown Cafe', date: '2 hours ago' },
    { id: '2', activity: 'Distributed food to 30 families', date: '5 hours ago' },
    { id: '3', activity: 'Partnered with Green Market for produce', date: '1 day ago' },
  ];

  return (
    <View style={styles.container}>
      <HeaderWithBurger
        title="Impact Dashboard"
        currentScreen="ShelterImpact"
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Your Impact</Text>
          <View style={styles.statsContainer}>
            {impactStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Recent Activities</Text>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <Text style={styles.activityText}>{activity.activity}</Text>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (isDarkMode: boolean, colors: any, typography: any, borderRadius: any, spacing: any, shadows: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: spacing.md,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.sizes.xlarge,
      fontWeight: typography.fontWeightBold,
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      width: '48%',
      alignItems: 'center',
      ...shadows,
    },
    statIcon: {
      fontSize: 30,
      marginBottom: spacing.xs,
    },
    statValue: {
      fontSize: typography.sizes.xlarge,
      fontWeight: typography.fontWeightBold,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    statLabel: {
      fontSize: typography.sizes.small,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    activityCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      ...shadows,
    },
    activityText: {
      fontSize: typography.sizes.medium,
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    activityDate: {
      fontSize: typography.sizes.small,
      color: colors.textSecondary,
    },
  });
