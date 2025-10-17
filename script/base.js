// Main JavaScript for the website

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector("nav ul");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

  // Cookie consent
  const cookieConsent = document.getElementById("cookieConsent");
  const acceptCookies = document.getElementById("acceptCookies");

  if (!localStorage.getItem("cookiesAccepted")) {
    setTimeout(() => {
      if (cookieConsent) cookieConsent.style.display = "block";
    }, 2000);
  }

  if (acceptCookies) {
    acceptCookies.addEventListener("click", function () {
      localStorage.setItem("cookiesAccepted", "true");
      if (cookieConsent) cookieConsent.style.display = "none";
    });
  }

  // Animated counter for stats
  const stats = document.querySelectorAll(".stat h3");

  if (stats.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    stats.forEach((stat) => {
      observer.observe(stat);
    });
  }

  // Resource tabs functionality
  const resourceTabs = document.querySelectorAll(".resource-tab");

  if (resourceTabs.length > 0) {
    resourceTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        resourceTabs.forEach((t) => t.classList.remove("active"));
        // Add active class to clicked tab
        this.classList.add("active");
        // In a real implementation, you would show/hide content based on the tab
      });
    });
  }

  // Giving levels selection
  const givingOptions = document.querySelectorAll(".giving-option");

  if (givingOptions.length > 0) {
    givingOptions.forEach((option) => {
      option.addEventListener("click", function () {
        // Remove selected class from all options
        givingOptions.forEach((o) => o.classList.remove("selected"));
        // Add selected class to clicked option
        this.classList.add("selected");
        // Update donation form with selected amount
        const amount = this.getAttribute("data-amount");
        if (amount) {
          const amountInput = document.getElementById("donation-amount");
          if (amountInput) amountInput.value = amount;
        }
      });
    });
  }

  // Form validation
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      if (!validateForm(this)) {
        e.preventDefault();
      }
    });
  });

  // Initialize chatbot if it exists
  initChatbot();

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Lazy loading for images
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
});

// Animate counter function
function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-count"));
  const suffix = element.textContent.replace(/[0-9]/g, "");
  let count = 0;
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps

  const timer = setInterval(() => {
    count += increment;
    if (count >= target) {
      element.textContent = target + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(count) + suffix;
    }
  }, 16);
}

// Form validation function
function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll(
    "input[required], textarea[required], select[required]"
  );

  inputs.forEach((input) => {
    // Remove previous error styling
    input.classList.remove("error");

    // Check if field is empty
    if (!input.value.trim()) {
      input.classList.add("error");
      isValid = false;
    }

    // Email validation
    if (input.type === "email" && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        input.classList.add("error");
        isValid = false;
      }
    }
  });

  return isValid;
}

// AI Chatbot functionality
function initChatbot() {
  const chatbotToggle = document.querySelector(".chatbot-toggle");
  const chatbotContainer = document.querySelector(".chatbot-container");
  const closeChatbot = document.querySelector(".close-chatbot");
  const chatbotInput = document.querySelector(".chatbot-input input");
  const sendMessageBtn = document.querySelector(".send-message");
  const chatbotMessages = document.querySelector(".chatbot-messages");

  if (!chatbotToggle || !chatbotContainer) return;

  // Toggle chatbot visibility
  chatbotToggle.addEventListener("click", function () {
    chatbotContainer.style.display =
      chatbotContainer.style.display === "flex" ? "none" : "flex";
  });

  // Close chatbot
  if (closeChatbot) {
    closeChatbot.addEventListener("click", function () {
      chatbotContainer.style.display = "none";
    });
  }

  // Send message function
  function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, "user");
    chatbotInput.value = "";

    // Simulate AI response after a short delay
    setTimeout(() => {
      const response = generateResponse(message);
      addMessage(response, "bot");
    }, 1000);
  }

  // Send message on button click
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener("click", sendMessage);
  }

  // Send message on Enter key
  if (chatbotInput) {
    chatbotInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  // Add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${sender}-message`);
    messageDiv.textContent = text;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Generate AI response (simplified)
  function generateResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How can I help you today?";
    } else if (
      lowerMessage.includes("program") ||
      lowerMessage.includes("initiative")
    ) {
      return "We have several programs focused on education, healthcare, and economic development. Would you like to know more about a specific area?";
    } else if (
      lowerMessage.includes("donat") ||
      lowerMessage.includes("support")
    ) {
      return "Thank you for your interest in supporting our work! You can donate through our website or contact us for other ways to contribute.";
    } else if (
      lowerMessage.includes("volunteer") ||
      lowerMessage.includes("help")
    ) {
      return "We're always looking for dedicated volunteers! Please visit our Get Involved page to see current opportunities.";
    } else if (
      lowerMessage.includes("contact") ||
      lowerMessage.includes("reach")
    ) {
      return "You can reach us at info@empowerfoundation.org or call us at (555) 123-4567. Our office hours are Monday-Friday, 9am-5pm.";
    } else {
      return "I'm here to help answer your questions about our foundation and its programs. What would you like to know?";
    }
  }

  // Add initial bot message
  addMessage(
    "Hello! I'm here to help answer your questions about our foundation and its programs. How can I assist you today?",
    "bot"
  );
}

// Performance optimization - Debounce function
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Analytics (simulated - in a real implementation, you would use Google Analytics)
function trackEvent(category, action, label) {
  // In a real implementation, this would send data to Google Analytics
  console.log(`Tracking: ${category}, ${action}, ${label}`);

  // Example of sending data to a hypothetical analytics service
  if (window.gtag) {
    gtag("event", action, {
      event_category: category,
      event_label: label,
    });
  }
}

// Track page views
trackEvent("Navigation", "Page View", window.location.pathname);

// Track CTA clicks - Enhanced version with donate tracking
document.querySelectorAll(".btn, a, .donate-btn, [href*='donate']").forEach((element) => {
  element.addEventListener("click", function () {
    const text = this.textContent.trim() || "Unknown";
    const href = this.getAttribute("href");
    
    // Enhanced donate tracking
    if (href && href.includes("donate.html") || 
        this.classList.contains("donate-btn") ||
        text.toLowerCase().includes("donate")) {
      
      trackEvent("Donation", "Donate Intent", {
        button_text: text,
        location: this.closest('section')?.className || 'unknown',
        href: href
      });
    } else {
      trackEvent("CTA", "Click", text);
    }
  });
});
