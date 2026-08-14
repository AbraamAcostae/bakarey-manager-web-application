/**
 * Represents the current stock level of an inventory item.
 */
export interface CurrentStock {
  inventoryItemId: number;
  currentQuantity: number;
  unit: string;
  isLowStock: boolean;
}
