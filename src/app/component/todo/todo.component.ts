import { TodoService, Todo } from '@/app/services/todo.service';
import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-todo',
  imports: [],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit{
  private readonly todoService = inject(TodoService);

  todos : Todo[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(){
    this.loadTodos();
  }

  private loadTodos(){
    this.loading = true;

    this.todoService.getTodos().subscribe({
      next: (todos) => {
        console.log(todos);
        console.log(this.error);
        this.todos = todos;
      },
      error: (error) => {
        console.log(error);
        this.error = "Error al obtener los datos";
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    })
  }
}
