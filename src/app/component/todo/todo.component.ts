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

  editingId: number | null = null;
  isEditingTodo: boolean = false;

  ngOnInit(){
    this.loadTodos();
  }

  private loadTodos(){
    this.loading = true;
    this.todos = []

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
    if(!this.isEditingTodo){
      this.createTodo();
    }else{
      this.updateTodo();
    }
 
  }

  createTodo():void{
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

  deleteTodo(id: number):void{
    
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        console.log(`Todo deleted`, id);
      },
      error: (error) => {
        console.log(`Error deleting todo `, error);
        this.loadTodos();
      }
    });
  }

  editTodo(todo: Todo): void{
    this.isEditingTodo = true;
    this.editingId = todo.id;

    this.todoForm.patchValue({
      title: todo.title,
      description: todo.description,
    })
  }

  updateTodo(){
    if(this.editingId === null){
      return;
    }
    const updatedTodo: Todo = {
      id: this.editingId,
      title: this.todoForm.controls.title.value,
      description: this.todoForm.controls.description.value,
    }
    this.todoService.updateTodo(updatedTodo).subscribe({
      next: (todo) => {
        console.log("todo updated", todo);
      },
      error: (error) => {
        console.log ("error while updating", error);
      },
      complete: () => {
        this.editingId = null;
        this.isEditingTodo = false;
        this.todoForm.reset();
      }
    })
    this.loadTodos();

  }
}
