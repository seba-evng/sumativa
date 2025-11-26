import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

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
  const baseStyles = 'rounded-lg flex-row items-center justify-center';
  
  const variantStyles = {
    primary: 'bg-primary-600 active:bg-primary-700',
    secondary: 'bg-gray-600 active:bg-gray-700',
    danger: 'bg-red-600 active:bg-red-700',
    success: 'bg-green-600 active:bg-green-700',
  };

  const disabledStyles = 'bg-gray-400 opacity-60';

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

  const buttonClasses = `${baseStyles} ${
    disabled ? disabledStyles : variantStyles[variant]
  } ${sizeStyles[size]} ${widthStyle}`;

  return (
    <TouchableOpacity
      className={buttonClasses}
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