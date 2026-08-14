import { Component } from '@angular/core';
import { TopSummary } from '../../components/top-summary/top-summary';
import { SensorGrid } from '../../components/sensor-grid/sensor-grid';
import { SensorForm } from '../../components/sensor-form/sensor-form';
import { IncidentManagement } from '../../components/incident-management/incident-management';
import { AlertManagement } from '../../components/alert-management/alert-management';

@Component({
  selector: 'app-dashboard',
  imports: [TopSummary, SensorForm, SensorGrid, IncidentManagement, AlertManagement],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
