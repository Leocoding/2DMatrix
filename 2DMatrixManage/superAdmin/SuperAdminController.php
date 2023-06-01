<?php 

session_start();

include_once("View/SuperAdminView.php");

$_SESSION['role'] = "SuperAdmin";

$message = "";
    
if (isset($_GET['action'])) {

    $action = htmlspecialchars($_GET['action']);
        
    if ($action == "addOrga") {
        if (isset($_POST['btnAddOrgaSubmit']) && isset($_POST['OrgaID']) && isset($_POST['OrgaName']) 
            && isset($_POST['OrgaCountry']) && isset($_POST['OrgaProvince']) && isset($_POST['username'])
            && isset($_POST['pass']) && isset($_POST['firstname']) && isset($_POST['name'])) {
            // Organization
            $organization_id = strtoupper(htmlspecialchars($_POST['OrgaID']));
            $organization_name = htmlspecialchars($_POST['OrgaName']);
            $country = htmlspecialchars($_POST['OrgaCountry']);
            $province = htmlspecialchars($_POST['OrgaProvince']);
            $validTime = 365;
            // Admin Account
            $id = NULL;
            $username = htmlspecialchars($_POST['username']);
            $pass = htmlspecialchars($_POST['pass']);
            $firstname = htmlspecialchars($_POST['firstname']);
            $lastname = htmlspecialchars($_POST['name']);
            $date = date('Y-m-d');

            if (OrganizationModel::checkIfExistOrga($organization_id)) {
               header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php?action=default&msg=orgExist");
            } else if (UserOrgaModel::checkIfExistUserOrga($username)) {
                header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php?action=default&msg=accExist");
            } else {
                OrganizationModel::addNewOrga(new Organization($organization_id, $organization_name, $country, $province, $validTime, $date, $username), 
                    new UserOrga($id, $organization_id, $firstname, $lastname, $date, $username, $pass));
                header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php?action=default&msg=addComplete");
            }
        }
    } else if ($action == "delOrga") {
        if (isset($_POST['btnDelOrgaSubmit']) && isset($_POST['IdOrga'])) {
            $organization_id = strtoupper(htmlspecialchars($_POST['IdOrga']));
            if (OrganizationModel::checkIfExistOrga($organization_id)) {
                OrganizationModel::delOrga($organization_id);
                header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php?action=default&msg=delComplete");
            } else {
                header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php?action=default&msg=orgNotExist");
            }
        }
    } else if ($action == "revOrga") {
        if (isset($_POST['btnRevOrgaSubmit']) && isset($_POST['IdOrga'])) {
            $organization_id = strtoupper(htmlspecialchars($_POST['IdOrga']));
            $data = json_decode(file_get_contents('../../blacklist-certif.json'), true);
            if (OrganizationModel::checkIfExistOrga($organization_id)) {
                OrganizationModel::revOrga($organization_id);
                header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php?action=default&msg=revComplete");
            } else if (OrganizationModel::checkIfExistOrgaJSON($organization_id, $data)) {
                OrganizationModel::removeAuthorityArchive($organization_id, $data);
            } else {
                header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php?action=default&msg=orgNotExist");
            }
        }
    } else if ($action == "export") {
        if(isset($_GET['id'])) {
            $orgaID = strtoupper(htmlspecialchars($_GET['id']));
            // Erreur sur cette fonction
            $orga = OrganizationModel::getAuthority($orgaID);
            if(!is_null($orga) || $orga != false) {
                $json = json_encode($orga, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                $filename = 'organizations'.date('Y-m-d');
                header("Content-type: application/vnd.ms-excel");
                header("Content-Type: application/force-download");
                header("Content-Type: application/download");
                header("Content-disposition: " . $filename . ".json");
                header("Content-disposition: filename=" . $filename . ".json");
                print $json;
                exit;
            } else {
                header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php?action=default&msg=noOrgaToGet");
            }
        } else {
            header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php?action=default&msg=noIdSpecified");
        }
    } else if ($action == "exportAll") {
        $orgas = OrganizationModel::getAllAuthorities();
        if(!is_null($orgas) || $orgas != false) {
            $json = json_encode($orgas, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            $filename = 'organizations'.date('Y-m-d');
            header("Content-type: application/vnd.ms-excel");
            header("Content-Type: application/force-download");
            header("Content-Type: application/download");
            header("Content-disposition: " . $filename . ".json");
            header("Content-disposition: filename=" . $filename . ".json");
            print $json;
            exit;
        } else {
            header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php?action=default&msg=noOrgaToGet");
        }
    } else if ($action == "import") {
        if (isset($_POST['btnImportSubmit']) && isset($_FILES['import'])) {
            if (OrganizationModel::checkImportFile($_FILES['import'])) {
                $data = json_decode(file_get_contents($_FILES['import']['tmp_name']), true);
                OrganizationModel::setAuthorities($data);
                header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php?action=default&msg=importComplete");
            } else {
                header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php?action=default&msg=BadImportFile");
            }
        }
    } else if ($action == "logout"){
        session_unset();
        session_destroy();
        header('Location: /index.php');
    } else if ($action == "default") {
        if (isset($_GET['msg'])) {
            $infoMsg = htmlspecialchars($_GET['msg']);
            switch ($infoMsg) {
                case 'delComplete':
                    $message = "<p class='infoMsg'>L'organisme a bien été supprimé.</p>";
                    break;
                case 'revComplete':
                    $message = "<p class='infoMsg'>L'organisme a bien été révoqué.</p>";
                    break;
                case 'addComplete':
                    $message = "<p class='infoMsg'>L'organisme a bien été créé.</p>";
                    break;
                case 'accExist':
                    $message = "<p class='infoMsg error'>Ce nom de compte n'est pas disponible.</p>";
                    break;
                case 'orgExist':
                    $message = "<p class='infoMsg error'>Cet identifiant organisme est déjà pris.</p>";
                    break;
                case 'noIdToDel':
                    $message = "<p class='infoMsg error'>Aucun compte à supprimmer.</p>";
                    break;
                case 'orgNotExist':
                    $message = "<p class='infoMsg error'>Cet identifiant organisme n'existe pas.</p>";
                    break;   
                case 'noOrgaToGet':
                    $message = "<p class='infoMsg error'>Aucun organisme à récuperer.</p>";
                    break;     
                case 'noIdSpecified':
                    $message = "<p class='infoMsg error'>Aucun identifiant d'organisme spécifié pour l'exportation.</p>";
                    break;
                case 'BadImportFile':
                    $message = "<p class='infoMsg error'>Le fichier envoyé ne convient pas.</p>";
                    break;             
                case 'importComplete':
                    $message = "<p class='infoMsg'>L'import a bien été efféctué.</p>";
                    break;  
                default:
                    break;
            }
        } else {
            header("Location: /2DMatrixManage/superAdmin/SuperAdminController.php");
        }
    }
}

// Print the Application View
echo SuperAdminView::showApp($message);

?>