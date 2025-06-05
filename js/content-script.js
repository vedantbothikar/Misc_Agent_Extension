/**
 * Content Script - Runs on all web pages
 * Handles the "Create with Gen AI" button click after redirect and populates input fields
 * Created: June 5, 2025
 */

(function () {
  console.log("AgentForce Assistant content script loaded");

  // Pre-defined text for the input field
  const preDefinedText =
    "I want the agent to talk my customers in a polite way and address their issues by using data from Sales and Marketing Cloud";

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
        setTimeout(populateTextArea, 1500); // Try to populate text area after button click
        return true;
      } else if (genAILabel) {
        console.log('Found "Create with Gen AI" label, clicking it...');
        genAILabel.click();
        setTimeout(populateTextArea, 1500); // Try to populate text area after button click
        return true;
      } else {
        // Try a broader selector if the specific ones failed
        const sparklesIcon = document.querySelector(
          ".slds-icon-utility-sparkles"
        );
        if (sparklesIcon && sparklesIcon.closest("label")) {
          console.log("Found sparkles icon, clicking its label...");
          sparklesIcon.closest("label").click();
          setTimeout(populateTextArea, 1500); // Try to populate text area after button click
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
            setTimeout(populateTextArea, 1500); // Try to populate text area after button click
            return true;
          }
        }
      }

      return false;
    }

    /**
     * Function to populate the textarea with predefined text
     */
    function populateTextArea() {
      console.log("Attempting to populate the textarea...");

      // Try various selectors to find the textarea
      const textareaSelectors = [
        'textarea[name="jobsToBeDone"]',
        ".textarea-container textarea",
        "textarea.slds-textarea",
        "#input-80",
      ];

      let textarea = null;

      // Try each selector
      for (const selector of textareaSelectors) {
        textarea = document.querySelector(selector);
        if (textarea) {
          console.log(`Found textarea using selector: ${selector}`);
          break;
        }
      }

      // If we still don't have the textarea, try a more general approach
      if (!textarea) {
        console.log("Trying to find textarea via broader search...");
        const allTextareas = document.querySelectorAll("textarea");
        if (allTextareas.length > 0) {
          // Find the textarea that's most likely to be the one we want
          for (const ta of allTextareas) {
            if (
              ta.closest(".textarea-container") ||
              ta.id.includes("input") ||
              ta.name === "jobsToBeDone"
            ) {
              textarea = ta;
              console.log("Found textarea via broader search:", ta);
              break;
            }
          }

          // If we still don't have it, just take the first one
          if (!textarea) {
            textarea = allTextareas[0];
            console.log("Using first textarea found as fallback");
          }
        }
      }

      // If we found a textarea, set its value and dispatch events to trigger any listeners
      if (textarea) {
        // Set the value
        textarea.value = preDefinedText;
        console.log("Populated textarea with predefined text");

        // Dispatch events to trigger any listeners
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));

        // Focus and blur to ensure the value is recognized
        textarea.focus();
        textarea.blur();

        return true;
      } else {
        console.log("Could not find the textarea to populate");
        return false;
      }
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
  } else if (window.location.href.includes("/copilot/wizard")) {
    // We're on some part of the wizard, check if there's a textarea to populate
    console.log("On wizard page, checking for textarea to populate");

    // Set up a mutation observer to watch for the textarea
    const textareaObserver = new MutationObserver(function (mutations) {
      const textarea = document.querySelector(
        'textarea[name="jobsToBeDone"], .textarea-container textarea, textarea.slds-textarea'
      );
      if (textarea && !textarea.getAttribute("data-agentforce-populated")) {
        console.log(
          "Found textarea in mutation observer, attempting to populate"
        );
        textarea.value = preDefinedText;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));
        textarea.setAttribute("data-agentforce-populated", "true");

        // Focus and blur to ensure the value is recognized
        textarea.focus();
        textarea.blur();

        console.log("Populated textarea during observation");
      }
    });

    textareaObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Also try immediately and periodically
    const checkForTextarea = () => {
      const textarea = document.querySelector(
        'textarea[name="jobsToBeDone"], .textarea-container textarea, textarea.slds-textarea'
      );
      if (textarea && !textarea.getAttribute("data-agentforce-populated")) {
        console.log("Found textarea in periodic check, attempting to populate");
        textarea.value = preDefinedText;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));
        textarea.setAttribute("data-agentforce-populated", "true");

        // Focus and blur to ensure the value is recognized
        textarea.focus();
        textarea.blur();

        console.log("Populated textarea during periodic check");
        return true;
      }
      return false;
    };

    // Check immediately
    if (!checkForTextarea()) {
      // Check every second for 10 seconds
      let attempts = 0;
      const intervalId = setInterval(() => {
        attempts++;
        if (checkForTextarea() || attempts >= 10) {
          clearInterval(intervalId);
          textareaObserver.disconnect();
        }
      }, 1000);
    }
  }
})();
