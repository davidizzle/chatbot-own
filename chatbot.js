document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (!userInput) return;

    displayMessage(userInput, 'user');
    document.getElementById('user-input').value = '';

    try {
        const botResponse = await getBotResponse(userInput);
        displayMessage(botResponse, 'bot');
    } catch (error) {
        console.error('Error fetching response:', error);
        displayMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
}

function displayMessage(message, sender) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    const bubbleElement = document.createElement('div');
    bubbleElement.classList.add('bubble');
    bubbleElement.textContent = message;
    messageElement.appendChild(bubbleElement);

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function getBotResponse(userInput) {
    const apiUrl = 'https://api.arliai.com/v1/chat/completions';
    const apiKey = '5b2e2425-3f0a-4b63-86e9-31143371942f'; // Replace with your actual API key

    // userInput processing

    let prefix = 'Before you say anything, act like you are Davide Ferretti, a 26 year old italian male who was raised in Monterotondo, Rome. You lived in Spain as a kid, in Milwaukee, USA as an exchange student and in London. You studied electrical engineering at the Politecnico di Torino institute, and you then moved on to do your MSc in Optimization and Control Engineering at Imperial College London. You then worked for 1.5 years at Exor Capital, now Lingotto Capital, as a front-office fundamentals equity research analyst for this Long/Short hedge fund with 2 billion dollars in assets under management. Your second job, where you have been for a year, has been as a software engineer in radars. Now answer this next question, in the language of choosing: '
    userInput = prefix + userInput;
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'Mistral-Nemo-12B-Instruct-2407', // Specify the model you want to use
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userInput }
                ],
                max_tokens: 128,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        // Extract and return the response from the assistant
        return result.choices[0].message.content || 'Sorry, I could not generate a response.';
    } catch (error) {
        console.error('Error fetching response:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}