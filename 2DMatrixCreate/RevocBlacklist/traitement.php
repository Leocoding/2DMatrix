<?php
session_start();
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


$signature;
$json = file_get_contents('../../blacklist-certif.json');
$data = json_decode($json, true);

// ----------------- SIGNATURE --------------------

if(isset($_POST['addSignature'])) {
    $signature = htmlspecialchars($_POST['addSignature']);
    addSignature($signature, $data);
}

function addSignature($signature, $data) {
    if(in_array($signature, $data["Signatures"])) {
        http_response_code(500);
        exit();
    }
    array_push($data["Signatures"],$signature);
    $newJson = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    file_put_contents('../../blacklist-certif.json', $newJson);
    http_response_code(200);
}

if(isset($_POST['removeSignature'])) {
    $signature = htmlspecialchars($_POST['removeSignature']);
    removeSignature($signature, $data);
}

function removeSignature($signature, $data) {
    $pos = array_search($signature, $data["Signatures"]);
    if($pos === false) {
        exit();
    }
    unset($data["Signatures"][$pos]);
    $data["Signatures"] = array_values($data["Signatures"]);
    $newJson = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    file_put_contents('../../blacklist-certif.json', $newJson);
    http_response_code(200);
}

?>
