# Guide d'Installation et d'Utilisation de PFM_Blockchain

## Table des Matières
1. [Installation](#installation)
2. [Configuration de MetaMask](#configuration-de-metamask)
3. [Description des Exercices](#description-des-exercices)

## Installation

### Prérequis
- Node.js et npm
- ganache-cli (pour la blockchain locale)
- MetaMask (extension navigateur)
- Git

### Procédure d'Installation
1. **Cloner le dépôt**
   ```bash
   git clone <url-du-dépôt>
   cd PFM_Blockchain
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Installer ganache-cli globalement**
   ```bash
   npm install -g ganache-cli
   ```

4. **Lancer ganache-cli**
   ```bash
   ganache-cli -p 7545 -i 1337 --deterministic
   ```
   > Note: Cette commande lance ganache-cli sur le port 7545 avec un ID réseau 1337 et des comptes déterministes (toujours les mêmes clés privées).
   > Laissez cette fenêtre de terminal ouverte pendant que vous utilisez l'application.

5. **Compiler et déployer les contrats** (dans un nouveau terminal)
   ```bash
   npx truffle compile
   npx truffle migrate --reset
   ```

6. **Installer les dépendances du client React**
   ```bash
   cd client
   npm install
   ```

7. **Lancer l'application**
   ```bash
   npm start
   ```

8. **Accéder à l'application**
   - Ouvrez votre navigateur à l'adresse `http://localhost:3000`

## Configuration de MetaMask

### Ajouter un Réseau Privé
1. Ouvrez l'extension MetaMask
2. Cliquez sur le menu déroulant des réseaux en haut
3. Sélectionnez "Ajouter un réseau" puis "Ajouter un réseau manuellement"
4. Entrez les informations suivantes:
   - **Nom du réseau**: Ganache Local
   - **URL RPC**: http://127.0.0.1:7545
   - **ID de chaîne**: 1337
   - **Symbole de devise**: ETH
   - **URL du bloc explorer**: laisser vide
5. Cliquez sur "Enregistrer"

### Importer un Compte Privé
1. Lorsque vous avez lancé ganache-cli, vous verrez une liste de comptes avec leurs clés privées dans le terminal
2. Copiez l'une des clés privées affichées (commençant par "0x...")
3. Dans MetaMask, cliquez sur le cercle de votre compte en haut à droite
4. Sélectionnez "Importer un compte"
5. Collez la clé privée et cliquez sur "Importer"

> Note: Le premier compte listé dans ganache-cli est généralement celui utilisé pour déployer les contrats, donc il est préférable de l'importer.

## Description des Exercices

### Exercice 1: Fonctions d'Addition
**Fonctionnalité**: Démontre les fonctions d'addition simples sur la blockchain.
- **Affichage**: Montre les valeurs a et b stockées dans le contrat.
- **Addition1**: Calcule la somme des variables d'état a + b.
- **Addition2**: Permet d'entrer deux nombres et d'effectuer leur addition sur la blockchain.

### Exercice 2: Conversion Ether/Wei
**Fonctionnalité**: Convertit entre les unités Ether et Wei.
- **Conversion Ether → Wei**: Entre un montant en ETH et le convertit en Wei.
- **Conversion Wei → Ether**: Entre un montant en Wei et le convertit en ETH.

### Exercice 3: Manipulation de Chaînes
**Fonctionnalité**: Démontre les manipulations de texte sur la blockchain.
- **Message actuel**: Affiche la chaîne stockée dans le contrat.
- **Modifier message**: Permet de changer le message stocké.
- **Concaténation**: Combine deux chaînes entrées par l'utilisateur.
- **Longueur**: Calcule la longueur d'une chaîne.
- **Comparaison**: Compare deux chaînes pour vérifier si elles sont identiques.

### Exercice 4: Vérification de Nombre Positif
**Fonctionnalité**: Vérifie si un nombre est positif.
- **Entrer un nombre**: Permet de saisir un nombre.
- **Vérifier**: Indique si le nombre entré est positif ou non.

### Exercice 5: Vérification de Nombre Pair
**Fonctionnalité**: Vérifie si un nombre est pair.
- **Entrer un nombre**: Permet de saisir un nombre.
- **Vérifier**: Indique si le nombre entré est pair ou impair.

### Exercice 6: Manipulation de Tableaux
**Fonctionnalité**: Gère un tableau de nombres sur la blockchain.
- **Liste des nombres**: Affiche tous les nombres dans le tableau.
- **Ajouter un nombre**: Ajoute un nouveau nombre au tableau.
- **Somme**: Calcule la somme de tous les nombres dans le tableau.
- **Rechercher par index**: Trouve l'élément à un index spécifique.
- **Initialiser nouveau contrat**: Option pour déployer un nouveau contrat avec des valeurs initiales différentes.

### Exercice 7: POO avec Formes
**Fonctionnalité**: Démontre la programmation orientée objet en Solidity avec l'héritage.
- **Informations de forme**: Affiche les détails sur la forme (Rectangle).
- **Coordonnées**: Montre les coordonnées X et Y de la forme.
- **Dimensions**: Affiche la longueur et la largeur du rectangle.
- **Surface**: Calcule et affiche la surface du rectangle.
- **Déplacer**: Permet de déplacer la forme en modifiant ses coordonnées.

### Exercice 8: Gestion des Paiements
**Fonctionnalité**: Permet l'envoi et la réception d'Ether via des contrats intelligents.
- **Informations du contrat**: Affiche l'adresse du contrat, l'adresse du destinataire et le solde actuel.
- **Envoyer un paiement**: Permet d'envoyer de l'ETH au contrat.
- **Retirer les fonds**: Permet au destinataire de retirer les fonds du contrat.
- **Envoyer vers une adresse**: Permet au destinataire d'envoyer les fonds à une adresse spécifique.

---

*Note: Ce document est destiné à être converti en format DOCX. Pour le convertir, utilisez un service en ligne comme Pandoc ou ouvrez-le dans Microsoft Word puis enregistrez-le au format DOCX.* 