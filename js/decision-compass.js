document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("decision-compass-form");
  if (!form) return;

  const loadingEl = document.getElementById("dc-loading");
  const errorEl = document.getElementById("dc-error");
  const resultEl = document.getElementById("dc-result");
  const placeholderEl = document.getElementById("results-placeholder");

  function showLoading(show) {
    if (loadingEl) loadingEl.style.display = show ? "block" : "none";
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message || "Something went wrong. Please try again.";
    errorEl.style.display = "block";
  }

  function clearError() {
    if (errorEl) errorEl.style.display = "none";
  }

  function renderDummyResponse(input) {
    if (!resultEl) return;

    const {
      situation,
      lifeArea,
      emotion,
      desiredOutcome,
      constraints
    } = input;

    // This roughly mirrors the future API response shape
    const dummyResponse = {
      summary:
        "The Gita invites you to act from dharma and clarity rather than fear or short-term gain.",
      gitaLens: [
        "See your situation as a field (kṣetra) for sincere effort, not as a battlefield of ego and anxiety.",
        "Choose the path that honours your responsibilities while keeping your inner poise.",
        "Offer the fruits of your decision to the Divine, and stay focused on right action."
      ],
      verses: [
        {
          ref: "BG 2.47",
          excerpt:
            "You have a right to perform your prescribed duty, but you are not entitled to the fruits of action...",
          whyRelevant:
            "This reminds you to choose and act wisely, without being paralysed by outcome anxiety."
        },
        {
          ref: "BG 18.66",
          excerpt:
            "Abandon all varieties of dharmas and simply surrender unto Me...",
          whyRelevant:
            "This points you to trust in a higher wisdom when the mind feels torn between options."
        }
      ],
      actionPlan: [
        "Step 1 — Clarify: Write down, in one sentence, what you are truly seeking here (e.g., integrity, security, service).",
        "Step 2 — Compare: For each option, note how well it serves that deeper aim and your key responsibilities.",
        "Step 3 — Commit: Choose the option that best aligns with dharma and inner peace, then act wholeheartedly without constant second-guessing."
      ],
      innerPractice: {
        title: "2-minute Gita pause",
        duration: "2–3 minutes",
        instructions:
          "Sit quietly, slow down your breath, and mentally repeat a simple verse or mantra (e.g., 'Karmanye vadhikaraste'). Offer your confusion to the Divine and ask for the clarity to choose what is right, not just what is comfortable."
      },
      reflectionQuestions: [
        "If I remove fear of loss for a moment, which option feels more dharmic and self-respecting?",
        "How will this decision help me grow in steadiness, sincerity, and service over the next few years?"
      ]
    };

    // Build HTML output
    const htmlParts = [];

    htmlParts.push(`<div class="dc-section">
      <h4>1. Summary</h4>
      <p>${dummyResponse.summary}</p>
    </div>`);

    if (situation) {
      htmlParts.push(`<div class="dc-section dc-section-muted">
        <h4>Your Situation (as heard)</h4>
        <p>${situation.trim()}</p>
      </div>`);
    }

    if (lifeArea || emotion || desiredOutcome || constraints) {
      htmlParts.push(`<div class="dc-section dc-section-meta">
        <h4>Context Snapshot</h4>
        <ul>
          ${lifeArea ? `<li><strong>Life area:</strong> ${lifeArea}</li>` : ""}
          ${emotion ? `<li><strong>Emotion:</strong> ${emotion}</li>` : ""}
          ${
            desiredOutcome
              ? `<li><strong>Desired outcome:</strong> ${desiredOutcome}</li>`
              : ""
          }
          ${
            constraints
              ? `<li><strong>Constraints:</strong> ${constraints}</li>`
              : ""
          }
        </ul>
      </div>`);
    }

    if (dummyResponse.gitaLens && dummyResponse.gitaLens.length) {
      htmlParts.push(`<div class="dc-section">
        <h4>2. Gita Lens on Your Dilemma</h4>
        <ul>
          ${dummyResponse.gitaLens
            .map((line) => `<li>${line}</li>`)
            .join("")}
        </ul>
      </div>`);
    }

    if (dummyResponse.verses && dummyResponse.verses.length) {
      htmlParts.push(`<div class="dc-section">
        <h4>3. Supporting Verses</h4>
        <ul class="dc-verses">
          ${dummyResponse.verses
            .map(
              (v) => `
            <li>
              <p><strong>${v.ref}</strong></p>
              <p class="dc-verse-excerpt">${v.excerpt}</p>
              <p class="dc-verse-note"><em>${v.whyRelevant}</em></p>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>`);
    }

    if (dummyResponse.actionPlan && dummyResponse.actionPlan.length) {
      htmlParts.push(`<div class="dc-section">
        <h4>4. Suggested 3-Step Action Plan</h4>
        <ol>
          ${dummyResponse.actionPlan
            .map((step) => `<li>${step}</li>`)
            .join("")}
        </ol>
      </div>`);
    }

    if (dummyResponse.innerPractice) {
      htmlParts.push(`<div class="dc-section">
        <h4>5. Inner Practice</h4>
        <p><strong>${dummyResponse.innerPractice.title}</strong> (${dummyResponse.innerPractice.duration})</p>
        <p>${dummyResponse.innerPractice.instructions}</p>
      </div>`);
    }

    if (
      dummyResponse.reflectionQuestions &&
      dummyResponse.reflectionQuestions.length
    ) {
      htmlParts.push(`<div class="dc-section">
        <h4>6. Reflection Questions</h4>
        <ul>
          ${dummyResponse.reflectionQuestions
            .map((q) => `<li>${q}</li>`)
            .join("")}
        </ul>
      </div>`);
    }

    resultEl.innerHTML = htmlParts.join("");

    // Hide placeholder once we have a result
    if (placeholderEl) {
      placeholderEl.style.display = "none";
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();
    showLoading(false);

    const situation = document.getElementById("situation")?.value || "";
    const lifeArea = document.getElementById("lifeArea")?.value || "";
    const emotion = document.getElementById("emotion")?.value || "";
    const desiredOutcome =
      document.getElementById("desiredOutcome")?.value || "";
    const constraints =
      document.getElementById("constraints")?.value || "";

    if (!situation.trim()) {
      showError("Please describe your situation or dilemma first.");
      return;
    }

    // For Milestone 1: no API call yet, just dummy response
    showLoading(true);

    // Simulate a short delay so the loading message is visible
    setTimeout(function () {
      showLoading(false);
      renderDummyResponse({
        situation,
        lifeArea,
        emotion,
        desiredOutcome,
        constraints
      });
    }, 400);
  });
});
