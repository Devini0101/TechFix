import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDark = true;

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
      this.setLightMode();
    } else {
      this.setDarkMode();
    }
  }

  toggleTheme(): void {
    if (this.isDark) {
      this.setLightMode();
    } else {
      this.setDarkMode();
    }
  }

  setDarkMode(): void {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    this.isDark = true;
  }

  setLightMode(): void {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    this.isDark = false;
  }

  isDarkMode(): boolean {
    return this.isDark;
  }
}