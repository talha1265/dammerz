import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const keyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = keyMatch ? keyMatch[1].trim() : process.env.GEMINI_API_KEY;

const candidateModels = [
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-pro-latest'
];

async function findWorkingModel() {
  const genAI = new GoogleGenerativeAI(apiKey);
  for (const modelName of candidateModels) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Namaste! Say 1 line greeting in Hinglish.');
      console.log(`✅ SUCCESS WITH MODEL "${modelName}":`);
      console.log('Response:', result.response.text());
      return modelName;
    } catch (e) {
      console.log(`❌ Failed with ${modelName}:`, e.message?.slice(0, 120));
    }
  }
}

findWorkingModel();
