<?php

include_once("Object/Organization.php");
include_once("../../other/DB.php");

class OrganizationModel { 

    // ACTIONS

    public static function addNewOrga($orga, $user) {
        if (is_null($orga) || is_null($user)) {
            echo "Erreur";
            exit;
        }
        try {
            $dbh = DB::getDB();
            if ($dbh != NULL) {
                $pkey = $orga->getPKey();
                $reqStr = 'INSERT INTO ORGANIZATION (id, organization_name, organization_country, organization_city, creation_date, organization_pkey) 
                VALUES (UPPER(:id), :orgaName, :orgaCountry, :orgaCity, :creationDate, :pkey);';
                $req = $dbh->prepare($reqStr);
                $req->execute(array(
                    ':id' => $orga->getOrganizationID(), 
                    ':orgaName' => $orga->getOrganizationName(), 
                    ':orgaCountry' => $orga->getCountry(), 
                    ':orgaCity' => $orga->getProvince(), 
                    ':creationDate' => $orga->getDate(),
                    ':pkey' => $pkey
                ));
                $reqStr = 'INSERT INTO USER_ACCOUNT (organization_id, first_name, last_name, creation_date, username_account, password_account, isAdmin) 
                    VALUES (UPPER(:organization_id), :first_name, :last_name, :creation_date, :username_account, SHA2(:password_account, 256), :isAdmin);';
                $req = $dbh->prepare($reqStr);
                $req->execute(array(
                    ':organization_id' => $user->getOrganizationID(), 
                    ':first_name' => $user->getFirstName(), 
                    ':last_name' => $user->getLastName(), 
                    ':creation_date' => $user->getDate(), 
                    ':username_account' => $user->getUsername(),
                    ':password_account' => $user->getPassword(),
                    ':isAdmin' => 1
                ));
                $dbh = null;
            }
        } catch (PDOException $e) {
            echo "Erreur !: ".$e->getMessage();
            return NULL;
        }
        $cert = $orga->getCertificate();
        $orgaID = $orga->getOrganizationID();
        $data = json_decode(file_get_contents('../../blacklist-certif.json'), true);
        $certID = "CR01";
        self::addAuthority($orgaID, $data);
        $data = json_decode(file_get_contents('../../blacklist-certif.json'), true);
        self::addCertif($cert, $orgaID, $certID, $data);
    }

    public static function delOrga($organization_id) {
        if(is_null($organization_id)) {
            echo "Erreur";
            exit;
        }
        try {
            $dbh = DB::getDB();
            if ($dbh != NULL) {
                $reqStr = 'DELETE FROM USER_ACCOUNT WHERE organization_id = :organization_id;';
                $req = $dbh->prepare($reqStr);
                $req->execute(array(
                    ':organization_id' => $organization_id
                ));
                $reqStr = 'DELETE FROM ORGANIZATION WHERE id = :id;';
                $req = $dbh->prepare($reqStr);
                $req->execute(array(
                    ':id' => $organization_id
                ));

                $dbh = null;
            }
        } catch (PDOException $e) {
            echo "Erreur !: ".$e->getMessage();
            return NULL;
        }
        $data = json_decode(file_get_contents('../../blacklist-certif.json'), true);
        self::removeAuthority($organization_id, true,$data);
    }

    public static function revOrga($organization_id) {
        if(is_null($organization_id)) {
            echo "Erreur";
            exit;
        }
        try {
            $dbh = DB::getDB();
            if ($dbh != NULL) {
                $reqStr = 'DELETE FROM USER_ACCOUNT WHERE organization_id = :organization_id;';
                $req = $dbh->prepare($reqStr);
                $req->execute(array(
                    ':organization_id' => $organization_id
                ));
                
                $reqStr = 'DELETE FROM ORGANIZATION WHERE id = :id;';
                $req = $dbh->prepare($reqStr);
                $req->execute(array(
                    ':id' => $organization_id
                ));

                $dbh = null;
            }
        } catch (PDOException $e) {
            echo "Erreur !: ".$e->getMessage();
            return NULL;
        }
        $data = json_decode(file_get_contents('../../blacklist-certif.json'), true);
        self::removeAuthority($organization_id, false, $data);
        $data = json_decode(file_get_contents('../../blacklist-certif.json'), true);
        self::removeAuthorityArchive($organization_id, $data);
    }

