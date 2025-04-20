import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, IconButton, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/store';
import { addShoppingItem, updateShoppingItem, deleteShoppingItem } from '@/store/slices/shoppingListSlice';
import { theme } from '@/constants/theme';
import { ShoppingItem, PriceOption } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const ShoppingItemDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const paperTheme = useTheme();
  const dispatch = useAppDispatch();
  const { itemId } = route.params as { itemId: string };
  const existingItem = useAppSelector((state) =>
    state.shoppingList.items.find((item) => item.id === itemId)
  );

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [priceOptions, setPriceOptions] = useState<PriceOption[]>([]);

  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name);
      setCategory(existingItem.category);
      setNotes(existingItem.notes);
      setPriceOptions(existingItem.priceOptions);
    }
  }, [existingItem]);

  const handleAddPriceOption = () => {
    const newPriceOption: PriceOption = {
      id: uuidv4(),
      store: '',
      price: '',
      isStarred: false,
    };
    setPriceOptions([...priceOptions, newPriceOption]);
  };

  const handleUpdatePriceOption = (index: number, field: keyof PriceOption, value: string | boolean) => {
    const updatedOptions = [...priceOptions];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value,
    };
    setPriceOptions(updatedOptions);
  };

  const handleRemovePriceOption = (index: number) => {
    setPriceOptions(priceOptions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      // Show error message
      return;
    }

    const shoppingItem: ShoppingItem = {
      id: itemId === 'new' ? uuidv4() : itemId,
      name: name.trim(),
      category: category.trim(),
      notes: notes.trim(),
      priceOptions: priceOptions.filter((po) => po.store.trim() && po.price.trim()),
    };

    if (itemId === 'new') {
      dispatch(addShoppingItem(shoppingItem));
    } else {
      dispatch(updateShoppingItem(shoppingItem));
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    if (itemId !== 'new') {
      dispatch(deleteShoppingItem(itemId));
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          label="Item Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          label="Category"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />

        <TextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <View style={styles.priceOptionsContainer}>
          <Button
            mode="outlined"
            onPress={handleAddPriceOption}
            style={styles.addButton}
          >
            Add Price Option
          </Button>

          {priceOptions.map((option, index) => (
            <View key={option.id} style={styles.priceOption}>
              <TextInput
                label="Store"
                value={option.store}
                onChangeText={(value) => handleUpdatePriceOption(index, 'store', value)}
                style={[styles.input, styles.priceInput]}
              />
              <TextInput
                label="Price"
                value={option.price}
                onChangeText={(value) => handleUpdatePriceOption(index, 'price', value)}
                keyboardType="decimal-pad"
                style={[styles.input, styles.priceInput]}
              />
              <IconButton
                icon="delete"
                size={24}
                onPress={() => handleRemovePriceOption(index)}
              />
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveButton}
          >
            Save
          </Button>
          {itemId !== 'new' && (
            <Button
              mode="outlined"
              onPress={handleDelete}
              style={styles.deleteButton}
            >
              Delete
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  input: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  priceOptionsContainer: {
    marginBottom: theme.spacing.md,
  },
  addButton: {
    marginBottom: theme.spacing.md,
  },
  priceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  priceInput: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  saveButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  deleteButton: {
    flex: 1,
  },
});

export default ShoppingItemDetailScreen; 