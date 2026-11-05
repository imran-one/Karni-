import { state } from "./state.js";

const CLE = "karni:v1";
const CLE_ILLISIBLE = "karni:sauvegarde-illisible";

const messageEl = document.getElementById("erreur-stockage-message");
const erreurEl = document.getElementById("erreur-stockage");

export function afficherErreurStockage(message) {
  messageEl.textContent = message;
  erreurEl.classList.remove("hidden");
}

export function sauvegarder() {
  const carnet = {
    app: "karni",
    version: 1,
    clients: state.clients,
    operations: state.operations,
  };
  try {
    localStorage.setItem(CLE, JSON.stringify(carnet));
  } catch {
    afficherErreurStockage(
      "Impossible d’enregistrer le carnet : l’espace de stockage est plein ou indisponible. Vos modifications restent visibles jusqu’à la fermeture de la page.",
    );
  }
}
export function charger() {
  let brut = null;
  try {
    brut = localStorage.getItem(CLE);
    if (brut === null) return null;
    const donnees = JSON.parse(brut);
    if (
      !(Array.isArray(donnees.clients) && Array.isArray(donnees.operations))
    ) {
      throw new Error("FORMAT invalide");
    }
    return { clients: donnees.clients, operations: donnees.operations };
  } catch {
    if (brut !== null) {
      try {
        localStorage.setItem(CLE_ILLISIBLE, brut);
      } catch {
        // la copie échoue: on continue.;
      }
    }
    afficherErreurStockage(
      "Les données enregistrées sont illisibles. Un carnet vide a été chargé et l’ancien contenu a été conservé à part",
    );
    return null;
  }
}
