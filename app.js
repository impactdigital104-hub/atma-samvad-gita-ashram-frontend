document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("gita-qa-form");
  const output = document.getElementById("gita-qa-response");
  const questionInput = document.getElementById("gita-question");

  if (!form || !output || !questionInput) {
    return;
  }

  // 1) Prefill question from Decision Compass (localStorage)
  try {
    const prefill = localStorage.getItem("gita_qna_prefill");
    if (prefill) {
      questionInput.value = prefill;
      // Optional: clear it so it doesn't persist forever
      localStorage.removeItem("gita_qna_prefill");
    }
  } catch (e) {
    console.warn("Could not read gita_qna_prefill from localStorage", e);
  }

  // 2) Handle Q&A form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const q = questionInput.value.trim();
    if (!q) {
      output.innerHTML = "<p>Please enter a question.</p>";
      return;
    }

    // Simple loading state
    output.innerHTML = "<p>Asking the Gita, please wait...</p>";

    const requestBody = {
      feature: "qna",
      language: "en",
      depth: "standard",
      payload: {
        question: q
      },
      client: {
        app: "gita-ashram",
        version: "v1"
      }
    };

    try {
      const res = await fetch("https://samvad.atmavani.life/api/chat-gita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      if (!data || !data.success || !data.content) {
        output.innerHTML =
          "<p>Sorry, the Gita Ashram Q&A is not available right now. Please try again later.</p>";
        return;
      }

      const answer =
        data.content.answer ||
        data.content.message ||
        "The Gita Ashram engine did not return a clear answer.";

      output.innerHTML = `
        <div style="background:white;padding:1rem;border-radius:8px;border:1px solid #f0c38e;">
          <p><strong>Your question:</strong> ${q}</p>
          <hr>
          <p>${answer}</p>
        </div>
      `;
    } catch (err) {
      console.error("Error calling Gita Q&A:", err);
      output.innerHTML =
        "<p>There was a problem connecting to the Gita Ashram server. Please try again later.</p>";
    }
  });
});
