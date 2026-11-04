export function statuserSolde(clientId, operations) {
  let totalAchat = 0;
  let totalRemboursement = 0;
  for(let i = 0; i<operations.length; i++){
   if(operations[i].clientId === clientId){
    if(operations[i].type === "achat"){
        totalAchat += operations[i].montant;
    }else if(operations[i].type === "remboursement"){
        totalRemboursement += operations[i].montant;
    }
   }
}
return totalAchat - totalRemboursement;

}
export const calculerSolde = statuserSolde;
export function getStatusClient(client, operations, aujourdHui){
    const solde = statuserSolde(client.id, operations);
    
    if(solde === 0){
        return "À jour"
    }
    else if(solde >= client.plafond){
        return "Plafond atteint"
    }

    let dernierRemboursement = null;
    let premierAchat = null;
    for(let i = 0; i < operations.length; i++){
        const operation = operations[i];
        if(operation.clientId === client.id){
            if(operation.type === "remboursement"){
                dernierRemboursement = operation;
            }

            if(operation.type === "achat" && premierAchat === null){
               premierAchat = operation;
            }
        }
    }

    const operationReference  = dernierRemboursement || premierAchat;
    const nombreDeJours = Math.floor((aujourdHui - new Date(operationReference.date))/(1000 * 60 * 60 * 24));
    if(nombreDeJours > 30){
        return "En retard"
    }else{
        return "En dette"
    }
}

export function statuserTotalDu(clients, operations){
    let totalDu = 0;
    for(let i = 0; i < clients.length; i++){
       const solde = statuserSolde(clients[i].id, operations);
       totalDu += solde;
       
    }
    return totalDu;
}

export function nombresDeclient(clients){
   return clients.length;
}

export function nombreClientsEndettes(clients, operations){
    let dette = 0;
    for(let i = 0; i < clients.length; i++){
        let solde = statuserSolde(clients[i].id, operations);
        if(solde > 0){
           dette++;
        }
    }
    return dette;
}

export function nombreClientsEnRetard(clients, operations, aujourdHui){
    let retard = 0;
    for(let i = 0; i < clients.length; i++){
    let status = getStatusClient(clients[i], operations, aujourdHui)
        if(status === "En retard"){
            retard++
        }
    }    
    return retard;
}