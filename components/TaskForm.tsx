import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Input from './Input';
import Button from './Button';
import { TaskFormData, TaskFormErrors, Task } from '../lib/types/task.types';
import { validateTaskForm, hasErrors } from '../lib/utils/validation';

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Guardar Tarea',
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Validate on change if field has been touched
    if (touched[field]) {
      const newErrors = validateTaskForm({
        ...formData,
        [field]: value,
      });
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: keyof TaskFormData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Validate on blur
    const newErrors = validateTaskForm(formData);
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouched({
      title: true,
      description: true,
    });

    // Validate entire form
    const validationErrors = validateTaskForm(formData);
    setErrors(validationErrors);

    // If there are errors, don't submit
    if (hasErrors(validationErrors)) {
      return;
    }

    // Submit form
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form after successful submission (only if it's a new task)
      if (!initialData) {
        setFormData({ title: '', description: '' });
        setTouched({});
        setErrors({});
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
      <View className="p-4">
        {/* Form Title */}
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          {initialData ? 'Editar Tarea' : 'Nueva Tarea'}
        </Text>

        {/* Title Input */}
        <Input
          label="Título"
          placeholder="Ej: Completar proyecto de React Native"
          value={formData.title}
          onChangeText={(value) => handleChange('title', value)}
          onBlur={() => handleBlur('title')}
          error={touched.title ? errors.title : undefined}
          helperText="Solo letras, números y espacios (3-50 caracteres)"
          required
          maxLength={50}
        />

        {/* Description Input */}
        <Input
          label="Descripción"
          placeholder="Ej: Desarrollar una app de gestión de tareas con todas las funcionalidades"
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          onBlur={() => handleBlur('description')}
          error={touched.description ? errors.description : undefined}
          helperText="Solo letras, números y espacios (5-200 caracteres)"
          required
          multiline
          numberOfLines={4}
          maxLength={200}
          style={{ textAlignVertical: 'top' }}
        />

        {/* Character Counters */}
        <View className="mb-6">
          <Text className="text-xs text-gray-500 mb-1">
            Título: {formData.title.length}/50 caracteres
          </Text>
          <Text className="text-xs text-gray-500">
            Descripción: {formData.description.length}/200 caracteres
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="gap-3">
          <Button
            title={submitLabel}
            onPress={handleSubmit}
            variant="primary"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          />

          {onCancel && (
            <Button
              title="Cancelar"
              onPress={onCancel}
              variant="secondary"
              fullWidth
              disabled={isSubmitting}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}