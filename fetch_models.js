const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('Missing API key. Set EXPO_PUBLIC_GEMINI_API_KEY (or GEMINI_API_KEY) before running this script.');
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.models) {
      console.log('Available Models:');
      data.models.forEach(m => {
        console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
      });
    } else {
      console.log('Error data:', JSON.stringify(data, null, 2));
    }
  })
  .catch(err => console.error('Fetch Error:', err));
