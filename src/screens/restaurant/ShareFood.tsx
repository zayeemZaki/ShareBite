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
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';

type FoodType = 'Vegan' | 'Vegetarian' | 'Non Veg';
type AllergenType = 'Gluten' | 'Nuts' | 'Dairy' | 'Soy' | 'Eggs' | 'Fish';

interface FoodItemInput {
  name: string;
  type: FoodType;
  allergens: AllergenType[];
  pickupStart: Date;
  pickupEnd: Date;
  quantity: number;
  isHalal: boolean;
}

export const ShareFood: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);
  const [foodItems, setFoodItems] = useState<FoodItemInput[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFood, setNewFood] = useState<FoodItemInput>({
    name: '',
    type: 'Vegan',
    allergens: [],
    pickupStart: new Date(),
    pickupEnd: new Date(),
    quantity: 1,
    isHalal: false,
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
      isHalal: false,
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

            <Text style={styles.label}>Halal</Text>
            <TouchableOpacity
              style={[
                styles.halalButton,
                newFood.isHalal && styles.halalButtonSelected,
              ]}
              onPress={() => setNewFood(prev => ({ ...prev, isHalal: !prev.isHalal }))}
            >
              <View style={[styles.checkbox, newFood.isHalal && styles.checkboxSelected]}>
                <Text style={styles.checkboxText}>{newFood.isHalal ? '☑️' : '□'}</Text>
              </View>
              <Text style={[
                styles.halalButtonText,
                newFood.isHalal && styles.halalButtonTextSelected,
              ]}>
                Halal
              </Text>
            </TouchableOpacity>

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
      <HeaderWithBurger
        title="Share Food"
        isDarkMode={isDarkMode}
        currentScreen="ShareFood"
      />
      
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
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: typography.sizes.xlarge,
      fontWeight: typography.fontWeightBold,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    sectionSubtitle: {
      fontSize: typography.sizes.medium,
      color: colors.textSecondary,
      marginBottom: spacing.md,
      lineHeight: 22,
    },
    foodList: {
      marginBottom: spacing.md,
    },
    foodItemCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      ...shadows,
    },
    foodItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    foodItemName: {
      fontSize: typography.sizes.large,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      flex: 1,
    },
    removeButton: {
      width: 24,
      height: 24,
      borderRadius: borderRadius.lg,
      backgroundColor: '#e74c3c',
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeButtonText: {
      color: '#fff',
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightBold,
    },
    foodItemDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    foodItemType: {
      fontSize: typography.sizes.regular,
      color: '#27ae60',
      fontWeight: typography.fontWeightMedium,
    },
    foodItemQuantity: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      fontWeight: typography.fontWeightMedium,
    },
    allergensContainer: {
      flexDirection: 'row',
      marginBottom: spacing.sm,
      flexWrap: 'wrap',
    },
    allergensLabel: {
      fontSize: typography.sizes.regular,
      color: '#e67e22',
      fontWeight: typography.fontWeightMedium,
    },
    allergensText: {
      fontSize: typography.sizes.regular,
      color: '#e67e22',
      flex: 1,
    },
    timeContainer: {
      marginTop: spacing.sm,
    },
    timeText: {
      fontSize: typography.sizes.small,
      color: colors.textSecondary,
    },
    emptyState: {
      padding: spacing.xl,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    emptyStateText: {
      fontSize: typography.sizes.medium,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    buttonContainer: {
      gap: spacing.sm,
      paddingBottom: spacing.xl,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: typography.sizes.xlarge,
      fontWeight: typography.fontWeightBold,
      color: colors.textPrimary,
      marginBottom: spacing.xl,
      textAlign: 'center',
    },
    label: {
      fontSize: typography.sizes.medium,
      fontWeight: typography.fontWeightMedium,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      marginTop: spacing.md,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.sm,
      padding: spacing.sm,
      fontSize: typography.sizes.medium,
      backgroundColor: colors.surface,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
    },
    typeContainer: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    typeButton: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    typeButtonSelected: {
      backgroundColor: '#3498db',
      borderColor: '#3498db',
    },
    typeButtonText: {
      fontSize: typography.sizes.regular,
      color: colors.textPrimary,
      fontWeight: typography.fontWeightMedium,
    },
    typeButtonTextSelected: {
      color: '#fff',
      fontWeight: typography.fontWeightMedium,
    },
    allergenContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    allergenButton: {
      backgroundColor: colors.surface,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    allergenButtonSelected: {
      backgroundColor: '#e67e22',
      borderColor: '#e67e22',
    },
    allergenButtonText: {
      fontSize: typography.sizes.small,
      color: colors.textPrimary,
      fontWeight: typography.fontWeightMedium,
    },
    allergenButtonTextSelected: {
      color: '#fff',
      fontWeight: typography.fontWeightMedium,
    },
    dateTimeRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    dateButton: {
      flex: 1,
      backgroundColor: colors.surface,
      padding: spacing.sm,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    dateButtonLabel: {
      fontSize: typography.sizes.small,
      color: colors.textSecondary,
      fontWeight: typography.fontWeightMedium,
      marginBottom: spacing.sm,
    },
    dateButtonText: {
      fontSize: typography.sizes.small,
      color: colors.textPrimary,
      textAlign: 'center',
      fontWeight: typography.fontWeightMedium,
    },
    modalButtons: {
      gap: spacing.sm,
      marginTop: spacing.xl,
    },
    halalButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      padding: spacing.sm,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    halalButtonSelected: {
      backgroundColor: '#d4edda',
      borderColor: '#27ae60',
    },
    halalButtonText: {
      fontSize: typography.sizes.medium,
      color: colors.textPrimary,
      marginLeft: spacing.sm,
    },
    halalButtonTextSelected: {
      color: '#27ae60',
      fontWeight: typography.fontWeightMedium,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.xs,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxSelected: {
      backgroundColor: '#27ae60',
      borderColor: '#27ae60',
    },
    checkboxText: {
      fontSize: typography.sizes.regular,
      color: '#fff',
    },
  });
