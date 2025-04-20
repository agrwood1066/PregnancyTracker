import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ShoppingItem } from '@/types';
import { theme } from '@/constants/theme';

interface ShoppingItemCardProps {
  item: ShoppingItem;
  onStarPress?: (itemId: string, priceOptionId: string) => void;
  showStarredOnly?: boolean;
}

export const ShoppingItemCard: React.FC<ShoppingItemCardProps> = ({
  item,
  onStarPress,
  showStarredOnly = false,
}) => {
  const navigation = useNavigation();
  const paperTheme = useTheme();

  const starredPriceOption = item.priceOptions.find((po) => po.isStarred);
  const lowestPrice = Math.min(...item.priceOptions.map((po) => po.price));

  const handlePress = () => {
    navigation.navigate('ShoppingItemDetail', { itemId: item.id });
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
          {starredPriceOption && (
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {starredPriceOption.currency} {starredPriceOption.price.toFixed(2)}
              </Text>
              <Text style={styles.store}>{starredPriceOption.store}</Text>
            </View>
          )}
        </View>

        {item.notes && <Text style={styles.notes}>{item.notes}</Text>}

        <View style={styles.priceOptions}>
          {item.priceOptions.map((priceOption) => (
            <View key={priceOption.id} style={styles.priceOption}>
              <View style={styles.priceOptionInfo}>
                <Text style={styles.storeName}>{priceOption.store}</Text>
                <Text style={styles.priceValue}>
                  {priceOption.currency} {priceOption.price.toFixed(2)}
                </Text>
              </View>
              {onStarPress && (
                <IconButton
                  icon={priceOption.isStarred ? 'star' : 'star-outline'}
                  size={20}
                  onPress={() => onStarPress(item.id, priceOption.id)}
                  iconColor={priceOption.isStarred ? theme.colors.accent : theme.colors.gray[400]}
                />
              )}
            </View>
          ))}
        </View>

        {!starredPriceOption && showStarredOnly && (
          <Text style={styles.noStarredPrice}>
            Lowest price: {lowestPrice.toFixed(2)} - Tap to set preferred price
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.primary,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  category: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.secondary,
    color: theme.colors.gray[600],
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.primary,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  store: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.secondary,
    color: theme.colors.gray[600],
  },
  notes: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.secondary,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing.sm,
  },
  priceOptions: {
    marginTop: theme.spacing.sm,
  },
  priceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
  },
  priceOptionInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.secondary,
    color: theme.colors.gray[700],
  },
  priceValue: {
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.primary,
    color: theme.colors.text,
  },
  noStarredPrice: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.secondary,
    color: theme.colors.gray[600],
    fontStyle: 'italic',
    marginTop: theme.spacing.sm,
  },
}); 