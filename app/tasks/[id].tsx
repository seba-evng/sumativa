import React, { useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Calendar, 
  RefreshCw, 
  Hash,
  Edit3,
  Trash2,
  RotateCcw
} from 'lucide-react-native';
import { useTasks } from '../../lib/context/TaskContext';
import TaskForm from '../../components/TaskForm';
import Button from '../../components/Button';
import { TaskFormData } from '../../lib/types/task.types';

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTaskById, updateTask, deleteTask, toggleTaskComplete } = useTasks();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const task = getTaskById(id as string);

  // Si la tarea no existe, mostrar error
  if (!task) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <XCircle size={64} color="#DC2626" strokeWidth={1.5} />
        <Text className="text-xl font-bold text-gray-800 mb-2 mt-4">
          Tarea no encontrada
        </Text>
        <Text className="text-gray-600 mb-6 text-center">
          La tarea que buscas no existe o fue eliminada
        </Text>
        <Button
          title="Volver"
          onPress={() => router.back()}
          variant="primary"
        />
      </View>
    );
  }

  // Manejar actualización de tarea
  const handleUpdate = async (data: TaskFormData) => {
    try {
      await updateTask(id as string, data);
      
      Alert.alert(
        'Éxito',
        'La tarea se actualizó correctamente',
        [
          {
            text: 'OK',
            onPress: () => setIsEditing(false),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo actualizar la tarea. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    }
  };

  // Manejar eliminación
  const handleDelete = () => {
    Alert.alert(
      'Eliminar Tarea',
      `¿Estás seguro de que deseas eliminar "${task.title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteTask(id as string);
              Alert.alert('Éxito', 'Tarea eliminada', [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la tarea');
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  // Manejar toggle de completado
  const handleToggleComplete = async () => {
    try {
      await toggleTaskComplete(id as string);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado de la tarea');
    }
  };

  // Vista de edición
  if (isEditing) {
    return (
      <View className="flex-1 bg-gray-50">
        <TaskForm
          initialData={task}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          submitLabel="Guardar Cambios"
        />
      </View>
    );
  }

  // Vista de detalles
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Estado de la tarea */}
        <View className="mb-6">
          <View
            className={`px-4 py-3 rounded-xl self-start flex-row items-center ${
              task.completed ? 'bg-green-100' : 'bg-orange-100'
            }`}
          >
            {task.completed ? (
              <CheckCircle size={20} color="#15803D" strokeWidth={2.5} />
            ) : (
              <Clock size={20} color="#C2410C" strokeWidth={2.5} />
            )}
            <Text
              className={`font-bold text-base ml-2 ${
                task.completed ? 'text-green-700' : 'text-orange-700'
              }`}
            >
              {task.completed ? 'Completada' : 'Pendiente'}
            </Text>
          </View>
        </View>

        {/* Título */}
        <View className="bg-white rounded-xl p-5 mb-4 border border-gray-200">
          <Text className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">
            Título
          </Text>
          <Text className="text-2xl font-bold text-gray-800 leading-tight">
            {task.title}
          </Text>
        </View>

        {/* Descripción */}
        <View className="bg-white rounded-xl p-5 mb-4 border border-gray-200">
          <Text className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">
            Descripción
          </Text>
          <Text className="text-base text-gray-700 leading-6">
            {task.description}
          </Text>
        </View>

        {/* Información de fechas */}
        <View className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
          <Text className="text-xs text-gray-500 mb-3 font-bold uppercase tracking-wider">
            Información
          </Text>
          
          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <Calendar size={14} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1 font-semibold">Fecha de Creación</Text>
            </View>
            <Text className="text-sm text-gray-800 font-semibold ml-5">
              {new Date(task.createdAt).toLocaleString('es-ES', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </Text>
          </View>

          {task.updatedAt && (
            <View className="pt-3 border-t border-gray-100">
              <View className="flex-row items-center mb-1">
                <RefreshCw size={14} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-1 font-semibold">Última Modificación</Text>
              </View>
              <Text className="text-sm text-gray-800 font-semibold ml-5">
                {new Date(task.updatedAt).toLocaleString('es-ES', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
              </Text>
            </View>
          )}

          <View className="pt-3 border-t border-gray-100 mt-3">
            <View className="flex-row items-center mb-1">
              <Hash size={14} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1 font-semibold">ID de Tarea</Text>
            </View>
            <Text className="text-sm text-gray-600 font-mono ml-5">
              {task.id}
            </Text>
          </View>
        </View>

        {/* Botones de acción */}
        <View>
          <View className="flex-row items-center justify-center mb-3">
            <Button
              title={task.completed ? 'Marcar como Pendiente' : 'Marcar como Completada'}
              onPress={handleToggleComplete}
              variant={task.completed ? 'secondary' : 'success'}
              fullWidth
            />
          </View>

          <View className="flex-row items-center justify-center mb-3">
            <Button
              title="Editar Tarea"
              onPress={() => setIsEditing(true)}
              variant="primary"
              fullWidth
            />
          </View>

          <View className="flex-row items-center justify-center">
            <Button
              title="Eliminar Tarea"
              onPress={handleDelete}
              variant="danger"
              fullWidth
              loading={isDeleting}
              disabled={isDeleting}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}