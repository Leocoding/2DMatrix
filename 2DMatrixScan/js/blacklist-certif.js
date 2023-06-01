// Retourne l'objet XHR pour les requêtes AJAX.
/*function createXHRObject() {
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

// getJsonContent : Récupère le contenu JSON dans le serveur.
function getJsonContent() {
    //On récupère le contenu du fichier JSON.
    var xhr = new createXHRObject();
    if(xhr == null) {
        throw new Error("Votre navigateur n'est pas pris en charge.");
    }
    var blContentText;
    xhr.overrideMimeType("application/json");
    xhr.open('GET', 'blacklist-certif.json', false);
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            blContentText = xhr.response;
        }
    }
    xhr.send(null);
    if(blContentText === null) {
        throw new Error("Erreur serveur");
    }
    return (JSON.parse(blContentText));
}

var blContent = getJsonContent();
*/

// getBLContent : récupère le contenu de la blacklist et des certificats
function getBLContent(){
    return jsonBLContent;
}

// getCertificate : retourne le certificat associé (PEM)
function getCertificate2DDoc(auth, certID){
    var blContent = getBLContent();
    if(CheckIfArchived(auth,certID,blContent) == 0){
        return blContent["Archives"][auth][certID];
    }
    return blContent["Authorities"][auth][certID];
}

function getx509FromPem(pem){
    return new x509.X509Certificate(pem);
}

function getX509Infos2ddoc(cert){
    // cert.children[0].children[2] pour certificat ants
    var oissuer = cert.issuer.split(", ")[2].substring(2);
    var cnissuer = cert.issuer.split(", ")[3].substring(3);

    // cert.children[0].children[4] pour certificat ants
    var o = cert.subject.split(", ")[2].substring(2);
    var cn = cert.subject.split(", ")[3].substring(3);

    return {
        oIssuer: oissuer,
        cnIssuer: cnissuer,
        oCert: o,
        cnCert: cn
    };
}

function getPublicKey2DDoc(x509cert){
    var pubkey = x509cert.publicKey.rawData.slice(26,91);
    pubkey = new Uint8Array(pubkey);
    return pubkey;
}

// CheckIfBlacklisted : Vérifie si la signature donnée en paramètre est dans la blacklist
function CheckIfBlacklisted(signature,blContent) {
    if(signature === null) {
        return -1;
    }
    if(signature === "") {
        return -1;
    }
    var signatures = blContent["Signatures"];
    for(var i = 0 ; i < signatures.length ; i++) {
        if(signatures[i] === signature) {
            return 1;
        }
    }
    return 0;
}

// CheckIfAuthorityExists : Vérifie si l'autorité existe dans
// la liste des autorités.
function CheckIfAuthorityExists(authority, blContent) {
    if(authority === null) {
        return -1;
    }
    if(authority === "") {
        return -1;
    }
    if(blContent["Authorities"][authority] != undefined || blContent["Archives"][authority] != undefined) {
        return 0;
    }
    return -1;
}

// CheckIfCertifExists : Vérifie si le certificat fait partie de l'autorité authority.
function CheckIfCertifExists(authority, IDCertificat, blContent) {
    if(IDCertificat === null) {
        return -1;
    }
    if(IDCertificat === "") {
        return -1;
    }
    var ath = blContent["Authorities"][authority];
    if(ath != undefined) {
        if(blContent["Authorities"][authority][IDCertificat] != undefined) {
            return 0;
        }
        return -1;
    }
    return -1;
}

// CheckIfArchived : Vérifie si un identifiant de certificat est présent dans les archives.
function CheckIfArchived(authority, IDCertificat, blContent) {
    if(IDCertificat === null) {
        return -1;
    }
    if(IDCertificat === "") {
        return -1;
    }
    var ath = blContent["Archives"][authority];
    if(ath != undefined) {
        if(blContent["Archives"][authority][IDCertificat] != undefined) {
            return 0;
        }
        return -1;
    }
    return -1;
}


// isDatamatrixValid : Renvoi 0 si le Datamatrix est valide, sinon -1
function isDatamatrixValid(authority, IDCertificat, signature) {
    var blContent = getBLContent();
    if(CheckIfBlacklisted(signature, blContent) == 1) {
        return -1;     
    }
    if(CheckIfAuthorityExists(authority, blContent) == -1) {
        return -2;
    }
    if(CheckIfCertifExists(authority, IDCertificat, blContent) == -1) {
        if(CheckIfArchived(authority, IDCertificat, blContent) == 0) {
            return -3;
        } else
            return -4;
    }

    return 0;
}