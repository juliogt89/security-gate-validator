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

    if (!data.findings || data.findings.length === 0) {
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

        <div class="finding success-finding">
          <strong>Buen resultado</strong>
          <p>No se encontraron problemas básicos en este análisis.</p>
        </div>
      `;

      return;
    }

    const findingsHtml = data.findings.map(f => {
      const info = getFindingInfo(f.title);

      return `
        <div class="finding">

          <div class="finding-header">
            <strong>${f.title}</strong>

            <span class="severity ${f.severity.toLowerCase()}">
              ${f.severity}
            </span>
          </div>

          <p>${f.description}</p>

          <div class="risk-box">
            <strong>Riesgo:</strong>
            ${info.risk}
          </div>

          <div class="recommendation">
            <strong>Cómo solucionarlo:</strong>
            ${f.recommendation}
          </div>

          <div class="example-box">
            <strong>Ejemplo recomendado:</strong>
            <code>${info.example}</code>
          </div>

          <div class="wiki-link">
            <a href="${info.docs}" target="_blank" rel="noopener noreferrer">
              Ver guía para solucionarlo →
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
      <p>No se pudo analizar el sitio. Revisa que la URL sea válida.</p>
    `;
  }
});

function getFindingInfo(title) {
  const info = {
    "Falta Content-Security-Policy": {
      docs: "https://developer.mozilla.org/es/docs/Web/HTTP/Headers/Content-Security-Policy",
      risk: "Puede aumentar el riesgo de ataques XSS o carga de scripts no autorizados.",
      example: "Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';"
    },

    "Falta Strict-Transport-Security": {
      docs: "https://developer.mozilla.org/es/docs/Web/HTTP/Headers/Strict-Transport-Security",
      risk: "Los usuarios podrían acceder al sitio por HTTP y quedar expuestos a ataques de intermediario.",
      example: "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload"
    },

    "Falta X-Frame-Options": {
      docs: "https://developer.mozilla.org/es/docs/Web/HTTP/Headers/X-Frame-Options",
      risk: "El sitio podría ser cargado dentro de un iframe malicioso y ser vulnerable a clickjacking.",
      example: "X-Frame-Options: SAMEORIGIN"
    },

    "Falta X-Content-Type-Options": {
      docs: "https://developer.mozilla.org/es/docs/Web/HTTP/Headers/X-Content-Type-Options",
      risk: "El navegador podría interpretar archivos con un tipo de contenido incorrecto.",
      example: "X-Content-Type-Options: nosniff"
    },

    "Falta Referrer-Policy": {
      docs: "https://developer.mozilla.org/es/docs/Web/HTTP/Headers/Referrer-Policy",
      risk: "El sitio podría compartir información sensible en la URL de referencia.",
      example: "Referrer-Policy: strict-origin-when-cross-origin"
    },

    "El sitio no usa HTTPS": {
      docs: "https://developer.mozilla.org/es/docs/Web/Security",
      risk: "La información enviada entre el usuario y el sitio podría viajar sin cifrado.",
      example: "Usar certificado SSL y redirigir HTTP hacia HTTPS."
    }
  };

  return info[title] || {
    docs: "https://developer.mozilla.org/es/docs/Web/Security",
    risk: "Este hallazgo puede afectar la postura de seguridad del sitio.",
    example: "Revisar la configuración de seguridad del servidor."
  };
}
