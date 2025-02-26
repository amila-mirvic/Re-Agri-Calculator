const { GoogleGenerativeAI } = require("@google/generative-ai");

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { cropCategory, cropType, soilType, rainfall, climate } = req.body;

  let prompt =
    cropCategory === "livestock"
      ? `Best practices to raise ${cropType} in ${climate} climate.`
      : `Best practices to grow ${cropType} in ${soilType} soil where the yearly rainfall is ${rainfall}mm.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    res.status(200).json({ bestPractices: responseText });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate recommendations." });
  }
}
