import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import "@/global.css";
import { Task } from '../lib/types/task.types';

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

  return (
    <View className={`border rounded-lg p-4 mb-3 shadow-sm ${cardStyles}`}>
      {/* Header with checkbox and delete button */}
      <View className="flex-row items-center justify-between mb-2">
        <TouchableOpacity
          onPress={onToggleComplete}
          className="flex-row items-center flex-1"
        >
          <View
            className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
              task.completed
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300'
            }`}
          >
            {task.completed && (
              <Text className="text-white text-xs font-bold">✓</Text>
            )}
          </View>
          <Text className={`text-lg font-semibold flex-1 ${titleStyles}`}>
            {task.title}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          className="bg-red-500 rounded-full w-8 h-8 items-center justify-center ml-2"
        >
          <Text className="text-white font-bold">✕</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <TouchableOpacity onPress={onPress}>
        <Text className={`text-sm mb-2 ${descriptionStyles}`} numberOfLines={2}>
          {task.description}
        </Text>

        {/* Date info */}
        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-xs text-gray-400">
            Creada: {new Date(task.createdAt).toLocaleDateString('es-ES')}
          </Text>
          {task.updatedAt && (
            <Text className="text-xs text-gray-400">
              Editada: {new Date(task.updatedAt).toLocaleDateString('es-ES')}
            </Text>
          )}
        </View>

        {/* View details link */}
        <Text className="text-primary-600 text-sm font-semibold mt-2">
          Ver detalles →
        </Text>
      </TouchableOpacity>
    </View>
  );
}