const ADD = 0;
const REMOVE = 1;

var perror = document.getElementById('status');

var AESJsonFormatter = {
    parse: function (jsonStr) {
        var j = JSON.parse(jsonStr);
        var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
        return cipherParams;
    }
}

// Retourne l'objet XHR pour les requêtes AJAX.
function createXHRObject() {
    if(window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    if(window.ActiveXObject) {
        var names = [
            "Msxml12.XMLHTTP.6.0",
            "Msxml12.XMLHTTP.3.0",
            "Msxml12.XMLHTTP",
            "Microsoft.XMLHTTTP"
        ];
        for(var i in names) {
            try {
                return new ActiveXObject(names[i]);
            } catch(e) {

            }
        }
    }
    return null;
}

// ----------------- SIGNATURE --------------------

// addOrRemoveSignature : Ajoute ou supprime une signature dans la blacklist selon le mode choisi.
function addOrRemoveSignature(mode) {
    var signature = "";
    if(mode == ADD) {
        signature = document.getElementById('ajout').value;
    } else if (mode == REMOVE) {
        signature = document.getElementById('remove').value;
    } else {
        return -1;
    }
    if(signature === null) {
        return -1;
    }
    if(signature === "") {
        return -1;
    }
    var xhr = new createXHRObject();
    if(xhr == null) {
        perror.textContent = "Votre navigateur n'est pas pris en charge.";
        return -1;
    }
    xhr.open('POST', 'RevocBlacklist/traitement.php', false);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            perror.textContent = "Opération terminée";
        } else if(xhr.readyState == 4 && xhr.status == 500) {
            perror.textContent =  "La signature n'a pas pu etre ajoutée. Elle est peut être déjà présente.";
        } else {
            perror.textContent =  "Erreur serveur";
        }
    }
    if(mode === ADD) {
        xhr.send("addSignature=" + signature);
        return 0;
    }
    if(mode === REMOVE) {
        xhr.send("removeSignature=" + signature);
    }
    return 0;
}

function onScanSuccess(decodedText, decodedResult) {
    readDataMatrix(decodedResult);
}
function onScanFailure(error) {
    console.warn('Code scan error = ${error}', error);
}

var html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", {fps: 10, qrbox: {width: 250, height: 250}}
);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);

