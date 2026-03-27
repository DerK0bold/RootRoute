
const apiKey = 'AIzaSyDFObelaqf_w21HKYhnSYMCzjpIJcyZcDY';
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
