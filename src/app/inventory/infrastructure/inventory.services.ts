import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { InventoryItem } from '../domain/model/inventory-item';
import { StockMovement } from '../domain/model/stock-movement';
import { CurrentStock } from '../domain/model/current-stock';
import { InventoryReport } from '../domain/model/inventory-report';
import { environment } from '../../../environments/environment';

/** Raw stock-movement payload as returned by the backend (snake_case fields). */
interface StockMovementApiResource {
  id: number;
  inventory_item_id: number;
  quantity: number;
  reason: string;
  movement_type: string;
}

/** Raw current-stock payload as returned by the backend (snake_case fields). */
interface CurrentStockApiResource {
  inventory_item_id: number;
  current_quantity: number;
  unit: string;
  is_low_stock: boolean;
}

/** Raw inventory report payload as returned by the backend (snake_case fields). */
interface InventoryReportApiResource {
  generated_at: string;
  total_items: number;
  low_stock_items: number;
  total_inventory_value: number;
  summary: string;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private http = inject(HttpClient);

  private readonly url = `${environment.bakeryManagerProviderApiBaseUrl}${environment.inventoryProviderItemsEndpointPath}`;
  private readonly reportUrl = `${environment.bakeryManagerProviderApiBaseUrl}${environment.inventoryProviderReportsEndpointPath}`;

  getAllItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.url);
  }

  getItemById(id: number): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.url}/${id}`);
  }

  createItem(item: Omit<InventoryItem, 'id'>): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.url, item);
  }

  updateItem(id: number, item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.url}/${id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  /** Registers a stock movement (ENTRY, EXIT or ADJUSTMENT) for an item. */
  addStockMovement(id: number, type: string, quantity: number, reason: string): Observable<StockMovement> {
    return this.http
      .post<StockMovementApiResource>(`${this.url}/${id}/movements`, { type, quantity, reason })
      .pipe(map((resource) => this.toStockMovement(resource)));
  }

  /** Retrieves the current stock level for an item. */
  getCurrentStock(id: number): Observable<CurrentStock> {
    return this.http
      .get<CurrentStockApiResource>(`${this.url}/${id}/stock`)
      .pipe(
        map((resource) => ({
          inventoryItemId: resource.inventory_item_id,
          currentQuantity: resource.current_quantity,
          unit: resource.unit,
          isLowStock: resource.is_low_stock,
        })),
      );
  }

  /** Retrieves the movement history for an item. */
  getMovementHistory(id: number): Observable<StockMovement[]> {
    return this.http
      .get<StockMovementApiResource[]>(`${this.url}/${id}/movements`)
      .pipe(map((resources) => resources.map((resource) => this.toStockMovement(resource))));
  }

  /** Retrieves the inventory-wide report, including low-stock detection. */
  getInventoryReport(): Observable<InventoryReport> {
    return this.http.get<InventoryReportApiResource>(this.reportUrl).pipe(
      map((resource) => ({
        generatedAt: resource.generated_at,
        totalItems: resource.total_items,
        lowStockItems: resource.low_stock_items,
        totalInventoryValue: resource.total_inventory_value,
        summary: resource.summary,
      })),
    );
  }

  private toStockMovement(resource: StockMovementApiResource): StockMovement {
    return {
      id: resource.id,
      inventoryItemId: resource.inventory_item_id,
      quantity: resource.quantity,
      reason: resource.reason,
      movementType: resource.movement_type,
    };
  }
}
