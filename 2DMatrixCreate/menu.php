<?php
    session_start();
    require_once('datamatrixCreate/createView.php');
    require_once('RevocBlacklist/revocSignatureView.php');
    require_once('../other/Config.php');

    $pageHTML = null;
    $state = null;

    if(isset($_SESSION['user'])) {
        if(!isset($_SESSION["role"])) {
            header("HTTP/1.1 403 Forbidden");
            exit();
        }
        
        if($_SESSION['role'] != "UserOrga") {
            header("HTTP/1.1 403 Forbidden");
            exit();
        }        
        $username = $_SESSION['user'];
        if (isset($_GET['bl'])) {
            $pageHTML = new blacklistView();
            $content = $pageHTML->showApp($username);
            echo $content;
            exit();
        }
        if (isset($_GET['logout'])) {
            session_unset();
            session_destroy();
            header('Location: /index.php');
            exit();
        }
        $idAuthority = $_SESSION['orgaID'];
        $json = file_get_contents('../blacklist-certif.json');
        $data = json_decode($json, true);
        $pageHTML = new createView();
        $certifications;
        if(!isset($data["Authorities"][$idAuthority])) {
            $certifications = null;
        } else {
            $certifications = $data["Authorities"][$idAuthority];
            $certifications = array_keys($certifications);
        }
        $content = $pageHTML->showApp($username, $certifications);
        echo $content;
        exit();
    } else {
        header('Location: /index.php');
        exit();
    }
?>
