const generateBtn = document.getElementById("generateBtn");
const topicInput = document.getElementById("topicInput");
const resultsSection = document.getElementById("resultsSection");
const generatedTitle = document.getElementById("generatedTitle");
const generatedTags = document.getElementById("generatedTags");
const copyBtn = document.getElementById("copyBtn");

// ===============================
// API CONFIG
// ===============================
const API_BASE = "http://127.0.0.1:5000";

const ENDPOINTS = {
  GENERATE: `${API_BASE}/generate`,
  HEALTH: `${API_BASE}/health`,
};

// ===============================
// API FUNCTIONS
// ===============================
async function checkHealth() {
  try {
    const res = await fetch(ENDPOINTS.HEALTH);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === "ok";
  } catch (err) {
    console.error("Health check failed:", err);
    return false;
  }
}

async function generateTitleAndTags(description) {
  try {
    const healthy = await checkHealth();
    if (!healthy) throw new Error("Backend not available");

    const res = await fetch(ENDPOINTS.GENERATE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }), // ✅ matches Flask app.py
    });

    if (!res.ok) throw new Error("Failed to fetch results");

    return await res.json();
  } catch (err) {
    console.error("Error generating:", err);
    throw err;
  }
}

// ===============================
// UI HANDLERS
// ===============================
generateBtn.addEventListener("click", async () => {
  const userPrompt = topicInput.value.trim();
  if (!userPrompt) {
    alert("⚠️ Please enter a video description.");
    return;
  }

  generatedTitle.textContent = "⏳ Generating...";
  generatedTags.innerHTML = "";
  resultsSection.style.display = "block";

  try {
    const { title, tags } = await generateTitleAndTags(userPrompt);
    displayResults(title, tags);
  } catch (err) {
    generatedTitle.textContent = "❌ Error generating content.";
    generatedTags.textContent = "";
  }
});

// ===============================
// DISPLAY RESULTS
// ===============================
function displayResults(title, tags) {
  generatedTitle.textContent = title || "No title generated.";
  generatedTags.innerHTML = "";

  if (Array.isArray(tags) && tags.length > 0) {
    tags.forEach((tag) => {
      const tagEl = document.createElement("span");
      tagEl.className = "tag";
      tagEl.textContent = "#" + tag;
      generatedTags.appendChild(tagEl);
    });
  } else {
    generatedTags.textContent = "No tags generated.";
  }

  resultsSection.style.display = "block";
}

// ===============================
// COPY RESULTS
// ===============================
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    const title = generatedTitle.textContent;
    const tags = Array.from(generatedTags.children)
      .map((tag) => tag.textContent)
      .join(" ");
    const text = `Title: ${title}\nTags: ${tags}`;

    navigator.clipboard.writeText(text).then(() => {
      showNotification("📋 Copied!");
    });
  });
}

// ===============================
// NOTIFICATION
// ===============================
function showNotification(message) {
  alert(message); // simple fallback
}
