export function trier(clients, tri) {
  const copie = [...clients];
  const comparateurs = {
    nom: (a, b) => a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" }),
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
    return trier(clientsfiltrer,tri);
}
