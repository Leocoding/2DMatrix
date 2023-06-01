<?php 
session_start();

include_once("DB.php");

// Test User send form and get datas
if(isset($_POST['btnSubmit'])) {
    $username = htmlspecialchars($_POST['username']);
    $pass = htmlspecialchars($_POST['passwd']);
} else {
    echo "Erreur sur l'envoi du formulaire";
}

try { 
    $dbh = DB::getDB();
    // Check if account exist
    $reqStr = 'SELECT COUNT(*) AS count FROM USER_ACCOUNT WHERE username_account = :user AND password_account = SHA2(:pass, 256);';
    $req = $dbh->prepare($reqStr);
    $req->execute(array(
        ':user' => $username,
        ':pass' => $pass
    ));
    $res = $req->fetchAll()[0];
    // No match found -> redirect with error message(GET)
    if($res['count'] == 0){
        $dbh = null;
        header('Location: /index.php?infoMsg=errorAuth');
    // Match found -> Get account datas
    } else {
        $reqStr = 'SELECT username_account AS user, organization_id AS orgaID, isAdmin AS adm FROM USER_ACCOUNT WHERE username_account = :user AND password_account = SHA2(:pass, 256);';
        $req = $dbh->prepare($reqStr);
        $req->execute(array(
        ':user' => $username,
        ':pass' => $pass
        ));
        $res = $req->fetchAll()[0];
        $dbh = null;
        // Protect session fixation
        session_regenerate_id(true);

        // Datas assignment in $_SESSION & redirect at the good interface
        // isAdmin -> 2DMatrixManage (admin organization interface)
        // ! isAdmin -> 2DMatrixCreate
        $_SESSION['orgaID'] = $res['orgaID'];
        $_SESSION['user'] = $res['user'];
        if($res['adm'] == 1) {
            $_SESSION['role'] = "AdminOrga";
            header("Location: /2DMatrixManage/adminOrga/AdminController.php");
        } else if($res['adm'] == 0) {
            $_SESSION['role'] = "UserOrga";;
            header('Location: /2DMatrixCreate/menu.php');
        }
    }
} catch (PDOException $e) {
    echo "Erreur !: ".$e->getMessage();
}

?>