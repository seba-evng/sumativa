import { Task, TaskFormData } from '../types/task.types';

const API_BASE_URL = '3000-firebase-sumativa-1764016882432.cluster-dwvm25yncracsxpd26rcd5ja3m.cloudworkstations.dev';
const API_URL = `${API_BASE_URL}/tasks`;

/**
 * GET - Obtener todas las tareas
 */
export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Error al obtener las tareas: ${response.status}`);
    }
    
    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error('Error en getTasks:', error);
    throw new Error('No se pudieron cargar las tareas. Verifica que JSON Server esté ejecutándose.');
  }
};

/**
 * GET - Obtener una tarea por ID
 */
export const getTaskById = async (id: string): Promise<Task | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`Error al obtener la tarea: ${response.status}`);
    }
    
    const task = await response.json();
    return task;
  } catch (error) {
    console.error('Error en getTaskById:', error);
    throw error;
  }
};

/**
 * POST - Crear una nueva tarea
 */
export const createTask = async (taskData: TaskFormData): Promise<Task> => {
  try {
    const newTask = {
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    
    if (!response.ok) {
      throw new Error(`Error al crear la tarea: ${response.status}`);
    }
    
    const createdTask = await response.json();
    return createdTask;
  } catch (error) {
    console.error('Error en createTask:', error);
    throw new Error('No se pudo crear la tarea. Verifica la conexión con el servidor.');
  }
};

/**
 * PUT - Actualizar una tarea existente
 */
export const updateTask = async (
  id: string,
  updates: Partial<Task>
): Promise<Task> => {
  try {
    // Primero obtenemos la tarea actual
    const currentTask = await getTaskById(id);
    
    if (!currentTask) {
      throw new Error('Tarea no encontrada');
    }

    // Mezclamos los datos actuales con las actualizaciones
    const updatedTask = {
      ...currentTask,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });
    
    if (!response.ok) {
      throw new Error(`Error al actualizar la tarea: ${response.status}`);
    }
    
    const task = await response.json();
    return task;
  } catch (error) {
    console.error('Error en updateTask:', error);
    throw new Error('No se pudo actualizar la tarea.');
  }
};

/**
 * DELETE - Eliminar una tarea
 */
export const deleteTask = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error al eliminar la tarea: ${response.status}`);
    }
  } catch (error) {
    console.error('Error en deleteTask:', error);
    throw new Error('No se pudo eliminar la tarea.');
  }
};

/**
 * PATCH - Toggle del estado completado de una tarea
 */
export const toggleTaskComplete = async (id: string): Promise<Task> => {
  try {
    const task = await getTaskById(id);
    
    if (!task) {
      throw new Error('Tarea no encontrada');
    }
    
    const updatedTask = await updateTask(id, { 
      completed: !task.completed 
    });
    
    return updatedTask;
  } catch (error) {
    console.error('Error en toggleTaskComplete:', error);
    throw error;
  }
};