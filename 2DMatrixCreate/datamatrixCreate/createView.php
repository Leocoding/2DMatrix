<?php

session_start();

class createView {
    public static function showApp($username, $certifications) {
        if(empty($certifications)) {
            return '
            <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="utf-8">
            <title>2DMatrix-Create</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" type="text/css" media="screen" href="datamatrixCreate/menu.css">
        
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
                <h2>Outil de génération ('.$_SESSION['orgaID'].')</h2>
                <a id="bl" href="menu.php?bl">Gestion Blacklist</a>
            </div>
            </header>


        
        
            <div id="createContainer">
                <!--<form action="#" method="get" onsubmit="validateData()" id="createForm">-->
                    <div id="createForm" class="noCertificate">
                    <p>Aucun certificat disponible pour votre organisme. Veuillez en ajouter un avant de pouvoir générer un datamatrix.</p>
                    </div>
                <!--</form>-->
        
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
                <p>Le projet est constitué de 3 outils : tout d\'abord vous avez l\'outil 2DMatrix-Scan qui permet d\'authentifier des 2d-doc (créer par l\'outil create) et pass sanitaires. À la manière de TousAntiCovid-verif mais en vous apportant plus de détails et de possibilité d\'actions que ce dernier. Ensuite vous avez 2DMatrix-Create permettant de créer des 2d-doc authentifiant des diplômes issue de l\'enseignement supérieur. Et enfin il y a l\'outil manage permettant de gérer les accès à l\'outil create.<br/></p>
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
        </body>
        </html>
            ';
        }
        //Afficher certif
        $htmlcertifcode = '<label for="certif">Selectionner un certificat :</label>
        <select id="certif" name="certif">';
        foreach($certifications as &$value) {
            $htmlcertifcode = $htmlcertifcode . '<option value="' . $value . '">' . $value . '</option>';
        }
        $htmlcertifcode = $htmlcertifcode . '</select>';
        return '
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="utf-8">
            <title>2DMatrixCreate</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" type="text/css" media="screen" href="datamatrixCreate/menu.css">
            <script src="datamatrixCreate/bwip-js.min.js"></script>
            <script src="datamatrixCreate/footer.js"></script>
        
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
                <h2>Outil de génération ('.$_SESSION['orgaID'].')</h2>
                <a id="bl" href="menu.php?bl">Gestion Blacklist</a>
            </div>
            </header>
        

            <div id="createContainer">
                <!--<form action="#" method="get" onsubmit="validateData()" id="createForm">-->
                    <div id="createForm">
                        <label for="Lname">Nom : </label><input type="text" name="Lname" id="Lname" placeholder="Nom " required>
                        <label for="Fname">Prénom : </label><input type="text" name="Fname" id="Fname" placeholder="Prénom" required>
                        <label for="dateBirth">Date de Naissance: </label><input type="date" name="dateBirth" id="dateBirth" required>
                        <label for="pays">Pays de naissance: </label><input list="paysListe" type="text" name="pays" id="pays" placeholder="Pays de naissance" required>
                        <label for="genre">Genre : </label><select name="genre" id="genre" required>
                            <option value ="" >--Choississez une option--</option>
                            <option value="F">Femme</option>
                            <option value="M">Homme</option>
                            <option value="X">Autre</option>
                        </select>
                        <label for="numDoc">Numéro du diplôme : </label><input type="text" name="numDoc" id="numDoc" placeholder="Numéro du document" required>
                        <label for="degree">Niveau de diplôme : </label><select name="degree" id="degree" required>
                            <option value ="" >--Choississez une option--</option>
                            <option value="4">Bac</option>
                            <option value="5">BTS/DUT</option>
                            <option value="6">Licence</option>
                            <option value="7">Master</option>
                            <option value="8">Doctorat</option>
                        </select>
                        <label for="type">Type de diplôme : </label> <input list="typeList" type="text" name="type" id="type" placeholder="Type de diplôme" required>
                        <label for="domaine">Domaine : </label><input type="text" name="domaine" id="domaine" placeholder="Domaine" required>
                        <label for="mention">Mention : </label><input type="text" name="mention" id="mention" placeholder="Mention" required>
                        <label for="spe">Spécialité : </label><input type="text" name="spe" id="spe" placeholder="Spécialité" required>
                        <div><label for="chiffrement">Chiffrer données : </label><input type="checkbox" name="chiffrement" id="chiffrement" value="ok"></div>'
                        . $htmlcertifcode . 
                    '</div>
                    <div id="centralDiv">
                        <p id=status></p>
                        <input onclick="validateData()" type="submit" value="Générer">
                    </div>
                <!--</form>-->
        
                <div id="datamatrixContainer">
                    <div id="canvasContainer">
                        <canvas id="mycanvas">Votre navigateur n\'est pas compatible</canvas>
                        <p id="attenteLbl">En attente de génération</p>
                    </div>
                    <a id="telecharge">Télécharger</a>
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
                    <p>Le projet est constitué de 3 outils : ... <br/></p>
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
            <script src="datamatrixCreate/liste.js"></script>
            <script src="datamatrixCreate/menu.js"></script>
        </body>
        </html>
        ';
    }
}


?>
