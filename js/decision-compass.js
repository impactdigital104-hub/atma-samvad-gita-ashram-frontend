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
    errorEl.textContent =
      message || "Something went wrong. Please try again in a little while.";
    errorEl.style.display = "block";
  }

  function clearError() {
    if (errorEl) errorEl.style.display = "none";
  }

  function renderDecisionCompass(content) {
    if (!resultEl) return;
    resultEl.innerHTML = "";

    if (!content) {
      resultEl.innerHTML =
        "<p>Sorry, no guidance was returned from the Gita just now.</p>";
      return;
    }

    const {
      summary,
      inputEcho = {},
      gitaLens = [],
      verses = [],
      actionPlan = [],
      innerPractice,
      reflectionQuestions = []
    } = content;

    const {
      situation = "",
      lifeArea = "",
      emotion = "",
      desiredOutcome = "",
      constraints = ""
    } = inputEcho;

    const htmlParts = [];

    // 1. Summary
    if (summary) {
      htmlParts.push(`<div class="dc-section">
        <h4>1. Summary</h4>
        <p>${summary}</p>
      </div>`);
    }

    // 2. Your Situation (as heard)
    if (situation) {
      htmlParts.push(`<div class="dc-section dc-section-muted">
        <h4>Your Situation (as heard)</h4>
        <p>${situation.trim()}</p>
      </div>`);
    }

    // 3. Context Snapshot
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

    // 4. Gita Lens
    if (Array.isArray(gitaLens) && gitaLens.length) {
      htmlParts.push(`<div class="dc-section">
        <h4>2. Gita Lens on Your Dilemma</h4>
        <ul>
          ${gitaLens.map((line) => `<li>${line}</li>`).join("")}
        </ul>
      </div>`);
    }

        // 5. Verses (now with Sanskrit + transliteration + translations)
    if (Array.isArray(verses) && verses.length) {
      htmlParts.push(`<div class="dc-section">
        <h4>3. Supporting Verses</h4>
        <ul class="dc-verses">
          ${verses
            .map((v) => {
              const ref = v.ref || "";
              const excerpt = v.excerpt || "";
              const whyRelevant = v.whyRelevant || "";

              // New fields from backend (may be empty)
              const dev = (v.devanagari || "").replace(/\n/g, "<br>");
              const translit = (v.transliteration || "").replace(/\n/g, "<br>");
              const enTrans = v.enTranslation || "";
              const hiTrans = v.hiTranslation || "";

              return `
                <li>
                  ${ref ? `<p><strong>${ref}</strong></p>` : ""}

                  ${dev ? `<p class="dc-verse-devanagari">${dev}</p>` : ""}

                  ${
                    translit
                      ? `<p class="dc-verse-translit"><em>${translit}</em></p>`
                      : ""
                  }

                  ${
                    enTrans
                      ? `<p class="dc-verse-en">${enTrans}</p>`
                      : ""
                  }

                  ${
                    hiTrans
                      ? `<p class="dc-verse-hi">${hiTrans}</p>`
                      : ""
                  }

                  ${
                    excerpt
                      ? `<p class="dc-verse-excerpt">${excerpt}</p>`
                      : ""
                  }

                  ${
                    whyRelevant
                      ? `<p class="dc-verse-note"><em>${whyRelevant}</em></p>`
                      : ""
                  }

                  <button 
                    type="button"
                    class="dc-more-explanation-btn"
                    data-verse-ref="${ref}"
                  >
                    Ask for a deeper explanation of this verse
                  </button>
                </li>
              `;
            })
            .join("")}
        </ul>
      </div>`);
    }


    // 6. Action Plan
    if (Array.isArray(actionPlan) && actionPlan.length) {
      htmlParts.push(`<div class="dc-section">
        <h4>4. Suggested 3-Step Action Plan</h4>
        <ol>
          ${actionPlan.map((step) => `<li>${step}</li>`).join("")}
        </ol>
      </div>`);
    }

    // 7. Inner Practice
    if (innerPractice) {
      htmlParts.push(`<div class="dc-section">
        <h4>5. Inner Practice</h4>
        <p><strong>${innerPractice.title || "Inner Practice"}</strong>${
        innerPractice.duration ? ` (${innerPractice.duration})` : ""
      }</p>
        <p>${innerPractice.instructions || ""}</p>
      </div>`);
    }

    // 8. Reflection Questions
    if (Array.isArray(reflectionQuestions) && reflectionQuestions.length) {
      htmlParts.push(`<div class="dc-section">
        <h4>6. Reflection Questions</h4>
        <ul>
          ${reflectionQuestions.map((q) => `<li>${q}</li>`).join("")}
        </ul>
      </div>`);
    }
    resultEl.innerHTML = htmlParts.join("");

    if (placeholderEl) {
      placeholderEl.style.display = "none";
    }

    // Attach click handlers for "More explanation" buttons
    const moreButtons = resultEl.querySelectorAll(".dc-more-explanation-btn");
    moreButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const verseRef = btn.getAttribute("data-verse-ref") || "";
        const situationText =
          situation ||
          document.getElementById("situation")?.value ||
          "";

        const question = `Please explain ${verseRef || "this verse from the Bhagavad Gita"} in detail in the context of this situation: "${situationText}". Focus on how its teaching can guide me practically in real life.`;

        try {
          localStorage.setItem("gita_qna_prefill", question);
        } catch (e) {
          console.warn("Could not store prefill in localStorage", e);
        }

        // Redirect to the main Gita Q&A page (adjust if your Q&A is at a different path)
        window.location.href = "/";
      });
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

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

    // Build request body for /api/chat-gita
    const requestBody = {
      feature: "decision_compass",
      language: "en",
      depth: "standard",
      payload: {
        title: "", // we are not collecting a separate title yet
        situation,
        lifeArea,
        emotion,
        timeHorizon: "", // optional, can be wired later
        desiredOutcome,
        constraints
      },
      client: {
        app: "gita-ashram",
        version: "v1"
      }
    };

    showLoading(true);

    fetch("https://samvad.atmavani.life/api/chat-gita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        showLoading(false);

        if (!data || !data.success) {
          showError("Unable to fetch guidance from the Gita just now.");
          return;
        }

        renderDecisionCompass(data.content);
      })
      .catch((err) => {
        console.error("Error calling /api/chat-gita:", err);
        showLoading(false);
        showError("There was a problem connecting to the Gita Ashram server.");
      });
  });
});
