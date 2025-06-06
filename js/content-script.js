/**
 * Content Script - Runs on all web pages
 * Handles the "Create with Gen AI" button click after redirect, populates input fields, and clicks the Next button
 * Created: June 5, 2025
 */

(function () {
  console.log("AgentForce Assistant content script loaded");

  // Pre-defined text for the input field
  const preDefinedText =
    "I want the agent to talk my customers in a polite way and address their issues by using data from Sales and Marketing Cloud";

  // Company information for form fields
  const companyName = "Resorts and Vacations - Sun and Spa Brothers LLC";
  const companyDescription =
    "Vacations, Resorts, tours, whatever you want, we are the Answer! We have weekly, monthly, as well as annual packages that you may like";

  // Generate a unique API name based on timestamp
  function generateUniqueApiName() {
    // Use timestamp to ensure uniqueness
    const timestamp = new Date().getTime().toString().slice(-6);
    // return `Customer_Care_Agent_${timestamp}`;
    console.log("Timestamp for API Name:", timestamp);
    return `Customer_Care_Agent_${timestamp}`;
  }

  /**
   * Function to populate the company information fields after the "Next" button is clicked
   */
  function populateCompanyInfo() {
    console.log("Attempting to populate company information...");

    // Add a delay to make sure elements are loaded properly
    setTimeout(() => {
      // Try to find the company name input field
      const companyNameSelectors = [
        'input[name="companyName"]',
        'input[placeholder="Enter the company name..."]',
        'input.slds-input[type="text"]',
        "#input-121",
      ];

      let companyNameInput = null;

      // Try each company name selector
      for (const selector of companyNameSelectors) {
        companyNameInput = document.querySelector(selector);
        if (companyNameInput) {
          console.log(`Found company name input using selector: ${selector}`);
          break;
        }
      }

      // Try to find the API Name input field
      const apiNameSelectors = [
        'input[placeholder="Enter API Name"]',
        "#input-106",
        "input.slds-input[required]",
      ];

      let apiNameInput = null;

      // Try each API name selector
      for (const selector of apiNameSelectors) {
        apiNameInput = document.querySelector(selector);
        if (apiNameInput) {
          console.log(`Found API name input using selector: ${selector}`);
          break;
        }
      }

      // Try to find the company description textarea
      const companyDescriptionSelectors = [
        'textarea[name="company"]',
        ".textarea-container textarea",
        "textarea.slds-textarea",
        "#input-128",
      ];

      let companyDescriptionTextarea = null;

      // Try each company description selector
      for (const selector of companyDescriptionSelectors) {
        companyDescriptionTextarea = document.querySelector(selector);
        if (companyDescriptionTextarea) {
          console.log(
            `Found company description textarea using selector: ${selector}`
          );
          break;
        }
      }

      // If either field wasn't found, try a broader approach
      if (!companyNameInput) {
        console.log("Trying broader search for company name input...");
        const allInputs = document.querySelectorAll('input[type="text"]');
        for (const input of allInputs) {
          if (
            input.name === "companyName" ||
            input.placeholder?.includes("company name") ||
            input.id?.includes("input")
          ) {
            companyNameInput = input;
            console.log("Found company name input via broader search");
            break;
          }
        }
      }

      if (!companyDescriptionTextarea) {
        console.log(
          "Trying broader search for company description textarea..."
        );
        const allTextareas = document.querySelectorAll("textarea");
        for (const textarea of allTextareas) {
          if (
            textarea.name === "company" ||
            textarea.placeholder?.includes("company") ||
            textarea.closest(".textarea-container")
          ) {
            companyDescriptionTextarea = textarea;
            console.log(
              "Found company description textarea via broader search"
            );
            break;
          }
        }
      }

      // If API Name field wasn't found, try a broader approach
      if (!apiNameInput) {
        console.log("Trying broader search for API Name input...");
        const allInputs = document.querySelectorAll('input[type="text"]');
        for (const input of allInputs) {
          if (
            input.placeholder === "Enter API Name" ||
            input.id === "input-106" ||
            (input.required &&
              input.className.includes("slds-input") &&
              !input.placeholder?.includes("company"))
          ) {
            apiNameInput = input;
            console.log("Found API Name input via broader search");
            break;
          }
        }
      }

      // Populate company name if found
      if (companyNameInput) {
        companyNameInput.value = companyName;
        companyNameInput.dispatchEvent(new Event("input", { bubbles: true }));
        companyNameInput.dispatchEvent(new Event("change", { bubbles: true }));
        companyNameInput.focus();
        companyNameInput.blur();
        console.log("Populated company name field");
      } else {
        console.log("Could not find company name input field");
      }

      // Populate company description if found
      if (companyDescriptionTextarea) {
        companyDescriptionTextarea.value = companyDescription;
        companyDescriptionTextarea.dispatchEvent(
          new Event("input", { bubbles: true })
        );
        companyDescriptionTextarea.dispatchEvent(
          new Event("change", { bubbles: true })
        );
        companyDescriptionTextarea.focus();
        companyDescriptionTextarea.blur();
        console.log("Populated company description field");
      } else {
        console.log("Could not find company description textarea");
      }

      // Populate API Name if found
      if (apiNameInput) {
        const uniqueApiName = generateUniqueApiName();
        apiNameInput.value = uniqueApiName;
        apiNameInput.dispatchEvent(new Event("input", { bubbles: true }));
        apiNameInput.dispatchEvent(new Event("change", { bubbles: true }));
        apiNameInput.focus();
        apiNameInput.blur();
        console.log(`Populated API Name field with: ${uniqueApiName}`);

        // If all fields are populated, click the Next button after a short delay
        if (companyNameInput && companyDescriptionTextarea) {
          setTimeout(() => {
            clickCustomizeYourAgentNextButton();
          }, 1000);
        }
      } else {
        console.log("Could not find API Name input field");

        // If API Name wasn't found but other fields were, still try to proceed
        if (companyNameInput && companyDescriptionTextarea) {
          setTimeout(() => {
            clickCustomizeYourAgentNextButton();
          }, 1000);
        }
      }

      // Set up an observer to try again if not found initially
      if (!companyNameInput || !companyDescriptionTextarea) {
        console.log("Setting up observer to find missing fields");
        const companyInfoObserver = new MutationObserver(() => {
          let foundMissing = false;

          // Try to find company name input if it wasn't found before
          if (!companyNameInput) {
            companyNameInput = document.querySelector(
              'input[name="companyName"], #input-121'
            );
            if (companyNameInput) {
              companyNameInput.value = companyName;
              companyNameInput.dispatchEvent(
                new Event("input", { bubbles: true })
              );
              companyNameInput.dispatchEvent(
                new Event("change", { bubbles: true })
              );
              foundMissing = true;
              console.log(
                "Found and populated company name field via observer"
              );
            }
          }

          // Try to find company description textarea if it wasn't found before
          if (!companyDescriptionTextarea) {
            companyDescriptionTextarea = document.querySelector(
              'textarea[name="company"], #input-128'
            );
            if (companyDescriptionTextarea) {
              companyDescriptionTextarea.value = companyDescription;
              companyDescriptionTextarea.dispatchEvent(
                new Event("input", { bubbles: true })
              );
              companyDescriptionTextarea.dispatchEvent(
                new Event("change", { bubbles: true })
              );
              foundMissing = true;
              console.log(
                "Found and populated company description field via observer"
              );
            }
          }

          // Try to find API Name input if it wasn't found before
          if (!apiNameInput) {
            apiNameInput = document.querySelector(
              'input[placeholder="Enter API Name"], #input-106'
            );
            if (apiNameInput) {
              const uniqueApiName = generateUniqueApiName();
              apiNameInput.value = uniqueApiName;
              apiNameInput.dispatchEvent(new Event("input", { bubbles: true }));
              apiNameInput.dispatchEvent(
                new Event("change", { bubbles: true })
              );
              foundMissing = true;
              console.log(
                `Found and populated API Name field via observer with: ${uniqueApiName}`
              );
            }
          }

          // If all fields were found, disconnect the observer
          if (companyNameInput && companyDescriptionTextarea) {
            companyInfoObserver.disconnect();
            console.log(
              "Required fields found and populated, observer disconnected"
            );

            // Try to click the Next button after fields are populated
            setTimeout(() => {
              clickCustomizeYourAgentNextButton();
            }, 1000);
          }
        });

        companyInfoObserver.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: false,
        });

        // Stop observing after 10 seconds to prevent resource waste
        setTimeout(() => companyInfoObserver.disconnect(), 10000);
      }
    }, 2000); // Wait 2 seconds after Next button is clicked
  }

  /**
   * Function to click the "Next" button after company information is filled
   * This is the second Next button in the flow, called "CustomizeYourAgentNext"
   */
  function clickCustomizeYourAgentNextButton() {
    console.log("Attempting to click the CustomizeYourAgentNext button...");

    // Try different selectors for the Next button
    const nextButtonSelectors = [
      'lightning-button[data-id="nextButton"] button',
      "button.slds-button_brand:not([disabled])",
      "button.slds-button.slds-button_brand:not([disabled])",
      'button[type="button"][part="button"]:not([disabled])',
      'button:contains("Next")',
    ];

    let nextButton = null;

    // Try each selector
    for (const selector of nextButtonSelectors) {
      try {
        // For the contains selector, we need a different approach
        if (selector.includes(":contains")) {
          const allButtons = document.querySelectorAll("button");
          for (const btn of allButtons) {
            if (btn.textContent.trim() === "Next" && !btn.disabled) {
              nextButton = btn;
              console.log(`Found Next button using text content matching`);
              break;
            }
          }
        } else {
          nextButton = document.querySelector(selector);
        }

        if (nextButton) {
          console.log(`Found Next button using selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}:`, e);
      }
    }

    // If we still don't have the button, try a more general approach
    if (!nextButton) {
      console.log("Trying to find Next button via broader search...");

      // Find all buttons with "Next" text that are not disabled
      const allButtons = document.querySelectorAll("button");
      for (const btn of allButtons) {
        if (btn.textContent.trim() === "Next" && !btn.disabled) {
          nextButton = btn;
          console.log("Found Next button via text content search");
          break;
        }
      }

      // If still not found, try looking for lightning-button with "Next"
      if (!nextButton) {
        const lightningButtons = document.querySelectorAll("lightning-button");
        for (const lb of lightningButtons) {
          if (lb.textContent && lb.textContent.includes("Next")) {
            // Try to find the actual button inside
            const btn = lb.querySelector("button:not([disabled])");
            if (btn) {
              nextButton = btn;
              console.log("Found Next button inside lightning-button");
              break;
            }
          }
        }
      }
    }

    // If we found a button, click it
    if (nextButton) {
      // Add a visual indicator that we're clicking the button
      const originalBackgroundColor = nextButton.style.backgroundColor;
      const originalTransition = nextButton.style.transition;

      // Apply a brief animation to show the click
      nextButton.style.transition = "background-color 0.3s ease";
      nextButton.style.backgroundColor = "#76b900";

      setTimeout(() => {
        // Click the button
        console.log("Clicking the CustomizeYourAgentNext button");
        nextButton.click();

        // Also try dispatch events in case click doesn't work
        nextButton.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );

        // Restore original style after a delay
        setTimeout(() => {
          nextButton.style.backgroundColor = originalBackgroundColor;
          nextButton.style.transition = originalTransition;
        }, 300);

        // After clicking the "CustomizeYourAgent Next" button, click the AddTopicsNext button after a delay
        setTimeout(() => {
          clickAddTopicsNextButton();
        }, 2000);
      }, 300);

      return true;
    } else {
      console.log("Could not find the CustomizeYourAgentNext button");

      // Set up an observer to find the button when it becomes available
      const nextButtonObserver = new MutationObserver(function () {
        const found = clickCustomizeYourAgentNextButton();
        if (found) {
          nextButtonObserver.disconnect();
        }
      });

      nextButtonObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Stop observing after 10 seconds
      setTimeout(() => nextButtonObserver.disconnect(), 10000);

      return false;
    }
  }

  /**
   * Function to click the "Next" button on the Add Topics screen
   * This is called "AddTopicsNext" button
   */
  function clickAddTopicsNextButton() {
    console.log("Attempting to click the AddTopicsNext button...");

    // Try different selectors for the Next button
    const nextButtonSelectors = [
      'lightning-button[data-id="nextButton"] button',
      "button.slds-button_brand:not([disabled])",
      "button.slds-button.slds-button_brand:not([disabled])",
      'button[type="button"][part="button"]:not([disabled])',
      'button:contains("Next")',
    ];

    let nextButton = null;

    // Try each selector
    for (const selector of nextButtonSelectors) {
      try {
        // For the contains selector, we need a different approach
        if (selector.includes(":contains")) {
          const allButtons = document.querySelectorAll("button");
          for (const btn of allButtons) {
            if (btn.textContent.trim() === "Next" && !btn.disabled) {
              nextButton = btn;
              console.log(
                `Found AddTopicsNext button using text content matching`
              );
              break;
            }
          }
        } else {
          nextButton = document.querySelector(selector);
        }

        if (nextButton) {
          console.log(`Found AddTopicsNext button using selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}:`, e);
      }
    }

    // If we still don't have the button, try a more general approach
    if (!nextButton) {
      console.log("Trying to find AddTopicsNext button via broader search...");

      // Find all buttons with "Next" text that are not disabled
      const allButtons = document.querySelectorAll("button");
      for (const btn of allButtons) {
        if (btn.textContent.trim() === "Next" && !btn.disabled) {
          nextButton = btn;
          console.log("Found AddTopicsNext button via text content search");
          break;
        }
      }

      // If still not found, try looking for lightning-button with "Next"
      if (!nextButton) {
        const lightningButtons = document.querySelectorAll("lightning-button");
        for (const lb of lightningButtons) {
          if (lb.textContent && lb.textContent.includes("Next")) {
            // Try to find the actual button inside
            const btn = lb.querySelector("button:not([disabled])");
            if (btn) {
              nextButton = btn;
              console.log("Found AddTopicsNext button inside lightning-button");
              break;
            }
          }
        }
      }
    }

    // If we found a button, click it
    if (nextButton) {
      // Add a visual indicator that we're clicking the button
      const originalBackgroundColor = nextButton.style.backgroundColor;
      const originalTransition = nextButton.style.transition;

      // Apply a brief animation to show the click
      nextButton.style.transition = "background-color 0.3s ease";
      nextButton.style.backgroundColor = "#76b900";

      setTimeout(() => {
        // Click the button
        console.log("Clicking the AddTopicsNext button");
        nextButton.click();

        // Also try dispatch events in case click doesn't work
        nextButton.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );

        // Restore original style after a delay
        setTimeout(() => {
          nextButton.style.backgroundColor = originalBackgroundColor;
          nextButton.style.transition = originalTransition;
        }, 300);

        // After clicking the "AddTopicsNext" button, click the Create button after a delay
        setTimeout(() => {
          clickCreateButton();
        }, 2000);
      }, 300);

      return true;
    } else {
      console.log("Could not find the AddTopicsNext button");

      // Set up an observer to find the button when it becomes available
      const nextButtonObserver = new MutationObserver(function () {
        const found = clickAddTopicsNextButton();
        if (found) {
          nextButtonObserver.disconnect();
        }
      });

      nextButtonObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Stop observing after 10 seconds
      setTimeout(() => nextButtonObserver.disconnect(), 10000);

      return false;
    }
  }

  /**
   * Function to click the final "Create" button on the last screen
   */
  function clickCreateButton() {
    console.log("Attempting to click the Create button...");

    // Try different selectors for the Create button
    const createButtonSelectors = [
      'lightning-button[data-id="nextButton"] button',
      "button.slds-button_brand:not([disabled])",
      "button.slds-button.slds-button_brand:not([disabled])",
      'button[type="button"][part="button"]:not([disabled])',
      'button:contains("Create")',
    ];

    let createButton = null;

    // Try each selector
    for (const selector of createButtonSelectors) {
      try {
        // For the contains selector, we need a different approach
        if (selector.includes(":contains")) {
          const allButtons = document.querySelectorAll("button");
          for (const btn of allButtons) {
            if (btn.textContent.trim() === "Create" && !btn.disabled) {
              createButton = btn;
              console.log(`Found Create button using text content matching`);
              break;
            }
          }
        } else {
          // For other selectors, first get all matching buttons
          const buttons = document.querySelectorAll(selector);
          for (const btn of buttons) {
            // Check if any of these buttons has "Create" text
            if (btn.textContent.trim() === "Create") {
              createButton = btn;
              console.log(`Found Create button using selector: ${selector}`);
              break;
            }
          }
        }

        if (createButton) {
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}:`, e);
      }
    }

    // If we still don't have the button, try a more general approach
    if (!createButton) {
      console.log("Trying to find Create button via broader search...");

      // Find all buttons with "Create" text that are not disabled
      const allButtons = document.querySelectorAll("button");
      for (const btn of allButtons) {
        if (btn.textContent.trim() === "Create" && !btn.disabled) {
          createButton = btn;
          console.log("Found Create button via text content search");
          break;
        }
      }

      // If still not found, try looking for lightning-button with "Create"
      if (!createButton) {
        const lightningButtons = document.querySelectorAll("lightning-button");
        for (const lb of lightningButtons) {
          if (lb.textContent && lb.textContent.includes("Create")) {
            // Try to find the actual button inside
            const btn = lb.querySelector("button:not([disabled])");
            if (btn) {
              createButton = btn;
              console.log("Found Create button inside lightning-button");
              break;
            }
          }
        }
      }
    }

    // If we found a button, click it
    if (createButton) {
      // Add a visual indicator that we're clicking the button
      const originalBackgroundColor = createButton.style.backgroundColor;
      const originalTransition = createButton.style.transition;

      // Apply a brief animation to show the click
      createButton.style.transition = "background-color 0.3s ease";
      createButton.style.backgroundColor = "#76b900";

      setTimeout(() => {
        // Click the button
        console.log("Clicking the Create button");
        createButton.click();

        // Also try dispatch events in case click doesn't work
        createButton.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );

        // Restore original style after a delay
        setTimeout(() => {
          createButton.style.backgroundColor = originalBackgroundColor;
          createButton.style.transition = originalTransition;
        }, 300);

        console.log("Create button clicked, agent creation process complete!");
      }, 300);

      return true;
    } else {
      console.log("Could not find the Create button");

      // Set up an observer to find the button when it becomes available
      const createButtonObserver = new MutationObserver(function () {
        const found = clickCreateButton();
        if (found) {
          createButtonObserver.disconnect();
        }
      });

      createButtonObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Stop observing after 10 seconds
      setTimeout(() => createButtonObserver.disconnect(), 10000);

      return false;
    }
  }

  /**
   * Function to click the "Next" button on the "Select an Agent" page
   * This is distinguished from other Next buttons by calling it "SelectAnAgentNext"
   */
  function clickSelectAnAgentNextButton() {
    console.log("Attempting to click the SelectAnAgentNext button...");

    // Try different selectors for the Next button
    const nextButtonSelectors = [
      'lightning-button[data-id="nextButton"] button',
      "button.slds-button_brand",
      "button.slds-button.slds-button_brand",
      'button[type="button"][part="button"]',
      'button:contains("Next")',
    ];

    let nextButton = null;

    // Try each selector
    for (const selector of nextButtonSelectors) {
      try {
        // For the contains selector, we need a different approach
        if (selector.includes(":contains")) {
          const allButtons = document.querySelectorAll("button");
          for (const btn of allButtons) {
            if (btn.textContent.trim() === "Next") {
              nextButton = btn;
              console.log(`Found Next button using text content matching`);
              break;
            }
          }
        } else {
          nextButton = document.querySelector(selector);
        }

        if (nextButton) {
          console.log(`Found Next button using selector: ${selector}`);
          break;
        }
      } catch (e) {
        console.log(`Error with selector ${selector}:`, e);
      }
    }

    // If we still don't have the button, try a more general approach
    if (!nextButton) {
      console.log("Trying to find Next button via broader search...");
      // Find all buttons with "Next" text
      const allButtons = document.querySelectorAll("button");
      for (const btn of allButtons) {
        if (btn.textContent.trim() === "Next") {
          nextButton = btn;
          console.log("Found Next button via text content search");
          break;
        }
      }

      // If still not found, try looking for lightning-button with "Next"
      if (!nextButton) {
        const lightningButtons = document.querySelectorAll("lightning-button");
        for (const lb of lightningButtons) {
          if (lb.textContent && lb.textContent.includes("Next")) {
            // Try to find the actual button inside
            const btn = lb.querySelector("button");
            if (btn) {
              nextButton = btn;
              console.log("Found Next button inside lightning-button");
              break;
            }
          }
        }
      }
    }

    // If we found a button, click it
    if (nextButton) {
      // Click the button
      console.log("Clicking the Next button");
      nextButton.click();

      // Also try dispatch events in case click doesn't work
      nextButton.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      // After clicking the "Next" button, populate the company information
      populateCompanyInfo();

      return true;
    } else {
      console.log("Could not find the Next button");

      // Set up an observer to find the button when it becomes available
      const nextButtonObserver = new MutationObserver(function () {
        const found = clickSelectAnAgentNextButton();
        if (found) {
          nextButtonObserver.disconnect();
        }
      });

      nextButtonObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Stop observing after 10 seconds
      setTimeout(() => nextButtonObserver.disconnect(), 10000);

      return false;
    }
  }

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

        // After populating the textarea, try to click the Next button
        setTimeout(() => {
          clickSelectAnAgentNextButton();
        }, 1000);

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

    // Also check for company information fields in case we're on that page
    populateCompanyInfo();

    // Check if we need to click the CustomizeYourAgentNext button
    if (document.querySelector('input[name="companyName"], #input-121')) {
      console.log("Found company name field, we're on the company info page");

      // Try clicking the next button if company fields are already populated
      setTimeout(() => {
        const companyNameField = document.querySelector(
          'input[name="companyName"], #input-121'
        );
        if (companyNameField && companyNameField.value) {
          clickCustomizeYourAgentNextButton();
        }
      }, 1500);
    }

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

        // Try to click the Next button after populating text
        setTimeout(() => {
          clickSelectAnAgentNextButton();
        }, 1000);
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

        // Try to click the Next button after populating text
        setTimeout(() => {
          clickSelectAnAgentNextButton();
        }, 1000);

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
