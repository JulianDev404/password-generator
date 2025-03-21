import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./password-generator/password-generator.component').then(
        (m) => m.PasswordGeneratorComponent
      ),
  },
  {
    path: 'password-generator',
    loadComponent: () =>
      import('./password-generator/password-generator.component').then(
        (m) => m.PasswordGeneratorComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
