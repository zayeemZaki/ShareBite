import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import DateTimePicker from '@react-native-community/datetimepicker';

type FoodType = 'Vegan' | 'Vegetarian' | 'Non Veg';
type AllergenType = 'Gluten' | 'Nuts' | 'Dairy' | 'Soy' | 'Eggs' | 'Fish';

interface FoodItemInput {
  name: string;
  type: FoodType;
  allergens: AllergenType[];
  pickupStart: Date;
  pickupEnd: Date;
  quantity: number;
}

export const ShareFood: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [foodItems, setFoodItems] = useState<FoodItemInput[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFood, setNewFood] = useState<FoodItemInput>({
    name: '',
    type: 'Vegan',
    allergens: [],
    pickupStart: new Date(),
    pickupEnd: new Date(),
    quantity: 1,
  });

  console.log("SHARE FOOOD CLICKED!!");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleAddFood = () => {
    setFoodItems([...foodItems, newFood]);
    setNewFood({
      name: '',
      type: 'Vegan',
      allergens: [],
      pickupStart: new Date(),
      pickupEnd: new Date(),
      quantity: 1,
    });
    setModalVisible(false);
  };

  const handleToggleAllergen = (allergen: AllergenType) => {
    setNewFood((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  };

  const handleTypeSelect = (type: FoodType) => {
    setNewFood((prev) => ({
      ...prev,
      type,
    }));
  };

  const handlePublish = () => {
    // TODO: Replace with actual API integration
    setFoodItems([]);
    if (navigation) navigation.goBack();
  };

  const renderAddFoodModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Food Item</Text>
          <TextInput
            placeholder="Menu Item Name"
            style={styles.input}
            value={newFood.name}
            onChangeText={name => setNewFood(prev => ({ ...prev, name }))}
          />

          <Text style={styles.label}>Type</Text>
          <View style={styles.typeContainer}>
            {(['Vegan', 'Vegetarian', 'Non Veg'] as FoodType[]).map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  newFood.type === type && styles.typeButtonSelected,
                ]}
                onPress={() => handleTypeSelect(type)}
              >
                <Text style={[
                  styles.typeButtonText,
                  newFood.type === type && styles.typeButtonTextSelected,
                ]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Allergens</Text>
          <View style={styles.allergenContainer}>
            {(['Gluten', 'Nuts', 'Dairy', 'Soy', 'Eggs', 'Fish'] as AllergenType[]).map(allergen => (
              <TouchableOpacity
                key={allergen}
                style={[
                  styles.allergenButton,
                  newFood.allergens.includes(allergen) && styles.allergenButtonSelected,
                ]}
                onPress={() => handleToggleAllergen(allergen)}
              >
                <Text style={[
                  styles.allergenButtonText,
                  newFood.allergens.includes(allergen) && styles.allergenButtonTextSelected,
                ]}>{allergen}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Pickup Date & Time Range</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={styles.dateButton}
            >
              <Text>
                Start: {newFood.pickupStart.toLocaleString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={styles.dateButton}
            >
              <Text>
                End: {newFood.pickupEnd.toLocaleString()}
              </Text>
            </TouchableOpacity>
          </View>
          {showStartPicker && (
            <DateTimePicker
              value={newFood.pickupStart}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, date) => {
                setShowStartPicker(false);
                if (date) setNewFood(prev => ({ ...prev, pickupStart: date }));
              }}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={newFood.pickupEnd}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={(event, date) => {
                setShowEndPicker(false);
                if (date) setNewFood(prev => ({ ...prev, pickupEnd: date }));
              }}
            />
          )}

          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(newFood.quantity)}
            onChangeText={quantity => setNewFood(prev => ({ ...prev, quantity: Number(quantity) }))}
          />

          <View style={styles.modalButtons}>
            <Button title="Add Food" onPress={handleAddFood} />
            <Button title="Cancel" variant="secondary" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Header title="Share Food" showLogout={true} />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add & Publish Food Items</Text>
          {foodItems.map((item, idx) => (
            <View key={idx} style={styles.foodCard}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodType}>{item.type}</Text>
                <Text style={styles.foodAllergens}>
                  Allergens: {item.allergens.length > 0 ? item.allergens.join(', ') : 'None'}
                </Text>
                <Text style={styles.foodPickup}>
                  Pickup: {item.pickupStart.toLocaleString()} - {item.pickupEnd.toLocaleString()}
                </Text>
                <Text style={styles.foodQuantity}>Qty: {item.quantity}</Text>
              </View>
            </View>
          ))}
          <Button
            title="Add New Food"
            onPress={() => setModalVisible(true)}
            style={styles.actionButton}
          />
          {foodItems.length > 0 && (
            <Button
              title="Publish Items"
              onPress={handlePublish}
              style={styles.publishButton}
            />
          )}
        </View>
      </ScrollView>
      {renderAddFoodModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  publishButton: {
    marginTop: 8,
    backgroundColor: '#27ae60',
  },
  foodCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3498db',
  },
  foodType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  foodAllergens: {
    fontSize: 12,
    color: '#e74c3c',
  },
  foodPickup: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  foodQuantity: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 62, 80, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3498db',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#3498db',
  },
  typeButtonText: {
    color: '#3498db',
    fontWeight: '600',
  },
  typeButtonTextSelected: {
    color: '#fff',
  },
  allergenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  allergenButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
    backgroundColor: '#fff',
    marginRight: 6,
    marginBottom: 6,
  },
  allergenButtonSelected: {
    backgroundColor: '#e74c3c',
  },
  allergenButtonText: {
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: 12,
  },
  allergenButtonTextSelected: {
    color: '#fff',
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#7f8c8d',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    backgroundColor: '#f8f9fa',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
});

export default ShareFood;