import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskFormData, TaskContextType } from '../types/task.types';
import * as taskService from '../services/taskService';

// Crear el contexto
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Props del provider
interface TaskProviderProps {
  children: ReactNode;
}

/**
 * Provider del contexto de tareas
 * Maneja el estado global de todas las tareas y proporciona métodos para manipularlas
 */
export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar tareas al montar el componente
  useEffect(() => {
    refreshTasks();
  }, []);

  /**
   * Recargar todas las tareas desde la API
   */
  const refreshTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las tareas';
      setError(errorMessage);
      console.error('Error refreshing tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agregar una nueva tarea
   */
  const addTask = async (taskData: TaskFormData) => {
    try {
      setError(null);
      const newTask = await taskService.createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la tarea';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Actualizar una tarea existente
   */
  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      setError(null);
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la tarea';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Eliminar una tarea
   */
  const deleteTask = async (id: string) => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la tarea';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Obtener una tarea por ID
   */
  const getTaskById = (id: string): Task | undefined => {
    return tasks.find((task) => task.id === id);
  };

  /**
   * Cambiar el estado de completado de una tarea
   */
  const toggleTaskComplete = async (id: string) => {
    try {
      setError(null);
      const updatedTask = await taskService.toggleTaskComplete(id);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la tarea';
      setError(errorMessage);
      throw err;
    }
  };

  // Valor del contexto
  const value: TaskContextType = {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    toggleTaskComplete,
    refreshTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

/**
 * Hook personalizado para usar el contexto de tareas
 * Lanza un error si se usa fuera del TaskProvider
 */
export function useTasks(): TaskContextType {
  const context = useContext(TaskContext);
  
  if (context === undefined) {
    throw new Error('useTasks debe ser usado dentro de un TaskProvider');
  }
  
  return context;
}