export function carnetValider(data) {
  if (data === null || Array.isArray(data) || typeof data !== "object")
    return false;
  if (!Array.isArray(data.clients)) return false;
  if (!Array.isArray(data.operations)) return false;

  const idsClients = [];

  for (const client of data.clients) {
    if (!clientValider(client)) return false;
    idsClients.push(client.id);
  }

  for (const operation of data.operations) {
    if (!operationValider(operation, idsClients)) return false;
  }

  return true;
}

export function clientValider(client) {
  if (typeof client !== "object" || client === null || Array.isArray(client))
    return false;
  if (typeof client.id !== "string" || client.id.trim() === "") return false;
  if (typeof client.nom !== "string") return false;
  if (client.nom.trim().length < 2 || client.nom.trim().length > 40)
    return false;
  if (typeof client.telephone !== "string") return false;
  if (!Number.isInteger(client.plafond)) return false;
  return true;
}

export function operationValider(operation, idsClients) {
  if (
    typeof operation !== "object" ||
    operation === null ||
    Array.isArray(operation)
  )
    return false;
  if (typeof operation.id !== "string" || operation.id.trim() === "")
    return false;
  if (!idsClients.includes(operation.clientId)) return false;
  if (operation.type !== "achat" && operation.type !== "remboursement")
    return false;
  if (!Number.isInteger(operation.montant) || operation.montant <= 0)
    return false;
  if (typeof operation.libelle !== "string") return false;
  if (typeof operation.date !== "string") return false;
  return true;
}
