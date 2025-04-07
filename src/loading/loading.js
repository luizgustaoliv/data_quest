class LoadingScreen {
  constructor() {
    this.resources = [
      { type: "script", url: "src/inicial/script.js" },
      // Add more resources here if needed
    ];
    this.loaded = 0;
    this.init();
  }

  init() {
    // Set body styles for fullscreen
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "#000";

    // Create enhanced styles first
    this.createEnhancedStyles();

    // Show logo intro
    this.createLogoIntro();

    // Load resources in background while showing logo
    this.loadResources();

    // After fixed time for logo display, transition directly to main app
    setTimeout(() => {
      this.createTransitionEffect();
    }, 4000); // Show logo for 4 seconds
  }

  createEnhancedStyles() {
    // Enhanced style tag with animations
    const styleTag = document.createElement("style");
    styleTag.textContent = `
      @keyframes logoFadeIn {
        0% { opacity: 0; transform: scale(0.7); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes logoGlow {
        0% { filter: brightness(1) drop-shadow(0 0 10px rgba(77, 238, 234, 0.5)); }
        50% { filter: brightness(1.3) drop-shadow(0 0 20px rgba(77, 238, 234, 0.8)); }
        100% { filter: brightness(1) drop-shadow(0 0 10px rgba(77, 238, 234, 0.5)); }
      }
      @keyframes fadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes digitalDissolve {
        0% { clip-path: inset(0 0 0 0); }
        10% { clip-path: inset(10px 0 0 0); }
        20% { clip-path: inset(0 15px 30px 5px); }
        30% { clip-path: inset(40px 30px 20px 0); }
        40% { clip-path: inset(10px 15px 0 30px); }
        50% { clip-path: inset(30px 0 10px 5px); }
        60% { clip-path: inset(0 10px 20px 15px); }
        70% { clip-path: inset(5px 15px 25px 0); }
        80% { clip-path: inset(10px 0 0 20px); }
        90% { clip-path: inset(0 0 10px 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
      @keyframes slideOutRight {
        0% { transform: translateX(0); }
        100% { transform: translateX(100%); }
      }
      @keyframes flickerOut {
        0%, 100% { opacity: 1; }
        10%, 30%, 70%, 90% { opacity: 0.4; }
        20%, 40%, 60%, 80% { opacity: 0.8; }
        50% { opacity: 0.2; }
      }
      @keyframes slideReveal {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(0); }
      }
    `;
    document.head.appendChild(styleTag);
  }

  createLogoIntro() {
    // Create logo intro container
    const introContainer = document.createElement("div");
    introContainer.id = "logo-intro";
    introContainer.style.position = "fixed";
    introContainer.style.top = "0";
    introContainer.style.left = "0";
    introContainer.style.width = "100vw";
    introContainer.style.height = "100vh";
    introContainer.style.backgroundColor = "#000";
    introContainer.style.display = "flex";
    introContainer.style.justifyContent = "center";
    introContainer.style.alignItems = "center";
    introContainer.style.zIndex = "10000";

    // Create the logo using the new function
    const logoCentered = document.createElement("div");
    logoCentered.style.animation = "logoFadeIn 1.5s ease-out forwards, logoGlow 3s infinite 1.5s";
    logoCentered.style.opacity = "0"; // Start invisible
    
    // Create and add the logo
    this.createDataQuestLogo(logoCentered);

    introContainer.appendChild(logoCentered);
    document.body.appendChild(introContainer);

    this.introContainer = introContainer;
  }

  createDataQuestLogo(parentElement) {
    const logoContainer = document.createElement("div");
    logoContainer.className = "logo-container";
    logoContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      font-family: Arial, sans-serif;
    `;

    const dataText = document.createElement("div");
    dataText.className = "data";
    dataText.textContent = "DATA";
    dataText.style.cssText = `
      font-size: 80px;
      font-weight: bold;
      color: #00f5f5;
      text-shadow: 
        0 0 10px rgba(0, 245, 245, 0.8),
        0 0 20px rgba(0, 245, 245, 0.5);
      letter-spacing: 2px;
    `;
    
    const questText = document.createElement("div");
    questText.className = "quest";
    questText.textContent = "QUEST";
    questText.style.cssText = `
      font-size: 80px;
      font-weight: bold;
      color: #ffb700;
      text-shadow: 
        0 0 10px rgba(255, 183, 0, 0.8),
        0 0 20px rgba(255, 183, 0, 0.5);
      letter-spacing: 2px;
    `;
    
    logoContainer.appendChild(dataText);
    logoContainer.appendChild(questText);
    
    (parentElement || document.body).appendChild(logoContainer);
    
    return logoContainer;
  }

  loadResources() {
    if (this.resources.length === 0) {
      return;
    }

    this.resources.forEach((resource) => {
      if (resource.type === "script") {
        const script = document.createElement("script");
        script.src = resource.url;

        script.onload = () => {
          this.loaded++;
          if (this.loaded === this.resources.length) {
            console.log("All resources loaded");
          }
        };

        script.onerror = (error) => {
          console.error(`Error loading ${resource.url}:`, error);
          this.loaded++;
        };

        document.body.appendChild(script);
      }
    });
  }

  createTransitionEffect() {
    // Fade out the intro
    this.introContainer.style.animation = "fadeOut 1s forwards";

    // Create the transition effect container
    const transitionContainer = document.createElement("div");
    transitionContainer.style.position = "fixed";
    transitionContainer.style.top = "0";
    transitionContainer.style.left = "0";
    transitionContainer.style.width = "100%";
    transitionContainer.style.height = "100%";
    transitionContainer.style.zIndex = "10001";
    transitionContainer.style.pointerEvents = "none";

    // Create slices for the digital transition effect
    const sliceCount = 15;
    const slices = [];

    for (let i = 0; i < sliceCount; i++) {
      const slice = document.createElement("div");
      slice.style.position = "absolute";
      slice.style.left = "0";
      slice.style.width = "100%";
      slice.style.height = `${100 / sliceCount}%`;
      slice.style.top = `${(i / sliceCount) * 100}%`;
      slice.style.backgroundColor = "#000";
      slice.style.transform = "translateX(-100%)";
      slice.style.animation = `slideReveal 0.5s cubic-bezier(.17,.67,.83,.67) forwards`;
      // Stagger the animations
      slice.style.animationDelay = `${i * 0.03}s`;

      slices.push(slice);
      transitionContainer.appendChild(slice);
    }

    document.body.appendChild(transitionContainer);

    // After the transition completes
    setTimeout(() => {
      // Digital glitch effect before removing
      const glitchOverlay = document.createElement("div");
      glitchOverlay.style.position = "fixed";
      glitchOverlay.style.top = "0";
      glitchOverlay.style.left = "0";
      glitchOverlay.style.width = "100%";
      glitchOverlay.style.height = "100%";
      glitchOverlay.style.backgroundColor = "#000";
      glitchOverlay.style.zIndex = "10002";
      glitchOverlay.style.animation =
        "digitalDissolve 0.5s forwards, flickerOut 0.8s forwards";

      document.body.appendChild(glitchOverlay);

      setTimeout(() => {
        // Remove all transition elements and the intro container
        document.body.removeChild(transitionContainer);
        document.body.removeChild(glitchOverlay);
        document.body.removeChild(this.introContainer);

        // Initialize the main app
        if (typeof carregarCSS === "function") {
          carregarCSS();
          criarInterface();
          configurarEventos();
          animarTeclas();
          animarTeclaE();
          animarTeclaInteracao();
        } else {
          console.error("Initial script functions not found");
        }
      }, 1000);
    }, sliceCount * 30 + 200); // A little longer than the last slice animation
  }
}

// Initialize the loading screen immediately
window.onload = function () {
  // Preload the Press Start 2P font for the loading screen
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
  document.head.appendChild(fontLink);

  // Start the loading screen after a short delay to ensure the font is available
  setTimeout(() => {
    new LoadingScreen();
  }, 100);
};
