#la classe données geo
class DonneesGeo:
    #constructeur
    def __init__(self,ville,pays,latitude,longitude):
        self.ville = ville
        self.pays = pays
        self.latitude = latitude
        self.longitude = longitude

    #la méthode daffichage
    def __str__(self):
        return (f" La ville : {self.ville}, Pays: {self.pays}, Latitude: {self.latitude}, Longitude: {self.longitude}")

#la fonction de lecture du fichier .csv
import csv
def lireDonneesCsv(nomFichier):
    donnees_geographiques = []
    with open(nomFichier, 'r', encoding='utf-8') as fichier:
        lecteur_csv = csv.reader(fichier)

        #Jignore l'entete car ca genere une erreur
        next(lecteur_csv)
        for ligne in lecteur_csv:
            # Je verifie si la ligne est vide
            if ligne:
                ville, pays, latitude, longitude = ligne
                latitude = float(latitude)

                # je supprime les espaces
                longitude = float(longitude.replace(" ", ""))
                donnees_geographiques.append(DonneesGeo(ville, pays, latitude, longitude))
    return donnees_geographiques



import json
import os

def ecrireDonneesJson(nomFichier, listeObjetDonneesGeo):
    # je convertienotre liste dobjets en dictionnaires
    liste_dicts = []
    for obj in listeObjetDonneesGeo:
        dict_obj ={
            "Ville":obj.ville,
            "Pays":obj.pays,
            "Latitude":obj.latitude,
            "Longitude":obj.longitude

        }
        liste_dicts.append(dict_obj)

    #ecrire notre dictionnaire dans un fichier json
    with open(nomFichier, 'w', encoding='utf-8') as fichier:
        #1.on verifie si le fichier existe déja
        if os.path.exists(nomFichier):
            #1.1 sil existe on ecrit directement dedans
            json.dump(liste_dicts, fichier, indent=4)

        else:
            #1.2 si le fichier nexiste pas , on le créer et on ecrit dedans
            json.dump(liste_dicts, fichier, indent=4)



# fonction juste pour tester
"""def ptittest():
    fichier_csv = "Donnees.csv"

    #lecture
    donnees = lireDonneesCsv(fichier_csv)
    #affichage
    print(f" données lues a partir du fichier de donées geographique :")

    for donnee in donnees:
        print(donnee)

    fichier_json ="donnees.json"

    #lecriture de nos données en json
    ecrireDonneesJson(fichier_json, donnees)
    print(f"données ecrites dans le fichier json")
"""

import json
import math
import csv

# Fonction pour calculer la distance de Haversine entre deux points
def calculer_distance(lat1, lon1, lat2, lon2):
    R = 6371.0  # Rayon de la Terre en kilomètres

    # Conversion des degrés en radians
    t1 = math.radians(lat1)
    t2 = math.radians(lat2)
    l1 = math.radians(lon1)
    l2 = math.radians(lon2)

    # Calcul des différences de latitude et longitude
    dlat = t2 - t1
    dlon = l2 - l1

    # Formule de Haversine pour calculer la distance
    a = math.sin(dlat / 2) ** 2 + math.cos(t1) * math.cos(t2) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))

    # Calcul de la distance finale
    return R * c

