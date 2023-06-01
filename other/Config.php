<?php

    // Permet la gestion des informations de configuration du fichier json.
    class Config{

        // Récupère l'enesmble des informations du fichier json. (decode)
        public static function getConfig(){
            return json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT']."/DBconfig.json"));
        }

        // Récupère les configurations de la base de données. (nom/hote/user/password)
        public static function getDBConfig(){
            return self::getConfig()->db;
        }
    }
?>