function readDataMatrix(dataMatrix) {
    if(dataMatrix == undefined || dataMatrix == null) {
        perror.textContent = "Impossible de traiter cette donnée";
        return -1;
    }
    if(!(dataMatrix.result.format.formatName === "DATA_MATRIX")) {
        perror.textContent = "Le format n'est pas correct.";
        return -1;
    }
    var text = dataMatrix.decodedText;

    console.log(text);
    // ------ HEADER ------
    var marqueur = text.substr(0,2);
    var version = text.substr(2,2);
    var IDAutoriteCertification = text.substr(4,4);
    var IDCertificat = text.substr(8,4);
    var dateEmission = text.substr(12,4);
    var dateCreationSignature = text.substr(16,4);
    var codeIdentificationDocument = text.substr(20,2);
    var perimetre = text.substr(22,2);
    var paysEmetteur = text.substr(24,2);

    if(marqueur != "DC") {
        perror.textContent = "Le contenu du datamatrix est incorrect : marqueur";
        return -1;
    }

    if(version != "04") {
        perror.textContent = "Le contenu du datamatrix est incorrect : version";
        return -1;
    }

    if(IDAutoriteCertification.length != 4) {
        perror.textContent = "Le contenu du datamatrix est incorrect : IDAC";
        return -1;
    }

    if(IDCertificat.length != 4) {
        perror.textContent = "Le contenu du datamatrix est incorrect : IDC";
        return -1;
    }
    
    const regex = /[0-9A-Fa-f]{4}/g;

    if(!dateEmission.match(regex)) {
        perror.textContent = "Le contenu du datamatrix est incorrect : dateEmi";
        return -1;
    }

    if(!dateCreationSignature.match(regex)) {
        perror.textContent = "Le contenu du datamatrix est incorrect : dateCrea";
        return -1;
    }

    if(codeIdentificationDocument != "B0") {
        perror.textContent = "Le contenu du datamatrix est incorrect : codeID";
        return -1;
    }

    if(perimetre != "01") {
        perror.textContent = "Le contenu du datamatrix est incorrect : perimetre";
        return -1;
    }

    // ------ CONTENT DATA ------
    var IDMandatory = new Array("B6", "B7", "B9", "B0", "B1", "B2", "BD", "BG", "BH", "BI", "BJ");
    var IDOptionals = new Array("B3", "B4", "B5", "B8", "BA", "BB", "BC", "BE", "BF", "BK");
    var IDFixed = {
      "B5": 2,
      "B6": 1,
      "B7": 8,
      "B9": 2,
      "BA": 1,
      "BD": 1,
      "BE": 3,
      "BF": 3,
      "BG": 2,
      "BK": 14
    };

    var StartDataIndex = 26;

    var payload = text.split('\u001f')[0].substr(StartDataIndex);
    
    var reg = new RegExp(/(^B[0-9A-Z].+(\u001d)?)+/);
    
    if(payload.match(reg) == null){
        var sign = text.split('\u001f')[1];
        var encrypted = atob(payload);
        var decrypted = JSON.parse(CryptoJS.AES.decrypt(encrypted, "ceci_est_un_mauvaispa$$", {format: AESJsonFormatter}).toString(CryptoJS.enc.Utf8));
        text = [decrypted,'\u001f',sign].join("");
        StartDataIndex = 0;
    }

    var endCharacterData;

    while(endCharacterData != '\u001f') {
        var index = text.substr(StartDataIndex, 2);
        if(IDMandatory.includes(index)) {
            IDMandatory.splice(IDMandatory.indexOf(index), 1);
        } else if (IDOptionals.includes(index)) {
            IDOptionals.splice(IDOptionals.indexOf(index), 1);
        } else {
            perror.textContent = "Les données ne sont pas corrects.";
            return -1;
        }
        var contentID = [];
        var i = 0;
        var limit = IDFixed[index];
        StartDataIndex = StartDataIndex + 2;
        if(limit == undefined) {
            endCharacterData = text.substr(StartDataIndex, 1);
            while(endCharacterData != '\u001d' && endCharacterData != '\u001e' && endCharacterData != '\u001f') {
                contentID[i] = endCharacterData;
                StartDataIndex++;
                i++;
                endCharacterData = text.substr(StartDataIndex, 1);
            }
            if(endCharacterData != '\u001f')
                StartDataIndex++;                    
        } else {
            StartDataIndex = StartDataIndex + limit;
          
        }
        endCharacterData = text.substr(StartDataIndex, 1);
    }

    if(IDMandatory.length != 1) {
        if(IDMandatory[0] != "B0" || IDMandatory[1] != "B1") {
            perror.textContent = "C'est pas bon, il manque des données";
            return -1;
        }
    }


    StartDataIndex++;

    // ------ SIGNATURE ------
    var i = 0;
    var contentSignatureArray = [];
    endCharacterData = text.substr(StartDataIndex, 1);
    while(endCharacterData != '\u001d' && endCharacterData != undefined && endCharacterData != '') {
        contentSignatureArray[i] = endCharacterData;
        StartDataIndex++;
        i++;
        endCharacterData = text.substr(StartDataIndex, 1);
    }

    if(contentSignatureArray.length < 64) {
        return -1;
    }

    var signature = contentSignatureArray.toString().replace(new RegExp(',', "g"), '');
    
    var elm1 = document.getElementById('ajout');
    var elm2 = document.getElementById('remove');
    elm1.value = signature;
    elm2.value = signature;
}