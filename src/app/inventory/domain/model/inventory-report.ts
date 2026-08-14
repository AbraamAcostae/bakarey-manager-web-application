/**
 * Represents the inventory-wide report, including low-stock detection.
 */
export interface InventoryReport {
  generatedAt: string;
  totalItems: number;
  lowStockItems: number;
  totalInventoryValue: number;
  summary: string;
}
