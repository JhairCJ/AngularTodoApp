import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.development';


export interface Todo{
  id: number;
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {

  private http = inject(HttpClient);

  getTodos(): Observable<Todo[]>{
    return this.http.get<Todo[]>(`${environment.apiUrl}/todo`);
  }

  updateTodo(todo: Todo): Observable<Todo>{
    return this.http.put<Todo>(`${environment.apiUrl}/todo/${todo.id}`, todo);
  }

  createTodo(todo: Todo): Observable<Todo>{
    return this.http.post<Todo>(`${environment.apiUrl}/todo`,todo)
  }
}
