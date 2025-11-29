import React from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import TaskForm from '../../components/TaskForm';
import { useTasks } from '../../lib/context/TaskContext';
import { TaskFormData } from '../../lib/types/task.types';

export default function NewTaskScreen() {
  const router = useRouter();
  const { addTask } = useTasks();

  const handleSubmit = async (data: TaskFormData) => {
    try {
      await addTask(data);
      
      Alert.alert(
        'Éxito',
        'La tarea se creó correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo crear la tarea. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <TaskForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Crear Tarea"
      />
    </View>
  );
}