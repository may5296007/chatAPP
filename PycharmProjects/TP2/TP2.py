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



