<?php

class blacklistView {
    public static function showApp($username) {
        return '
        <!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8"/>
        <title>Révocation 2D-DOC Signature</title>
        <link rel="stylesheet" type="text/css" media="screen" href="RevocBlacklist/blacklist.css">
        <script type="text/javascript" src="RevocBlacklist/footer.js"></script>
    </head>
    <body>
        <header>
        <div id="firstLine" class="headerLine">
            <h1>Projet DataMatrix</h1>
            <div id="userContainer">
                <div id="userInfoContainer">
                    <p id="username">' . $username . '</p>
                    <a href="menu.php?logout">Déconnexion</a>
                </div>
                <img src="ressources/unknown.png" alt="image utilisateur">
            </div>
        </div>
        <div id="secondLine" class="headerLine">
            <h2>Gestion Blacklist ('.$_SESSION['orgaID'].')</h2>
            <a id="bl" href="menu.php">Outil de génération</a>
        </div>
        </header>
        <div id="bodyContent">
        <div id="readerContainer">
            <div id="reader"></div>
            <p>Utilisez le scanner pour récupérer automatiquement la signature</p>
        </div>
        <div id="fieldsDiv">
        <div id="add">
            <h3>AJOUTER UNE SIGNATURE DANS LA BLACKLIST</h3>
            <div>
                <input id="ajout" type="text" name="valide">
                
                
                <input onclick="addOrRemoveSignature(ADD)" type="submit" value="Ajouter">
            </div>
        </div>
        
        <div id="rem">
            <h3>SUPPRIMER UNE SIGNATURE DE LA BLACKLIST</h3>
                <input id="remove" type="text" name="supprime">
                
                
                <input onclick="addOrRemoveSignature(REMOVE)" type="submit" value="Supprimer">
        </div>
        
        <p id="status"></p>

        </div>
        </div>
        <img id="close" src="/img/close.png" alt="bouton fermeture" onclick="closeAllBox()">
        <div id="infoLegale" class="footBox">
            <fieldset>
                <legend>Informations légales</legend>
                <p>
                    Projet réalisé par des étudiants de Master 1 Informatique branche sécurité à la demande de Mme. Bardet<br/>
                    BELABDOUN Billal <br/>
                    DURAND Alan <br/>
                    FONTENIL Adrien <br/>
                    MENUDE Leo<br/>
    
                </p>
                <img src="/img/team.jpg" alt="team">
            </fieldset>
        </div>
        <div id="infoProj" class="footBox">
            <fieldset>
                <legend>Informations sur le projet</legend>
                <p>Notre projet se déroule dans le cadre de la matière applications informatique en première année de master informatique. Notre projet consisté à exploiter le protocole Français 2D-doc pour valider un diplôme. Pour cela nous devions créer un outil capable de lire des 2D-doc contenu dans un datamatrix et dans un second temps avoir un outil capable d"en générer. Enfin, du fait de la pandémie, nous avons ajouté à l"outil de scan la possibilité de lire et comprendre le pass sanitaire (resp. vaccinale) Européen.</p>
                <img src="/img/team.jpg" alt="team">
            </fieldset>
        </div>
        <div id="fctProj" class="footBox">
            <fieldset>
                <legend>Fonctionnement Projet</legend>
                <p>Le projet est constitué de 3 outils : tout d\'abord vous avez l\'outil 2DMatrix-Scan qui permet d\'authentifier des 2d-doc (créer par l\'outil create) et pass sanitaires. À la manière de TousAntiCovid-verif mais en vous apportant plus de détails et de possibilité d\'actions que ce dernier. Ensuite vous avez 2DMatrix-Create permettant de créer des 2d-doc authentifiant des diplômes issue de l\'enseignement supérieur. Et enfin il y a l\'outil manage permettant de gérer les accès à l\'outil create. <br/></p>
                <img src="/img/team.jpg" alt="team">
            </fieldset>
        </div>
        <footer>
            <div id="footer1">
                <h3 onclick="displayInfolegale()">Informations légales</h3>
            </div>
            <div id="footer2" >
                <h3 onclick="displayInfoProj()">Information Projet</h3>
            </div>
            <div id="footer3">
                <h3 onclick="displayfctProj()">Fonctionnement Projet</h3>
            </div>
        </footer>
        <script src="RevocBlacklist/html5-qrcode.min.js"></script>
        <script src="RevocBlacklist/cryptojs.min.js"></script>
        <script src="RevocBlacklist/blacklistCertif.js"></script>
    </body>
</html>
        ';
    }
}


?>
