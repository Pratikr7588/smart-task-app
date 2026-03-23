import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface SmartTask {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  importance: number;
  requiredEnergy: string;
  dueDate: string | null;
  smartScore: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;
  
  // Reactive list of tasks using Signals
  tasks = signal<SmartTask[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadTasks(energyFilter?: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    let url = this.apiUrl;
    if (energyFilter && energyFilter !== 'All') {
      url += `?energyFilter=${energyFilter}`;
    }

    this.http.get<SmartTask[]>(url).pipe(
      tap((data) => {
        this.tasks.set(data);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        this.error.set(error?.error?.message || 'Failed to load tasks');
        this.isLoading.set(false);
        console.error('Load tasks error:', error);
        return of([]);
      })
    ).subscribe();
  }

  createTask(task: Partial<SmartTask>) {
    return this.http.post<SmartTask>(this.apiUrl, task).pipe(
      tap((newTask) => {
        this.tasks.update(tasks => [newTask, ...tasks]);
        this.error.set(null);
      }),
      catchError((error) => {
        this.error.set(error?.error?.message || 'Failed to create task');
        console.error('Create task error:', error);
        throw error;
      })
    );
  }

  updateTask(id: number, task: Partial<SmartTask>) {
    return this.http.put<SmartTask>(`${this.apiUrl}/${id}`, task).pipe(
      tap((updatedTask) => {
        this.tasks.update(tasks =>
          tasks.map(t => t.id === id ? updatedTask : t)
        );
        this.error.set(null);
      }),
      catchError((error) => {
        this.error.set(error?.error?.message || 'Failed to update task');
        console.error('Update task error:', error);
        throw error;
      })
    );
  }

  toggleComplete(id: number) {
    return this.http.patch<SmartTask>(`${this.apiUrl}/${id}/complete`, {}).pipe(
      tap((updatedTask) => {
        // Update with actual response from backend
        this.tasks.update(tasks =>
          tasks.map(t => t.id === id ? updatedTask : t)
        );
        this.error.set(null);
      }),
      catchError((error) => {
        this.error.set(error?.error?.message || 'Failed to toggle task');
        console.error('Toggle task error:', error);
        throw error;
      })
    );
  }

  deleteTask(id: number) {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.tasks.update(tasks => tasks.filter(t => t.id !== id));
        this.error.set(null);
      }),
      catchError((error) => {
        this.error.set(error?.error?.message || 'Failed to delete task');
        console.error('Delete task error:', error);
        throw error;
      })
    );
  }
}
