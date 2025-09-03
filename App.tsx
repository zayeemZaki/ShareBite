/**
 * ShareBite - Food Sharing App
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
import { FoodCard } from './src/components/FoodCard';
import { sampleFoodItems } from './src/data/mockData';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState('home');

  const styles = getStyles(isDarkMode);

  const HomeScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🍽️ ShareBite</Text>
        <Text style={styles.subtitle}>Share Food, Reduce Waste</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Food Near You</Text>
        {sampleFoodItems.map(item => (
          <FoodCard key={item.id} item={item} isDarkMode={isDarkMode} />
        ))}
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

  const ShareScreen = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => setCurrentScreen('home')}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Share Your Food</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What are you sharing today?</Text>
        
        <View style={styles.shareForm}>
          <Text style={styles.label}>Food Item:</Text>
          <View style={styles.input}>
            <Text style={styles.inputPlaceholder}>e.g., Leftover pasta, Fresh fruits...</Text>
          </View>

          <Text style={styles.label}>Quantity:</Text>
          <View style={styles.input}>
            <Text style={styles.inputPlaceholder}>e.g., 2 servings, 1 bowl...</Text>
          </View>

          <Text style={styles.label}>Description:</Text>
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {currentScreen === 'home' ? <HomeScreen /> : <ShareScreen />}
    </SafeAreaView>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    color: isDarkMode ? '#ffffff' : '#000000',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    color: isDarkMode ? '#ffffff' : '#000000',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: isDarkMode ? '#ffffff' : '#000000',
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
    color: isDarkMode ? '#ffffff' : '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#444' : '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa',
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
