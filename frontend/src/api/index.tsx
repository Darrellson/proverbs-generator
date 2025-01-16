const backendUrl =  import.meta.env.VITE_API_URL; // Updated API domain

fetch(`${backendUrl}/your-endpoint`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
