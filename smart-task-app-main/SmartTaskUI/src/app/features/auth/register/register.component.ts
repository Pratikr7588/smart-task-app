import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, RegisterData } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  userData: RegisterData = { username: '', email: '', password: '' };
  isLoading = computed(() => this.authService.isLoading());
  error = computed(() => this.authService.error());

  onSubmit(): void {
    if (!this.userData.email || !this.userData.password || !this.userData.username) {
      this.authService.error.set('Please fill in all fields');
      return;
    }

    if (this.userData.password.length < 6) {
      this.authService.error.set('Password must be at least 6 characters');
      return;
    }
    
    this.authService.register(this.userData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Registration failed', err);
      }
    });
  }

  clearError(): void {
    this.authService.error.set(null);
  }
}
