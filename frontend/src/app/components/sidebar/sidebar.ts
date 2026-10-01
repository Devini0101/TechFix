import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
<<<<<<< Updated upstream
=======
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../theme.service';
>>>>>>> Stashed changes

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private authService = inject(AuthService);
<<<<<<< Updated upstream
=======
  themeService = inject(ThemeService);
  readonly role = this.authService.getRole();
>>>>>>> Stashed changes
  isCollapsed = false;

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }
}
