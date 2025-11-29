import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  size = 'md',
}: ButtonProps) {
  // Determinar el color de fondo según el variant
  const getBackgroundColor = () => {
    if (disabled) return '#9CA3AF'; // gray-400
    
    switch (variant) {
      case 'primary':
        return '#0284c7'; // blue-600
      case 'secondary':
        return '#4B5563'; // gray-600
      case 'danger':
        return '#DC2626'; // red-600
      case 'success':
        return '#16A34A'; // green-600
      default:
        return '#0284c7';
    }
  };

  const sizeStyles = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <TouchableOpacity
      className={`rounded-lg flex-row items-center justify-center ${sizeStyles[size]} ${widthStyle}`}
      style={{ backgroundColor: getBackgroundColor() }}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text className={`text-white font-semibold ${textSizeStyles[size]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}