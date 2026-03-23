import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, AuthCredentials } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  credentials: AuthCredentials = { email: '', password: '' };
  isLoading = computed(() => this.authService.isLoading());
  error = computed(() => this.authService.error());

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.authService.error.set('Please enter both email and password');
      return;
    }
    
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }

  clearError(): void {
    this.authService.error.set(null);
  }
}
