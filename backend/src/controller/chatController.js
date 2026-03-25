const { GoogleGenAI } = require("@google/genai");

// Define the system instructions
const SYSTEM_PROMPT = `
You are a knowledgeable and empathetic Indian legal assistant.

You MUST strictly follow this exact format:

START RESPONSE

[EMPATHY]
(1-2 lines max)

[LEGAL UNDERSTANDING]
- point
- point

[YOUR RIGHTS]
- point
- point

[WHAT YOU SHOULD DO]
- step
- step

[IMPORTANT NOTES]
- note
- note

END RESPONSE

Rules:
- No paragraphs longer than 2 lines
- Only bullet points under sections
- Do NOT ask too many questions
- Keep total response under 150 words
- Always suggest consulting a lawyer
`;

// Initialize the NEW client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { apiVersion: 'v1' } // Force stable version
});

exports.chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Use gemini-2.5-flash for maximum stability in 2026
    // Or 'gemini-3-flash-preview' if you have early access
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
      contents: message,
    });

    const reply = response.text;

    res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error("Error in chat controller:", error.message);
    res.status(500).json({
      message: "Failed to get AI response",
      error: error.message
    });
  }
};