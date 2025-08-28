/**
 * ShareBite - Food Sharing App
 * Built with React Native + TypeScript
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState('home');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    flex: 1,
  };

  const textStyle = {
    color: isDarkMode ? '#ffffff' : '#000000',
  };

  const renderHomeScreen = () => (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
      <View style={styles.header}>
        <Text style={[styles.title, textStyle]}>🍽️ ShareBite</Text>
        <Text style={[styles.subtitle, textStyle]}>Share Food, Reduce Waste</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, textStyle]}>Available Food Near You</Text>
        
        <View style={styles.foodCard}>
          <Text style={styles.foodTitle}>🍕 Pizza Slices</Text>
          <Text style={styles.foodDetails}>2 slices • 0.3 miles away</Text>
          <Text style={styles.foodDescription}>Fresh pizza from Mario's Kitchen</Text>
          <TouchableOpacity style={styles.claimButton}>
            <Text style={styles.claimButtonText}>Claim Food</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.foodCard}>
          <Text style={styles.foodTitle}>🥗 Fresh Salad</Text>
          <Text style={styles.foodDetails}>1 bowl • 0.5 miles away</Text>
          <Text style={styles.foodDescription}>Organic mixed greens with dressing</Text>
          <TouchableOpacity style={styles.claimButton}>
            <Text style={styles.claimButtonText}>Claim Food</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.foodCard}>
          <Text style={styles.foodTitle}>🍞 Fresh Bread</Text>
          <Text style={styles.foodDetails}>1 loaf • 0.8 miles away</Text>
          <Text style={styles.foodDescription}>Whole wheat bread from local bakery</Text>
          <TouchableOpacity style={styles.claimButton}>
            <Text style={styles.claimButtonText}>Claim Food</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => setCurrentScreen('share')}
        >
          <Text style={styles.shareButtonText}>🍽️ Share Food</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderShareScreen = () => (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => setCurrentScreen('home')}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, textStyle]}>Share Your Food</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, textStyle]}>What are you sharing today?</Text>
        
        <View style={styles.shareForm}>
          <Text style={[styles.label, textStyle]}>Food Item:</Text>
          <View style={styles.input}>
            <Text style={styles.inputPlaceholder}>e.g., Leftover pasta, Fresh fruits...</Text>
          </View>

          <Text style={[styles.label, textStyle]}>Quantity:</Text>
          <View style={styles.input}>
            <Text style={styles.inputPlaceholder}>e.g., 2 servings, 1 bowl...</Text>
          </View>

          <Text style={[styles.label, textStyle]}>Description:</Text>
          <View style={[styles.input, styles.textArea]}>
            <Text style={styles.inputPlaceholder}>Describe your food item...</Text>
          </View>

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>📤 Share Food</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {currentScreen === 'home' ? renderHomeScreen() : renderShareScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  foodCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  foodDetails: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  foodDescription: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 12,
  },
  claimButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  claimButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  actionSection: {
    padding: 24,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  shareForm: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    minHeight: 80,
  },
  inputPlaceholder: {
    color: '#95a5a6',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#e67e22',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default App;
