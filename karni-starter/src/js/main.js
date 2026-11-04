// Karni — point d'entrée, chargé comme module ES (<script type="module">).
// Lis d'abord le format des données (brief) et le HTML fourni, puis découpe ton code en modules
// (state.js, storage.js, validation.js, calculs.js, ui.js) que tu importes ici.
import { initClientDialog } from "./clients.js";
import { renderClients } from "./render.js";
import { state } from "./state.js";
import { creerDemo } from "./demo.js";
import { initExport } from "./exporter.js";

initClientDialog();
initExport();
const demo = creerDemo();
state.clients = demo.clients;
state.operations = demo.operations;
// TODO-US-05: remplacer par localStorage

document.getElementById("recherche").addEventListener("input", (e) => {
  state.filtres.recherche = e.target.value;
  renderClients();
});

document.getElementById("tri").addEventListener("change", (e) => {
  state.filtres.tri = e.target.value;
  renderClients();
});

document
  .getElementById("reinitialiser-filtres")
  .addEventListener("click", () => {
    document.getElementById("recherche").value = "";
    document.getElementById("tri").value = "nom";
    document.getElementById("filtre-statut").value = "tous";
    state.filtres = { recherche: "", statut: "tous", tri: "nom" };
    renderClients();
  });
document.getElementById("filtre-statut").addEventListener("change", (e) => {
  state.filtres.statut = e.target.value;
  renderClients();
});
renderClients();
