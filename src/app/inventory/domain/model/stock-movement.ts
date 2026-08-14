/**
 * Represents a stock movement (entry, exit or adjustment) for an inventory item.
 */
export interface StockMovement {
  id: number;
  inventoryItemId: number;
  quantity: number;
  reason: string;
  movementType: string;
}
