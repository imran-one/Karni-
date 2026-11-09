export function validerCarnet(data) {
  let erreur = [];
  if (data === null || Array.isArray(data) || typeof data !== "object") {
    erreur.push("carnet : doit être un objet");
    return erreur;
  }
  if (data.app !== "karni") erreur.push("app : doit valoir « karni »");
  if (data.version !== 1) erreur.push("version : doit valoir 1");
  if (!Array.isArray(data.clients))
    erreur.push("clients : doit être un tableau");
  if (!Array.isArray(data.operations))
    erreur.push("operations : doit être un tableau");
  return erreur;
}