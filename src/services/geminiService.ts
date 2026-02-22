import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateIntervention(studentData: any) {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the following student data and generate a personalized 7-day intervention plan.
    Student: ${JSON.stringify(studentData.student)}
    Academic Risk: ${studentData.risk?.academic_risk}%
    Behavioral Risk: ${studentData.risk?.behavioral_risk}%
    
    The plan should be action-oriented, time-bound, and focus on the highest risk areas.
    Format the response as a clear, structured markdown list.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI plan. Please try again later.";
  }
}

export async function chatWithAI(message: string, context: any) {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are EduGuardian AI, a supportive academic companion. 
    You have access to the student's current risk status: ${JSON.stringify(context.risk)}.
    Help the student understand their risks and provide encouraging, practical advice.
    Keep responses concise and empathetic.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: message }] }],
      config: { systemInstruction }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting right now. Let's talk later!";
  }
}
