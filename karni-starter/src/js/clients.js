import { state } from "./state.js";
import { ajouterClient } from "./state.js";
import { renderClients } from "./render.js";
import { sauvegarder } from "./stockage.js";

export const newClient = document.getElementById("nouveau-client");
export const clientDiag = document.getElementById("dialog-client");
export const diagTitle = document.getElementById("dialog-client-titre");
export const clientForm = document.getElementById("form-client");
export const clientID = document.getElementById("client-id");
export const clientCancel = document.getElementById("client-annuler");
export const clientNomError = document.getElementById("client-nom-erreur");
export const clientNom = document.getElementById("client-nom");
export const clientTel = document.getElementById("client-telephone");
export const clientPlafond = document.getElementById("client-plafond");
export const regexNom = /^[\p{L} '-]+$/u;
export const regexTelephone = /^0[567]\d{8}$/;
export const regexPlafond = /^\d+([.,]\d{1,2})?$/;
export const clientTelError = document.getElementById(
  "client-telephone-erreur",
);
export const clientPlafondError = document.getElementById(
  "client-plafond-erreur",
);
const listeClients = document.getElementById("liste-clients");
const dialogConfirmation = document.getElementById("dialog-confirmation");
const confirmationTitre = document.getElementById("confirmation-titre");
const confirmationMessage = document.getElementById("confirmation-message");
const confirmationDetails = document.getElementById("confirmation-details");

const confirmationValider = document.getElementById("confirmation-valider");
const confirmationAnnuler = document.getElementById("confirmation-annuler");

let clientASupprimerId = null;
export function initClientDialog() {
  newClient.addEventListener("click", () => {
    clientForm.reset();
    clientID.value = "";
    diagTitle.textContent = "Nouveau client";

    clientNomError.classList.add("hidden");
    clientTelError.classList.add("hidden");
    clientPlafondError.classList.add("hidden");

    clientNomError.textContent = "";
    clientTelError.textContent = "";
    clientPlafondError.textContent = "";

    clientNom.removeAttribute("aria-invalid");
    clientNom.removeAttribute("aria-describedby");
    clientNom.classList.remove("champ-invalide");

    clientTel.removeAttribute("aria-invalid");
    clientTel.removeAttribute("aria-describedby");
    clientTel.classList.remove("champ-invalide");

    clientPlafond.removeAttribute("aria-invalid");
    clientPlafond.removeAttribute("aria-describedby");
    clientPlafond.classList.remove("champ-invalide");

    clientDiag.showModal();
  });

  clientCancel.addEventListener("click", () => {
    clientDiag.close();
  });

  listeClients.addEventListener("click", (e) => {
    const bouton = e.target.closest('[data-action="modifier-client"]');

    if (!bouton) return;

    const carte = bouton.closest("[data-client-id]");

    const client = state.clients.find(
      (client) => client.id === carte.dataset.clientId,
    );

    if (!client) return;

    clientForm.reset();

    clientID.value = client.id;
    diagTitle.textContent = "Modifier le client";

    clientNom.value = client.nom;
    clientTel.value = client.telephone;

    const dirhams = Math.floor(client.plafond / 100);
    const centimes = String(client.plafond % 100).padStart(2, "0");

    clientPlafond.value = `${dirhams},${centimes}`;

    nettoyerErreurs();

    clientDiag.showModal();
  });
  listeClients.addEventListener("click", (e) => {
    const bouton = e.target.closest('[data-action="supprimer-client"]');

    if (!bouton) return;

    const carte = bouton.closest("[data-client-id]");

    const client = state.clients.find(
      (client) => client.id === carte.dataset.clientId,
    );

    if (!client) return;

    clientASupprimerId = client.id;

    confirmationTitre.textContent = "Supprimer le client";
    confirmationMessage.textContent = `Voulez-vous vraiment supprimer ${client.nom} ?`;
    confirmationDetails.textContent =
      "Les opérations associées à ce client seront également supprimées.";

    dialogConfirmation.showModal();
  });

  confirmationAnnuler.addEventListener("click", () => {
    clientASupprimerId = null;
    dialogConfirmation.close();
  });

  confirmationValider.addEventListener("click", () => {
    if (!clientASupprimerId) return;

    const indexClient = state.clients.findIndex(
      (client) => client.id === clientASupprimerId,
    );

    if (indexClient === -1) return;

    state.clients.splice(indexClient, 1);
    state.operations = state.operations.filter(
      (o) => o.clientId !== clientASupprimerId,
    );
    clientASupprimerId = null;
    sauvegarder();
    renderClients();
  });
}

function nettoyerErreurs() {
  clientNomError.textContent = "";
  clientTelError.textContent = "";
  clientPlafondError.textContent = "";

  clientNomError.classList.add("hidden");
  clientTelError.classList.add("hidden");
  clientPlafondError.classList.add("hidden");

  clientNom.classList.remove("champ-invalide");
  clientTel.classList.remove("champ-invalide");
  clientPlafond.classList.remove("champ-invalide");

  clientNom.removeAttribute("aria-invalid");
  clientNom.removeAttribute("aria-describedby");

  clientTel.removeAttribute("aria-invalid");
  clientTel.removeAttribute("aria-describedby");

  clientPlafond.removeAttribute("aria-invalid");
  clientPlafond.removeAttribute("aria-describedby");
}

export function validerNom(clients, clientIdExclu = "") {
  const nom = clientNom.value.trim();
  if (!regexNom.test(nom)) {
    clientNomError.textContent =
      "Le nom contient des caractères non autorisés.";
    clientNomError.classList.remove("hidden");

    clientNom.classList.add("champ-invalide");
    clientNom.setAttribute("aria-invalid", "true");
    clientNom.setAttribute("aria-describedby", "client-nom-erreur");

    return false;
  }

  if (nom.length < 2 || nom.length > 40) {
    clientNomError.textContent =
      "Le nom doit contenir entre 2 et 40 caractères.";
    clientNomError.classList.remove("hidden");

    clientNom.classList.add("champ-invalide");
    clientNom.setAttribute("aria-invalid", "true");
    clientNom.setAttribute("aria-describedby", "client-nom-erreur");

    return false;
  }
  if (nomExisteDeja(nom, clients, clientIdExclu)) {
    clientNomError.textContent = "Ce client existe déjà.";
    clientNomError.classList.remove("hidden");

    clientNom.classList.add("champ-invalide");
    clientNom.setAttribute("aria-invalid", "true");
    clientNom.setAttribute("aria-describedby", "client-nom-erreur");

    return false;
  }
  clientNomError.textContent = "";
  clientNomError.classList.add("hidden");

  clientNom.classList.remove("champ-invalide");
  clientNom.removeAttribute("aria-invalid");
  clientNom.removeAttribute("aria-describedby");
  return true;
}

export function validerTelephone() {
  const num = clientTel.value.trim();
  if (num !== "" && !regexTelephone.test(num)) {
    clientTelError.textContent =
      "Le numéro doit contenir 10 chiffres et commencer par 05, 06 ou 07.";
    clientTelError.classList.remove("hidden");

    clientTel.classList.add("champ-invalide");
    clientTel.setAttribute("aria-invalid", "true");
    clientTel.setAttribute("aria-describedby", "client-telephone-erreur");

    return false;
  }
  clientTelError.textContent = "";
  clientTelError.classList.add("hidden");

  clientTel.classList.remove("champ-invalide");
  clientTel.removeAttribute("aria-invalid");
  clientTel.removeAttribute("aria-describedby");
  return true;
}

export function validerPlafond() {
  const plafond = clientPlafond.value.trim();
  if (plafond === "" || !regexPlafond.test(plafond)) {
    clientPlafondError.textContent =
      "Veuillez saisir un plafond valide (entre 50 et 10 000 MAD).";
    clientPlafondError.classList.remove("hidden");

    clientPlafond.classList.add("champ-invalide");
    clientPlafond.setAttribute("aria-invalid", "true");
    clientPlafond.setAttribute("aria-describedby", "client-plafond-erreur");

    return false;
  }
  const plafondEnCentimes = convertirEnCentimes(plafond);

  if (plafondEnCentimes < 5000 || plafondEnCentimes > 1000000) {
    clientPlafondError.textContent =
      "Le plafond doit être compris entre 50 et 10 000 MAD.";
    clientPlafondError.classList.remove("hidden");

    clientPlafond.classList.add("champ-invalide");
    clientPlafond.setAttribute("aria-invalid", "true");
    clientPlafond.setAttribute("aria-describedby", "client-plafond-erreur");

    return false;
  }
  clientPlafondError.textContent = "";
  clientPlafondError.classList.add("hidden");

  clientPlafond.classList.remove("champ-invalide");
  clientPlafond.removeAttribute("aria-invalid");
  clientPlafond.removeAttribute("aria-describedby");
  return true;
}

export function convertirEnCentimes(montant) {
  const montantNormalise = montant.replace(",", ".");
  const parties = montantNormalise.split(".");

  const dirhams = parties[0];
  const centimes = parties[1] || "";

  const centimesComplets = centimes.padEnd(2, "0");
  return Number(dirhams + centimesComplets);
}

export function creerClientDepuisFormulaire() {
  return {
    id: crypto.randomUUID(),
    nom: clientNom.value.trim(),
    telephone: clientTel.value.trim(),
    plafond: convertirEnCentimes(clientPlafond.value.trim()),
    creeLe: new Date().toISOString().slice(0, 10),
  };
}

clientForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const idActuel = clientID.value;

  const nomValide = validerNom(state.clients, idActuel);
  const telValide = validerTelephone();
  const plafondValide = validerPlafond();

  if (!nomValide) {
    clientNom.focus();
  } else if (!telValide) {
    clientTel.focus();
  } else if (!plafondValide) {
    clientPlafond.focus();
  } else {
    if (idActuel) {
      const client = state.clients.find((client) => client.id === idActuel);

      if (!client) return;

      client.nom = clientNom.value.trim();
      client.telephone = clientTel.value.trim();
      client.plafond = convertirEnCentimes(clientPlafond.value.trim());
    } else {
      const client = creerClientDepuisFormulaire();
      ajouterClient(client);
    }
    sauvegarder();
    renderClients();

    clientForm.reset();
    clientID.value = "";
    clientDiag.close();
  }
});

export function normaliserNom(nom) {
  return nom.toLowerCase().replace(/\s/g, "");
}

export function nomExisteDeja(nom, clients, clientIdExclu = "") {
  const nomNormalise = normaliserNom(nom);

  return clients.some(
    (client) =>
      client.id !== clientIdExclu && normaliserNom(client.nom) === nomNormalise,
  );
}
