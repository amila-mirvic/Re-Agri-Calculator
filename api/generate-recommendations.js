import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const port = process.env.PORT || 3000;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.use(cors());
app.use(bodyParser.json());

app.post("/api/generate-recommendations", async (req, res) => {
  const { cropCategory, cropType, soilType, rainfall, climate } = req.body;
  
  let prompt = cropCategory === "livestock" 
    ? `Best practices to raise ${cropType} in ${climate} climate.`
    : `Best practices to grow ${cropType} in ${soilType} soil where the yearly rainfall is ${rainfall}mm.`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    res.json({ bestPractices: responseText });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate recommendations." });
  }
});

export default app;
