import { Stack } from 'expo-router';
import "@/global.css";
import { TaskProvider } from '../lib/context/TaskContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <TaskProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#0284c7',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: 'Mis Tareas',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="tasks/new"
            options={{
              title: 'Nueva Tarea',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="tasks/[id]"
            options={{
              title: 'Detalles de Tarea',
            }}
          />
        </Stack>
      </TaskProvider>
    </SafeAreaProvider>
  );
}