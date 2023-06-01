<?php 

session_start();

include_once("View/AdminOrgaView.php");

// Access Rights Test
if(isset($_SESSION['role']) && $_SESSION['role'] == 'AdminOrga') {

    $message = "";
    
    // Get the Organization ID or redirect if can't get
    if (isset($_SESSION['orgaID'])) {
        $organization_id = htmlspecialchars($_SESSION['orgaID']);
        $username = htmlspecialchars($_SESSION['user']);
    } else {
        header("Location: /index.php");
    }

    // Action to do ?
    if(isset($_GET['action'])) {

        // Get the action
        $action = htmlspecialchars($_GET['action']);
        
        // Add a new organization user to DB
        if ($action == "addUserOrga") {
            // Test if user send the form
            if(isset($_POST['btnSubmit']) && isset($_POST['username']) && isset($_POST['pass']) 
                && isset($_POST['firstname']) && isset($_POST['name'])) {
            
                // Get values of form
                $id = NULL;
                $username = htmlspecialchars($_POST['username']);
                $pass = htmlspecialchars($_POST['pass']);
                $firstname = htmlspecialchars($_POST['firstname']);
                $lastname = htmlspecialchars($_POST['name']);
                $date = date('Y-m-d');

                // Check if account already exist : Yes -> redirect with error msg ; No -> Add-it and redirect with success msg
                if(UserOrgaModel::checkIfExistUserOrga($username)) {
                   header("Location: /2DMatrixManage/adminOrga/AdminController.php?action=default&msg=accExist");
                } else {
                    UserOrgaModel::addNewUserOrga(new UserOrga($id, $organization_id, $firstname, $lastname, $date, $username, $pass));
                    header("Location: /2DMatrixManage/adminOrga/AdminController.php?action=default&msg=addComplete");
                }
            }
        // Delete a organization user to DB
        } else if ($action == "delUserOrga") {
            if (isset($_GET['id'])) {
                $id = htmlspecialchars($_GET['id']);
                UserOrgaModel::removeUserOrga($id);
                header("Location: /2DMatrixManage/adminOrga/AdminController.php?action=default&msg=delComplete");
            } else {
                header("Location: /2DMatrixManage/adminOrga/AdminController.php?action=default&msg=noIdToDel");
            }
        // Logout the current User (Organization administrator)
        } elseif ($action == "logout"){
            session_unset();
            session_destroy();
            header('Location: /index.php');
        // Default action -> print messages about the application behavior
        } else if ($action == "default") {
            if (isset($_GET['msg'])) {
                $infoMsg = htmlspecialchars($_GET['msg']);
                switch ($infoMsg) {
                    case 'delComplete':
                        $message = "<p class='infoMsg'>Le compte a bien été supprimé.</p>";
                        break;
                    case 'addComplete':
                        $message = "<p class='infoMsg'>La compte a bien été créé.</p>";
                        break;
                    case 'accExist':
                        $message = "<p class='infoMsg error'>Ce nom de compte n'est pas disponible.</p>";
                        break;
                    case 'noIdToDel':
                        $message = "<p class='infoMsg error'>Aucun compte à supprimmer.</p>";
                        break;                       
                    default:
                        break;
                }
            // Unknown action in URL -> redirect
            } else {
                header("Location: /2DMatrixManage/adminOrga/AdminController.php");
            }
        }
    }
    // Print the Application View
    echo AdminOrgaView::showApp($message, $username, $organization_id);
// No Access Rigths -> Access Forbiden
} else if (isset($_SESSION['role']) && $_SESSION['role'] != 'AdminOrga'){
    header("HTTP/1.1 403 Forbidden"); 
} else {
    header("Location: /index.php");
}

?>