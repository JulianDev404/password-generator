import {
  Injectable,
  Renderer2,
  RendererFactory2,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private darkMode = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkMode.asObservable();
  private isBrowser: boolean;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initTheme();
  }

  private initTheme(): void {
    if (this.isBrowser) {
      try {
        // Verificar si hay una preferencia guardada
        const savedTheme = localStorage.getItem('theme');
        // Detectar si el usuario prefiere modo oscuro
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;

        const isDarkMode =
          savedTheme === 'dark' || (!savedTheme && prefersDark);
        this.setDarkMode(isDarkMode);
      } catch (error) {
        console.error('Error al inicializar el tema:', error);
        // En caso de error, establecer un valor predeterminado
        this.setDarkMode(false);
      }
    }
  }

  toggleTheme(): void {
    if (!this.isBrowser) return;

    const newDarkMode = !this.darkMode.value;
    this.setDarkMode(newDarkMode);
  }

  setDarkMode(isDark: boolean): void {
    if (!this.isBrowser) return;

    this.darkMode.next(isDark);

    try {
      if (isDark) {
        this.renderer.addClass(document.documentElement, 'dark');
        localStorage.setItem('theme', 'dark');
      } else {
        this.renderer.removeClass(document.documentElement, 'dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.error('Error al cambiar el tema:', error);
    }
  }

  isDarkMode(): boolean {
    return this.darkMode.value;
  }
}
