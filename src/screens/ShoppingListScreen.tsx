import React, { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { FAB, Searchbar, Chip, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/store';
import { ShoppingItemCard } from '@/components/ShoppingItemCard';
import { togglePriceOptionStar } from '@/store/slices/shoppingListSlice';
import { theme } from '@/constants/theme';
import { ShoppingItem } from '@/types';

const ShoppingListScreen = () => {
  const navigation = useNavigation();
  const paperTheme = useTheme();
  const dispatch = useAppDispatch();
  const { items: shoppingItems, categories } = useAppSelector((state) => state.shoppingList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  const handleAddItem = () => {
    navigation.navigate('ShoppingItemDetail', { itemId: 'new' });
  };

  const handleStarPress = useCallback(
    (itemId: string, priceOptionId: string) => {
      dispatch(togglePriceOptionStar({ itemId, priceOptionId }));
    },
    [dispatch]
  );

  const filteredItems = shoppingItems.filter((item) => {
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;

    const matchesStarred = showStarredOnly
      ? item.priceOptions.some((po) => po.isStarred)
      : true;

    return matchesSearch && matchesCategory && matchesStarred;
  });

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <ShoppingItemCard
      item={item}
      onStarPress={handleStarPress}
      showStarredOnly={showStarredOnly}
    />
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search items"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={!selectedCategory}
            onPress={() => setSelectedCategory(null)}
            style={styles.chip}
          >
            All
          </Chip>
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.chip}
            >
              {category}
            </Chip>
          ))}
          <Chip
            selected={showStarredOnly}
            onPress={() => setShowStarredOnly(!showStarredOnly)}
            style={styles.chip}
            icon="star"
          >
            Starred
          </Chip>
        </ScrollView>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBar: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  filterContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  chip: {
    marginRight: theme.spacing.sm,
  },
  list: {
    paddingBottom: theme.spacing.xl,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
  },
});

export default ShoppingListScreen; 