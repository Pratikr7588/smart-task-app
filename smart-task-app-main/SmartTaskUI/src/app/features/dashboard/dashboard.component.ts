import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';
import { TaskListComponent } from '../tasks/task-list/task-list.component';
import { TaskFormComponent } from '../tasks/task-form/task-form.component';

interface DashboardStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private router = inject(Router);

  showNewTaskForm = false;
  currentFilter = 'All';
  readonly energyFilters = ['All', 'High', 'Medium', 'Low'];

  // Expose signals for template
  user = this.authService.currentUser;
  authError = computed(() => this.authService.error());
  
  stats = computed<DashboardStats>(() => {
    const tasks = this.taskService.tasks();
    const completed = tasks.filter(t => t.isCompleted).length;
    const total = tasks.length;
    
    return {
      total,
      completed,
      pending: total - completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  });

  constructor() {
    this.loadInitialTasks();
  }

  private loadInitialTasks(): void {
    this.taskService.loadTasks();
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.taskService.loadTasks(filter);
  }

  toggleForm(): void {
    this.showNewTaskForm = !this.showNewTaskForm;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
