<?php

include_once("Object/UserOrga.php");
include_once("../../other/DB.php");

class UserOrgaModel {

    public static function addNewUserOrga($userOrga){
        try {
			// Connexion DB et préparation de la requète paramétrée.
            $dbh = DB::getDB();
            if($dbh != NULL) {
                $reqStr = 'INSERT INTO USER_ACCOUNT (organization_id, first_name, last_name, creation_date, username_account, password_account, isAdmin) VALUES (:organization_id, :first_name, :last_name, :creation_date, :username_account, SHA2(:password_account, 256), :isAdmin);';
                $req = $dbh->prepare($reqStr);
                $req->execute(array(
                    ':organization_id' => $userOrga->getOrganizationID(), 
                    ':first_name' => $userOrga->getFirstName(), 
                    ':last_name' => $userOrga->getLastName(), 
                    ':creation_date' => $userOrga->getDate(), 
                    ':username_account' => $userOrga->getUsername(),
                    ':password_account' => $userOrga->getPassword(),
                    ':isAdmin' => 0
                ));
                $dbh = null;
            }
        } catch (PDOException $e) {
            $dbh = null;
            echo "Une erreur s'est produite !";
        }
    }

	public static function removeUserOrga($id){
        try {
			// Connexion DB et préparation de la requète paramétrée.
            $dbh = DB::getDB();
            if($dbh != NULL) {
                $reqStr = 'DELETE FROM USER_ACCOUNT WHERE id = :id';
                $req = $dbh->prepare($reqStr);
                $req->execute(array(':id' => $id));
                $dbh = null;
            }
        } catch (PDOException $e) {
            $dbh = null;
            echo "Une erreur s'est produite !";
        }
    }

    public static function getUsersOrga($organizationID) {
        $tab = array();
        try {
			// Connexion DB et préparation de la requète paramétrée.
            $dbh = DB::getDB();
            if ($dbh != NULL) {
                $reqStr = 'SELECT id, organization_id, first_name, last_name, creation_date, username_account FROM USER_ACCOUNT WHERE organization_id = :organization_id AND isAdmin = 0 ORDER BY id';
                $req = $dbh->prepare($reqStr);
                $req->execute(array(':organization_id' => $organizationID));
                $users = $req->fetchAll(); // Récupération dans un ensemble.
                // Itération pour peupler le tableau
                foreach($users as $user){
                    $id = $user["id"];
                    $organizationID = $user["organization_id"];
                    $username = $user["username_account"];
                    $firstName = $user["first_name"];
                    $lastName = $user["last_name"];
                    $creation_date = $user["creation_date"];
                    // Création d'objet Responsable pour le stocker dans notre tableau.
                    $user = new UserOrga($id, $organizationID, $firstName, $lastName, $creation_date, $username, NULL);
                    array_push($tab, $user);
                }
                // Fin de connexion et renvoie des Responsables.
                $dbh = null;
                return $tab;
            }
        } catch (PDOException $e) {
            echo "Une erreur s'est produite !";
        }
	}

    public static function checkIfExistUserOrga($username) {
        try {
            $dbh = DB::getDB();
            if ($dbh != NULL) {
                $reqStr = 'SELECT COUNT(*) FROM USER_ACCOUNT WHERE username_account = :user';
                $req = $dbh->prepare($reqStr);
                $req->execute(array(':user' => $username));
                $res = $req->fetchAll()[0];
                // Compte inexistant
                if($res[0] == 0){
                    $dbh = null;
                    return false;
                }
                return true;
            }
        } catch (PDOException $e) {
            echo "Une erreur s'est produite !";
        }
    }
}

?>