#!/bin/bash

# Mise à jour
apt update

# Installation du serveur
apt install mariadb-server  

# Option de sécurité mysql
mysql_secure_installation

# Démarrage sql
mariadb -u root