    // GETTER INFORMATIONS

    public static function getOrganizationList() {
        $tab = array();
        try {
            $dbh = DB::getDB();
            if ($dbh != NULL) {
                $reqStr = 'SELECT O.id, O.organization_name, O.organization_country, O.organization_city, O.creation_date, A.username_account
                    FROM ORGANIZATION O, USER_ACCOUNT A WHERE O.id = A.organization_id AND A.isAdmin = 1;';
                $req = $dbh->prepare($reqStr);
                $req->execute();
                $orgas = $req->fetchAll();
                foreach($orgas as $orga){
                    $id = $orga["id"];
                    $organizationName = $orga["organization_name"];
                    $country = $orga["organization_country"];
                    $province = $orga["organization_city"];
                    $creation_date = $orga["creation_date"];
                    $username = $orga["username_account"];
                    $orga = new Organization($id, $organizationName, $country, $province, -1, $creation_date, $username);
                    array_push($tab, $orga);
                }
                $dbh = null;
                return $tab;
            }
        } catch (PDOException $e) {
            echo "Erreur !: ".$e->getMessage();
            return NULL;
        }
    }

    public static function getOrganizationIDList() {
        $tab = array();
        try {
            $dbh = DB::getDB();
            if ($dbh != NULL) {
                $reqStr = 'SELECT DISTINCT id FROM ORGANIZATION;';
                $req = $dbh->prepare($reqStr);
                $req->execute();
                $res = $req->fetchAll(PDO::FETCH_ASSOC);
                foreach($res as $r) {
                    array_push($tab, $r['id']);
                }
                $dbh = null;
                return $tab;
            }
        } catch (PDOException $e) {
            echo "Erreur !: ".$e->getMessage();
            return NULL;
        }
    }

    public static function getAdminIDByOrgaID($organization_id) {
        if(is_null($organization_id)) {
            echo "Erreur";
            exit;
        }
        try {
            $dbh = DB::getDB();
            if ($dbh != NULL) {
                $reqStr = 'SELECT A.id
                    FROM ORGANIZATION O, USER_ACCOUNT A 
                    WHERE O.id = A.organization_id AND A.isAdmin = 1;';
                $req = $dbh->prepare($reqStr);
                $req->execute();
                $orga = $req->fetchAll()[0];
                $dbh = null;
                return $orga[0];
            }
        } catch (PDOException $e) {
            echo "Erreur !: ".$e->getMessage();
            return NULL;
        }
    }

    public static function checkIfExistOrga($id) {
        if(is_null($id)) {
            echo "Erreur";
            exit;
        }
        try {
            $dbh = DB::getDB();
            if ($dbh != NULL) {
                $reqStr = 'SELECT COUNT(*) FROM ORGANIZATION WHERE id = UPPER(:id)';
                $req = $dbh->prepare($reqStr);
                $req->execute(array(':id' => $id));
                $res = $req->fetchAll()[0];
                if($res[0] == 0){
                    $dbh = null;
                    return false;
                }
                $dbh = null;
                return true;
            }
        } catch (PDOException $e) {
            echo "Une erreur s'est produite !";
        }
    }

    public static function checkIfExistOrgaJSON($id, $data) {
        if(is_null($id) || is_null($data)) {
            echo "Erreur";
            exit;
        }
        $auth = $data["Archives"][$id];
        if (!is_null($auth)) {
            return true;
        }
        return false;
    }

