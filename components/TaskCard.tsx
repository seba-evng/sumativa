import { Calendar, Check, RefreshCw, Trash2 } from 'lucide-react-native';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Task } from '../lib/types/task.types';
import React from 'react';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}

export default function TaskCard({
  task,
  onPress,
  onToggleComplete,
  onDelete,
}: TaskCardProps) {
  const cardStyles = task.completed
    ? 'bg-green-50 border-green-300'
    : 'bg-white border-gray-200';

  const titleStyles = task.completed
    ? 'line-through text-gray-500'
    : 'text-gray-900';

  const descriptionStyles = task.completed
    ? 'line-through text-gray-400'
    : 'text-gray-600';

  const handleDeletePress = () => {
    console.log('Botón de eliminar presionado para tarea:', task.id);
    onDelete();
  };

  return (
    <View className={`border-2 rounded-xl p-4 mb-3 shadow-sm ${cardStyles}`}>
      {/* Header with checkbox and delete button */}
      <View className="flex-row items-start justify-between mb-3">
        {/* Checkbox and Title */}
        <Pressable
          onPress={onToggleComplete}
          className="flex-row items-start flex-1 mr-2"
        >
          <View
            className={`w-7 h-7 rounded-md border-2 mr-3 items-center justify-center mt-0.5 ${
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'bg-white border-gray-400'
            }`}
          >
            {task.completed && (
              <Check size={16} color="white" strokeWidth={3} />
            )}
          </View>
          <Text className={`text-lg font-bold flex-1 ${titleStyles}`}>
            {task.title}
          </Text>
        </Pressable>

        {/* Delete Button - Separated and bigger */}
        <TouchableOpacity
          onPress={handleDeletePress}
          className="bg-red-500 rounded-lg ml-2"
          style={{ 
            minWidth: 50, 
            minHeight: 50, 
            justifyContent: 'center', 
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 12,
          }}
          activeOpacity={0.7}
        >
          <Trash2 size={20} color="white" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Description - Clickeable para ver detalles */}
      <Pressable onPress={onPress}>
        <Text className={`text-sm mb-3 ${descriptionStyles}`} numberOfLines={2}>
          {task.description}
        </Text>

        {/* Date info */}
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center">
            <Calendar size={14} color="#9CA3AF" />
            <Text className="text-xs text-gray-400 ml-1">
              {new Date(task.createdAt).toLocaleDateString('es-ES')}
            </Text>
          </View>
          {task.updatedAt && (
            <View className="flex-row items-center">
              <RefreshCw size={14} color="#9CA3AF" />
              <Text className="text-xs text-gray-400 ml-1">
                {new Date(task.updatedAt).toLocaleDateString('es-ES')}
              </Text>
            </View>
          )}
        </View>

        {/* View details link */}
        <View className="border-t border-gray-200 pt-2">
          <Text className="text-primary-600 text-sm font-bold">
            Ver detalles completos →
          </Text>
        </View>
      </Pressable>
    </View>
  );
}