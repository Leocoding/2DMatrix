<?php
session_start();
require_once('../../other/Config.php');

if(!isset($_SESSION['user'])) {
    http_response_code(403);
    exit();
}

if(!isset($_SESSION['role'])) {
    http_response_code(403);
    exit();
}

if($_SESSION['role'] != "UserOrga") {
    http_response_code(403);
    exit();
}

if(!isset($_POST["Lname"]) || !isset($_POST["Fname"]) || !isset($_POST["dateBirth"]) || !isset($_POST['pays'])
    || !isset($_POST['genre']) || !isset($_POST['type']) || !isset($_POST['numDoc']) || !isset($_POST['degree'])
    || !isset($_POST['domaine']) || !isset($_POST['mention']) || !isset($_POST['spe']) || !isset($_POST['certif'])) {
        http_response_code(400);
        exit();
}

$IDCertificat = htmlspecialchars($_POST['certif']);
$json = file_get_contents('../../blacklist-certif.json');
$data = json_decode($json, true);
if(!isset($data["Authorities"][$_SESSION['orgaID']][$IDCertificat])) {
    http_response_code(422);
    exit();
}

try {
    $dbh = new PDO("mysql:host=".Config::getDBConfig()->dbhost.";dbname=".Config::getDBConfig()->dbname, Config::getDBConfig()->dbuser, Config::getDBConfig()->dbpass);
} catch (PDOException $e) {
    http_response_code(500);
}


function getHeader() {
    $date1 = new DateTime("2000-01-01");
    $date2 = new DateTime("now");
    $diffMiliseconds = $date2->getTimestamp() - $date1->getTimestamp();
    $diffJours = $diffMiliseconds / (86400);
    $diffJoursHexa = strtoupper(dechex($diffJours));
    global $user;
    global $IDCertificat;
    return "DC04" . $_SESSION['orgaID'] . $IDCertificat . $diffJoursHexa . $diffJoursHexa . "B001FR";
}


$Lname = htmlspecialchars($_POST['Lname']);
$Fname = htmlspecialchars($_POST['Fname']);
$dateBirth = htmlspecialchars($_POST['dateBirth']);
$pays = htmlspecialchars($_POST['pays']);
$genre = htmlspecialchars($_POST['genre']);
$type = htmlspecialchars($_POST['type']);
$numDoc = htmlspecialchars($_POST['numDoc']);
$degree = htmlspecialchars($_POST['degree']);
$domaine = htmlspecialchars($_POST['domaine']);
$mention = htmlspecialchars($_POST['mention']);
$spe = htmlspecialchars($_POST['spe']);


function getContent() {
    global $Lname;
    global $Fname;
    global $genre;
    global $dateBirth;
    global $pays;
    global $degree;
    global $domaine;
    global $mention;
    global $spe;
    global $numDoc;
    global $type;
    return "B1" . $Fname . "\u{001d}"
        . "B2" . $Lname . "\u{001d}"
        . "B6" . $genre
        . "B7" . $dateBirth
        . "B9" . $pays
        . "BC" . $numDoc . "\u{001d}"
        . "BD" . $degree
        . "BG" . $type
        . "BH" . $domaine . "\u{001d}"
        . "BI" . $mention . "\u{001d}"
        . "BJ" . $spe;
}

function sign($msg){

    // On récupère en BDD la clé privée
    global $dbh;
    try {
        $result = $dbh->prepare('SELECT organization_pkey from USER_ACCOUNT A, ORGANIZATION B where A.username_account = :username AND A.organization_id = B.id;');
        $result->bindParam(':username', $username);
        $username = $_SESSION['user'];
        $result->execute();
        $row = $result->fetch(PDO::FETCH_BOTH);
        $result = null;
    } catch (PDOException $e) {
        http_response_code(500);
    }
    $pkey = $row[0];
    # Generate privateKey from PEM string
    $pkey = "-----BEGIN EC PRIVATE KEY-----\n".$pkey."\n-----END EC PRIVATE KEY-----";

    $signature = exec('python3 sign.py "'.base64_encode($msg).'" "'.$pkey.'" 2>&1', $out, $err);

    return $signature;
}

function encrypt($pass, $value){
    $salt = openssl_random_pseudo_bytes(8);
    $salted = '';
    $dx = '';
    while (strlen($salted) < 48) {
        $dx = md5($dx.$pass.$salt, true);
        $salted .= $dx;
    }
    $key = substr($salted, 0, 32);
    $iv  = substr($salted, 32,16);
    $encrypted_data = openssl_encrypt(json_encode($value), 'aes-256-cbc', $key, true, $iv);
    $data = array("ct" => base64_encode($encrypted_data), "iv" => bin2hex($iv), "s" => bin2hex($salt));
    return base64_encode(json_encode($data));
}

$header = getHeader();
$data = getContent();

if(isset($_POST["chiffrement"]) && htmlspecialchars($_POST["chiffrement"])=="true"){
    $content = $header . encrypt("ceci_est_un_mauvaispa\$\$", $data);
} else {
    $content = $header . $data;
}

$signature = sign($content);

$content = $content . "\u{001f}" . $signature;

$dbh = null;
echo $content;
?>
