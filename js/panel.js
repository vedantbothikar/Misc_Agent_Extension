/**
 * Panel JavaScript - Implements functionality for the AgentForce Assistant DevTools panel
 * Created: June 2, 2025
 */

document.addEventListener("DOMContentLoaded", function () {
  // Cache DOM elements
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-button");
  const newChatButton = document.getElementById("new-chat-button");
  const defaultWorkflow = document.getElementById("default-workflow");
  const agentWorkflow = document.getElementById("agent-workflow");
  const button1 = document.getElementById("button1");
  const button2 = document.getElementById("button2");
  const button3 = document.getElementById("button3");
  const status1 = document.getElementById("status1");
  const status2 = document.getElementById("status2");
  const status3 = document.getElementById("status3");

  // Initialize the application
  init();

  /**
   * Initialize the application
   */
  function init() {
    // Show default workflow initially
    showDefaultWorkflow();

    // Load chat history from storage
    loadChatHistory();

    // Set up event listeners
    setupEventListeners();
  }

  /**
   * Set up event listeners for the UI elements
   */
  function setupEventListeners() {
    // Send message when send button is clicked
    sendButton.addEventListener("click", sendMessage);

    // Send message when Enter key is pressed (but allow Shift+Enter for new line)
    chatInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });

    // Clear chat history when the new chat button is clicked
    newChatButton.addEventListener("click", clearChatHistory);

    // Bottom buttons functionality
    button1.addEventListener("click", () => handleActionButtonClick(1));
    button2.addEventListener("click", () => handleActionButtonClick(2));
    button3.addEventListener("click", () => handleActionButtonClick(3));

    // Status buttons functionality
    status1.addEventListener("click", () => handleStatusButtonClick(1));
    status2.addEventListener("click", () => handleStatusButtonClick(2));
    status3.addEventListener("click", () => handleStatusButtonClick(3));
  }

  /**
   * Switch to the default workflow iframe
   */
  function showDefaultWorkflow() {
    defaultWorkflow.classList.add("active");
    agentWorkflow.classList.remove("active");
  }

  /**
   * Switch to the agent creation workflow iframe
   */
  function showAgentWorkflow() {
    agentWorkflow.classList.add("active");
    defaultWorkflow.classList.remove("active");
  }

  /**
   * Clear chat history
   */
  function clearChatHistory() {
    // Clear chat messages in the UI
    chatMessages.innerHTML = "";

    // Add welcome message
    addMessageToChat("system", "Welcome to AgentForce Assistant!");

    // Reset to default workflow
    showDefaultWorkflow();

    // Clear chat history in storage
    chrome.storage.local.remove("chatHistory", function () {
      console.log("Chat history cleared.");
    });
  }

  /**
   * Send a message from the chat input
   */
  function sendMessage() {
    const message = chatInput.value.trim();

    if (message) {
      // Add user message to chat
      addMessageToChat("user", message);

      // Clear input
      chatInput.value = "";

      // Process the message and generate a response
      processMessage(message);

      // Save chat history to storage
      saveChatHistory();
    }
  }

  /**
   * Process the user message and generate a response
   * @param {string} message - The user's message
   */
  function processMessage(message) {
    // Convert message to lowercase for easier comparison
    const lowerMessage = message.toLowerCase();

    // Add a slight delay to simulate thinking
    setTimeout(() => {
      // Check for specific message patterns and respond accordingly
      if (
        lowerMessage.includes("hi") ||
        lowerMessage.includes("hello") ||
        lowerMessage.includes("hey") ||
        lowerMessage.includes("greetings")
      ) {
        // Welcome message response
        addMessageToChat(
          "bot",
          "Hello! I am the AgentForce Assistant. I'm here to help you speed up your agent creation process. Tell me what kind of agent you'd like to create!"
        );

        // Show default workflow
        showDefaultWorkflow();
      } else if (
        lowerMessage.includes("create an agent") ||
        lowerMessage.includes("build an agent") ||
        lowerMessage.includes("make an agent") ||
        lowerMessage.includes("develop an agent") ||
        lowerMessage.includes("new agent")
      ) {
        // Agent creation response
        addMessageToChat(
          "bot",
          "I'm now starting the process to create your custom agent! Please take a look at the visual workflow diagram on the right for a step-by-step guide to the creation process. This will help you understand the stages involved in building your agent."
        );

        // Show agent creation workflow
        showAgentWorkflow();
      } else {
        // Generic response for other messages
        const genericResponses = [
          "I understand you're looking to build an agent. Could you provide more details about what tasks this agent should perform?",
          "To create the most effective agent for your needs, I'll need to know more about your specific use case. Could you elaborate?",
          "I'm ready to help you build your agent. Would you like to see some templates to get started, or do you have specific requirements in mind?",
          "Thanks for the information. Would you like your agent to focus on sales, support, or another specialized task?",
          "I can help you create an agent with those capabilities. Please refer to the workflow diagram for the creation process.",
        ];

        const randomResponse =
          genericResponses[Math.floor(Math.random() * genericResponses.length)];
        addMessageToChat("bot", randomResponse);

        // Show default workflow
        showDefaultWorkflow();
      }

      saveChatHistory();
    }, 800);
  }

  /**
   * Add a message to the chat area
   * @param {string} sender - 'user', 'bot', or 'system'
   * @param {string} text - The message text
   */
  function addMessageToChat(sender, text) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    // Add specific class based on sender
    if (sender === "user") {
      messageDiv.classList.add("user-message");
    } else if (sender === "bot") {
      messageDiv.classList.add("bot-message");
    } else if (sender === "system") {
      messageDiv.classList.add("system-message");
    }

    const messagePara = document.createElement("p");
    messagePara.textContent = text;

    messageDiv.appendChild(messagePara);
    chatMessages.appendChild(messageDiv);

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /**
   * Handle clicks on the action buttons
   * @param {number} buttonNumber - The button number (1, 2, or 3)
   */
  function handleActionButtonClick(buttonNumber) {
    switch (buttonNumber) {
      case 1:
        addMessageToChat(
          "system",
          "Starting the Quick Basic Agent creation process..."
        );
        addMessageToChat(
          "bot",
          "I'm creating a basic agent for you. This agent will handle general queries and can be customized further."
        );
        // Show agent creation workflow when creating an agent
        showAgentWorkflow();
        break;
      case 2:
        addMessageToChat(
          "system",
          "Starting the Quick Sales Agent creation process..."
        );
        addMessageToChat(
          "bot",
          "I'm creating a specialized Sales agent for you. This agent will be optimized for lead qualification, follow-ups, and sales conversations."
        );
        // Show agent creation workflow when creating an agent
        showAgentWorkflow();
        break;
      case 3:
        addMessageToChat(
          "system",
          "Starting the Quick Support Agent creation process..."
        );
        addMessageToChat(
          "bot",
          "I'm creating a Support agent for you. This agent will be optimized for customer service, troubleshooting, and issue resolution."
        );
        // Show agent creation workflow when creating an agent
        showAgentWorkflow();
        break;
    }

    saveChatHistory();
  }

  /**
   * Handle clicks on the status buttons
   * @param {number} statusNumber - The status button number (1, 2, or 3)
   */
  function handleStatusButtonClick(statusNumber) {
    switch (statusNumber) {
      case 1:
        addMessageToChat("system", "Agent Status: Ready for configuration");
        break;
      case 2:
        addMessageToChat("system", "Agent Status: In development");
        break;
      case 3:
        addMessageToChat("system", "Agent Status: Testing required");
        break;
    }

    saveChatHistory();
  }

  /**
   * Save chat history to Chrome storage
   */
  function saveChatHistory() {
    // Get all messages as an array of objects
    const messages = Array.from(chatMessages.querySelectorAll(".message")).map(
      (msg) => {
        let sender = "system";
        if (msg.classList.contains("user-message")) {
          sender = "user";
        } else if (msg.classList.contains("bot-message")) {
          sender = "bot";
        }

        return {
          sender,
          text: msg.querySelector("p").textContent,
        };
      }
    );

    // Save to Chrome storage
    chrome.storage.local.set({ chatHistory: messages }, function () {
      console.log("Chat history saved.");
    });
  }

  /**
   * Load chat history from Chrome storage
   */
  function loadChatHistory() {
    chrome.storage.local.get("chatHistory", function (data) {
      if (
        data.chatHistory &&
        Array.isArray(data.chatHistory) &&
        data.chatHistory.length > 0
      ) {
        // Clear current messages
        chatMessages.innerHTML = "";

        // Add each message from storage
        data.chatHistory.forEach((msg) => {
          addMessageToChat(msg.sender, msg.text);
        });

        // Check if we should show agent workflow
        const lastMessages = data.chatHistory.slice(-3);
        let shouldShowAgentWorkflow = false;

        // Check recent messages for agent creation phrases
        for (const msg of lastMessages) {
          const text = msg.text.toLowerCase();
          if (
            msg.sender === "bot" &&
            (text.includes("create your custom agent") ||
              text.includes("creating a basic agent") ||
              text.includes("creating a specialized sales agent") ||
              text.includes("creating a support agent"))
          ) {
            shouldShowAgentWorkflow = true;
            break;
          }
        }

        // Set the right workflow diagram based on chat history
        if (shouldShowAgentWorkflow) {
          showAgentWorkflow();
        } else {
          showDefaultWorkflow();
        }

        console.log("Chat history loaded.");
      }
    });
  }
});
