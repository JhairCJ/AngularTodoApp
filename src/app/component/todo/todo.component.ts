import { TodoService} from '@/app/services/todo.service';
import { Todo, CreateTodoDto } from '@/app/models/todo.model';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
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

  todos = signal<Todo[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  editingId = signal<number | null>(null);
  isEditingTodo = computed<boolean>(() => this.editingId() !== null);

  ngOnInit(){
    this.loadTodos();
  }

  private loadTodos(){
    this.loading.set(true);
    this.todos.set([]);

    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos.set(todos);
      },
      error: (error) => {
        console.log(error);
        this.error.set("Error fetching data");
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    })
  }

  onSubmit(){
    if(!this.isEditingTodo()){
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
        this.todos().push(todo as Todo);
        this.todoForm.reset();
      },
      error: (error) => {
        console.log(`Error creating todo `, error);
        this.error.set(error.message);
      }
    });
  }

  deleteTodo(id: number):void{
    this.todos.update( 
      todos => todos.filter(todo => todo.id !== id) 
    );
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
    this.editingId.set(todo.id);

    this.todoForm.patchValue({
      title: todo.title,
      description: todo.description,
    })
  }

  updateTodo(){
    const editingId = this.editingId()
    if(editingId === null){
      return;
    }
    const updatedTodo: Todo = {
      id: editingId,
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
        this.editingId.set(null);
        this.todoForm.reset();
      }
    })
    this.loadTodos();

  }
}
