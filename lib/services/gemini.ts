// lib/services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
  throw new Error("No se encontró EXPO_PUBLIC_GEMINI_API_KEY en el .env");
}

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);

export async function getTaskImprovements(task: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
      Eres un asistente experto en productividad. 
      Vas a analizar la siguiente tarea escrita por un usuario:
      -----
      ${task}
      -----
      Devuélveme sugerencias claras en formato:
      1. Mejorar título
      2. Mejorar descripción
      3. Opcional: pasos sugeridos
    `;

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    console.error("Error al consultar Gemini:", error);
    return "Hubo un problema al consultar la IA.";
  }
}
