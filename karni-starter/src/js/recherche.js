import { calculerSolde } from "./calculation.js";


export function trier(clients, tri, operations) {
  const copie = [...clients];
  const comparateurs = {
    nom: (a, b) => a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" }),
    solde: (a,b)=> calculerSolde(b.id, operations) - calculerSolde(a.id, operations),
    recent: (a,b) => derniereOperation(b.id, operations).localeCompare(derniereOperation(a.id,operations)) ,
  };
  copie.sort(comparateurs[tri] ?? comparateurs.nom);
  return copie;
}
export function normaliser(texte){
    const cleanText = texte.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return cleanText.toLowerCase();
}
export function filtrer(clients, recherche){
    const t = normaliser(recherche);
    return clients.filter(c=> normaliser(c.nom).includes(t));
}
export function preparerListe(state){
    const recherche = state.filtres.recherche;
    const tri = state.filtres.tri;
    const clients = state.clients;
    const clientsfiltrer = filtrer(clients, recherche);
    return trier(clientsfiltrer,tri, state.operations);
}
function derniereOperation(clientId, operations) {
  return operations
    .filter(o => o.clientId === clientId)
    .reduce((max, o) => (o.date > max ? o.date : max), "");
}