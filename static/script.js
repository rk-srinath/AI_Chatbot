document.addEventListener("DOMContentLoaded", () => {
    createNewConversation(); // Ensure a new conversation group is created
    loadChatHistory(); // Load chat history on page load
});

// Send Message Function
function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    if (userInput.trim() === "") return;

    addMessage(userInput, "user-message");

    // Show typing animation with dots
    let typingDiv = document.createElement("div");
    typingDiv.classList.add("chat-message", "bot-message", "typing-indicator");
    typingDiv.textContent = "..."; // Show only dots
    document.getElementById("chat-box").appendChild(typingDiv);
    document.getElementById("chat-box").scrollTop = document.getElementById("chat-box").scrollHeight;

    fetch("/get_response", {
        method: "POST",
        body: JSON.stringify({ message: userInput }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        setTimeout(() => {
            typingDiv.remove();
            addMessage(data.response, "bot-message");
            saveConversation(userInput, data.response); // Save the conversation after AI response
        }, 1000);
    })
    .catch(error => {
        console.error("Error:", error);
        typingDiv.remove();
        addMessage("Sorry, an error occurred.", "bot-message");
    });

    document.getElementById("user-input").value = "";
}

// Add Message to Chatbox
function addMessage(text, className) {
    let chatBox = document.getElementById("chat-box");
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", className);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Save Full Conversation
function saveConversation(userMsg, botMsg) {
    let history = JSON.parse(localStorage.getItem("chatSessions")) || [];

    // Create a new session for each new page load if previous session is completed
    let currentSession = history[history.length - 1];
    if (!currentSession || currentSession.completed) {
        currentSession = { messages: [], completed: false };
        history.push(currentSession);
    }

    currentSession.messages.push({ user: userMsg, bot: botMsg });
    localStorage.setItem("chatSessions", JSON.stringify(history));

    loadChatHistory(); // Update chat history UI after saving
}

// Create a New Conversation (start a new session after each refresh)
function createNewConversation() {
    let history = JSON.parse(localStorage.getItem("chatSessions")) || [];
    
    // If the last session is completed, create a new one
    if (!history.length || history[history.length - 1].completed) {
        history.push({ messages: [], completed: false });
        localStorage.setItem("chatSessions", JSON.stringify(history));
    }
}

// Load Chat History
function loadChatHistory() {
    let historyList = document.getElementById("history-list");
    historyList.innerHTML = ""; // Clear previous history list
    let history = JSON.parse(localStorage.getItem("chatSessions")) || [];

    if (history.length === 0) {
        historyList.innerHTML = "<li>No previous chats</li>"; // Display message if no history exists
    }

    history.forEach((session, index) => {
        let item = document.createElement("li");
        item.textContent = `Previous Chat ${index + 1}`; // Change to "Previous Chat"
        item.onclick = () => loadChat(index);
        historyList.appendChild(item);
    });
}

// Load Selected Conversation
function loadChat(index) {
    let history = JSON.parse(localStorage.getItem("chatSessions")) || [];
    let session = history[index];
    let chatBox = document.getElementById("chat-box");

    chatBox.innerHTML = ""; // Clear current chat

    session.messages.forEach(message => {
        addMessage(message.user, "user-message");
        addMessage(message.bot, "bot-message");
    });
}

// Handle Enter Key Press to Send Message
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
