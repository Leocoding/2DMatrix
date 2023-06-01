<?php
session_start();
include_once("../other/Config.php");

/*if(!isset($_SESSION['user'])) {
    http_response_code(403);
    exit();
}*/

$json = file_get_contents('../blacklist-certif.json');
$data = json_decode($json, true);

if(!isset($data["Signatures"]) || !isset($data["Authorities"])
    || !isset($data["Archives"]) || !isset($data["Date"])) {
        http_response_code(500);
        exit();
}

$dataToSign["Signatures"] = $data["Signatures"];
$dataToSign["Authorities"] = $data["Authorities"];
$dataToSign["Archives"] = $data["Archives"];
$dataToSign["Date"] = date("Y-m-d");

$data["Date"] = $dataToSign["Date"];

try {
    $dbh = new PDO("mysql:host=".Config::getDBConfig()->dbhost.";dbname=".Config::getDBConfig()->dbname, Config::getDBConfig()->dbuser, Config::getDBConfig()->dbpass);
    $result = $dbh->prepare('SELECT json_pkey from JSON_KEY_DATA;');
    $result->execute();
    $row = $result->fetch(PDO::FETCH_BOTH);
    $result = null;
} catch (PDOException $e) {
        var_dump($e);
}
$pkey = $row[0];
# Generate privateKey from PEM string
$pkey = "-----BEGIN EC PRIVATE KEY-----\n".$pkey."\n-----END EC PRIVATE KEY-----";
$ret = json_encode($dataToSign,JSON_UNESCAPED_SLASHES);
$signature = exec('python3 sign.py "'. base64_encode($ret) .'" "'.$pkey.'" 2>&1', $out, $err);
$data["Sign"] = $signature;
$newJson = json_encode($data, JSON_UNESCAPED_SLASHES);
file_put_contents('../blacklist-certif.json', $newJson);
?>