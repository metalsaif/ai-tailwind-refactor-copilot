// app/api/refactor/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const maxDuration = 60;
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_API_KEY is not set." }, { status: 500 });
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: "No code provided." }, { status: 400 });
    }

    const prompt = `
      You are an expert Tailwind CSS developer. Your task is to refactor a snippet of HTML/CSS into clean, best-practice Tailwind CSS.
      Your response MUST be a valid JSON object with the following structure:
      {
        "refactoredCode": "The refactored HTML code...",
        "tip": "A concise, helpful tip for improvement. If there's no obvious tip, return an empty string."
      }
      Here is the user's input:
      \`\`\`
      ${code}
      \`\`\`
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const aiResponseText = result.response.text();

    let refactoredCode = "";
    let tip = "";

    // THIS IS THE FIX: Clean the AI response on the server
    try {
      // Use a regular expression to remove the markdown fences
      const cleanedJsonString = aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedJson = JSON.parse(cleanedJsonString);
      refactoredCode = parsedJson.refactoredCode || "";
      tip = parsedJson.tip || "";
    } catch (e) {
      // If parsing fails, it means the AI didn't return JSON.
      // We'll treat the entire response as the code and provide a default tip.
      console.error("Failed to parse AI JSON response:", e);
      refactoredCode = aiResponseText; 
      tip = "The AI response was not in the expected JSON format, but here is the raw output.";
    }

    // Now, we send a guaranteed-clean JSON object to the client
    return NextResponse.json({ refactoredCode, tip });

  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "An error occurred on the server while communicating with the AI." },
      { status: 500 }
    );
  }
}