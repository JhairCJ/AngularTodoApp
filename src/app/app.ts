import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoService } from './services/todo.service';
import { TodoComponent } from './component/todo.component/todo.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TodoComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  todoService = inject(TodoService);
  protected readonly title = signal('AngularTodoApp');
  getTodos = this.todoService.getTodos();
}
