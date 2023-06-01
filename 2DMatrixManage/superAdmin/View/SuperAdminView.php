<?php 

include_once("Model/OrganizationModel.php");
include_once("../adminOrga/Model/UserOrgaModel.php");

class SuperAdminView {

    public static function showApp($msg) {
        $html = "<html><head><script src='/2DMatrixManage/superAdmin/View/footer.js'></script><link rel='stylesheet' href='/2DMatrixManage/superAdmin/View/AdminViewCSS.css'><title>Super Admin</title></head><body>";
        $html .= "<header><div id='firstLine' class='headerLine'><h1>Outil Manage</h1>";
        $html .= "<div id='userContainer'><a id='logout' href='/2DMatrixManage/superAdmin/SuperAdminController.php/?action=logout'><p>Se déconnecter</p></a></div></div>";
        $html .= "<div id='secondLine' class='headerLine'><h2>Partie Super Administrateur</h2></div></header>";
        $html .= $msg;
        $html .= "<div id='bloc1' class='addContainer'>";
        $html .= self::displaySuperAdminForm();
        $html .=self::displayImportForm();
        $html .= "</div>";
        $ol = OrganizationModel::getOrganizationList();
        $html .= self::displayOrganizationList($ol);
        if (count($ol) > 0){
            $html .= "<div id='exportAllContainer'><button id='exportAllButton' onclick='document.getElementById(\"exportAllLink\").click();'><p class='export actionButton'>Exporter tous</p></button><a id='exportAllLink' href='/2DMatrixManage/superAdmin/SuperAdminController.php/?action=exportAll'></a></div>";
        }
        $html .= "<aside>";
        $html .= "<div id='bloc3' class='addContainer'>";
        $html .= self::displayDelOrgaForm(OrganizationModel::getOrganizationIDList());
        $html .= self::displayRevOrgaForm(OrganizationModel::getOrganizationIDList());
        $html .= "</div>";
        $html .= "</aside>";
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
                <p>Le projet est constitué de 3 outils : tout d'abord vous avez l'outil 2DMatrix-Scan qui permet d'authentifier des 2d-doc (créer par l'outil create) et pass sanitaires. À la manière de TousAntiCovid-verif mais en vous apportant plus de détails et de possibilité d'actions que ce dernier. Ensuite vous avez 2DMatrix-Create permettant de créer des 2d-doc authentifiant des diplômes issue de l'enseignement supérieur. Et enfin il y a l'outil manage permettant de gérer les accès à l'outil create. <br/></p>
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
        $html .= "</body>";
        $html .= "</html>";
        return $html;
    }

    public static function displaySuperAdminForm() {
        $file = file_get_contents("../../countries.json");
        $json = json_decode($file);
        $html ="<div class='createForm'><form id='addUserForm' method='POST' action='/2DMatrixManage/superAdmin/SuperAdminController.php/?action=addOrga'>
            <fieldset>
            <legend>Création d'un organisme</legend>
            <div><label for='OrgaID'>Identifiant organisme : </label><input type='text' name='OrgaID' id='OrgaID' minlength='4' maxlength='4' placeholder='Identifiant (4 caractères)' required/></div>
            <div><label for='OrgaName'>Nom de l'organisme : </label><input type='text' name='OrgaName' id='OrgaName' maxlength='60' placeholder='Nom organisme' required/></div>
            <div><label for='OrgaCountry'>Pays de l'organisme : </label><select name='OrgaCountry'>";
        for ($i = 0; $i < count($json); $i++) {
            $code = $json[$i]->{'Code'};
            $html.= "<option value='".$code."'>".$code."</option>";
        }
        $html .= "</select>";

        $html .= "<div><label for='OrgaProvince'>Ville de l'organisme : </label><input type='text' name='OrgaProvince' id='OrgaProvince' maxlength='30' placeholder='Ville organisme' required/></div>
            </fieldset>
            <fieldset><legend>Création du compte administrateur organisme</legend>
            <div><label for='username'>Nom d'utilisateur : </label><input type='text' name='username' id='username' maxlength='30' placeholder='Username' required/></div>
            <div><label for='pass'>Mot de passe : </label><input type='password' name='pass' id='pass' placeholder='A strong password' required/></div>
            <div><label for='firstname'>Prénom :</label><input type='text' name='firstname' id='firstname' maxlength='60' placeholder='Nicolas' required/></div>
            <div><label for='name'>Nom :</label><input type='text' name='name' id='name' maxlength='60' placeholder='Dupont' required/></div>
            </fieldset>
            <div id='creer'>
            <input type='submit' class='validation' name='btnAddOrgaSubmit' value='Créer'/>
            </div>
            </form></div>";
        return $html;
    }

    public static function displayImportForm() {
        return "<div class='createForm'><form id='importForm' method='post' action='/2DMatrixManage/superAdmin/SuperAdminController.php/?action=import' enctype='multipart/form-data'>
        <fieldset><legend>Importation d'organisme</legend>
        <input type='file' name='import' id='import' placeholder='fichier json' required/>
        <input type='submit' class='validation' name='btnImportSubmit' value='Importer'/>
        </fieldset>
        </form></div>";
    }

    public static function displayOrganizationList($ol) {
        $html = "<div id='bloc2' class='listContainer'>\n";
        $html .= "<div><h3>Liste des organismes</h3><div class='cardsContainer'>";
        if (count($ol) <= 0) {
            $html .= "<p>Actuellement, aucun organisme</p>";
            $html .= "</div></div></div>";
            return $html;
        }
        for ($i = 0; $i < count($ol); $i++) {
            $organizationID = $ol[$i]->getOrganizationID();
            $organizationName = $ol[$i]->getOrganizationName();
            $country = $ol[$i]->getCountry();
            $province = $ol[$i]->getProvince();
            $date = $ol[$i]->getDate();
            $username = $ol[$i]->getAdminUsername();
            $html .= "<div class='infosContainer'>        
                        <div>
                        <p>Identifiant Organisme</p>
                        <p>$organizationID</p>
                        </div>

                        <div>
                        <p>Nom Organisme</p>
                        <p>$organizationName</p>
                        </div>

                        <div>
                        <p>Pays Organisme</p>
                        <p>$country</p>
                        </div>

                        <div>
                        <p>Ville Organisme</p>
                        <p>$province</p>
                        </div>

                        <div>
                        <p>Date de création</p>
                        <p>$date</p>
                        </div>

                        <div>
                        <p>Administrateur associé</p>
                        <p>$username</p>
                        </div>";       
            $html .= "<div class='actionButtonsContainer'>
                        <a class='export actionButton' href='/2DMatrixManage/superAdmin/SuperAdminController.php/?action=export&id=$organizationID'></a>
                        </div>
                    </div>";
    
        }
        $html .= "</div></div></div>";
        return $html;
    }

    public static function displayDelOrgaForm($oil) {
        if($oil != NULL) {
            $html = "<div class='createForm'><form id='delOrgaForm' method='POST' action='/2DMatrixManage/superAdmin/SuperAdminController.php/?action=delOrga'>
                <fieldset><legend>Suppression d'un Organisme</legend><select name='IdOrga'>";
            for ($i = 0; $i < count($oil); $i++) {
                $ID = $oil[$i];
                $html.= "<option value='".$ID."'>".$ID."</option>";
            }
            $html .= "</select></fieldset><div class='creer'>
            <input type='submit' class='validation' name='btnDelOrgaSubmit' value='Supprimer'/></div></form></div>";
            return $html;
        }
        return "<p>Aucun organisme à supprimer</p>";
    }

    public static function displayRevOrgaForm($oil) {
        $tab = json_decode(file_get_contents('../../blacklist-certif.json'), true);
        if($oil != NULL || count($tab['Archives']) > 0) {
            $html = "<div class='createForm'><form id='revOrgaForm' method='POST' action='/2DMatrixManage/superAdmin/SuperAdminController.php/?action=revOrga'>
                <fieldset><legend>Révocation d'un Organisme</legend><select name='IdOrga'>";
            for ($i = 0; $i < count($oil); $i++) {
                $ID = $oil[$i];
                $html.= "<option value='".$ID."'>".$ID."</option>";
            }
            foreach (array_keys($tab['Archives']) as $ID) {
                $html .= "<option value='".$ID."'>".$ID."</option>";
            }
            $html .= "</select></fieldset><div class='creer'>
            <input type='submit' class='validation' name='btnRevOrgaSubmit' value='Révoquer'/></div></form></div>";
            return $html;
        }
        return "<p>Aucun organisme à révoquer</p>";
    }

}

?>
