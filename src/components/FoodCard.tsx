import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface FoodItem {
  id: string;
  title: string;
  details: string;
  description: string;
}

interface FoodCardProps {
  item: FoodItem;
  isDarkMode?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, isDarkMode = false }) => {
  return (
    <View style={[styles.foodCard, { backgroundColor: isDarkMode ? '#2c2c2c' : '#f8f9fa' }]}>
      <Text style={[styles.foodTitle, { color: isDarkMode ? '#ffffff' : '#2c3e50' }]}>
        {item.title}
      </Text>
      <Text style={styles.foodDetails}>{item.details}</Text>
      <Text style={[styles.foodDescription, { color: isDarkMode ? '#cccccc' : '#34495e' }]}>
        {item.description}
      </Text>
      <TouchableOpacity style={styles.claimButton}>
        <Text style={styles.claimButtonText}>Claim Food</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  foodCard: {
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
    marginBottom: 4,
  },
  foodDetails: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  foodDescription: {
    fontSize: 14,
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
});
