const backgroundImages = [];
const backgroundColors = [
  "linear-gradient(135deg, #1a1a2e, #16213e)",
  "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  "linear-gradient(135deg, #4b6cb7, #182848)",
  "linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)",
  "linear-gradient(135deg, #2c3e50, #4ca1af)",
  "linear-gradient(135deg, #141e30, #243b55)",
];

// Preload 3 images for faster background switching
function preloadImages() {
  for (let i = 0; i < 3; i++) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = `https://picsum.photos/1000/1000?random=${Math.random()}`;
    backgroundImages.push(img);
  }
}

// Set a random background
function setRandomBackground() {
  document.body.style.backgroundImage = ""; // Clear any existing background

  // Use a gradient as immediate background
  const randomColorIndex = Math.floor(Math.random() * backgroundColors.length);
  document.body.style.background = backgroundColors[randomColorIndex];

  // If we have preloaded images, use one
  if (backgroundImages.length > 0) {
    const randomImgIndex = Math.floor(Math.random() * backgroundImages.length);
    const img = backgroundImages[randomImgIndex];

    // If the image is loaded, set it as background
    if (img.complete) {
      document.body.style.backgroundImage = `url(${img.src})`;
      document.getElementById("attribution").innerHTML = `
              <a href="https://picsum.photos" target="_blank">
                Background from Lorem Picsum
              </a>`;
    }

    // Replace the used image with a new one for next time
    const newImg = new Image();
    newImg.crossOrigin = "Anonymous";
    newImg.src = `https://picsum.photos/1000/1000?random=${Math.random()}`;
    backgroundImages[randomImgIndex] = newImg;
  }
}

async function generateRandomQuote() {
  try {
    // Show loading animation
    document.getElementById("loading").style.display = "flex";

    // Set new background
    setRandomBackground();

    const response = await fetch(
      "https://api.freeapi.app/api/v1/public/quotes/quote/random"
    );
    const data = await response.json();

    // Hide loading animation
    document.getElementById("loading").style.display = "none";

    if (data.success && data.data) {
      const quoteElement = document.getElementById("quote");
      const authorElement = document.getElementById("author");
      quoteElement.textContent = data.data.content;
      authorElement.textContent = `— ${data.data.author || "Unknown"}`;
    } else {
      throw new Error("Failed to fetch quote");
    }
  } catch (error) {
    console.error("Error fetching quote:", error);
    document.getElementById("quote").textContent =
      "Could not fetch a quote. Please try again later.";
    document.getElementById("author").textContent = "";
    document.getElementById("loading").style.display = "none";
  }
}

function copyToClipboard() {
  const quote = document.getElementById("quote").textContent;
  const author = document.getElementById("author").textContent;
  const textToCopy = `${quote} ${author}`;

  navigator.clipboard.writeText(textToCopy).then(() => {
    const message = document.getElementById("message");
    message.classList.add("show");
    setTimeout(() => {
      message.classList.remove("show");
    }, 2000);
  });
}

function shareOnTwitter() {
  const quote = document.getElementById("quote").textContent;
  const author = document.getElementById("author").textContent;
  const twitterText = encodeURIComponent(`${quote} ${author}`);
  window.open(`https://twitter.com/intent/tweet?text=${twitterText}`, "_blank");
}

function exportQuote() {
  const container = document.querySelector(".quote-box");

  html2canvas(container).then((canvas) => {
    const link = document.createElement("a");
    link.download = "inspiration_quote.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

// Initialize on page load
window.onload = function () {
  preloadImages(); // Preload images first
  setRandomBackground(); // Set initial background
  generateRandomQuote(); // Get first quote
};