    public static function checkImportFile($file) {
        $filename = $file['name'];
        $fileError = $file['error'];
        $fileSize = $file['size'];
        $fileType = $file['type'];

        $fileExt = explode('.', $filename);
        $fileActualExt = strtolower(end($fileExt));
        $allowed = array('json');

        if ($fileError === 0) {
            if (in_array($fileActualExt, $allowed)) {
                if ($fileType === "application/json") {
                    if ($fileSize < 1000000) {
                        return 1;
                    }
                    return 0;
                }
                return 0;
            }
            return 0;
        }
        return 0;
    }

    // JSON MANAGEMENT

    // -- AUTHORITIES --

    public static function addAuthority($authority,$data) {
        $data["Authorities"][$authority] = [];
        $newJson = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        file_put_contents('../../blacklist-certif.json', $newJson);
    }
    
    public static function removeAuthority($authority, $saveCertif,$data) {
        $auth = $data["Authorities"][$authority];
        if(!(is_null($auth))) {
            if($saveCertif == "true") {
                self::addAuthorityArchive($authority, $data);
            } else {
                unset($data["Authorities"][$authority]);
                $newJson = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                file_put_contents('../../blacklist-certif.json', $newJson);
            }
        }
    }
    
    //-- CERTIFICATES --
        
    public static function addCertif($certificat, $authority,$IDCertif, $data) {
        if(!(is_null($data["Authorities"][$authority]))) {
            $data["Authorities"][$authority][$IDCertif] = $certificat;
            $newJson = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            file_put_contents('../../blacklist-certif.json', $newJson);
        } else {
            echo "Erreur";
            return NULL;
        }
    }

    // GETTER INFORMATIONS

        //--- ARCHIVE --

        public static function addAuthorityArchive($authority, $data) {
            $data["Archives"][$authority] = [];
            $IDCertificats = $data["Authorities"][$authority];
            $arrayKey = array_keys($IDCertificats);
            for($i = 0 ; $i < count($IDCertificats) ; $i++) {
                $data["Archives"][$authority][$arrayKey[$i]] = $IDCertificats[$arrayKey[$i]];
            }
            unset($data["Authorities"][$authority]);
            $newJson = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            file_put_contents('../../blacklist-certif.json', $newJson);
        }
        
        public static function removeAuthorityArchive($authority, $data) {
            unset($data["Archives"][$authority]);
            $newJson = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            file_put_contents('../../blacklist-certif.json', $newJson);
        }
        
        public static function addCertifArchive($authority, $IDCertificat, $data) {
            $certificat = $data["Authorities"][$authority][$IDCertificat];
            if(is_null($data["Archives"][$authority])) {
                $data["Archives"][$authority] = [];
            }
            $data["Archives"][$authority][$IDCertificat] = $certificat;
            unset($data["Authorities"][$authority][$IDCertificat]);
            $newJson = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            file_put_contents('../../blacklist-certif.json', $newJson);
        }

        // IMPORT

