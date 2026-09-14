import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-budget',
  imports: [Sidebar],
  templateUrl: './budget.html',
  styleUrl: './budget.css',
})
export class Budget {}
