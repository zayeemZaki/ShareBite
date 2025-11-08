import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Header } from '../../components/common/Header';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FoodService, FoodItemRequest } from '../../services/FoodService';
import { ProfileService } from '../../services/ProfileService';
import { useCustomAlert } from '../../hooks/useCustomAlert';

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
  const { showSuccessAlert, showErrorAlert, showConfirmAlert, AlertComponent } = useCustomAlert();
  const [foodItems, setFoodItems] = useState<FoodItemInput[]>([]);
  const [modalVisible, setModalVisible] = useState(true); // Open modal by default
  const [loading, setLoading] = useState(false);
  const [addedItemTitle, setAddedItemTitle] = useState('');
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
      showErrorAlert(
        'Missing Information',
        'Please fill in all required fields (title, description, and quantity)'
      );
      return;
    }

    if (parseInt(newFood.quantity) <= 0) {
      showErrorAlert(
        'Invalid Quantity',
        'Quantity must be greater than 0'
      );
      return;
    }

    if (newFood.expiryHours < 1) {
      showErrorAlert(
        'Invalid Expiry',
        'Expiry hours must be at least 1 hour'
      );
      return;
    }

    setAddedItemTitle(newFood.title);
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
    
    showSuccessAlert(
      'Item Added Successfully!',
      `"${newFood.title}" has been added. You can add more items or review & publish.`
    );
  };

  const handleModalClose = () => {
    if (foodItems.length === 0) {
      // If no items added, go back to dashboard
      if (navigation) {
        navigation.goBack();
      }
    } else {
      // If items exist, just close modal to show the list
      setModalVisible(false);
    }
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
      showErrorAlert(
        'No Items',
        'Please add at least one food item before publishing'
      );
      return;
    }

    if (!state.user) {
      showErrorAlert(
        'Error',
        'User not authenticated'
      );
      return;
    }

    const itemsSummary = foodItems.map(item => `• ${item.title} (${item.quantity})`).join('\n');
    showConfirmAlert(
      'Publish Food Items?',
      `You are about to publish ${foodItems.length} item(s):\n\n${itemsSummary}\n\nThese items will be visible to nearby shelters.`,
      () => confirmPublish(),
      'PUBLISH',
      'CANCEL'
    );
  };

  const confirmPublish = async () => {
    setLoading(true);
    try {
      const restaurantProfile = await ProfileService.getUserProfile(state.user!.id);
      
      if (!restaurantProfile) {
        showErrorAlert(
          'Profile Required',
          'Please complete your restaurant profile first.'
        );
        setLoading(false);
        return;
      }
      
      const promises = foodItems.map((item) => {
        return FoodService.createFoodItem(state.user!.id, restaurantProfile, item);
      });
      
      await Promise.all(promises);
      
      setLoading(false);
      setFoodItems([]);
      if (navigation) {
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      showErrorAlert(
        'Publishing Failed',
        'Unable to publish food items. Please check your connection and try again.'
      );
    }
  };

  const handleRemoveFood = (index: number) => {
    const updatedItems = foodItems.filter((_, i) => i !== index);
    setFoodItems(updatedItems);
  };

  const renderFoodItem = ({ item, index }: { item: FoodItemInput; index: number }) => (
    <View style={styles.modernFoodItemCard}>
      <View style={styles.foodItemHeader}>
        <Text style={styles.modernFoodItemName}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => handleRemoveFood(index)}
          style={styles.modernRemoveButton}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.modernFoodDescription} numberOfLines={2}>{item.description}</Text>
      
      <View style={styles.modernMetaRow}>
        <View style={styles.modernMetaItem}>
          <Text style={styles.modernMetaLabel}>Qty:</Text>
          <Text style={styles.modernMetaText}>{item.quantity}</Text>
        </View>
        <View style={styles.modernMetaDivider} />
        <View style={styles.modernMetaItem}>
          <Text style={styles.modernMetaLabel}>Expiry:</Text>
          <Text style={styles.modernMetaText}>{item.expiryHours}h</Text>
        </View>
        {(item.isVegan || item.isVegetarian) && (
          <>
            <View style={styles.modernMetaDivider} />
            <View style={styles.modernMetaItem}>
              <View style={styles.modernTypeBadge}>
                <Text style={styles.modernTypeBadgeText}>
                  {item.isVegan ? 'Vegan' : 'Vegetarian'}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
      
      {item.allergens.length > 0 && (
        <View style={styles.modernAllergenBadges}>
          <Text style={styles.allergenTitle}>Allergens:</Text>
          {item.allergens.map(allergen => (
            <View key={allergen} style={styles.modernAllergenBadge}>
              <Text style={styles.modernAllergenText}>{allergen}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderAddFoodModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent
    >
      <SafeAreaView style={styles.fullScreenModal}>
        <StatusBar backgroundColor={colors.background} barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Food Item</Text>
          <Text style={styles.modalSubtitle}>Share your delicious food with those in need</Text>
        </View>
        
        <ScrollView 
          style={styles.modalScrollContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.modernLabel}>Item Name *</Text>
              <TextInput
                placeholder="e.g., Grilled Chicken Sandwich"
                placeholderTextColor={colors.textSecondary}
                style={styles.modernInput}
                value={newFood.title}
                onChangeText={title => setNewFood(prev => ({ ...prev, title }))}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.modernLabel}>Description *</Text>
              <TextInput
                placeholder="Tell us about this delicious food..."
                placeholderTextColor={colors.textSecondary}
                style={[styles.modernInput, styles.modernTextArea]}
                value={newFood.description}
                onChangeText={description => setNewFood(prev => ({ ...prev, description }))}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Quantity and Expiry Row */}
            <View style={styles.twoColumnRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.sm }]}>
                <Text style={styles.modernLabel}>Quantity *</Text>
                <TextInput
                  style={styles.modernInput}
                  keyboardType="numeric"
                  placeholder="Servings"
                  placeholderTextColor={colors.textSecondary}
                  value={String(newFood.quantity)}
                  onChangeText={quantity => setNewFood(prev => ({ ...prev, quantity: quantity || '1' }))}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: spacing.sm }]}>
                <Text style={styles.modernLabel}>Expiry (hrs) *</Text>
                <TextInput
                  style={styles.modernInput}
                  keyboardType="numeric"
                  placeholder="24"
                  placeholderTextColor={colors.textSecondary}
                  value={String(newFood.expiryHours)}
                  onChangeText={hours => setNewFood(prev => ({ ...prev, expiryHours: parseInt(hours) || 24 }))}
                />
              </View>
            </View>

            {/* Food Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.modernLabel}>Food Type (Optional)</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity
                  style={[styles.modernChip, newFood.isVegan && styles.modernChipActive]}
                  onPress={handleVeganToggle}
                >
                  <Text style={[styles.modernChipText, newFood.isVegan && styles.modernChipTextActive]}>
                    Vegan
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modernChip, newFood.isVegetarian && !newFood.isVegan && styles.modernChipActive]}
                  onPress={handleVegetarianToggle}
                >
                  <Text style={[styles.modernChipText, newFood.isVegetarian && !newFood.isVegan && styles.modernChipTextActive]}>
                    Vegetarian
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Allergens */}
            <View style={styles.inputGroup}>
              <Text style={styles.modernLabel}>Allergens (Optional)</Text>
              <View style={styles.chipRow}>
                {(['Gluten', 'Nuts', 'Dairy', 'Soy', 'Eggs', 'Fish'] as AllergenType[]).map(allergen => (
                  <TouchableOpacity
                    key={allergen}
                    style={[styles.modernChip, styles.smallChip, newFood.allergens.includes(allergen) && styles.allergenChipActive]}
                    onPress={() => handleToggleAllergen(allergen)}
                  >
                    <Text style={[styles.modernChipText, styles.smallChipText, newFood.allergens.includes(allergen) && styles.allergenChipTextActive]}>
                      {allergen}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Pickup Instructions */}
            <View style={styles.inputGroup}>
              <Text style={styles.modernLabel}>Pickup Instructions (Optional)</Text>
              <TextInput
                style={[styles.modernInput, styles.modernTextArea]}
                value={newFood.pickupInstructions}
                onChangeText={instructions => setNewFood(prev => ({ ...prev, pickupInstructions: instructions }))}
                placeholder="e.g., Ring doorbell, ask for manager..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={2}
              />
            </View>

          </ScrollView>
        
        {/* Fixed Bottom Buttons */}
        <View style={styles.fixedBottomButtons}>
          <PrimaryButton
            title={foodItems.length > 0 ? "Done" : "Cancel"}
            onPress={handleModalClose}
            variant="secondary"
            size="medium"
            style={{ flex: 1 }}
          />
          <PrimaryButton
            title="Add Item"
            onPress={handleAddFood}
            variant="primary"
            size="medium"
            style={{ flex: 1 }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Share Food"
        showLogo={true}
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
            <View style={styles.modernEmptyState}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyIconText}>+</Text>
              </View>
              <Text style={styles.modernEmptyText}>No Items Added Yet</Text>
              <Text style={styles.modernEmptySubtext}>
                Tap the button below to add your first food item
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="+ Add Food Item"
            onPress={() => setModalVisible(true)}
            variant="secondary"
            size="medium"
            fullWidth
          />
          
          {foodItems.length > 0 && (
            <PrimaryButton
              title={loading ? "Publishing..." : `Publish ${foodItems.length} Item${foodItems.length > 1 ? 's' : ''}`}
              onPress={handlePublish}
              variant="primary"
              size="medium"
              fullWidth
              loading={loading}
              disabled={loading}
            />
          )}

          {loading && (
            <View style={styles.publishingLoadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.publishingLoadingText}>Publishing your items...</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {renderAddFoodModal()}
      {AlertComponent}
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
      padding: spacing.sm,
    },
    section: {
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: typography.sizes.h2,
      fontWeight: typography.fontWeights?.semibold || '600',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    sectionSubtitle: {
      fontSize: typography.sizes.body,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      lineHeight: 20,
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
      backgroundColor: colors.error,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeButtonText: {
      color: colors.surface,
      fontSize: typography.sizes.bodyLarge,
      fontWeight: typography.fontWeights?.semibold || '600',
    },
    foodItemDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    foodItemType: {
      fontSize: typography.sizes.body,
      color: colors.success,
      fontWeight: typography.fontWeights?.medium || '500',
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
      fontSize: typography.sizes.body,
      color: colors.warning,
      fontWeight: typography.fontWeights?.medium || '500',
    },
    allergensText: {
      fontSize: typography.sizes.body,
      color: colors.warning,
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
      gap: spacing.xs,
      paddingBottom: spacing.md,
    },
    fullScreenModal: {
      flex: 1,
      backgroundColor: colors.background,
      width: '100%',
      height: '100%',
    },
    modalScrollContent: {
      flex: 1,
    },
    scrollContentContainer: {
      padding: spacing.sm,
      paddingBottom: spacing.xl,
    },
    modalTitle: {
      fontSize: typography.sizes.h2,
      fontWeight: typography.fontWeights?.semibold || '600',
      color: colors.textPrimary,
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
      fontSize: typography.sizes.body,
      backgroundColor: colors.background,
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      height: 48,
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
      backgroundColor: colors.background,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.xs,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      height: 40,
      justifyContent: 'center',
    },
    typeButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeButtonText: {
      fontSize: typography.sizes.body,
      color: colors.textPrimary,
      fontWeight: typography.fontWeights?.medium || '500',
    },
    typeButtonTextSelected: {
      color: '#FFFFFF',
      fontWeight: typography.fontWeights?.medium || '500',
    },
    allergenContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    allergenButton: {
      backgroundColor: colors.background,
      paddingVertical: 6,
      paddingHorizontal: spacing.xs,
      borderRadius: borderRadius.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    allergenButtonSelected: {
      backgroundColor: colors.warning,
      borderColor: colors.warning,
    },
    allergenButtonText: {
      fontSize: typography.sizes.caption,
      color: colors.textPrimary,
      fontWeight: typography.fontWeights?.medium || '500',
    },
    allergenButtonTextSelected: {
      color: '#FFFFFF',
      fontWeight: typography.fontWeights?.medium || '500',
    },
    dateTimeRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    dateButton: {
      flex: 1,
      backgroundColor: colors.background,
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
      backgroundColor: colors.background,
      padding: spacing.sm,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    halalButtonSelected: {
      backgroundColor: colors.successLight,
      borderColor: colors.success,
    },
    halalButtonText: {
      fontSize: typography.sizes.body,
      color: colors.textPrimary,
      marginLeft: spacing.xs,
    },
    halalButtonTextSelected: {
      color: colors.success,
      fontWeight: typography.fontWeights?.medium || '500',
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
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    checkboxText: {
      fontSize: typography.sizes.regular,
      color: '#fff',
    },
    // Modern Modal Styles
    modalHeader: {
      backgroundColor: colors.background,
      padding: spacing.sm,
      paddingTop: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalSubtitle: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: spacing.sm,
    },
    inputGroup: {
      marginBottom: spacing.sm,
    },
    modernLabel: {
      fontSize: typography.sizes.body,
      fontWeight: typography.fontWeights?.medium || '500',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    modernInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: borderRadius.sm,
      padding: spacing.sm,
      fontSize: typography.sizes.bodyLarge,
      backgroundColor: colors.background,
      color: colors.textPrimary,
      height: 48,
    },
    modernTextArea: {
      height: 80,
      textAlignVertical: 'top',
      paddingTop: spacing.sm,
    },
    twoColumnRow: {
      flexDirection: 'row',
      marginBottom: spacing.sm,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    modernChip: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.xs,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modernChipActive: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    modernChipText: {
      fontSize: typography.sizes.body,
      color: colors.textSecondary,
      fontWeight: typography.fontWeights?.medium || '500',
    },
    modernChipTextActive: {
      color: '#FFFFFF',
    },
    smallChip: {
      paddingHorizontal: spacing.xs,
      paddingVertical: 4,
    },
    smallChipText: {
      fontSize: typography.sizes.caption,
    },
    allergenChipActive: {
      backgroundColor: colors.warning,
      borderColor: colors.warning,
    },
    allergenChipTextActive: {
      color: '#FFFFFF',
    },
    fixedBottomButtons: {
      flexDirection: 'row',
      gap: spacing.sm,
      padding: spacing.sm,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      ...shadows.sm,
    },
    compactPrimaryButton: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: borderRadius.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
    },
    compactPrimaryButtonText: {
      fontSize: typography.sizes.bodyLarge,
      fontWeight: typography.fontWeights?.medium || '500',
      color: '#FFFFFF',
    },
    compactSecondaryButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: borderRadius.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.primary,
      height: 48,
    },
    compactSecondaryButtonText: {
      fontSize: typography.sizes.bodyLarge,
      fontWeight: typography.fontWeights?.medium || '500',
      color: colors.primary,
    },
    // Modern Food Item Card Styles
    modernFoodItemCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      marginBottom: spacing.sm,
      ...shadows.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modernFoodItemName: {
      fontSize: typography.sizes.h3,
      fontWeight: typography.fontWeights?.medium || '500',
      color: colors.textPrimary,
      flex: 1,
      marginRight: spacing.xs,
    },
    modernRemoveButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.error,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modernFoodDescription: {
      fontSize: typography.sizes.body,
      color: colors.textSecondary,
      lineHeight: 20,
      marginTop: spacing.xs,
      marginBottom: spacing.sm,
    },
    modernMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    modernMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    modernMetaLabel: {
      fontSize: typography.sizes.caption,
      color: colors.textSecondary,
      fontWeight: typography.fontWeights?.regular || '400',
    },
    modernMetaText: {
      fontSize: typography.sizes.caption,
      color: colors.textPrimary,
      fontWeight: typography.fontWeights?.medium || '500',
    },
    modernMetaDivider: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: colors.border,
      marginHorizontal: spacing.xs,
    },
    modernTypeBadge: {
      backgroundColor: colors.success,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.xs,
    },
    modernTypeBadgeText: {
      fontSize: typography.sizes.caption,
      color: '#FFFFFF',
      fontWeight: typography.fontWeights?.medium || '500',
    },
    modernAllergenBadges: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      marginTop: spacing.xs,
      alignItems: 'center',
    },
    allergenTitle: {
      fontSize: typography.sizes.caption,
      color: colors.textSecondary,
      fontWeight: typography.fontWeights?.regular || '400',
      marginRight: 4,
    },
    modernAllergenBadge: {
      backgroundColor: colors.errorLight,
      paddingHorizontal: spacing.xs,
      paddingVertical: 2,
      borderRadius: borderRadius.xs,
      borderWidth: 1,
      borderColor: colors.error,
    },
    modernAllergenText: {
      fontSize: typography.sizes.caption,
      color: colors.error,
      fontWeight: typography.fontWeights?.medium || '500',
    },
    // Modern Empty State
    modernEmptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.md,
    },
    emptyIconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    emptyIconText: {
      fontSize: 48,
      fontWeight: typography.fontWeights?.semibold || '600',
      color: colors.textSecondary,
    },
    modernEmptyText: {
      fontSize: typography.sizes.h3,
      fontWeight: typography.fontWeights?.semibold || '600',
      color: colors.textPrimary,
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    modernEmptySubtext: {
      fontSize: typography.sizes.body,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    // Custom Modal Styles
    customModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    customModalContent: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
      ...shadows,
    },
    customModalTitle: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.fontWeightBold,
      color: colors.textPrimary,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    customModalMessage: {
      fontSize: typography.sizes.regular,
      color: colors.textSecondary,
      marginBottom: spacing.xl,
      textAlign: 'center',
      lineHeight: 22,
    },
    customModalButtons: {
      flexDirection: 'row',
      gap: spacing.md,
      width: '100%',
    },
    successIconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.successLight,
      borderWidth: 2,
      borderColor: colors.success,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    successIconText: {
      fontSize: 32,
      fontWeight: typography.fontWeights?.semibold || '600',
      color: colors.success,
    },
    errorIconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.errorLight,
      borderWidth: 2,
      borderColor: colors.error,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    errorIconText: {
      fontSize: 32,
      fontWeight: typography.fontWeights?.semibold || '600',
      color: colors.error,
    },
    publishingLoadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      marginTop: spacing.sm,
    },
    publishingLoadingText: {
      marginLeft: spacing.sm,
      fontSize: typography.sizes.body,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
  });
