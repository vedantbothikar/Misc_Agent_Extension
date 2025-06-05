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
          "I'm highlighting the 'New agent' button and automatically redirecting you to create a basic agent. You'll be taken to the wizard where I'll automatically select 'Create with Gen AI', pre-fill the agent description, click the Next button, fill in company information, and complete all steps for you."
        );
        // Show agent creation workflow when creating an agent
        showAgentWorkflow();

        // Highlight the "New agent" button and automatically redirect
        simulateClickOnNewAgentButton();
        break;
      case 2:
        addMessageToChat(
          "system",
          "Starting the Quick Sales Agent creation process..."
        );
        addMessageToChat(
          "bot",
          "I'm highlighting the 'New agent' button and automatically redirecting you to create a specialized Sales agent. You'll be taken to the wizard where I'll automatically select 'Create with Gen AI', pre-fill the agent description, click the Next button, fill in company information, and complete all steps for you."
        );
        // Show agent creation workflow when creating an agent
        showAgentWorkflow();

        // Highlight the "New agent" button and automatically redirect
        simulateClickOnNewAgentButton();
        break;
      case 3:
        addMessageToChat(
          "system",
          "Starting the Quick Support Agent creation process..."
        );
        addMessageToChat(
          "bot",
          "I'm highlighting the 'New agent' button and automatically redirecting you to create a Support agent. You'll be taken to the wizard where I'll automatically select 'Create with Gen AI', pre-fill the agent description, click the Next button, fill in company information, and complete all steps for you."
        );
        // Show agent creation workflow when creating an agent
        showAgentWorkflow();

        // Highlight the "New agent" button and automatically redirect
        simulateClickOnNewAgentButton();
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
   * Highlight the "New agent" button on the webpage and automatically redirect after a delay
   */
  function simulateClickOnNewAgentButton() {
    // Execute a content script that finds, highlights, and automatically redirects from the "New agent" button
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      if (activeTab) {
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTab.id },
            function: highlightAndRedirectFromNewAgentButton,
          },
          function (results) {
            if (chrome.runtime.lastError) {
              console.error(
                "Error executing script:",
                chrome.runtime.lastError.message
              );
              addMessageToChat(
                "system",
                "Failed to highlight the 'New agent' button and redirect. Attempting manual redirect..."
              );
              // Attempt manual redirect as a fallback
              chrome.tabs.update(activeTab.id, {
                url: `https://${
                  new URL(activeTab.url).host
                }/AiCopilot/copilotStudio.app#/copilot/wizard?mode=newAgent`,
              });
            } else {
              console.log(
                "Button highlight and auto-redirect script executed successfully"
              );
              addMessageToChat(
                "system",
                "Highlighting and automatically redirecting to the wizard page. I'll automatically: 1) select 'Create with Gen AI', 2) pre-fill the agent description, 3) click the Next button, 4) fill in company information fields, and continue through the workflow."
              );
            }
          }
        );
      } else {
        console.error("No active tab found");
        addMessageToChat(
          "system",
          "No active tab found. Please navigate to the agent creation page first."
        );
      }
    });
  }

  /**
   * Function to be executed in the context of the web page to find and highlight the "New agent" button,
   * then automatically redirect to the wizard URL after a brief delay
   */
  function highlightAndRedirectFromNewAgentButton() {
    const newAgentButton = document.querySelector(
      '[data-e2e="gen_ai_agentbuilder-add-new-item"] button'
    );

    if (newAgentButton) {
      // Create a pulsating highlight effect around the button
      newAgentButton.style.outline = "4px solid #ff4d4f";
      newAgentButton.style.boxShadow = "0 0 10px #ff4d4f";
      newAgentButton.style.transition = "all 0.5s";
      newAgentButton.style.position = "relative";

      // Add a tooltip above the button
      const tooltip = document.createElement("div");
      tooltip.textContent = "Automatically redirecting in 1 second...";
      tooltip.style.position = "absolute";
      tooltip.style.top = "-40px";
      tooltip.style.left = "50%";
      tooltip.style.transform = "translateX(-50%)";
      tooltip.style.backgroundColor = "#ff4d4f";
      tooltip.style.color = "white";
      tooltip.style.padding = "5px 10px";
      tooltip.style.borderRadius = "4px";
      tooltip.style.fontSize = "14px";
      tooltip.style.fontWeight = "bold";
      tooltip.style.zIndex = "1000";
      tooltip.style.whiteSpace = "nowrap";

      // Add arrow pointing to the button
      tooltip.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
      tooltip.style.position = "absolute";
      tooltip.style.opacity = "0";
      tooltip.style.animation = "fadeIn 0.5s forwards";

      // Create and add a style element for the animation
      const styleEl = document.createElement("style");
      styleEl.textContent = `
        @keyframes fadeIn {
          0% { opacity: 0; transform: translate(-50%, 10px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 5px #ff4d4f; }
          50% { box-shadow: 0 0 15px #ff4d4f, 0 0 20px #ff7875; }
          100% { box-shadow: 0 0 5px #ff4d4f; }
        }
      `;
      document.head.appendChild(styleEl);

      // Add pulsating effect
      newAgentButton.style.animation = "pulse 1.5s infinite";

      // Get the parent container with positioning to add the tooltip
      let container = newAgentButton.parentElement;
      if (container) {
        if (window.getComputedStyle(container).position === "static") {
          container.style.position = "relative";
        }
        container.appendChild(tooltip);
      } else {
        // If no suitable parent, add tooltip to the button itself
        newAgentButton.appendChild(tooltip);
      }

      // Function to handle the automatic redirection
      function performAutoRedirect() {
        // Get the current host URL
        const currentHostUrl = window.location.host;

        // Create the redirect URL
        const redirectUrl = `https://${currentHostUrl}/AiCopilot/copilotStudio.app#/copilot/wizard?mode=newAgent`;

        console.log(`Auto-redirecting to: ${redirectUrl}`);

        // Store the redirect URL in session storage for the next page to read
        sessionStorage.setItem("agentforceRedirectUrl", redirectUrl);
        sessionStorage.setItem("agentforceNeedsAIButtonClick", "true");

        // Add a visual indication that redirection is happening
        tooltip.textContent = "Redirecting now...";
        tooltip.style.backgroundColor = "#52c41a";

        // Flash the button before redirecting
        newAgentButton.style.backgroundColor = "#ff4d4f";

        // Redirect to the wizard URL after a brief visual indication
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 200);
      }

      // Also keep the click event as backup in case automatic redirect doesn't work
      newAgentButton.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        performAutoRedirect();
        return true;
      });

      // Set a timeout to automatically redirect after 1 second
      setTimeout(performAutoRedirect, 1000);

      // Also set up a MutationObserver to detect URL changes and click the Gen AI button if needed
      setupGenAIButtonObserver();

      console.log(
        'Successfully highlighted the "New agent" button and set auto-redirect'
      );
      return true;
    } else {
      console.error('Could not find the "New agent" button on the page');
      return false;
    }
  }

  /**
   * Set up an observer to detect when we're on the wizard page to click the "Create with Gen AI" button
   */
  function setupGenAIButtonObserver() {
    // Check if we are on the wizard page and need to click the AI button
    if (
      window.location.href.includes("/copilot/wizard?mode=newAgent") &&
      sessionStorage.getItem("agentforceNeedsAIButtonClick") === "true"
    ) {
      // Clear the flag to avoid repeated clicks
      sessionStorage.removeItem("agentforceNeedsAIButtonClick");

      // Add a delay to allow the page to fully load
      setTimeout(clickGenAIButton, 1500);

      // Also set up a mutation observer to keep trying if the button isn't immediately available
      const observer = new MutationObserver(function (mutations) {
        clickGenAIButton();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Stop observing after 10 seconds to prevent resource waste
      setTimeout(() => observer.disconnect(), 10000);
    }
  }

  /**
   * Try to find and click the "Create with Gen AI" button
   */
  function clickGenAIButton() {
    // Look for the "Create with Gen AI" input or label using various selectors
    const genAIOption = document.querySelector(
      'input[aria-label="Create with Gen AI"]'
    );
    const genAILabel = document.querySelector(
      'label[for^="agentWithAIAssist-"]'
    );

    // Try to click on the appropriate element
    if (genAIOption) {
      console.log('Found "Create with Gen AI" input, clicking it...');
      genAIOption.click();
      return true;
    } else if (genAILabel) {
      console.log('Found "Create with Gen AI" label, clicking it...');
      genAILabel.click();
      return true;
    } else {
      // Try a broader selector if the specific ones failed
      const sparklesIcon = document.querySelector(
        ".slds-icon-utility-sparkles"
      );
      if (sparklesIcon && sparklesIcon.closest("label")) {
        console.log("Found sparkles icon, clicking its label...");
        sparklesIcon.closest("label").click();
        return true;
      }
    }

    return false;
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
