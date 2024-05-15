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

