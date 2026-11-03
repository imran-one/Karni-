import { state } from "./state.js";
import { creerClientDepuisFormulaire } from "./clients.js";

const listeClients = document.getElementById("liste-clients");
const modeleClient = document.getElementById("modele-client");
const etatVide = document.getElementById("etat-vide");

export function renderClients() {
  listeClients.replaceChildren();

  if (state.clients.length === 0) {
    etatVide.classList.remove("hidden");
    return;
  }

  etatVide.classList.add("hidden");

  for (const client of state.clients) {
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

    solde.textContent = "0,00 MAD";
    badges.textContent = "À jour";

    const nomsSr = fragment.querySelectorAll(".nom-sr");

    for (const element of nomsSr) {
      element.textContent = ` : ${client.nom}`;
    }

    listeClients.append(fragment);
  }
}
