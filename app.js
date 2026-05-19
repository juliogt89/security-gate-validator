const form = document.getElementById("scanForm");
const urlInput = document.getElementById("urlInput");
const result = document.getElementById("result");

const API_URL = "https://security-gate-api.juliosgt89.workers.dev/scan";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  result.classList.remove("hidden");

  result.innerHTML = `
    <h2>Analizando seguridad...</h2>
    <p>Estamos revisando headers, HTTPS y configuraciones del sitio.</p>
  `;

  try {
    const response = await fetch(
      `${API_URL}?url=${encodeURIComponent(urlInput.value)}`
    );

    const data = await response.json();

    const findingsHtml = data.findings.map(f => {

      const docs = getDocs(f.title);

      return `
        <div class="finding">

          <div class="finding-header">
            <strong>${f.title}</strong>

            <span class="severity ${f.severity.toLowerCase()}">
              ${f.severity}
            </span>
          </div>

          <p>${f.description}</p>

          <div class="recommendation">
            <strong>Recomendación:</strong>
            ${f.recommendation}
          </div>

          <div class="wiki-link">
            <a href="${docs}" target="_blank">
              Ver documentación oficial →
            </a>
          </div>

        </div>
      `;
    }).join("");

    result.innerHTML = `
      <h2>Reporte de Seguridad</h2>

      <div class="score-box">
        <div>
          <span>Score</span>
          <strong>${data.score}/100</strong>
        </div>

        <div>
          <span>Riesgo</span>
          <strong>${data.risk}</strong>
        </div>
      </div>

      <p class="analyzed-url">
        <strong>URL Analizada:</strong>
        ${data.url}
      </p>

      ${findingsHtml}
    `;

  } catch (error) {

    result.innerHTML = `
      <h2>Error</h2>
      <p>No se pudo analizar el sitio.</p>
    `;
  }
});

function getDocs(title) {

  const docs = {

    "Falta Content-Security-Policy":
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP",

    "Falta Strict-Transport-Security":
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security",

    "Falta X-Frame-Options":
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options",

    "Falta X-Content-Type-Options":
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options",

    "Falta Referrer-Policy":
      "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy",

    "El sitio no usa HTTPS":
      "https://developer.mozilla.org/en-US/docs/Web/Security"
  };

  return docs[title] || "https://developer.mozilla.org/";
}
