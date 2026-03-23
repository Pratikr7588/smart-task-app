import { Component, EventEmitter, Output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, SmartTask } from '../../../core/services/task.service';

interface TaskFormData {
  title: string;
  description: string;
  importance: number;
  requiredEnergy: string;
  dueDate: string | null;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  @Output() taskCreated = new EventEmitter<void>();
  
  private taskService = inject(TaskService);
  
  taskData: TaskFormData = {
    title: '',
    description: '',
    importance: 5,
    requiredEnergy: 'Medium',
    dueDate: null
  };

  isSubmitting = computed(() => this.taskService.isLoading());
  error = computed(() => this.taskService.error());

  onSubmit(): void {
    if (!this.taskData.title.trim()) {
      this.taskService.error.set('Task title is required');
      return;
    }
    
    this.taskService.createTask(this.taskData).subscribe({
      next: () => {
        this.resetForm();
        this.taskCreated.emit();
      },
      error: (err) => {
        console.error('Failed to create task', err);
      }
    });
  }

  resetForm(): void {
    this.taskData = {
      title: '',
      description: '',
      importance: 5,
      requiredEnergy: 'Medium',
      dueDate: null
    };
    this.taskService.error.set(null);
  }

  cancel(): void {
    this.resetForm();
    this.taskCreated.emit();
  }
}
