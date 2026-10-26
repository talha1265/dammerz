import fs from 'fs';

// Read .env.local to set env
const envContent = fs.readFileSync('.env.local', 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

const { processWhatsAppAgentMessage } = await import('../src/lib/gemini.ts');

async function testAgent() {
  console.log('Testing BizzUp Gemini Agent...');
  const res = await processWhatsAppAgentMessage(
    'Bhai humein 150 Butterfly Valves DN200 chahiye with GST bill urgent delivery in Gurugram. Kya best rate milega?',
    'Aditya Sharma',
    '+91 99100 88201',
    'Apex Industrial Solutions',
    'premium'
  );
  console.log('✅ AGENT RESPONSE:');
  console.log(JSON.stringify(res, null, 2));
}

testAgent().catch(console.error);
