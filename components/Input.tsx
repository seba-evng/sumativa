import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  textAlignVertical?: 'top' | 'center' | 'bottom';
}

export default function Input({
  label,
  error,
  helperText,
  required = false,
  textAlignVertical,
  ...textInputProps
}: InputProps) {
  const hasError = !!error;
  
  const inputBorderColor = hasError
    ? 'border-red-500'
    : 'border-gray-300 focus:border-primary-500';

  const inputBgColor = hasError ? 'bg-red-50' : 'bg-white';

  return (
    <View className="mb-4">
      {/* Label */}
      <View className="flex-row items-center mb-2">
        <Text className="text-gray-700 font-semibold text-base">
          {label}
        </Text>
        {required && <Text className="text-red-500 ml-1">*</Text>}
      </View>

      {/* Input Field */}
      <TextInput
        className={`border-2 rounded-lg px-4 py-3 text-base ${inputBorderColor} ${inputBgColor}`}
        placeholderTextColor="#9CA3AF"
        style={textAlignVertical ? { textAlignVertical } : undefined}
        {...textInputProps}
      />

      {/* Error Message */}
      {hasError && (
        <View className="flex-row items-center mt-1">
          <Text className="text-red-500 text-sm">⚠ {error}</Text>
        </View>
      )}

      {/* Helper Text */}
      {!hasError && helperText && (
        <Text className="text-gray-500 text-xs mt-1">{helperText}</Text>
      )}
    </View>
  );
}