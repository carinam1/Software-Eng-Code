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
  const apiKey = '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';
  const url = 'https://api.openai.com/v1/engines/davinci-codex/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  const data = {
    prompt: `Health and fitness chatbot:\n\nUser: ${prompt}\nBot:`,
    max_tokens: 50,
    n: 1,
    stop: null,
    temperature: 0.8
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data)
    });

    const result = await response.json();
    return result.choices[0].text.trim();
  } catch (error) {
    console.error(error);
    return 'Error fetching chatbot response';
  }
}
