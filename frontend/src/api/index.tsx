const backendUrl =  import.meta.env.VITE_API_URL;

fetch(`${backendUrl}/your-endpoint`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
