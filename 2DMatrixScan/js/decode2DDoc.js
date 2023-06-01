function buildError(msg){
    return {error:msg};
}

var AESJsonFormatter = {
    parse: function (jsonStr) {
        var j = JSON.parse(jsonStr);
        var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
        return cipherParams;
    }
}

function readDataMatrix(dataMatrix) {

    // On vérifie s'il s'agit bien d'un DataMatrix valide.
    if(dataMatrix == undefined || dataMatrix == null) {
        var errorMsg = "Erreur lors de l'envoi du dataMatrix.";
        console.log(errorMsg)
        return buildError(errorMsg);
    }

    /*
     * Vérification déjà effectuée en amont
    if(!(dataMatrix.result.format.formatName === "DATA_MATRIX")) {
        console.log("Il ne s'agit pas d'un dataMatrix.");
        dataInvalid();
        return;
    }
    */

    var text = dataMatrix;


    // On récupère l'ensemble des données de l'Header et on vérifie si elles sont valides.
    // ------ HEADER ------
    var header = [];
    header["marqueur"] = text.substr(0,2);
    if(header["marqueur"] != "DC") {
        var errorMsg = "Erreur HEADER : marqueur";
        console.log(errorMsg)
        return buildError(errorMsg);
    }
    header["version"] = text.substr(2,2);
    if(header["version"] != "04") {
        var errorMsg = "Erreur HEADER : version";
        console.log(errorMsg)
        return buildError(errorMsg);
    }
    header["IDAutoriteCertification"] = text.substr(4,4);
    if(header["IDAutoriteCertification"].length != 4) {
        var errorMsg = "Erreur HEADER : IDAC";
        console.log(errorMsg)
        return buildError(errorMsg);
    }
    header["IDCertificat"] = text.substr(8,4);
    if(header["IDCertificat"].length != 4) {
        var errorMsg = "Erreur HEADER : IDC";
        console.log(errorMsg)
        return buildError(errorMsg);
    }
    header["dateEmission"] = text.substr(12,4);
    const regex = /[0-9A-Fa-f]{4}/g;

    if(!header["dateEmission"].match(regex)) {
        var errorMsg = "Erreur HEADER : dateEmission";
        console.log(errorMsg)
        return buildError(errorMsg);
    }
    header["dateCreationSignature"] = text.substr(16,4);
    if(!header["dateCreationSignature"].match(regex)) {
        var errorMsg = "Erreur HEADER : dateCreation";
        console.log(errorMsg)
        return buildError(errorMsg);
    }
    header["codeIdentificationDocument"] = text.substr(20,2);
    if(header["codeIdentificationDocument"] != "B0") {
        var errorMsg = "Erreur HEADER : codeID";
        console.log(errorMsg)
        return buildError(errorMsg);
    }
    header["perimetre"] = text.substr(22,2);
    if(header["perimetre"] != "01") {
        var errorMsg = "Erreur HEADER : perimetre";
        console.log(errorMsg)
        return buildError(errorMsg);    }
    header["paysEmetteur"] = text.substr(24,2);
    if(header["paysEmetteur"].length != 2) {
        var errorMsg = "Erreur HEADER : paysEmetteur";
        console.log(errorMsg)
        return buildError(errorMsg); 
    }


    // On entre dans la zone de données.
    // ------ CONTENT DATA ------
    // On fait la liste des champs obligatoires et optionnels.
    var IDMandatory = new Array("B6", "B7", "B9", "B0", "B1", "B2", "BD", "BG", "BH", "BI", "BJ");
    var IDOptionals = new Array("B3", "B4", "B5", "B8", "BA", "BB", "BC", "BE", "BF", "BK");
    // On fait la liste de chaque longueur fixe selon le champ.
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

    var contentDataMatrix = new Array();

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
    // Tant que le caractère de séparation données/signature n'est pas atteint, on traite la zone de données.
    while(endCharacterData != '\u001f') {
        // On est forcément dans un champ qui est sur deux caractère.
        // On vérifie si ce champ est optionnel ou obligatoire et on le retire du tableau selon le cas.
        var index = text.substr(StartDataIndex, 2);
        if(IDMandatory.includes(index)) {
            IDMandatory.splice(IDMandatory.indexOf(index), 1);
        } else if (IDOptionals.includes(index)) {
            IDOptionals.splice(IDOptionals.indexOf(index), 1);
        } else {
            var errorMsg = "Erreur DATA : Incorrect data.";
            console.log(errorMsg)
            return buildError(errorMsg);
        }
        var contentID = [];
        var i = 0;
        var limit = IDFixed[index];
        //On avance de 2 caractères pour être sur les données du champ.
        StartDataIndex = StartDataIndex + 2;
        // Le champ n'a pas de limite fixe. On va lire caractère par caractère jusqu'à rencontré un caractère de fin ou de troncature.
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
            // On récupère la chaine entière dans un bon format.
            contentDataMatrix[index] = contentID.toString().replace(new RegExp(',', "g"), '');
        } else {
            // Le champ a une limite. On récupère l'ensemble de la chaine de longueur limit.
            contentDataMatrix[index] = text.substr(StartDataIndex, limit);
            StartDataIndex = StartDataIndex + limit;
        }
        endCharacterData = text.substr(StartDataIndex, 1);
    }

    // Il doit rester exactement un champ.
    if(IDMandatory.length != 1) {
        // données obligatoires manquantes
        if(IDMandatory.length > 1){
            var errorMsg = "Erreur DATA : données obligatoires manquantes";
            console.log(errorMsg);
        } else { 
            // Soit on a B0 dans les données et dans ce cas il reste B1, soit l'inverse.
            if(IDMandatory[0] != "B0" || IDMandatory[0] != "B1") {
                var errorMsg = "Erreur DATA : B0|B1";
                console.log(errorMsg)
                return buildError(errorMsg);
            }
        }
    }

    // On a lu le caractère de séparation données/signatures, on avance de 1 caractère
    // pour être dans la signature.
    StartDataIndex++;

    // On se retrouve dans la signature.
    // ------ SIGNATURE ------
    // On lit caractère par caractère pour récupérer l'ensemble de la signature jusqu'à tomber sur le caractère de fin de signature.
    var i = 0;
    var contentSignatureArray = [];
    endCharacterData = text.substr(StartDataIndex, 1);
    while(endCharacterData != '\u001d' && endCharacterData != undefined && endCharacterData != '') {
        contentSignatureArray[i] = endCharacterData;
        StartDataIndex++;
        i++;
        endCharacterData = text.substr(StartDataIndex, 1);
    }

    // La longueur de la signature doit au moins faire 64 caractères.
    if(contentSignatureArray.length < 64) {
        var errorMsg = "Erreur SIGNATURE : Invalid signature";
        console.log(errorMsg)
    }

    // On récupère la signautre en chaine de caractère au bon format.
    var signature = contentSignatureArray.toString().replace(new RegExp(',', "g"), '');

    // On arrive maintenant dans l'annexe.
    // ------ ANNEXE ------
    StartDataIndex++;
    endCharacterData = text.substr(StartDataIndex,1);
    contentAnnexe = [];
    if(endCharacterData != '') {
        // Si ce n'est pas la fin et qu'il y une annexe, on vérifie qu'il y a encore des champs a traiter.
        if(IDOptionals.length == 0) {
            var errorMsg = "Erreur ANNEXE : No more data to read.";
            console.log(errorMsg)
            return buildError(errorMsg);
        }
        // Tant qu'on est pas arrivé à une chaine vide, on traite la zone annexe.
        // Même algorithme que la zone de données.
        while(endCharacterData != '') {
            var index = text.substr(StartDataIndex, 2);
            if(IDOptionals.includes(index)) {
                IDOptionals.splice(IDOptionals.indexOf(index), 1);
            } else {
                var errorMsg = "Erreur ANNEXE : Incorrect Data";
                console.log(errorMsg)
                return buildError(errorMsg);
            }
            var contentID = [];
            var i = 0;
            var limit = IDFixed[index];
            StartDataIndex = StartDataIndex + 2;
            if(limit == undefined) {
                endCharacterData = text.substr(StartDataIndex, 1);
                while(endCharacterData != '\u001d' && endCharacterData != '\u001e') {
                    contentID[i] = endCharacterData;
                    StartDataIndex++;
                    i++;
                    endCharacterData = text.substr(StartDataIndex, 1);
                }
                StartDataIndex++;
                contentAnnexe[index] = contentID.toString().replace(new RegExp(',', "g"), '');
            } else {
                contentAnnexe[index] = text.substr(StartDataIndex, limit);
                StartDataIndex = StartDataIndex + limit;
            }
            endCharacterData = text.substr(StartDataIndex, 1);
        }
    }
    // On a récupéré toutes les informations, on affiche les informations avec une autre fonction.
    return {header : header, content : contentDataMatrix, signature : signature, annexe : contentAnnexe};
}

