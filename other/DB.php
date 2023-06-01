<?php

include_once("Config.php");

    // Interface de communication entre notre MVC et la base de données
    class DB{

        // Renvoie une connexion ouverte sur la base de données selon les informations du fichier json.
        public static function getDB(){
            try {
                // Tentative de connexion à la base de données avec les informations de configuration du fichier json.
                $dbh = new PDO("mysql:host=".Config::getDBConfig()->dbhost.";dbname=".Config::getDBConfig()->dbname, Config::getDBConfig()->dbuser, Config::getDBConfig()->dbpass);
                return $dbh;
                // Gestion des exceptions.
            } catch (PDOException $e) {
                echo "Erreur !: ".$e->getMessage()."<br/>";
            }
            // Renvoie d'une connexion ouverte sur la base de données.
        }
    }
?>