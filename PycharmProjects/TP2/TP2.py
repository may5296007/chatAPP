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
        return (donnees_geographiques)



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
def ptittest():
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

from math import *
import json
import math


# Fonction pour calculer la distance de Haversine
def calculer_distance(lat1, lon1, lat2, lon2):
    R = 6371.0  # Rayon de la Terre en kilomètres

    # Conversion des degrés en radians
    t1 = math.radians(lat1)
    t2 = math.radians(lat2)
    l1 = math.radians(lon1)
    l2 = math.radians(lon2)

    # Application de la formule de Haversine
    dlat = t2 - t1
    dlon = l2 - l1
    a = math.sin(dlat / 2) ** 2 + math.cos(t1) * math.cos(t2) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    distance = R * c

    return distance
# Fonction pour trouver la distance minimale
def trouverDistanceMin(nomFichier):

    with open(nomFichier, 'r', encoding='utf-8') as fichier:
            villes = json.load(fichier)

    # initialisation de la distance min a une valeure élevé
    distance_min = float('inf')
    ville1_min = None
    ville2_min = None

    for i in range(len(villes)):
        for j in range(i + 1, len(villes)):
            ville1 = villes[i]
            ville2 = villes[j]
            lat1, lon1 = ville1['Latitude'], ville1['Longitude']
            lat2, lon2 = ville2['Latitude'], ville2['Longitude']

            # calcul de la distance entre la ville 1 et la ville 2
            distance = calculer_distance(lat1, lon1, lat2, lon2)

            # Si la distance calculée est inférieure à la distance minimale actuelle,
            # mettre à jour la distance minimale et les villes correspondantes
            if distance < distance_min:
                distance_min = distance
                ville1_min = ville1
                ville2_min = ville2

    if ville1_min and ville2_min:
        print(f"Distance minimale en kilomètres entre 2 villes :")
        print(f"Ville 1 : {ville1_min['Ville']} {ville1_min['Pays']} {ville1_min['Latitude']} {ville1_min['Longitude']}")
        print(f"Ville 2 : {ville2_min['Ville']} {ville2_min['Pays']} {ville2_min['Latitude']} {ville2_min['Longitude']}")
        print(f"Distance en kilomètres : {distance_min:.2f}")

# Exemple d'utilisation
trouverDistanceMin('donnees.json')

