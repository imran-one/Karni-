export const state = {
  clients: [],
  operations: [],
    filtres: { recherche: "", statut: "tous", tri: "nom" },
};

export function ajouterClient(client) {
  state.clients.push(client);
}
