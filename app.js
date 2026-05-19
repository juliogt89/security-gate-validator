const form = document.getElementById("scanForm");
const urlInput = document.getElementById("urlInput");
const result = document.getElementById("result");

/*
  AQUÍ pondremos luego tu API real
*/
const API_URL = "https://security-gate-api.juliosgt89.workers.dev/scan";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  result.classList.remove("hidden");

  result.innerHTML = `
    <h2>Analizando...</h2>
    <p>Estamos revisando la seguridad básica del sitio.</p>
  `;

  setTimeout(() => {

    result.innerHTML = `
      <h2>Reporte de Seguridad</h2>

      <p><strong>URL:</strong> ${urlInput.value}</p>

      <p><strong>Score:</strong> 72/100</p>

      <p><strong>Riesgo:</strong> Medio</p>

      <div class="finding">
        <strong>Falta Content-Security-Policy</strong>

        <p>
          El sitio no define una política CSP.
        </p>
      </div>

      <div class="finding">
        <strong>Falta X-Frame-Options</strong>

        <p>
          El sitio puede ser embebido en iframes.
        </p>
      </div>
    `;

  }, 1500);
});
