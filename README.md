# Smart Immat

Smart Immat a pour objectif d'aider les utilisateurs du site ANTS a préparer leurs dossiers d'immatriculation en leur fournissant un outil leur permettant de compresser et convertir leur documents et de les stocker dans leur espaces utilisateurs.

Sur cette plateforme l'utilisateur peut conserver un historique des documents traités  qui seront disponible au téléchargement dans une seconde version

Les technologies choisit pour ce projet sont:

- HTML CSS Javascript côté front-end
- PHP côté back-end

Concernant le MVP les fonctionnalités attendu sont:

- compression et conversion des documents au formats et poids attendu par l'ANTS
- creation d'un compte utilisateur
- reinitialisation de mot de passe
- historique des fichiers traités
- téléchargment des fichiers traités


## User stories

### 1. Utilisateurs

         1.1 Connexions

| En tant que  | Je souhaite |Afin de|
| :--------------- |:---------------:| -----:|
| Utilisateur| pouvoir creer un compte   |de pouvoir me connecter|
| Utilisateur| faire une demande nouveau mot de passe|de reinitialiser le mot de passe|
|Utilisateur| pouvoir me deconnecter||
|Utilisateur|pouvoir acceder à mon profil|mettre à jour mes informations|

### 2. Documents

        2.2 Compressions

| En tant que  | Je souhaite |Afin de|
| :--------------- |:---------------:| -----:|
| Utilisateur| compresser un document   ||
| Utilisateur|  garder le document compressé dans un historique|de pouvoir le telecharger plus tard|
|Utilisateur| pouvoir supprimer un document de l'historique||

## Dictionnaire de données
   ### 1. Utilisateurs
| Données  | Description  | Types de données |
| :--------------- |:---------------:| -----:|
|id_user  | designe l'id unique de l'utilisateur  | VARCHAR(100) |
|nom  | designe le nom de l'utilisateur  | VARCHAR(100) |
|prenom  | designe le prenomnom de l'utilisateur  | VARCHAR(100) |
| email | designe l'email de l'utilisateur pour se connecter | VARCHAR(100) |
|password  | designe le mot de passe d'luitlisateur pour se connecter  | VARCHAR(100) |

### 2. Document

| Données  | Description  | Types de données |
| :--------------- |:---------------:| -----:|
|id_document | designe l'id unique du document  | VARCHAR(100) |
| nom  | designe le nom du document  | VARCHAR(50) |
| taille  | designe la taille du fichier uploadé  | FLOAT |
| Extension| designe le type du fichier uploadé  | VARCHAR(10) |

### 3. Historique

| Données  | Description  | Types de données |
| :--------------- |:---------------:| -----:|
|id_document | designe l'id unique du document  | VARCHAR(100) |
| nom  | designe le nom du document  | VARCHAR(50) |
|date|designe la date de traitement du document| DATE|
| taille  | designe la taille du fichier uploadé  | FLOAT |
| Extension| designe le type du fichier uploadé  | VARCHAR(10) |
