import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import Input from "./Input";
import Button from "./Button";
import { TaskFormData, TaskFormErrors, Task } from "../lib/types/task.types";
import { validateTaskForm, hasErrors } from "../lib/utils/validation";
import { getTaskImprovements } from "../lib/services/gemini";
import { Bot, Check, X } from "lucide-react-native";

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: TaskFormData) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const router = useRouter();

export default function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Guardar Tarea",
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
  });

  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // IA modal / estados
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // si viene initialData se actualiza el formulario
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const newErrors = validateTaskForm({ ...formData, [field]: value });
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: keyof TaskFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateTaskForm(formData));
  };

  const handleSubmit = async () => {
    setTouched({ title: true, description: true });
    const validationErrors = validateTaskForm(formData);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      if (!initialData) {
        setFormData({ title: "", description: "" });
        setTouched({});
        setErrors({});
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Llamada a Gemini y apertura del modal
  const handleAskAI = async () => {
    setLoadingAI(true);
    setModalVisible(true);
    setAiSuggestion(null);

    const prompt = `
Eres un asistente experto en productividad y gestión del tiempo.
Analiza esta tarea y sugiere mejoras claras y accionables.

IMPORTANTE:
- Máximo 5 sugerencias.
- No reescribas toda la tarea.
- Si ya está bien definida, responde: “La tarea ya está bien definida”.

Título: ${formData.title}
Descripción: ${formData.description}
    `;

    try {
      const response = await getTaskImprovements(prompt);
      setAiSuggestion(response);
    } catch (err) {
      console.error("Error con Gemini:", err);
      setAiSuggestion("Hubo un error obteniendo sugerencias de la IA.");
    } finally {
      setLoadingAI(false);
    }
  };

  // 🔥🔥🔥 FUNCIÓN ACTUALIZADA QUE SÍ REEMPLAZA LA DESCRIPCIÓN 🔥🔥🔥
  const applyAISuggestions = () => {
    if (!aiSuggestion) {
      setModalVisible(false);
      return;
    }

    // 1️⃣ Buscar formato explícito (si existe)
    const titleRegex = /\*\*Título mejorado:\*\*\s*["“](.*?)["”]/i;
    const descRegex = /\*\*Descripción mejorada:\*\*\s*["“](.*?)["”]/is;

    const titleMatch = aiSuggestion.match(titleRegex);
    const descMatch = aiSuggestion.match(descRegex);

    let newTitle = titleMatch ? titleMatch[1] : formData.title;
    let newDesc = descMatch ? descMatch[1] : null;

    // 2️⃣ Si no hay descripción explícita, buscar sugerencias tipo lista
    if (!newDesc) {
      const lines = aiSuggestion.split("\n").map((l) => l.trim());

      const bulletPoints = lines.filter((l) =>
        l.match(/^[-*•]\s+.+/) || l.match(/^\d+\.\s+.+/)
      );

      if (bulletPoints.length > 0) {
        newDesc = bulletPoints[bulletPoints.length - 1].replace(/^[-*•\d.]\s*/, "");
      }
    }

    // 3️⃣ Si aún no hay descripción, usar el texto completo como fallback
    if (!newDesc) newDesc = aiSuggestion;

    // 4️⃣ Aplicar cambios al formulario
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      description: newDesc,
    }));

    setModalVisible(false);
  };

  return (

    <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          {initialData ? "Editar Tarea" : "Nueva Tarea"}
        </Text>

        <Input
          label="Título"
          placeholder="Ej: Completar proyecto de React Native"
          value={formData.title}
          onChangeText={(value) => handleChange("title", value)}
          onBlur={() => handleBlur("title")}
          error={touched.title ? errors.title : undefined}
          helperText="Solo letras, números y espacios (3-50 caracteres)"
          required
          maxLength={50}
        />

        <Input
          label="Descripción"
          placeholder="Ej: Desarrollar una app de gestión de tareas con todas las funcionalidades"
          value={formData.description}
          onChangeText={(value) => handleChange("description", value)}
          onBlur={() => handleBlur("description")}
          error={touched.description ? errors.description : undefined}
          helperText="Solo letras, números y espacios (5-200 caracteres)"
          required
          multiline
          numberOfLines={4}
          maxLength={200}
          textAlignVertical="top"
        />

        <View className="mb-6">
          <Text className="text-xs text-gray-500 mb-1">
            Título: {formData.title.length}/50 caracteres
          </Text>
          <Text className="text-xs text-gray-500">
            Descripción: {formData.description.length}/200 caracteres
          </Text>
        </View>

        <View className="mt-2">
          <Button
            title={submitLabel}
            onPress={handleSubmit}
            variant="primary"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          />

          <View className="mt-3">
            <Button
              title={loadingAI ? "Analizando..." : "Sugerencia de IA"}
              onPress={handleAskAI}
              variant="secondary"
              fullWidth
              disabled={loadingAI}
              iconLeft={Bot}
            />
          </View>

          {onCancel && (
            <View className="mt-3">
              <Button
                title="Cancelar"
                onPress={onCancel}
                variant="secondary"
                fullWidth
                disabled={isSubmitting}
              />
            </View>
          )}
        </View>

        {aiSuggestion && !modalVisible && (
          <View className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300">
            <Text className="font-semibold text-gray-700">
              Última sugerencia de IA:
            </Text>
            <Text className="text-gray-600 mt-2">{aiSuggestion}</Text>
          </View>
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              borderRadius: 12,
              maxHeight: "85%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>
              Gemini sugiere:
            </Text>

            <ScrollView style={{ maxHeight: "70%" }}>
              {loadingAI ? (
                <ActivityIndicator size="large" />
              ) : (
                <Text style={{ color: "#374151", lineHeight: 20 }}>
                  {aiSuggestion ?? "Sin sugerencias aún."}
                </Text>
              )}
            </ScrollView>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                onPress={applyAISuggestions}
                style={{
                  backgroundColor: "#16a34a",
                  padding: 12,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
                disabled={loadingAI}
              >
                <Check size={16} color="white" />
                <Text style={{ color: "white", marginLeft: 8 }}>
                  Aplicar cambios
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: "#dc2626",
                  padding: 12,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
                disabled={loadingAI}
              >
                <X size={16} color="white" />
                <Text style={{ color: "white", marginLeft: 8 }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
