import csv
from TP2 import DonneesGeo
def lireDonneesCsv():
    liste_donnee_geo = []

    with open("Donnees.csv",newline="",encoding="utf-8") as f_Csv:
        lecteur = csv.reader(f_Csv)

        for ligne in lecteur:
            if len(ligne) >= 4:
                ville = ligne[0]
                pays = ligne[1]
                latitude = float(ligne[2])
                longitude = float(ligne[3])
                donneeGeo = DonneesGeo(ville,pays,latitude,longitude)
                liste_donnee_geo.append(donneeGeo)

    return liste_donnee_geo