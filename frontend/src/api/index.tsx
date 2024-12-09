const backendUrl = 'https://express-backend-414536605087.us-central1.run.app'; // Cloud Run URL

fetch(`${backendUrl}/your-endpoint`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
