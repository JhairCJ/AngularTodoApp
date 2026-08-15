import { TodoService} from '@/app/services/todo.service';
import { Todo, CreateTodoDto } from '@/app/models/todo.model';
import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo',
  imports: [ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit{
  private readonly todoService = inject(TodoService);

  todoForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    }),
    description: new FormControl(''),
  });

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
        this.todos = todos;
      },
      error: (error) => {
        console.log(error);
        this.error = "Error fetching data";
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

  onSubmit(){
    console.log(this.todoForm.value);
    const newTodo: CreateTodoDto = {
      title: this.todoForm.controls.title.value,
      description: this.todoForm.controls.description.value,
    };

    this.todoService.createTodo(newTodo).subscribe({
      next: (todo) => {
        console.log(`Todo created`, todo)
        this.todos.push(todo as Todo);
        this.todoForm.reset();
      },
      error: (error) => {
        console.log(`Error creating todo `, error)
      }
    });
  }
}
