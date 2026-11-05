import { state } from "./state.js";

export function calculerSolde(clientID, operations){
    let totalAchats = 0;
    let totalRembourssement = 0;

    for(let i = 0; i < operations.length; i++){
        if(operations[i].clientId === clientID){
            if(operations[i].type === "achat"){
                totalAchats = totalAchats + operations[i].montant;
            }
            if(operations[i].type === "remboursement"){
                totalRembourssement = totalRembourssement + operations[i].montant;
            }
        }
    }
    return (totalAchats - totalRembourssement) / 100;
}

export function calculerPlafond(clientID, clients){
    for(let i = 0; i < clients.length; i++){
        if(clientID === clients[i].id){
            return clients[i].plafond / 100;
        }
    }
}

export function calculerCreditDispo(Plafond, Solde){
    return Plafond - Solde;
}

export function ajouterOperation(operations, nouvelleOperation){
    operations.push(nouvelleOperation);
    return operations;
}

export function recupererOperations(clientID, operations) {
    return operations.filter(function(operation) {
        return operation.clientId === clientID;
    });
}

let clientActuelId = null;

export function definirClientActuel(id) {
    clientActuelId = id;
}

const montantFicheInput = document.getElementById("operation-montant");
const dateFicheInput = document.getElementById("operation-date");
const libelleFicheInput = document.getElementById("operation-libelle");
const ficheForm = document.getElementById("form-operation");
const radioType = document.getElementsByName("operation-type");

export function validMontant(){
    const montant = montantFicheInput.value;
    const regex = /^\d+([.,]\d{1,2})?$/;
    if(montant === ""){
        return false;
    }
    if(Number.isNaN(Number(montant))){
        return false;
    }
    if(Number(montant) <= 0){
        return false;
    }
    if(Number(montant) > 10000){
        return false;
    }
    if(regex.test(montant)){
        return true;
    }
    return regex.test(montant);
}

export function validDate(){
    const date = dateFicheInput.value;
    const aujourdhui = new Date().toISOString().split("T")[0];
    if(date === ""){
        return false;
    }
    if(aujourdhui < date){
        return false;
    }
    return true;
}

export function validLibelle(type){
    const libelle = libelleFicheInput.value.trim();
    if(libelle.length > 60){
        return false;
    }
    if(type === "achat" && libelle.length < 2)
    {
        return false;
    }
    return true;
}

const ficheDispo = document.getElementById("fiche-disponible");
const ficheSolde = document.getElementById("fiche-solde");

