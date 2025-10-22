import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { HeaderWithBurger } from '../../components/common/HeaderWithBurger';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FoodService, FoodItemRequest } from '../../services/FoodService';
import { ProfileService } from '../../services/ProfileService';

type FoodType = 'Vegan' | 'Vegetarian' | 'Non Veg';
type AllergenType = 'Gluten' | 'Nuts' | 'Dairy' | 'Soy' | 'Eggs' | 'Fish';

interface FoodItemInput {
  title: string;
  description: string;
  quantity: string;
  expiryHours: number;
  isVegetarian: boolean;
  isVegan: boolean;
  allergens: AllergenType[];
  pickupInstructions: string;
  imageUrl?: string;
}

export const ShareFood: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { isDarkMode, colors, typography, borderRadius, spacing, shadows } = useTheme();
  const { state } = useAuth();
  const styles = getStyles(isDarkMode, colors, typography, borderRadius, spacing, shadows);
  const [foodItems, setFoodItems] = useState<FoodItemInput[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newFood, setNewFood] = useState<FoodItemInput>({
    title: '',
    description: '',
    quantity: '1',
    expiryHours: 24,
    isVegetarian: false,
    isVegan: false,
    allergens: [],
    pickupInstructions: '',
    imageUrl: undefined,
  });

  const handleAddFood = () => {
    if (!newFood.title?.trim() || !newFood.description?.trim() || !newFood.quantity?.trim()) {
      Alert.alert('Error', 'Please fill in all required fields (title, description, and quantity)');
      return;
    }

    if (parseInt(newFood.quantity) <= 0) {
      Alert.alert('Error', 'Quantity must be greater than 0');
      return;
    }

    setFoodItems([...foodItems, { ...newFood }]);
    setNewFood({
      title: '',
      description: '',
      quantity: '1',
      expiryHours: 24,
      isVegetarian: false,
      isVegan: false,
      allergens: [],
      pickupInstructions: '',
      imageUrl: undefined,
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

  const handleVegetarianToggle = () => {
    setNewFood(prev => ({ 
      ...prev, 
      isVegetarian: !prev.isVegetarian,
      isVegan: prev.isVegetarian ? false : prev.isVegan // If turning off vegetarian, also turn off vegan
    }));
  };

  const handleVeganToggle = () => {
    setNewFood(prev => ({ 
      ...prev, 
      isVegan: !prev.isVegan,
      isVegetarian: prev.isVegan ? prev.isVegetarian : true // If turning on vegan, also turn on vegetarian
    }));
  };

  const handlePublish = async () => {
    if (foodItems.length === 0) {
      Alert.alert('Error', 'Please add at least one food item before publishing');
      return;
    }

    if (!state.user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setLoading(true);
    try {
      // Get restaurant profile for additional details
      const restaurantProfile = await ProfileService.getUserProfile(state.user.id);
      
      if (!restaurantProfile) {
        Alert.alert('Error', 'Restaurant profile not found. Please update your profile first.');
        return;
      }
      
      
      // Create all food items
      const promises = foodItems.map((item, index) => {
        return FoodService.createFoodItem(state.user!.id, restaurantProfile, item);
      });
      
      await Promise.all(promises);
      
      Alert.alert('Success', `${foodItems.length} food item(s) published successfully!`);
      setFoodItems([]);
      if (navigation) navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to publish food items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFood = (index: number) => {
    const updatedItems = foodItems.filter((_, i) => i !== index);
    setFoodItems(updatedItems);
  };

  const renderFoodItem = ({ item, index }: { item: FoodItemInput; index: number }) => (
    <View style={styles.foodItemCard}>
      <View style={styles.foodItemHeader}>
        <Text style={styles.foodItemName}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => handleRemoveFood(index)}
          style={styles.removeButton}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.foodItemDetails}>
        <Text style={styles.foodItemType}>
          {item.isVegan ? 'Vegan' : item.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
        </Text>
        <Text style={styles.foodItemQuantity}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.foodItemDescription}>{item.description}</Text>
      {item.allergens.length > 0 && (
        <View style={styles.allergensContainer}>
          <Text style={styles.allergensLabel}>Allergens: </Text>
          <Text style={styles.allergensText}>{item.allergens.join(', ')}</Text>
        </View>
      )}
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          Expires in: {item.expiryHours} hours
        </Text>
        {item.pickupInstructions && (
          <Text style={styles.timeText}>
            Pickup: {item.pickupInstructions}
          </Text>
        )}
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
            
            <Text style={styles.label}>Food Item Name *</Text>
            <TextInput
              placeholder="e.g., Grilled Chicken Sandwich"
              style={styles.input}
              value={newFood.title}
              onChangeText={title => setNewFood(prev => ({ ...prev, title }))}
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              placeholder="Describe the food item..."
              style={[styles.input, styles.textArea]}
              value={newFood.description}
              onChangeText={description => setNewFood(prev => ({ ...prev, description }))}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Food Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newFood.isVegan && styles.typeButtonSelected,
                ]}
                onPress={handleVeganToggle}
              >
                <Text style={[
                  styles.typeButtonText,
                  newFood.isVegan && styles.typeButtonTextSelected,
                ]}>Vegan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newFood.isVegetarian && !newFood.isVegan && styles.typeButtonSelected,
                ]}
                onPress={handleVegetarianToggle}
              >
                <Text style={[
                  styles.typeButtonText,
                  newFood.isVegetarian && !newFood.isVegan && styles.typeButtonTextSelected,
                ]}>Vegetarian</Text>
              </TouchableOpacity>
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

            <Text style={styles.label}>Expiry Hours *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Hours until food expires (e.g. 24)"
              value={String(newFood.expiryHours)}
              onChangeText={hours => setNewFood(prev => ({ ...prev, expiryHours: parseInt(hours) || 24 }))}
            />

            <Text style={styles.label}>Pickup Instructions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newFood.pickupInstructions}
              onChangeText={instructions => setNewFood(prev => ({ ...prev, pickupInstructions: instructions }))}
              placeholder="Special pickup instructions..."
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.textSecondary}
            />

            <Text style={styles.label}>Quantity *</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Number of servings available"
              value={String(newFood.quantity)}
              onChangeText={quantity => setNewFood(prev => ({ ...prev, quantity: quantity || '1' }))}
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
              title={loading ? "Publishing..." : `Publish ${foodItems.length} Item(s)`}
              onPress={handlePublish}
              disabled={loading}
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
    foodItemDescription: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      fontStyle: 'italic',
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
    textArea: {
      height: 80,
      textAlignVertical: 'top',
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
