import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordService } from '../services/password.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-password-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-generator.component.html',
  styleUrls: ['./password-generator.component.css'],
})
export class PasswordGeneratorComponent implements OnInit {
  passwordLength: number = 12;
  includeUppercase: boolean = true;
  includeLowercase: boolean = true;
  includeNumbers: boolean = true;
  includeSymbols: boolean = false;
  includePunctuation: boolean = false;

  generatedPassword: string = '';
  strengthPercentage: number = 0;
  strengthBarClass: string = '';
  strengthText: string = '';
  strengthTextClass: string = '';
  copied: boolean = false;
  error: string = '';
  currentYear = new Date().getFullYear();

  constructor(
    private passwordService: PasswordService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.generatePassword();
  }

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleOption(option: string) {
    switch (option) {
      case 'uppercase':
        this.includeUppercase = !this.includeUppercase;
        break;
      case 'lowercase':
        this.includeLowercase = !this.includeLowercase;
        break;
      case 'numbers':
        this.includeNumbers = !this.includeNumbers;
        break;
      case 'symbols':
        this.includeSymbols = !this.includeSymbols;
        break;
      case 'punctuation':
        this.includePunctuation = !this.includePunctuation;
        break;
    }
    this.generatePassword();
  }

  generatePassword() {
    this.error = '';

    if (
      !this.includeUppercase &&
      !this.includeLowercase &&
      !this.includeNumbers &&
      !this.includeSymbols &&
      !this.includePunctuation
    ) {
      this.error = 'Por favor, seleccione al menos un tipo de carácter';
      return;
    }

    this.generatedPassword = this.passwordService.generatePassword(
      this.passwordLength,
      this.includeUppercase,
      this.includeLowercase,
      this.includeNumbers,
      this.includeSymbols,
      this.includePunctuation
    );

    this.calculateStrength();
  }

  calculateStrength() {
    const strength = this.passwordService.calculateStrength(
      this.generatedPassword
    );
    this.strengthPercentage = strength.score;
    this.strengthBarClass = strength.barClass;
    this.strengthText = strength.text;
    this.strengthTextClass = strength.textClass;
  }

  async copyToClipboard() {
    if (!this.generatedPassword) return;

    try {
      await navigator.clipboard.writeText(this.generatedPassword);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (err) {
      console.error('Error al copiar texto: ', err);
    }
  }
}
