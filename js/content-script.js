/**
 * Content Script - Runs on all web pages
 * Handles the "Create with Gen AI" button click after redirect
 * Created: June 5, 2025
 */

(function () {
  console.log("AgentForce Assistant content script loaded");

  // Check if we're on the wizard page and need to click the AI button
  if (
    window.location.href.includes("/copilot/wizard?mode=newAgent") &&
    sessionStorage.getItem("agentforceNeedsAIButtonClick") === "true"
  ) {
    console.log("On wizard page, will attempt to click Gen AI button");

    // Clear the flag to avoid repeated clicks
    sessionStorage.removeItem("agentforceNeedsAIButtonClick");

    // Function to try clicking the button
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

        // If sparkles icon is not available, try looking for any element with "Create with Gen AI" text
        const allElements = document.querySelectorAll("*");
        for (const element of allElements) {
          if (
            element.textContent &&
            element.textContent.includes("Create with Gen AI")
          ) {
            const clickableEl =
              element.closest("label") || element.closest("button") || element;
            console.log(
              'Found element containing "Create with Gen AI" text, clicking it...'
            );
            clickableEl.click();
            return true;
          }
        }
      }

      return false;
    }

    // Try immediately but allow a delay for elements to load
    setTimeout(function () {
      if (!clickGenAIButton()) {
        console.log("Button not found on first try, will keep trying...");

        // Set up a mutation observer to keep trying if the button isn't immediately available
        const observer = new MutationObserver(function (mutations) {
          if (clickGenAIButton()) {
            // If successfully clicked, disconnect the observer
            observer.disconnect();
            console.log("Successfully clicked button, observer disconnected");
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        // Stop observing after 10 seconds to prevent resource waste
        setTimeout(() => {
          observer.disconnect();
          console.log("Observer automatically disconnected after timeout");
        }, 10000);
      }
    }, 1500);
  }
})();
