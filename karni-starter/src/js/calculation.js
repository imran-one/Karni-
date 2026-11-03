export function calculerSolde(clientId, operations) {
  let solde = 0;
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
return solde = totalAchat - totalRemboursement;

}

export function getStatusClient(client, operations, aujourdHui){
    const solde = calculerSolde(client.id, operations);
    
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