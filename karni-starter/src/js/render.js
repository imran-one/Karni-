import { state } from "./state.js";
import { preparerListe } from "./recherche.js";
import { calculerSolde, getStatusClient } from "./calculation.js";

const listeClients = document.getElementById("liste-clients");
const modeleClient = document.getElementById("modele-client");
const etatVide = document.getElementById("etat-vide");
const aucun = document.getElementById("etat-aucun-resultat");

export function renderClients() {
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

    const montantSolde = calculerSolde(client.id, state.operations);
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
