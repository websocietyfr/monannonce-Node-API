# Mon Annonce API
Détail des routes appelables :
https://documenter.getpostman.com/view/6977146/2s8YKAo4j9

## Avec docker
### Installer le projet avec Docker
```
git clone ... project_api && cd project_api
```
Il vous faudra créer un fichier d'environnement dans le projet node, vous pouvez vous baser sur le fichier *.env.example* fourni et le reprendre à l'identique sur l'environnement Docker:
```
cp monannonce/.env.example monannonce/.env
```
Construire le container Node:
```
docker compose build monannonce-node
```
Réaliser l'installation des dépendances dans le projet :
```
docker compose run monannonce-node npm i
```
### Démarrer le projet avec Docker
```
docker compose up monannonce-node
```
### Arrêter le projet avec Docker
```
docker compose down
```

## Avec un environnement Node 16.X installé nativement
```
git clone ... project_api && cd project_api
```
Il vous faudra créer un fichier d'environnement dans le projet node, vous pouvez vous baser sur le fichier *.env.example* fourni et le reprendre à l'identique sur l'environnement Docker:
```
cp monannonce/.env.example monannonce/.env
```
Installer les dépendances:
```
cd monannonce && npm i
```
Démarrer l'environnement (depuis le dossier */monannonce*):
```
node ace serve
```