import { state } from "./state.js";
import { preparerListe } from "./recherche.js";
import {
  statuserSolde,
  getStatusClient,
  statuserTotalDu,
  nombresDeclient,
  nombreClientsEndettes,
  nombreClientsEnRetard,
} from "./calculation.js";

const listeClients = document.getElementById("liste-clients");
const modeleClient = document.getElementById("modele-client");
const etatVide = document.getElementById("etat-vide");
const aucun = document.getElementById("etat-aucun-resultat");

export function renderTableauDeBord() {
  const totalDu = statuserTotalDu(state.clients, state.operations);
  const clients = nombresDeclient(state.clients);
  const enDette = nombreClientsEndettes(state.clients, state.operations);
  const enRetard = nombreClientsEnRetard(state.clients, state.operations, new Date());

  document.getElementById("total-du").textContent =
    `${(totalDu / 100).toFixed(2).replace(".", ",")} MAD`;

  document.getElementById("nb-clients").textContent = clients;
  document.getElementById("nb-en-dette").textContent = enDette;
  document.getElementById("nb-en-retard").textContent = enRetard;
}

export function renderClients() {
  renderTableauDeBord();
  listeClients.replaceChildren();

  const clients = preparerListe(state);
  const carnetVide = state.clients.length === 0;

  etatVide.classList.toggle("hidden", !carnetVide);
  aucun.classList.toggle("hidden", carnetVide || clients.length > 0);

  for (const client of clients) {
    const fragment = modeleClient.content.cloneNode(true);

    const carte = fragment.querySelector("li");
    const nom = fragment.querySelector(".client-nom");
    const telephone = fragment.querySelector(".client-telephone");
    const solde = fragment.querySelector(".client-solde");
    const badges = fragment.querySelector(".client-badges");

    carte.dataset.clientId = client.id;

    nom.textContent = client.nom;
    nom.setAttribute("aria-label", `Ouvrir la fiche de ${client.nom}`);

    telephone.textContent = client.telephone || "Téléphone non renseigné";

    const montantSolde = statuserSolde(client.id, state.operations);
    const status = getStatusClient(client, state.operations, new Date());

    solde.textContent = `${(montantSolde / 100)
      .toFixed(2)
      .replace(".", ",")} MAD`;

    badges.textContent = status;

    const nomsSr = fragment.querySelectorAll(".nom-sr");

    for (const element of nomsSr) {
      element.textContent = ` : ${client.nom}`;
    }

    listeClients.append(fragment);
  }
}
