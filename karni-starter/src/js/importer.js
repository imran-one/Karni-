import { state } from "./state.js";
import { sauvegarder } from "./stockage.js";
import { renderClients } from "./render.js";

const boutonImporter = document.getElementById("importer");
const fichierImporter = document.getElementById("import-fichier");

function ouvrirImport() {
  fichierImporter.click();
}

function lireFichier(event) {
  const fichier = event.target.files[0];
  event.target.value = "";

  if (!fichier) {
    return;
  }

  const lecteur = new FileReader();

  lecteur.onload = function() {
    try {
    const donnees = JSON.parse(lecteur.result);

    const erreurs = validerImport(donnees);

    if (erreurs.length > 0) {
        alert(erreurs.join("\n"));
        return;
    }
    const resume = `${donnees.clients.length} clients, ${donnees.operations.length} opérations`;

    const confirmation = confirm(`Importer ces données ?\n${resume}`);

    if (!confirmation) {
        return;
    }

    state.clients = donnees.clients;
    state.operations = donnees.operations;

    sauvegarder();
    renderClients();

  } catch (erreur) {
    alert("Fichier JSON invalide");
  }
    };
    lecteur.readAsText(fichier);
}

function dateValid(date){
    if(typeof date !== "string"){
        return false;
    }
    const resultat = new Date(date);

    return !Number.isNaN(resultat.getTime()) &&
        resultat.toISOString().slice(0, 10) === date;
}

function nomValid(nom){
    if(typeof nom !== "string"){
        return false;
    }

    const nomPropre = nom.trim();

    if(nomPropre.length < 2 || nomPropre.length > 40){
        return false;
    }
    const regex = /^[\p{L} '-]+$/u;
    return regex.test(nomPropre);
}

function validTelephone(telephone){
    if(typeof telephone !== "string"){
        return false;
    }
    if(telephone === ""){
        return true;
    }
    const regex = /^0[567]\d{8}$/;
    return regex.test(telephone);
}

function plafondValide(plafond) {
    if (!Number.isInteger(plafond)) {
        return false;
    }
    if (plafond < 5000 || plafond > 1000000){
        return false;
    }
    return true;
}

function dateHeureISOValide(valeur) {
  if (typeof valeur !== "string") {
    return false;
  }

  const date = new Date(valeur);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.toISOString() === valeur;
}

export function validerImport(donnees){
    const erreurs = [];

    if (donnees === null || typeof donnees !== "object" || Array.isArray(donnees)) {
        erreurs.push("Fichier : format invalide");
        return erreurs;
    }
    
        if (donnees.app !== "karni") {
        erreurs.push("app : valeur invalide");
    }

    if (donnees.version !== 1) {
        erreurs.push("version : version non supportée");
    }

    if (!dateHeureISOValide(donnees.exporteLe)) {
        erreurs.push("exporteLe : date invalide");
    }

    if(!Array.isArray(donnees.clients))
    {
        erreurs.push("clients : doit être un tableau");
    }
    if(!Array.isArray(donnees.operations)){
        erreurs.push("operations : doit être un tableau");
    }

    if (!Array.isArray(donnees.clients) || !Array.isArray(donnees.operations)) {
        return erreurs;
    }

    const idsClients = [];
    const idsOperations = [];
    const aujourdHui = new Date().toISOString().slice(0, 10);
    for (let i = 0; i < donnees.clients.length; i++) {
        const client = donnees.clients[i];

        if(typeof client !== "object" || client === null || Array.isArray(client)){
            erreurs.push(`clients[${i}] : format invalide`);
            continue;
        }

        if(typeof client.id !== "string" || client.id.trim() === ""){
            erreurs.push(`clients[${i}].id : doit être une chaîne non vide`);
            continue;
        }

        if(idsClients.some(id => id === client.id)){
            erreurs.push(`clients[${i}].id : identifiant dupliqué`);
        }
        else{
            idsClients.push(client.id);
        }
        if(!nomValid(client.nom)){
            erreurs.push(`clients[${i}].nom : nom invalide`);
        }
        if(!validTelephone(client.telephone)){
            erreurs.push(`clients[${i}].telephone : téléphone invalide`);
        }
        if(!plafondValide(client.plafond)){
            erreurs.push(`clients[${i}].plafond : montant invalide`);
        }
        if (!dateValid(client.creeLe)) {
            erreurs.push(`clients[${i}].creeLe : date invalide`);
        } else if (client.creeLe > aujourdHui) {
            erreurs.push(`clients[${i}].creeLe : date future interdite`);
        }
    }
    for (let i = 0; i < donnees.operations.length; i++) {
        const operation = donnees.operations[i];
        if(typeof operation !== "object" || operation === null || Array.isArray(operation)){
            erreurs.push(`operations[${i}] : format invalide`);
            continue;
        }

        if (typeof operation.id !== "string" || operation.id.trim() === "") {
            erreurs.push(`operations[${i}].id : identifiant invalide`);
            continue;
        }
        if(idsOperations.some(id => id === operation.id)){
            erreurs.push(`operations[${i}].id : identifiant dupliqué`);
        }
        else{
            idsOperations.push(operation.id);
        }
        if (!idsClients.some(id => id === operation.clientId)) {
            erreurs.push(`operations[${i}].clientId : client inexistant`);
        }
        if(operation.type !== "achat" && operation.type !== "remboursement"){
            erreurs.push(`operations[${i}].type : type invalide`);
        }
        if(!Number.isInteger(operation.montant) || operation.montant <= 0 || operation.montant > 1000000){
            erreurs.push(`operations[${i}].montant : doit être un entier positif`);
        }
        if(typeof operation.libelle !== "string" || operation.libelle.length > 60){
            erreurs.push(`operations[${i}].libelle : libellé invalide`);
        }
        if(typeof operation.libelle === "string" && (operation.type === "achat" && operation.libelle.trim().length < 2)){
            erreurs.push(`operations[${i}].libelle : minimum 2 caractères`);
        }
        if (!dateValid(operation.date)) {
            erreurs.push(`operations[${i}].date : date invalide`);
        } else if (operation.date > aujourdHui) {
            erreurs.push(`operations[${i}].date : date future interdite`);
        }
    }
    return erreurs.slice(0, 10);
}

export function initImport() {
    boutonImporter.addEventListener("click", ouvrirImport);
    fichierImporter.addEventListener("change", lireFichier);
}
