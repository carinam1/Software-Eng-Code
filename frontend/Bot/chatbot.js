const input = document.getElementById('input');
const send = document.getElementById('send');
const messages = document.getElementById('messages');

function appendMessage(text, isUserMessage) {
  const message = document.createElement('div');
  message.classList.add(isUserMessage ? 'user-message' : 'bot-message');
  message.textContent = text;
  messages.appendChild(message);
}

send.addEventListener('click', async () => {
  const message = input.value.trim();
  if (!message) return;
  appendMessage(message, true);
  input.value = '';

  const response = await fetchChatbotResponse(message);
  appendMessage(response, false);
});

async function fetchChatbotResponse(prompt) {
  const url = '/chatbot';
  const headers = {
    'Content-Type': 'application/json',
  };
  const data = {
    message: prompt,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return result.response;
  } catch (error) {
    console.error(error);
    return 'Error fetching chatbot response';
  }
}
