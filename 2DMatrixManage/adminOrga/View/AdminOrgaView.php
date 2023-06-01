<?php 

include_once("Model/UserOrgaModel.php");

class AdminOrgaView {

    public static function showApp($msg, $username, $organizationID) {
        $html = "<html><head><script src='/2DMatrixManage/adminOrga/View/footer.js'></script><link rel='stylesheet' href='View/AdminOrgaCSS.css'><title>AdminOrga</title></head><body>";
        $html .= "<header><div id='firstLine' class='headerLine'><h1>Outil Manage</h1>";
        $html .= "<div id='userContainer'>
                    <div id='userInfoContainer'>
                    <p id='username'>" . $username . "</p>
                    <a href='/2DMatrixManage/adminOrga/AdminController.php/?action=logout'>Déconnexion</a>
                </div>
                <img src='imgs/unknown.png' alt='image utilisateur'>
            </div></div>";
        $html .= "<div id='secondLine' class='headerLine'><h2>Administrateur Organisme (".$_SESSION['orgaID'].")</h2></div></header>";
        $html .= $msg;
        $html .= "<div id='addContainer'>";
        $html .= self::displayUserOrgaForm();
        $html .= "</div>";
        $html .= self::displayUserOrgaList(UserOrgaModel::getUsersOrga($organizationID));
        $html .= "</body>";
        $html .= "<img id='close' src='/img/close.png' alt='bouton fermeture' onclick='closeAllBox()'>
        <div id='infoLegale' class='footBox'>
            <fieldset>
                <legend>Informations légales</legend>
                <p>
                    Projet réalisé par des étudiants de Master 1 Informatique branche sécurité à la demande de Mme. Bardet<br/>
                    BELABDOUN Billal <br/>
                    DURAND Alan <br/>
                    FONTENIL Adrien <br/>
                    MENUDE Leo<br/>
    
                </p>
                <img src='/img/team.jpg' alt='team'>
            </fieldset>
        </div>
        <div id='infoProj' class='footBox'>
            <fieldset>
                <legend>Informations sur le projet</legend>
                <p>Notre projet se déroule dans le cadre de la matière applications informatique en première année de master informatique. Notre projet consisté à exploiter le protocole Français 2D-doc pour valider un diplôme. Pour cela nous devions créer un outil capable de lire des 2D-doc contenu dans un datamatrix et dans un second temps avoir un outil capable d'en générer. Enfin, du fait de la pandémie, nous avons ajouté à l'outil de scan la possibilité de lire et comprendre le pass sanitaire (resp. vaccinale) Européen.</p>
                <img src='/img/team.jpg' alt='team'>
            </fieldset>
        </div>
        <div id='fctProj' class='footBox'>
            <fieldset>
                <legend>Fonctionnement Projet</legend>
                <p>Le projet est constitué de 3 outils : tout d'abord vous avez l'outil 2DMatrix-Scan qui permet d'authentifier des 2d-doc (créer par l'outil create) et pass sanitaires. À la manière de TousAntiCovid-verif mais en vous apportant plus de détails et de possibilité d'actions que ce dernier. Ensuite vous avez 2DMatrix-Create permettant de créer des 2d-doc authentifiant des diplômes issue de l'enseignement supérieur. Et enfin il y a l'outil manage permettant de gérer les accès à l'outil create.</p>
                <img src='/img/team.jpg' alt='team'>
            </fieldset>
        </div>
        <footer>
            <div id='footer1'>
                <h3 onclick='displayInfolegale()'>Informations légales</h3>
            </div>
            <div id='footer2' >
                <h3 onclick='displayInfoProj()'>Information Projet</h3>
            </div>
            <div id='footer3'>
                <h3 onclick='displayfctProj()'>Fonctionnement Projet</h3>
            </div>
        </footer>";
        $html .= "</html>";
        return $html;
    }

    public static function displayUserOrgaForm() {
        $html ="<div class='createForm'><form id='addUserForm' method='POST' action='/2DMatrixManage/adminOrga/AdminController.php/?action=addUserOrga'>
        <fieldset>
            <legend>Création d'un utilisateur organisme</legend>
            <div><label for='username'>Nom d'utilisateur : </label><input type='text' name='username' id='username' maxlength='30' placeholder='Username' required/></div>
            <div><label for='pass'>Mot de passe : </label><input type='password' name='pass' id='pass' placeholder='A strong password' required/></div>
            <div><label for='firstname'>Prénom :</label><input type='text' name='firstname' id='firstname' maxlength='60' placeholder='Nicolas' required/></div>
            <div><label for='name'>Nom :</label><input type='text' name='name' id='name' maxlength='60' placeholder='Dupont' required/></div>
        </fieldset>
        <div id='creer'>
        <input type='submit' class='validation' name='btnSubmit' value='Créer'/>
        </div>
    </form></div>";
    return $html;
    }

    public static function displayUserOrgaList($ul){
        $html = "<div id='bloc2' class='listContainer'>\n";
        $html .= "<div><h3>Liste des utilisateurs</h3><div class='cardsContainer'>";
        if ($ul == NULL) {
            $html .= "<p>Actuellement, aucun utilisateur pour cet organisme</p>";
            $html .= "</div></div></div>";
            return $html;
        }
        // Itération sur la liste de responsables rl en récupérant les différentes informations.
        for ($i = 0; $i < count($ul); $i++) {
            $id = $ul[$i]->getID();
            $username = $ul[$i]->getUsername();
            $firstName = $ul[$i]->getFirstName();
            $lastName = $ul[$i]->getLastName();
            $date = $ul[$i]->getDate();
            $html .= "<div class='infosContainer'>        
                        <div>
                        <p>ID</p>
                        <p>$id</p>
                        </div>

                        <div>
                        <p>Nom d'utilisateur</p>
                        <p>$username</p>
                        </div>

                        <div>
                        <p>Prénom</p>
                        <p>$firstName</p>
                        </div>

                        <div>
                        <p>Nom</p>
                        <p>$lastName</p>
                        </div>

                        <div>
                        <p>Date de création</p>
                        <p>$date</p>
                        </div>                
                <div class='actionButtonsContainer'>
                    <a class='remove actionButton' href='AdminController.php?action=delUserOrga&id=$id'></a>
                </div></div>";
        }
        $html .= "</div></div></div>";
        return $html;
    }


}

?>
