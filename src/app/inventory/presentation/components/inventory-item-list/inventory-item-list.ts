import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { InventoryItem } from '../../../domain/model/inventory-item';

@Component({
  selector: 'app-inventory-item-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './inventory-item-list.html',
  styleUrl: './inventory-item-list.css',
})
export class InventoryItemList {
  @Input() dataSource: InventoryItem[] = [];

  @Output() adjustStock = new EventEmitter<InventoryItem>();
  @Output() delete = new EventEmitter<InventoryItem>();

  displayedColumns: string[] = ['name', 'quantity', 'unit', 'status', 'actions'];

  isLowStock(item: InventoryItem): boolean {
    return item.quantity <= item.minStock;
  }
}