        // A partir des données dans $data, remplit la BDD et le JSON avec les informations contenues dans $data. Renvoi 0 en cas d'erreur
// 1 en cas de succès
    public static function setAuthorities($data) {
        $json = file_get_contents('../../blacklist-certif.json');
        $dataOrga = json_decode($json, true);
        if(count($data["Authorities"]) == 0) {
            // Le contenu est vide ou ne respecte pas la structure, on renvoit 0
            return 0;
        } 
        try {
            $dbh = DB::getDB();
            $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            foreach ($data["Authorities"] as $key => $value) {
                if(self::checkIfExistOrga($key)) {
                    continue;
                } else {
                    $Organization = $value;
                    if(self::areValuesValid($Organization, $key)) {
                        echo 'Erreur sur les données.';
                        exit();
                    }
                    $ID = $data["Authorities"][$key]["ID"];
                    $orga_name = $data["Authorities"][$key]["ORGANIZATION_NAME"];
                    $orga_country = $data["Authorities"][$key]["ORGANIZATION_COUNTRY"];
                    $orga_city = $data["Authorities"][$key]["ORGANIZATION_CITY"];
                    $creation_date = $data["Authorities"][$key]["CREATION_DATE"];
                    $pkey = $data["Authorities"][$key]["ORGANIZATION_PKEY"];
                    $idAcc = NULL;
                    $firstname = $data["Authorities"][$key]["ADMIN_ACCOUNT"]["FIRST_NAME"];
                    $lastname = $data["Authorities"][$key]["ADMIN_ACCOUNT"]["LAST_NAME"];
                    $username = $data["Authorities"][$key]["ADMIN_ACCOUNT"]["USERNAME_ACCOUNT"];
                    $password = $data["Authorities"][$key]["ADMIN_ACCOUNT"]["PASSWORD_ACCOUNT"];
                    $result = $dbh->prepare('INSERT INTO ORGANIZATION VALUES 
                                    (:id, :orga_name, :orga_country, :orga_city, :creation_date, :pkey)');
                    $result->bindParam(':id', $ID);
                    $result->bindParam(':orga_name', $orga_name);
                    $result->bindParam(':orga_country', $orga_country);
                    $result->bindParam(':orga_city', $orga_city);
                    $result->bindParam(':creation_date', $creation_date);
                    $result->bindParam(':pkey', $pkey);
                    $result->execute();
                    if(!$result) {
                        echo "Erreur";
                        return 0;
                    }
                    $result = $dbh->prepare('INSERT INTO USER_ACCOUNT VALUES 
                                    (:id, :orga_id, :first_name, :last_name, :creation_date, :username_account, :password_account, 1)');
                    $result->bindParam(':id', $idAcc);
                    $result->bindParam(':orga_id', $ID);
                    $result->bindParam(':first_name', $firstname);
                    $result->bindParam(':last_name', $lastname);
                    $result->bindParam(':creation_date', $creation_date);
                    $result->bindParam(':username_account', $username);
                    $result->bindParam(':password_account', $password);
                    $result->execute();
                    if(!$result) {
                        echo "Erreur";
                        return 0;
                    }
                    $dataOrga["Authorities"][$key] = $data["Authorities"][$key]["CERTIFICATS"];
                    $newJson = json_encode($dataOrga, JSON_PRETTY_PRINT);
                    file_put_contents('../../blacklist-certif.json', $newJson);
                }
            }
        } catch (PDOException $e) {
            echo '</p>AN ERROR HAS OCCURRED . ' . $e->getMessage() . '</p>';
            $result = null;
            $dbh = null;
            return 0;
        }
        $result = null;
        $dbh = null;
        return 1;
    }

    public static function areValuesValid($Organization, $keyID) {
        if(strlen($keyID) != 4) {
            return false;
        }
        if(!isset($Organization[$keyID]["ID"])) {
            return false;
        }
        $ID = $Organization[$keyID]["ID"];
        if($ID != $keyID) {
            return false;
        }
        if(!isset($Organization[$keyID]["ORGANIZATION_NAME"])) {
            return false;
        }
        $organization_name = $Organization[$keyID]["ORGANIZATION_NAME"];
        if(strlen($organization_name) > 60 || strlen($organization_name) == 0) {
            return false;
        }
        if(!isset($Organization[$keyID]["ORGANIZATION_COUNTRY"])) {
            return false;
        }
        $organization_country =$Organization[$keyID]["ORGANIZATION_COUNTRY"];
        if(strlen($organization_country) > 30 || strlen($organization_country) == 0) {
            return false;
        }
        if(!isset($Organization[$keyID]["ORGANIZATION_CITY"])) {
            return false;
        }
        $organization_city = $Organization[$keyID]["ORGANIZATION_CITY"];
        if(strlen($organization_city) > 30 || strlen($organization_city) == 0) {
            return false;
        }
        if(!isset($Organization[$keyID]["CREATION_DATE"])) {
            return false;
        }
    $creation_date = $Organization[$keyID]["CREATION_DATE"];
        // Expression regex partiellement fausse, à améliorer...
        if(!preg_match('/^[0-9]{4}-[0-2]{2}-[0-9]{2}\z/', $creation_date, $matches)) {
            return false;   
        }
        if(!isset($Organization[$keyID]["ORGANIZATION_PKEY"])) {
            return false;
        }
        $organization_pkey = $Organization[$keyID]["ORGANIZATION_PKEY"];
        if(strlen($organization_pkey) > 256 || strlen($organization_name) == 0) {
            return false;
        }
        if(!isset($data["Authorities"][$keyID]["CERTIFICATS"])) {
            return false;
        }
        $Certiflists = $data["Authorities"][$keyID]["CERTIFICATS"];
        if(!is_array($Certiflists)) {
            return false;
        }
        foreach ($Certiflists as $key => $value) {
            // On vérifie si l'ID de l'organisme est de bonne longueur
            if(strlen($key) != 4) {
                return false;
            }
            // On regarde si la valeur de certificat n'est pas nulle
            if(strlen($value) == 0) {
                return false;
            }
        }
        $id = $Organization[$keyID]['ADMIN_ACCOUNT']["ID"];
        if($id < 0) {
            return false;
        }
        $first_name = $Organization[$keyID]['ADMIN_ACCOUNT']["FIRST_NAME"];
        if(strlen($first_name) > 60 || strlen($first_name) == 0) {
            return false;
        }
        $last_name = $Organization[$keyID]['ADMIN_ACCOUNT']["LAST_NAME"];
        if(strlen($last_name) > 60 || strlen($last_name) == 0) {
            return false;
        }
        $username_account = $Organization[$keyID]['ADMIN_ACCOUNT']["USERNAME_ACCOUNT"];
        if(strlen($username_account) > 30 || strlen($username_account) == 0) {
            return false;
        }
        $password_account = $Organization[$keyID]['ADMIN_ACCOUNT']["PASSWORD_ACCOUNT"];
        if(strlen($password_account) > 255 || strlen($password_account) == 0) {
            return false;
        }
        return true;
    }

        // EXPORT

    // getAuthority : Renvoi un tableau contenant les informations associées à un organisme d'identifiant $authority
    public static function getAuthority($authority) {
        $json = file_get_contents('../../blacklist-certif.json');
        $dataOrga = json_decode($json, true);
        $data["Authorities"] = [];
        $id = self::getAdminIDByOrgaID($authority);
        try {
            $dbh = DB::getDB();
            
            // Organization
            $result = $dbh->prepare('SELECT * from ORGANIZATION where id = :authority_name;');
            $result->bindParam(':authority_name', $authority);
            $result->execute();
            $row = $result->fetch(PDO::FETCH_BOTH);
            $result = null;
            // Account
            $result = $dbh->prepare('SELECT * from USER_ACCOUNT where id = :id;');
            $result->bindParam(':id', $id);
            $result->execute();
            $row2 = $result->fetch(PDO::FETCH_BOTH);
            $result = null;
            $dbh = null;
        } catch (PDOException $e) {
            echo '</p>AN ERROR HAS OCCURRED . ' . $e->getMessage . '</p>';
            exit();
        }
        // La requête n'a rien renvoyé, il y a un problème avec la valeur de $authority
        if(!$row) {
            // Traiter le problème...
            //echo 'Erreur : Autorite inconnue';
            exit();
        }
        $data["Authorities"][$row[0]] = [];
        $data["Authorities"][$row[0]]["ID"] = $row[0];
        $data["Authorities"][$row[0]]["ORGANIZATION_NAME"] = $row[1];
        $data["Authorities"][$row[0]]["ORGANIZATION_COUNTRY"] = $row[2];
        $data["Authorities"][$row[0]]["ORGANIZATION_CITY"] = $row[3];
        $data["Authorities"][$row[0]]["CREATION_DATE"] = $row[4];
        $data["Authorities"][$row[0]]["ORGANIZATION_PKEY"] = $row[5];
        if(!isset($dataOrga["Authorities"][$row[0]])) {
            $data["Authorities"][$row[0]]["CERTIFICATS"] = [];
        } else {
            $data["Authorities"][$row[0]]["CERTIFICATS"] = $dataOrga["Authorities"][$row[0]];
        }
        $data["Authorities"][$row[0]]["ADMIN_ACCOUNT"] = [];
        $data["Authorities"][$row[0]]["ADMIN_ACCOUNT"]["ID"] = $row2[0];
        $data["Authorities"][$row[0]]["ADMIN_ACCOUNT"]["FIRST_NAME"] = $row2[2];
        $data["Authorities"][$row[0]]["ADMIN_ACCOUNT"]["LAST_NAME"] = $row2[3];
        $data["Authorities"][$row[0]]["ADMIN_ACCOUNT"]["USERNAME_ACCOUNT"] = $row2[5];
        $data["Authorities"][$row[0]]["ADMIN_ACCOUNT"]["PASSWORD_ACCOUNT"] = $row2[6];
        return $data;
    }

    // getAuthority : Renvoi un tableau contenant les informations associées à tous les organismes
    public static function getAllAuthorities() {
        $json = file_get_contents('../../blacklist-certif.json');
        $dataOrga = json_decode($json, true);
        $data["Authorities"] = [];
        try {
            $dbh = DB::getDB();

            // Organization
            $result = $dbh->prepare('SELECT * FROM ORGANIZATION O, USER_ACCOUNT A WHERE O.id = A.organization_id AND A.isAdmin = 1');
            $result->execute();
            while($row = $result->fetch(PDO::FETCH_BOTH)) {
                $data["Authorities"][$row[0]] = [];
                $data["Authorities"][$row[0]]["ID"] = $row[0];
                $data["Authorities"][$row[0]]["ORGANIZATION_NAME"] = $row[1];
                $data["Authorities"][$row[0]]["ORGANIZATION_COUNTRY"] = $row[2];
                $data["Authorities"][$row[0]]["ORGANIZATION_CITY"] = $row[3];
                $data["Authorities"][$row[0]]["CREATION_DATE"] = $row[4];
                $data["Authorities"][$row[0]]["ORGANIZATION_PKEY"] = $row[5];
                if(!isset($dataOrga["Authorities"][$row[0]])) {
                    $data["Authorities"][$row[0]]["CERTIFICATS"] = [];
                } else {
                    $data["Authorities"][$row[0]]["CERTIFICATS"] = $dataOrga["Authorities"][$row[0]];
                }
                $data["Authorities"][$row[0]]["ADMIN_ACCOUNT"] = [];
                $data["Authorities"][$row[0]]["ADMIN_ACCOUNT"]["ID"] = $row[6];
                $data["Authorities"][$row[0]]["ADMIN_ACCOUNT"]["FIRST_NAME"] = $row[8];
                $data["Authorities"][$row[0]]["ADMIN_ACCOUNT"]["LAST_NAME"] = $row[9];
                $data["Authorities"][$row[0]]["ADMIN_ACCOUNT"]["USERNAME_ACCOUNT"] = $row[11];
                $data["Authorities"][$row[0]]["ADMIN_ACCOUNT"]["PASSWORD_ACCOUNT"] = $row[12];
            }
            $result = null;
            $dbh = null;
        } catch (PDOException $e) {
            echo '</p>AN ERROR HAS OCCURRED . ' . $e->getMessage . '</p>';
            exit();
        }
        if(count($data["Authorities"]) == 0) {
            exit();
        }
        return $data;
    }
}

?>