function dataInvalid() {
    var exp = document.createElement("p");
    var textexp = document.createTextNode("Erreur");
    exp.appendChild(textexp);
    document.getElementById('result').appendChild(exp);
}

function writeDataMatrixContent(header, content, signature,annexe) {
    console.log(content);
    var h1 = document.createElement("h1");
    var texth1 = document.createTextNode("HEADER");
    h1.appendChild(texth1);
    document.getElementById('result').appendChild(h1);
    for (var key in header) {
        var exp = document.createElement("p");
        var textexp = document.createTextNode(key + ' : ' + header[key]);
        exp.appendChild(textexp);
        document.getElementById('result').appendChild(exp);
    }
    h1 = document.createElement("h1");
    texth1 = document.createTextNode("CONTENT");
    h1.appendChild(texth1);
    document.getElementById('result').appendChild(h1);
    for (var key in content) {
        var exp = document.createElement("p");
        var textexp = document.createTextNode(key + ' : ' + content[key]);
        exp.appendChild(textexp);
        document.getElementById('result').appendChild(exp);
    }
    h1 = document.createElement("h1");
    texth1 = document.createTextNode("SIGNATURE");
    h1.appendChild(texth1);
    document.getElementById('result').appendChild(h1);

    var exp = document.createElement("p");
    var textexp = document.createTextNode(signature);
    exp.appendChild(textexp);
    document.getElementById('result').appendChild(exp);


    h1 = document.createElement("h1");
    texth1 = document.createTextNode("ANNEXE");
    h1.appendChild(texth1);
    document.getElementById('result').appendChild(h1);
    for (var key in annexe) {
        var exp = document.createElement("p");
        var textexp = document.createTextNode(key + ' : ' + annexe[key]);
        exp.appendChild(textexp);
        document.getElementById('result').appendChild(exp);
    }
}

function convertDate(date){
    var nbJours = parseInt(date, 16);
    var newDate = new Date(2000, 0, 1);
    newDate.setDate(newDate.getDate()+ nbJours);
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return newDate.toLocaleDateString(undefined, options);
}

function convertYear(year){
    return parseInt(year, 16);
}

function birthdayDateToString(bd){
    return bd.replace(/(\d{2})(\d{2})(\d{4})/, "$1-$2-$3");
}

function decryptPayload2DDoc(encrypted){
    return JSON.parse(CryptoJS.AES.decrypt(encrypted, "ceci_est_un_mauvaispa$$", {format: AESJsonFormatter}).toString(CryptoJS.enc.Utf8));
}


