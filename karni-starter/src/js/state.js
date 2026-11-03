export const state = {
  clients: [],
  operations: [],
};

export function ajouterClient(client) {
  state.clients.push(client);
}
