import { state } from "./state.js";

const boutonExporter = document.getElementById("exporter");

function exporterCarnet() {
  const maintenant = new Date();

  const dateLocale = [
    maintenant.getFullYear(),
    String(maintenant.getMonth() + 1).padStart(2, "0"),
    String(maintenant.getDate()).padStart(2, "0"),
  ].join("-");

  const donnees = {
    app: "karni",
    version: 1,
    exporteLe: maintenant.toISOString(),
    clients: state.clients,
    operations: state.operations,
  };

  const contenu = JSON.stringify(donnees, null, 2);

  const fichier = new Blob([contenu], {
    type: "application/json",
  });

  const url = URL.createObjectURL(fichier);

  const lien = document.createElement("a");
  lien.href = url;
  lien.download = `karni-${dateLocale}.json`;

  document.body.append(lien);
  lien.click();
  lien.remove();

  URL.revokeObjectURL(url);
}

export function initExport() {
  boutonExporter.addEventListener("click", exporterCarnet);
}
