const backendUrl = 'https://proverbscreator.online'; // Updated API domain

fetch(`${backendUrl}/your-endpoint`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
