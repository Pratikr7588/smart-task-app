import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, SmartTask } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  
  tasks = this.taskService.tasks;
  isLoading = this.taskService.isLoading;
  error = this.taskService.error;

  toggleComplete(id: number): void {
    this.taskService.toggleComplete(id).subscribe({
      error: (err) => console.error('Toggle complete error:', err)
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        error: (err) => console.error('Delete task error:', err)
      });
    }
  }

  getEnergyColor(energy: string): string {
    switch(energy.toLowerCase()) {
      case 'high': 
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'medium': 
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'low': 
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      default: 
        return 'bg-slate-700 text-slate-300';
    }
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-rose-400 font-bold';
    if (score >= 50) return 'text-amber-400 font-bold';
    return 'text-emerald-400 font-medium';
  }

  trackByTaskId(_index: number, task: SmartTask): number {
    return task.id;
  }
}
