/**
 * Task type definition
 */
export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt?: string;
  }
  
  /**
   * Form data for creating/editing tasks
   */
  export interface TaskFormData {
    title: string;
    description: string;
  }
  
  /**
   * Validation errors for form fields
   */
  export interface TaskFormErrors {
    title?: string;
    description?: string;
  }
  
  /**
   * Task context state
   */
  export interface TaskContextType {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    addTask: (taskData: TaskFormData) => Promise<void>;
    updateTask: (id: string, taskData: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    getTaskById: (id: string) => Task | undefined;
    toggleTaskComplete: (id: string) => Promise<void>;
    refreshTasks: () => Promise<void>;
  }