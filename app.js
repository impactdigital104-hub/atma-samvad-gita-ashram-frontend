document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("gita-qa-form");
  const output = document.getElementById("gita-qa-response");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const q = document.getElementById("gita-question").value.trim();
    if (!q) {
      output.innerHTML = "<p>Please enter a question.</p>";
      return;
    }

    // DUMMY RESPONSE — will be replaced by real API later
    output.innerHTML = `
      <div style="background:white;padding:1rem;border-radius:8px;border:1px solid #f0c38e;">
        <p><strong>Your question:</strong> ${q}</p>
        <hr>
        <p><strong>Sample Gita Reflection:</strong></p>
        <p>
          The Gita teaches that clarity arises when we act without fear,
          attachment or pressure. This is only a sample placeholder — soon
          this box will respond using the real Gita-only AI engine.
        </p>
      </div>
    `;
  });
});
