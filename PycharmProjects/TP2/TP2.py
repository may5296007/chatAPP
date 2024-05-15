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

ptittest()
blababa