const db = require('./mssql'); 
const knexMock = require('mock-knex'); 
const { listerProduit } = require('./dal'); 

// initialiser le mock pour knex
knexMock.mock(db);

describe('Test des requêtes de sélection', () => {
    
    it('devrait retourner une liste de produits', async () => {
        
        const mockData = [
            { id_Produit: 1, nom_Produit: 'Pâtes complètes', description_Produit: 'Les pâtes complètes sont fabriquées à partir de farine de blé entier, qui conserve le son, le germe et l endosperme du grain', stock: 50, prixUnitaire: 2.5, idMagasin: 1 },
            { id_Produit: 3, nom_Produit: 'Haricots en conserve', description_Produit: 'Haricots en conserve prêts à l emploi. Faciles à utiliser dans des salades, des soupes, ou des plats mijotés.', stock: 80, prixUnitaire: 1.2, idMagasin: 1 },
            { id_Produit: 4, nom_Produit: 'Tomates en dés', description_Produit: 'Tomates en dés en conserve, prêtes à l’utilisation. Parfaites pour des sauces, des soupes, ou des plats de pâtes.', stock: 90, prixUnitaire: 1, idMagasin: 2 },
            { id_Produit: 5, nom_Produit: 'Huile olive', description_Produit: 'Huile olive vierge extra, idéale pour les vinaigrettes, la cuisson ou pour arroser les plats avant.', stock: 50, prixUnitaire: 5, idMagasin: 1 },
            { id_Produit: 6, nom_Produit: 'Vinaigre balsamique', description_Produit: 'Un vinaigre balsamique de qualité, parfait pour les sauces, marinades et assaisonnements de salades.', stock: 40, prixUnitaire: 3.5, idMagasin: 3 },
            { id_Produit: 7, nom_Produit: 'Sel', description_Produit: 'Sel de table classique, essentiel pour assaisonner tous vos plats. Disponible en grande quantité pour une utilisation quotidienne.', stock: 200, prixUnitaire: 0.5, idMagasin: 1 },
            { id_Produit: 8, nom_Produit: 'Poivre', description_Produit: 'Poivre moulu pour ajouter du piquant et de la profondeur à vos recettes. Un assaisonnement polyvalent pour de nombreux plats.', stock: 150, prixUnitaire: 1.5, idMagasin: 2 },
            { id_Produit: 9, nom_Produit: 'Sucre', description_Produit: 'Sucre cristallisé, idéal pour sucrer vos boissons, pâtisseries, ou autres préparations sucrées.', stock: 120, prixUnitaire: 1, idMagasin: 2 },
            { id_Produit: 10, nom_Produit: 'Farine', description_Produit: 'Farine tout usage, parfaite pour faire du pain, des gâteaux, des crêpes, ou toute autre recette nécessitant de la farine.', stock: 100, prixUnitaire: 1.2, idMagasin: 3 },
            { id_Produit: 11, nom_Produit: 'Café', description_Produit: 'Café de qualité supérieure, pour un moment de détente ou pour bien commencer la journée. À préparer selon vos préférences, en filtre ou en espresso.', stock: 60, prixUnitaire: 4, idMagasin: 3 },
            { id_Produit: 12, nom_Produit: 'Thé', description_Produit: 'Thé en sachets, pour une boisson relaxante à tout moment de la journée. Disponible en plusieurs saveurs, comme le thé vert, noir, ou aromatisé.', stock: 80, prixUnitaire: 2.5, idMagasin: 3 },
            { id_Produit: 13, nom_Produit: 'Miel', description_Produit: 'Miel pur et naturel, excellent pour sucrer les boissons ou comme ingrédient dans des recettes sucrées. Très doux et parfumé.', stock: 50, prixUnitaire: 3, idMagasin: 2 },
            { id_Produit: 14, nom_Produit: 'Confiture', description_Produit: 'Confiture de fruits, parfaite pour les tartines ou pour être utilisée dans des recettes sucrées. Un goût sucré et fruité qui ravira les petits-déjeuners.', stock: 70, prixUnitaire: 2, idMagasin: 1 },
            { id_Produit: 15, nom_Produit: 'Céréales', description_Produit: 'Céréales pour le petit-déjeuner, offrant un mélange croquant et nourrissant. Idéales avec du lait ou du yaourt pour bien démarrer la journée.', stock: 90, prixUnitaire: 3, idMagasin: 3 },
            { id_Produit: 16, nom_Produit: 'Soupe en conserve', description_Produit: 'Soupe prête à l’emploi en conserve. Un repas rapide et pratique pour les journées chargées. Disponible dans plusieurs saveurs.', stock: 100, prixUnitaire: 1, idMagasin: 1 },
            { id_Produit: 17, nom_Produit: 'Oignons', description_Produit: 'Oignons frais, un ingrédient de base pour de nombreux plats. Ajoute de la saveur aux sauces, soupes, et autres recettes.', stock: 150, prixUnitaire: 1.5, idMagasin: 2 },
            { id_Produit: 18, nom_Produit: 'Ail', description_Produit: 'Ail frais, indispensable pour ajouter une saveur riche et profonde à vos plats. Utilisé dans une variété de recettes salées.', stock: 200, prixUnitaire: 0.3, idMagasin: 2 },
            { id_Produit: 19, nom_Produit: 'Pommes de terre', description_Produit: 'Pommes de terre fraîches, parfaites pour les purées, frites, ou tout autre plat à base de pommes de terre.', stock: 120, prixUnitaire: 1, idMagasin: 1 },
            { id_Produit: 20, nom_Produit: 'Lait', description_Produit: 'Lait frais, idéal pour les boissons, les céréales, ou comme ingrédient dans la préparation de sauces et pâtisseries.', stock: 100, prixUnitaire: 1, idMagasin: 3 },
            { id_Produit: 21, nom_Produit: 'Nana3', description_Produit: 'Des menthes marocaines exotiques', stock: 5, prixUnitaire: 2, idMagasin: 1 }
        ];

        
        const tracker = knexMock.getTracker();
        tracker.install();

        
        tracker.on('query', query => {
            
            if (query.sql.includes('select')) {
                query.response(mockData); 
            }
        });

 
        const result = await listerProduit();

        
        expect(result).toEqual(mockData);


        tracker.uninstall();
    });
});
