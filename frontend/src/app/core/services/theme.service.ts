import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light' | 'system';

const STORAGE_KEY = 'techfix-theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  readonly theme = signal<Theme>(this.loadTheme());

  constructor() {
    this.apply();
    // quando o tema é "sistema", acompanha a mudança do SO em tempo real
    this.mediaQuery.addEventListener('change', () => this.apply());
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // sem localStorage (aba anônima, etc.) o tema vale só para a sessão
    }
    this.apply();
  }

  private loadTheme(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light' || saved === 'system') {
        return saved;
      }
    } catch {}
    return 'dark';
  }

  // adiciona a classe "dark" no <html>, usada pelo variant dark: do Tailwind (ver styles.css)
  private apply(): void {
    const theme = this.theme();
    const isDark = theme === 'dark' || (theme === 'system' && this.mediaQuery.matches);
    const root = this.document.documentElement;
    root.classList.toggle('dark', isDark);
    root.style.colorScheme = isDark ? 'dark' : 'light';
  }
}
