import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  userId: number;
  username: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Reactive signal for UI auth state
  currentUser = signal<User | null>(null);
  error = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(private http: HttpClient) {
    this.checkInitialAuth();
  }

  private checkInitialAuth(): void {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userIdStr = localStorage.getItem('userId');
    
    if (token && username && userIdStr) {
      this.currentUser.set({
        token,
        username,
        userId: parseInt(userIdStr, 10)
      });
    }
  }

  login(credentials: AuthCredentials) {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        this.handleAuthResponse(res);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        const message = error?.error?.message || 'Login failed';
        this.error.set(message);
        this.isLoading.set(false);
        console.error('Login error:', error);
        return throwError(() => new Error(message));
      })
    );
  }

  register(userData: RegisterData) {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<User>(`${this.apiUrl}/register`, userData).pipe(
      tap(res => {
        this.handleAuthResponse(res);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        const message = error?.error?.message || 'Registration failed';
        this.error.set(message);
        this.isLoading.set(false);
        console.error('Register error:', error);
        return throwError(() => new Error(message));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    this.currentUser.set(null);
    this.error.set(null);
  }

  private handleAuthResponse(res: User): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('username', res.username);
    localStorage.setItem('userId', res.userId.toString());
    this.currentUser.set(res);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
