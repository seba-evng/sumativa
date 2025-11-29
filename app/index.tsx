import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, AlertCircle, ClipboardList } from 'lucide-react-native';
import { useTasks } from '../lib/context/TaskContext';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, loading, error, deleteTask, toggleTaskComplete, refreshTasks } = useTasks();
  const [refreshing, setRefreshing] = useState(false);

  // Manejar refresco manual
  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTasks();
    setRefreshing(false);
  };

  // Manejar eliminación de tarea con confirmación
  const handleDelete = async (id: string, title: string) => {
    console.log('handleDelete llamado con ID:', id, 'Título:', title);
    
    Alert.alert(
      '🗑️ Eliminar Tarea',
      `¿Estás seguro de que deseas eliminar "${title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => console.log('Eliminación cancelada'),
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            console.log('Intentando eliminar tarea ID:', id);
            try {
              await deleteTask(id);
              console.log('Tarea eliminada exitosamente');
              Alert.alert('✅ Éxito', 'Tarea eliminada correctamente');
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('❌ Error', 'No se pudo eliminar la tarea');
            }
          },
        },
      ]
    );
  };

  // Manejar toggle de completado
  const handleToggleComplete = async (id: string) => {
    try {
      await toggleTaskComplete(id);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  // Navegar a detalles de tarea
  const handleViewDetails = (id: string) => {
    router.push(`/tasks/${id}`);
  };

  // Navegar a crear nueva tarea
  const handleCreateTask = () => {
    router.push('/tasks/new');
  };

  // Estadísticas de tareas
  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  // Renderizar contenido vacío
  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <ClipboardList size={64} color="#9CA3AF" strokeWidth={1.5} />
      <Text className="text-xl font-bold text-gray-800 mb-2 text-center mt-4">
        No hay tareas
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        Comienza agregando tu primera tarea presionando el botón +
      </Text>
    </View>
  );

  // Renderizar error
  if (error && !loading && tasks.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-6">
        <AlertCircle size={64} color="#DC2626" strokeWidth={1.5} />
        <Text className="text-xl font-bold text-red-600 mb-2 text-center mt-4">
          Error al cargar tareas
        </Text>
        <Text className="text-gray-600 text-center mb-6">{error}</Text>
        <Button title="Reintentar" onPress={refreshTasks} variant="primary" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header con estadísticas */}
      {tasks.length > 0 && (
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary-600">
                {tasks.length}
              </Text>
              <Text className="text-sm text-gray-600">Total</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {completedCount}
              </Text>
              <Text className="text-sm text-gray-600">Completadas</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-600">
                {pendingCount}
              </Text>
              <Text className="text-sm text-gray-600">Pendientes</Text>
            </View>
          </View>
        </View>
      )}

      {/* Lista de tareas */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => handleViewDetails(item.id)}
            onToggleComplete={() => handleToggleComplete(item.id)}
            onDelete={() => handleDelete(item.id, item.title)}
          />
        )}
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1,
        }}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0284c7']}
            tintColor="#0284c7"
          />
        }
      />

      {/* Botón flotante para crear tarea */}
      <TouchableOpacity
        onPress={handleCreateTask}
        className="absolute bottom-6 right-6 bg-primary-600 rounded-full w-16 h-16 items-center justify-center shadow-lg active:bg-primary-700"
        style={{ backgroundColor: '#0284c7' }}
        activeOpacity={0.8}
      >
        <Plus size={32} color="white" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}