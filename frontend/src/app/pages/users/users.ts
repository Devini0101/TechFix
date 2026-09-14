import { Component } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-users',
  imports: [Sidebar],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {}
