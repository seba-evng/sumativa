import { Task, TaskFormData } from '../types/task.types';

// Configuración de la API
const USE_MOCK_API = false;
const API_BASE_URL = 'https://3000-firebase-sumativa-1764016882432.cluster-dwvm25yncracsxpd26rcd5ja3m.cloudworkstations.dev';
const API_URL = `${API_BASE_URL}/tasks`;

// Mock data para desarrollo
let mockTasks: Task[] = [
  {
    id: '1',
    title: 'Tarea de ejemplo',
    description: 'Esta es una tarea de ejemplo para probar la aplicacion',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Completar proyecto React Native',
    description: 'Finalizar el desarrollo de la app de gestion de tareas',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

const simulateNetworkDelay = (ms: number = 500) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * GET - Obtener todas las tareas
 */
export const getTasks = async (): Promise<Task[]> => {
  try {
    if (USE_MOCK_API) {
      await simulateNetworkDelay();
      return [...mockTasks];
    }
    
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
    if (USE_MOCK_API) {
      await simulateNetworkDelay(300);
      const task = mockTasks.find((t) => t.id === id);
      return task || null;
    }
    
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
    if (USE_MOCK_API) {
      await simulateNetworkDelay();
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      mockTasks.push(newTask);
      return newTask;
    }
    
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
    if (USE_MOCK_API) {
      await simulateNetworkDelay();
      const index = mockTasks.findIndex((t) => t.id === id);
      
      if (index === -1) {
        throw new Error('Tarea no encontrada');
      }
      
      mockTasks[index] = {
        ...mockTasks[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      return mockTasks[index];
    }
    
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
    if (USE_MOCK_API) {
      await simulateNetworkDelay();
      const index = mockTasks.findIndex((t) => t.id === id);
      
      if (index === -1) {
        throw new Error('Tarea no encontrada');
      }
      
      mockTasks.splice(index, 1);
      return;
    }
    
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
    if (USE_MOCK_API) {
      await simulateNetworkDelay(200);
      const task = mockTasks.find((t) => t.id === id);
      
      if (!task) {
        throw new Error('Tarea no encontrada');
      }
      
      const updatedTask = {
        ...task,
        completed: !task.completed,
        updatedAt: new Date().toISOString(),
      };
      
      const index = mockTasks.findIndex((t) => t.id === id);
      mockTasks[index] = updatedTask;
      
      return updatedTask;
    }
    
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