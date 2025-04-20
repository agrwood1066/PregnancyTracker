import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShoppingItem, PriceOption } from '@/types';

interface ShoppingListState {
  items: ShoppingItem[];
  categories: string[];
}

const initialState: ShoppingListState = {
  items: [],
  categories: [],
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    addShoppingItem: (state, action: PayloadAction<ShoppingItem>) => {
      state.items.push(action.payload);
      // Update categories if new category is added
      if (action.payload.category && !state.categories.includes(action.payload.category)) {
        state.categories.push(action.payload.category);
      }
    },
    updateShoppingItem: (state, action: PayloadAction<ShoppingItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        // Update categories if category changed
        const oldCategory = state.items[index].category;
        const newCategory = action.payload.category;
        if (newCategory && newCategory !== oldCategory) {
          if (!state.categories.includes(newCategory)) {
            state.categories.push(newCategory);
          }
          // Remove old category if no items use it anymore
          if (oldCategory && !state.items.some((item) => item.category === oldCategory)) {
            state.categories = state.categories.filter((cat) => cat !== oldCategory);
          }
        }
        state.items[index] = action.payload;
      }
    },
    deleteShoppingItem: (state, action: PayloadAction<string>) => {
      const itemToDelete = state.items.find((item) => item.id === action.payload);
      if (itemToDelete) {
        // Check if we need to remove the category
        const category = itemToDelete.category;
        if (category && !state.items.some((item) => item.category === category)) {
          state.categories = state.categories.filter((cat) => cat !== category);
        }
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
    },
    togglePriceOptionStar: (
      state,
      action: PayloadAction<{ itemId: string; priceOptionId: string }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.itemId);
      if (item) {
        // First, unstar all price options for this item
        item.priceOptions.forEach((po) => {
          po.isStarred = false;
        });
        // Then star the selected price option
        const priceOption = item.priceOptions.find(
          (po) => po.id === action.payload.priceOptionId
        );
        if (priceOption) {
          priceOption.isStarred = true;
        }
      }
    },
    addPriceOption: (
      state,
      action: PayloadAction<{ itemId: string; priceOption: PriceOption }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.itemId);
      if (item) {
        item.priceOptions.push(action.payload.priceOption);
      }
    },
    updatePriceOption: (
      state,
      action: PayloadAction<{
        itemId: string;
        priceOptionId: string;
        updates: Partial<PriceOption>;
      }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.itemId);
      if (item) {
        const priceOption = item.priceOptions.find(
          (po) => po.id === action.payload.priceOptionId
        );
        if (priceOption) {
          Object.assign(priceOption, action.payload.updates);
        }
      }
    },
    removePriceOption: (
      state,
      action: PayloadAction<{ itemId: string; priceOptionId: string }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.itemId);
      if (item) {
        item.priceOptions = item.priceOptions.filter(
          (po) => po.id !== action.payload.priceOptionId
        );
      }
    },
  },
});

export const {
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  togglePriceOptionStar,
  addPriceOption,
  updatePriceOption,
  removePriceOption,
} = shoppingListSlice.actions;

export default shoppingListSlice.reducer; 