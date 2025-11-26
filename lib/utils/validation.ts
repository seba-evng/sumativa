import { TaskFormData, TaskFormErrors } from '../types/task.types';

/**
 * Validates if a string contains only alphanumeric characters and spaces
 */
export const isAlphanumeric = (value: string): boolean => {
    // Acepta cualquier carácter menos cadena vacía
    const allCharsRegex = /^[\s\S]+$/;
    return allCharsRegex.test(value);
  };
  

/**
 * Validates if a string is not empty (after trimming)
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates the entire task form
 * Returns an object with error messages for each field
 */
export const validateTaskForm = (formData: TaskFormData): TaskFormErrors => {
  const errors: TaskFormErrors = {};

  // Validate title
  if (!isNotEmpty(formData.title)) {
    errors.title = 'El título no puede estar vacío';
  } else if (!isAlphanumeric(formData.title)) {
    errors.title = 'El título solo puede contener letras, números y espacios';
  } else if (formData.title.trim().length < 3) {
    errors.title = 'El título debe tener al menos 3 caracteres';
  } else if (formData.title.trim().length > 50) {
    errors.title = 'El título no puede exceder 50 caracteres';
  }

  // Validate description
  if (!isNotEmpty(formData.description)) {
    errors.description = 'La descripción no puede estar vacía';
  } else if (!isAlphanumeric(formData.description)) {
    errors.description = 'La descripción solo puede contener letras, números y espacios';
  } else if (formData.description.trim().length < 5) {
    errors.description = 'La descripción debe tener al menos 5 caracteres';
  } else if (formData.description.trim().length > 200) {
    errors.description = 'La descripción no puede exceder 200 caracteres';
  }

  return errors;
};

/**
 * Checks if the form has any validation errors
 */
export const hasErrors = (errors: TaskFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};