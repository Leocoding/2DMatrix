/*
 * Retire le début de la chaine (HC1:)
 */
function removePrefix(str){
    var qr = str.substring(4,str.length);
    return qr;
}

/*
 * Décode les données binaire depuis la chaine en base45
 */
function decodeB45(data){
    var qrDecodedB45 = BASE45.decode(data);
    return qrDecodedB45;
}

/*
 * Décompresse l'objet (zlib)
 */
function decompress(data){
    try{
    var qrDecompressed = pako.inflate(data);
    } catch (e){
        var qrDecompressed = pako.inflate(new Uint8Array(data));
    }
    return qrDecompressed;
}


/*
 * Parse l'objet CBOR depuis l'objet décompressé
 * Contient 4 objets:
 * - 1 objet CBOR "protected" contenant l'algorithme de signature et l'identifiant du certificat à utiliser
 * - 1 objet vide ("unprotected")
 * - 1 objet CBOR contenant les informations du pass
 * - la signature
 */
function getCBOR(data){
    var decbor = CBOR.decode(data.buffer);
    return decbor;
}

/*
 * Récupère l'array buffer correspondant au tableau Uint8Array
 */
function getArrayBuffer(array){
    return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset);
}

/*
 * Converti un tableau de Byte en string
 */
function getStringFromByte(data){
    var str = "";
    var count = data.length;
    for (let i= 0; i < count; ++i)
        str += String.fromCharCode(data[i]);
    return str;
}



/*
 * Récupère l'objet header contenu dans le CBOR principal
 */
function getHeader(cbor){
    return CBOR.decode(getArrayBuffer(cbor[0]));
}

/*
 * Récupère l'objet payload contenu dans le CBOR principal
 */
function getPayload(cbor){
    return CBOR.decode(getArrayBuffer(cbor[2]));
}

/*
 * Récupère l'objet signature contenu dans le CBOR principal
 */
function getSignature(cbor){
    return cbor[3];
}

function getSignatureFromFullDCC(dcc) {
    var qr = removePrefix(dcc);
    qr = decodeB45(qr);
    qr = decompress(qr);
    qr = getCBOR(qr);
    signature = getSignature(qr);
    return signature;
}

/*
 * Récupère l'identifiant de l'autorité depuis le header
 */
function getAuthorityId(cbor){
    var header = getHeader(cbor);
    var id = btoa(getStringFromByte(header[4]));
    return id;
}

/*
 * Récupère un objet contenant toutes les informations du pass, de manière structurée
 * pour pouvoir y avoir facilement accès
 */
function getDCC(cbor){
    var dcc = {
        header : getHeader(cbor),
        payload : getPayload(cbor),
        signature : getSignature(cbor),
        authId : getAuthorityId(cbor)
    };
    return dcc;
}

function getX509(authId){
    var b64x509 = authorities.certificatesDCC[authId];
    if(b64x509 == undefined){
        return null;
    }

    var cert = atob(b64x509)

    return new x509.X509Certificate(cert);
}

function getX509Infos(cert){
    var issuer = cert.issuer.split(", ");
    var oissuer = issuer[1].substring(2);
    var cnissuer = issuer[issuer.length - 1].substring(3);

    var subject = cert.subject.split(", ");
    var o = subject[1].substring(2);
    var cn = subject[subject.length - 1].substring(3);

    return {
        oIssuer: oissuer,
        cnIssuer: cnissuer,
        oCert: o,
        cnCert: cn
    };
}

/*
 * Retourne la clef publique depuis le x509 de la TSL, en fonction d'un authId
 */
function getPublicKey(x509cert){
    var pubkey = x509cert.publicKey.rawData.slice(26,91);
    pubkey = new Uint8Array(pubkey);
    return pubkey;
}

/*
 * Retourne les valeurs x et y de la clef ECDSA depuis une clef pem
 */
function getXY(key){

    var offset = 0;
    if(key[0]==4){
        offset = 1;
    }

    var x = key.subarray(offset,key.length/2+offset);
    var y = key.subarray(key.length/2+offset);
        return {x, y};
}


/*
 * Valide la signature et exécute une fonction avec comme paramètre true/false
 */
function validSig(cose,xy,funcToExecute){
    COSEverify(cose,xy.x,xy.y).then(function(result){
        funcToExecute(result);
    });
}