# Fonction pour trouver la distance minimale et sauvegarder toutes les distances dans un fichier CSV
def trouverDistanceMin(nomFichierJSON, nomFichierCSV):
    # Chargement des données des villes à partir d'un fichier JSON
    with open(nomFichierJSON, 'r', encoding='utf-8') as fichier:
        villes = json.load(fichier)

    # Initialisation de la distance minimale et des villes correspondantes
    distance_min = float('inf')
    ville1_min = None
    ville2_min = None

    # Ouverture du fichier CSV pour écrire les distances
    with open(nomFichierCSV, 'w', newline='', encoding='utf-8') as f_csv:
        fieldnames = ['ville1', 'ville2', 'distance']
        f_distance = csv.DictWriter(f_csv, fieldnames=fieldnames)
        f_distance.writeheader()

        # Boucles imbriquées pour comparer chaque paire de villes
        for i in range(len(villes)):
            for j in range(i + 1, len(villes)):
                ville1 = villes[i]
                ville2 = villes[j]
                lat1, lon1 = ville1['Latitude'], ville1['Longitude']
                lat2, lon2 = ville2['Latitude'], ville2['Longitude']

                # Calcul de la distance entre la ville 1 et la ville 2
                distance = calculer_distance(lat1, lon1, lat2, lon2)

                # Écriture de la distance dans le fichier CSV
                f_distance.writerow({
                    'ville1': f"{ville1['Ville']} ({ville1['Pays']})",
                    'ville2': f"{ville2['Ville']} ({ville2['Pays']})",
                    'distance': f"{distance:.2f}"
                })

                # Mise à jour de la distance minimale si nécessaire
                if distance < distance_min:
                    distance_min = distance
                    ville1_min = ville1
                    ville2_min = ville2

    # Affichage des villes les plus proches et de la distance minimale
    if ville1_min and ville2_min:
        print(f"Distance minimale en kilomètres entre 2 villes :")
        print(f"Ville 1 : {ville1_min['Ville']} {ville1_min['Pays']} {ville1_min['Latitude']} {ville1_min['Longitude']}")
        print(f"Ville 2 : {ville2_min['Ville']} {ville2_min['Pays']} {ville2_min['Latitude']} {ville2_min['Longitude']}")
        print(f"Distance en kilomètres : {distance_min:.2f}")

# Exemple d'utilisation de la fonction
trouverDistanceMin('donnees.json', 'distance.csv')




def menu():

    choix = ''
    donnees = [] #liste pour stocker les données geographiques
    donneesChargees = False #pour suivre letat des operations
    donneesSauvgardees = False

    while choix != 'q':  #boucle jusqua ce que lutilisateur mette q
        print(f'\n---------------------------------------- MENU ----------------------------------')
        print(f" 1-	Lire les données du fichier csv, créer les objets et afficher les données")
        print(f" 2- Sauvegarder les données dans un fichier .json ")
        print(f" 3- Lire les données du fichier .json, déterminer et afficher les données associées à la distance minimale entre deux villes et sauvegarder les calculs dans distances.csv ")
        print(" veuillez Entrez un numéro pour choisir ou 'q' pour quitter : ")

        choix = input().strip() #pour lirele choix de lutilisateur

        if choix =='1':

            #lire les donnees du fichier csv
            donnees = lireDonneesCsv('Donnees.csv')
            print(f" Les données ont été lu a partir du fichier Donnees.csv :")

            #afficher les données du fichier
            for donnee in donnees:

                print(donnee)

            #lutilisateur dois appuyez sur une touche pour continuez (petit bonus pour les points)
            input("Appuyez sur une touche pour continuez...")

            #je met a jour letat des donnees de false a true
            donneesChargees = True

        elif choix == '2':

            #verifier si les donnes ont été chargées
            if not donneesChargees :
                print(f" vuillez dabord lire les données a partir du fichier csv (loption num 1)")

            else:
                #sauvgarde les données dans le fichier json
                ecrireDonneesJson('donnees.json', donnees)
                print("Données sauvegardées dans le fichier donnees.json ")

                #mise a jour des données chargées allons de letat false a true
                donneesSauvgardees = True

        elif choix == '3':
            if not donneesChargees:
                print("Veuillez d'abord lire les données à partir du fichier CSV (l'option num 1) ")

            elif not donneesSauvgardees:
                print("Veuillez d'abord sauvegarder les données dans un fichier JSON (l'option num 2)")

            else:
                #japelle ta fonction de calcul
                trouverDistanceMin('donnees.json')

        elif choix == 'q':
            #je quitte le programme
            print("Quitter le programme...")

        else:
            #pour les entrées invalide
            print("Option invalide. Veuillez réessayer.")

if __name__ == "__main__":
    menu()
