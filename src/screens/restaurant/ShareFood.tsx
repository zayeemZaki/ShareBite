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
  Alert,
  FlatList,
} from 'react-native';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';

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

  const handleAddFood = () => {
    if (!newFood.name || newFood.quantity <= 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

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
    Alert.alert('Success', 'Food item added successfully!');
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

  const handleSetStartTime = () => {
    const newStart = new Date();
    newStart.setHours(newStart.getHours() + 1);
    setNewFood(prev => ({ ...prev, pickupStart: newStart }));
  };

  const handleSetEndTime = () => {
    const newEnd = new Date();
    newEnd.setHours(newEnd.getHours() + 3);
    setNewFood(prev => ({ ...prev, pickupEnd: newEnd }));
  };

  const handlePublish = () => {
    if (foodItems.length === 0) {
      Alert.alert('Error', 'Please add at least one food item before publishing');
      return;
    }

    Alert.alert(
      'Publish Food Items',
      `Are you sure you want to publish ${foodItems.length} food item(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          onPress: () => {
            // TODO: Replace with actual API integration
            console.log('Publishing food items:', foodItems);
            Alert.alert('Success', 'Food items published successfully!');
            setFoodItems([]);
            if (navigation) navigation.goBack();
          },
        },
      ]
    );
  };

  const handleRemoveFood = (index: number) => {
    const updatedItems = foodItems.filter((_, i) => i !== index);
    setFoodItems(updatedItems);
  };

  const renderFoodItem = ({ item, index }: { item: FoodItemInput; index: number }) => (
    <View style={styles.foodItemCard}>
      <View style={styles.foodItemHeader}>
        <Text style={styles.foodItemName}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => handleRemoveFood(index)}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.foodItemDetails}>
        <Text style={styles.foodItemType}>{item.type}</Text>
        <Text style={styles.foodItemQuantity}>Qty: {item.quantity}</Text>
      </View>
      {item.allergens.length > 0 && (
        <View style={styles.allergensContainer}>
          <Text style={styles.allergensLabel}>Allergens: </Text>
          <Text style={styles.allergensText}>{item.allergens.join(', ')}</Text>
        </View>
      )}
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          Pickup: {item.pickupStart.toLocaleString()} - {item.pickupEnd.toLocaleString()}
        </Text>
      </View>
    </View>
  );

  const renderAddFoodModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Add New Food Item</Text>
            
            <Text style={styles.label}>Menu Item Name *</Text>
            <TextInput
              placeholder="e.g., Grilled Chicken Sandwich"
              style={styles.input}
              value={newFood.name}
              onChangeText={name => setNewFood(prev => ({ ...prev, name }))}
            />

            <Text style={styles.label}>Food Type</Text>
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

            <Text style={styles.label}>Allergens (Optional)</Text>
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
                onPress={handleSetStartTime}
                style={styles.dateButton}
              >
                <Text style={styles.dateButtonLabel}>Start Time</Text>
                <Text style={styles.dateButtonText}>
                  {newFood.pickupStart.toLocaleString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSetEndTime}
                style={styles.dateButton}
              >
                <Text style={styles.dateButtonLabel}>End Time</Text>
                <Text style={styles.dateButtonText}>
                  {newFood.pickupEnd.toLocaleString()}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Quantity *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Number of servings available"
              value={String(newFood.quantity)}
              onChangeText={quantity => setNewFood(prev => ({ ...prev, quantity: Number(quantity) || 1 }))}
            />

            <View style={styles.modalButtons}>
              <Button title="Add Food Item" onPress={handleAddFood} />
              <Button 
                title="Cancel" 
                variant="secondary" 
                onPress={() => setModalVisible(false)} 
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Header title="Share Food" showLogout={true} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Items to Share</Text>
          <Text style={styles.sectionSubtitle}>
            Add the food items you want to share with shelters and volunteers
          </Text>
          
          {foodItems.length > 0 ? (
            <FlatList
              data={foodItems}
              renderItem={renderFoodItem}
              keyExtractor={(_, index) => index.toString()}
              style={styles.foodList}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No food items added yet. Tap the button below to add your first item.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="+ Add Food Item"
            onPress={() => setModalVisible(true)}
            variant="secondary"
          />
          
          {foodItems.length > 0 && (
            <Button
              title={`Publish ${foodItems.length} Item(s)`}
              onPress={handlePublish}
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
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 16,
    lineHeight: 22,
  },
  foodList: {
    marginBottom: 16,
  },
  foodItemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  foodItemType: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '500',
  },
  foodItemQuantity: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  allergensContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  allergensLabel: {
    fontSize: 14,
    color: '#e67e22',
    fontWeight: '500',
  },
  allergensText: {
    fontSize: 14,
    color: '#e67e22',
    flex: 1,
  },
  timeContainer: {
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#95a5a6',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ecf0f1',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 12,
    paddingBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  allergenContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  allergenButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  allergenButtonSelected: {
    backgroundColor: '#e67e22',
    borderColor: '#e67e22',
  },
  allergenButtonText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '500',
  },
  allergenButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  dateButtonLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
    marginBottom: 4,
  },
  dateButtonText: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalButtons: {
    gap: 12,
    marginTop: 24,
  },
});