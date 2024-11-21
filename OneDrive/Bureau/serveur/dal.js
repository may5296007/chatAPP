
module.exports = {listerProduit,};


const db = require('./mssql');

async function listerProduit() {
   try {
       
       const produits = await db('Produits').select('*');
       return produits; 
   } catch (error) {
       console.log('Erreur lors de l affichage des produits: ', error);
   }
}

listerProduit();

async function ajouterProduit({ NomProduitI, QuantiteI, CoutI, DescriptionI, IdMagasinI }) {
   try {
       const resultat = await db('Produits')
           .insert({
               NomProduit: NomProduitI,
               Quantite: QuantiteI,
               Cout: CoutI,
               Description: DescriptionI,
               IdMagasin: IdMagasinI
           })
           .returning('IdProduitM');
       
       console.log(resultat);
   } catch (error) {
       console.log('Erreur lors de l ajout du produit :', error);
   }
}

const produit = {
   IdProduitMI: 21,
   NomProduitI: 'Nana3',
   QuantiteI: 5,
   CoutI: 2.0,
   DescriptionI: 'des menthes marocains exotiques',
   IdMagasinI: 1
};
 
ajouterProduit(produit)

 
 
// fonction modifierProduit
async function modifierProduit({idModifier, nomP, QtP, CoutP, idM, DescP}) {
   try {
      const Produit = await db('Produits').where('idProduitM', idModifier).update({NomProduit: nomP, Quantite: QtP, Cout: CoutP, Description: DescP, IdMagasin: idM})
      console.log(Produit);
   }catch(error) {
      console.log('Erreur lors de la modification des produits : ', error)
   }
}


const idProduit = {
   idModifier: 1,
   nomP : 'Pâtes complètes',
   QtP : 50,
   CoutP: 2.5,
   DescP: 'Les pâtes complètes sont fabriquées à partir de farine de blé entier, qui conserve le son, le germe et l endosperme du grain',
   idM: 1
}
 
modifierProduit(idProduit);
 

 // fonction supprimerProduit
async function supprimerProduit(idProduit) {
   try {
      const CommandeProduit = await db('CommandeProduit').where('idProduitM', idProduit).delete('*');
      const Produit = await db('Produits').where('idProduitM', idProduit).delete('*');
      console.log(Produit);

   }catch(error) {
      console.log('Erreur lors de la suppression des produits: ', error)
   }
}
 
supprimerProduit(2);

 