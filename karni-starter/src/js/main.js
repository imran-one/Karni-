// Karni — point d'entrée, chargé comme module ES (<script type="module">).
// Lis d'abord le format des données (brief) et le HTML fourni, puis découpe ton code en modules
// (state.js, storage.js, validation.js, calculs.js, ui.js) que tu importes ici.
import { initClientDialog } from "./clients.js";
import { renderClients } from "./render.js";
import { state } from "./state.js";
import { creerDemo } from "./demo.js";
import { initExport } from "./exporter.js";
import {
  calculerSolde,
  calculerPlafond,
  calculerCreditDispo,
  recupererOperations,
  ajouterOperation,
  validMontant,
  validDate,
  validLibelle
} from "./operations.js";


initClientDialog();
initExport();

const chargé = document.getElementById('charger-demo');
const vider = document.getElementById('vider-carnet');

chargé.addEventListener('click', function(){
  if(!confirm("Charger les données de démonstration ?")){
    return;
  }
    const demo = creerDemo();
    state.clients = demo.clients;
    state.operations = demo.operations;
    renderClients();
})

vider.addEventListener("click", function(){
  if(!confirm("Voulez-vous vraiment vider le carnet ?")){
    return;
  }
  state.clients = [];
  state.operations = [];
  renderClients();
})
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

const dialog = document.getElementById("fiche-client");
const listeClients = document.getElementById("liste-clients");
const ficheFermer = document.getElementById("fiche-fermer");

const ficheNom = document.getElementById("fiche-nom");
const ficheTelephone = document.getElementById("fiche-telephone");
const ficheBadges = document.getElementById("fiche-badges");

const montantFicheInput = document.getElementById("operation-montant");
const dateFicheInput = document.getElementById("operation-date");
const libelleFicheInput = document.getElementById("operation-libelle");
const ficheForm = document.getElementById("form-operation");

ficheForm.addEventListener("submit", function(event){
    event.preventDefault();
    const montant = Number(montantFicheInput.value.replace(",", "."));
    const montantEnCentimes = Math.round(montant * 100);
    const solde = calculerSolde(clientActuelId, state.operations);
    const plafond = calculerPlafond(clientActuelId, state.clients);
    const disponible = calculerCreditDispo(plafond, solde);
    const date = dateFicheInput.value;
    const libelle = libelleFicheInput.value;
    const type = document.querySelector('input[name="operation-type"]:checked').value

    if(!validLibelle(type) || !validDate() || !validMontant()){
        return;
    }
    if(type === "achat" && montant > disponible){
        return;
    }
    if(type === "remboursement" && montant > solde){
        return;
    }

    const nouvelleOperation = {
        id: Date.now().toString(),
        clientId: clientActuelId,
        type: type,
        montant: montantEnCentimes,
        libelle: libelle,
        date: date
    }

    ajouterOperation(state.operations, nouvelleOperation);
    afficherHistorique(clientActuelId, state.operations);
    ficheForm.reset();
    const nouveauSolde = calculerSolde(clientActuelId, state.operations);
    const nouveauDisponible = calculerCreditDispo(plafond, nouveauSolde);
    ficheSolde.textContent = nouveauSolde.toFixed(2) + " MAD";
    ficheDisponible.textContent = nouveauDisponible.toFixed(2) + " MAD";
})

const ficheSolde = document.getElementById("fiche-solde");
const fichePlafond = document.getElementById("fiche-plafond");
const ficheDisponible = document.getElementById("fiche-disponible");

const modeleOperation = document.getElementById("modele-operation");
const historique = document.getElementById("historique");
const historiqueVide = document.getElementById("historique-vide");

historique.addEventListener("click", function(event) {
    const bouton = event.target.closest('[data-action="supprimer-operation"]');

    if(!bouton){
        return;
    }
    const ligne = bouton.closest("[data-operation-id]");

    if(!ligne){
        return;
    }
    const operationId = ligne.dataset.operationId;
    if (!confirm("Voulez-vous vraiment supprimer cette opération ?")) {
    return;
    }
    state.operations = state.operations.filter(function(operation) {
        return operation.id !== operationId;
    });
    afficherHistorique(clientActuelId, state.operations);
    const solde = calculerSolde(clientActuelId, state.operations);
    const plafond = calculerPlafond(clientActuelId, state.clients);
    const disponible = calculerCreditDispo(plafond, solde);
    ficheSolde.textContent = solde.toFixed(2) + " MAD";
    ficheDisponible.textContent = disponible.toFixed(2) + " MAD";
    renderClients();
});

function afficherHistorique(clientID, operations) {
  const clientOperations = recupererOperations(clientID, operations);

  clientOperations.sort(function(a, b) {
    return b.date.localeCompare(a.date);
  });

  historique.replaceChildren();

  historiqueVide.hidden = clientOperations.length > 0;

  for (let i = 0; i < clientOperations.length; i++) {
    const operation = clientOperations[i];

    const copie = modeleOperation.content.cloneNode(true);
    const ligne = copie.querySelector("li");

    ligne.dataset.operationId = operation.id;

    ligne.querySelector(".operation-libelle").textContent = operation.libelle;
    ligne.querySelector(".operation-date").textContent = operation.date;

    ligne.querySelector(".operation-montant").textContent =
      (operation.montant / 100).toFixed(2) + " MAD";

    historique.appendChild(copie);
  }
}


let clientActuelId = null;

listeClients.addEventListener("click", function(event) {
  const nom = event.target.closest(".client-nom");

    if(!nom){
        return;
    }

const carte = nom.closest("[data-client-id]");

  const client = state.clients.find(function(client) {
    return client.id === carte.dataset.clientId;
  });

    if (!client) {
        return;
    }

    clientActuelId = client.id;

    ficheNom.textContent = client.nom;
    ficheTelephone.textContent = client.telephone || "Téléphone non renseigné";
    const solde = calculerSolde(clientActuelId, state.operations);
    const plafond = calculerPlafond(clientActuelId, state.clients);
    const disponible = calculerCreditDispo(plafond, solde);

    ficheSolde.textContent = solde.toFixed(2) + " MAD";
    fichePlafond.textContent = plafond.toFixed(2) + " MAD";
    ficheDisponible.textContent = disponible.toFixed(2) + " MAD";
    afficherHistorique(clientActuelId, state.operations);

  dialog.showModal();
});

ficheFermer.addEventListener("click", function() {
    dialog.close();
});


