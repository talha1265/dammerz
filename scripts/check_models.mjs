import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const keyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
const apiKey = keyMatch ? keyMatch[1].trim() : process.env.GEMINI_API_KEY;

async function checkModels() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  if (data.models) {
    console.log('Available models:');
    data.models.forEach(m => console.log(' - ' + m.name + ' (' + m.supportedGenerationMethods.join(', ') + ')'));
  } else {
    console.log('Response:', data);
  }
}

checkModels();
