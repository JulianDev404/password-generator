import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  // Conjuntos de caracteres
  private readonly uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private readonly lowercase = 'abcdefghijklmnopqrstuvwxyz';
  private readonly numbers = '0123456789';
  private readonly symbols = '!@#$%^&*()-_=+[]{}|;:<>/?~';
  private readonly punctuation = ',.;:\'"`';

  constructor() {}

  /**
   * Genera una contraseña aleatoria según las opciones dadas
   */
  generatePassword(
    length: number,
    includeUppercase: boolean,
    includeLowercase: boolean,
    includeNumbers: boolean,
    includeSymbols: boolean,
    includePunctuation: boolean
  ): string {
    let charset = '';

    // Construir el conjunto de caracteres basado en las opciones
    if (includeUppercase) charset += this.uppercase;
    if (includeLowercase) charset += this.lowercase;
    if (includeNumbers) charset += this.numbers;
    if (includeSymbols) charset += this.symbols;
    if (includePunctuation) charset += this.punctuation;

    if (charset.length === 0) {
      return '';
    }

    // Generar contraseña
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  /**
   * Calcula la fortaleza de una contraseña
   */
  calculateStrength(password: string): any {
    if (!password)
      return {
        score: 0,
        text: 'No evaluada',
        barClass: '',
        textClass: '',
      };

    // Factores que afectan la seguridad
    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);

    // Calcular puntuación (0-100)
    let score = 0;

    // Longitud contribuye hasta 50 puntos
    score += Math.min(50, length * 2.5);

    // Variedad de caracteres contribuye hasta 50 puntos
    if (hasUpper) score += 10;
    if (hasLower) score += 10;
    if (hasNumbers) score += 10;
    if (hasSymbols) score += 20;

    // Determinando la categoría basada en la puntuación
    let result = {
      score: score,
      text: '',
      barClass: '',
      textClass: '',
    };

    if (score < 30) {
      result.text = 'Muy débil';
      result.barClass = 'bg-red-500';
      result.textClass = 'text-red-500';
    } else if (score < 60) {
      result.text = 'Media';
      result.barClass = 'bg-yellow-500';
      result.textClass = 'text-yellow-500';
    } else if (score < 80) {
      result.text = 'Fuerte';
      result.barClass = 'bg-green-400';
      result.textClass = 'text-green-500';
    } else {
      result.text = 'Muy fuerte';
      result.barClass = 'bg-green-600';
      result.textClass = 'text-green-600';
    }

    return result;
  }
}
