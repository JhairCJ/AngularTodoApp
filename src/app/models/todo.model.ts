

export interface Todo{
  id: number;
  title: string;
  description: string | null;
}


export interface CreateTodoDto{
    title: string;
    description: string | null;
}