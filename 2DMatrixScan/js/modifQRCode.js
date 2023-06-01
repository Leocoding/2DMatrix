function modificationDonneesQRCode(){
    var itemsTable = schemas["qrcode"].itemsTable;
    for (itemTableId in itemsTable){
        var item = itemsTable[itemTableId];

        if(item.id!="trHead"){
            var dataField = document.getElementById(item.id+"Brut");
            var dataContent = dataField.textContent;

            var input = document.createElement("input");
            input.setAttribute("id",item.id+"BrutInput");
            input.setAttribute("type","text");
            input.value = dataContent;
            dataField.textContent = "";
            dataField.append(input);


            var butsModif = document.querySelectorAll("#butModifAv, #butModifAp");
            butsModif.forEach(but => {
                but.setAttribute("onclick", "validationNewData('qrcode')");
                but.textContent = "Valider modifications";
            });
        }
    }
}

function validationNewDataQRCode(){
    var itemsTable = schemas["qrcode"].itemsTable;
    for (itemTableId in itemsTable){
        var item = itemsTable[itemTableId];

        if(item.id!="trHead"){
            var input = document.getElementById(item.id+"BrutInput");
            var dataContent = input.value;

            var dataField = document.getElementById(item.id+"Brut");
            dataField.textContent = dataContent;

            var butsModif = document.querySelectorAll("#butModifAv, #butModifAp");
            butsModif.forEach(but => {
                but.setAttribute("onclick", "modificationDonnees('qrcode')");
                but.textContent = "Modifier données";
            });
        }
    }


    var newDCC = reconstructionPassSanitaire();
    removeFields();
    affichageComplet("QR_CODE",newDCC);
}

function reconstructionPassSanitaire(){
    var cbor = reconstructionCBOR();
    var compressedCBOR = compressQR(cbor);
    var b45QR = toBase45QR(compressedCBOR);
    var DCC = "HC1:"+b45QR;
    return DCC;
}

function toBase45QR(data){
    return BASE45.encode(data);
}

function compressQR(cbor){
    return pako.deflate(cbor);
}

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

function reconstructionHeaderQR(){
    var authIdStr = document.getElementById("AuthIdBrut").textContent.split(",");
    var authIdArray = [];
    for(var i = 0; i < authIdStr.length; i++){
        authIdArray[i] = parseInt(authIdStr[i]);
    }
    return CBOR.encode({
        1:parseInt(document.getElementById("AlgoBrut").textContent),
        4:new Uint8Array(authIdArray)
    });
}

function reconstructionPayloadQR(){
    return CBOR.encode({
        1:document.getElementById("IssuerBrut").textContent,
        4:parseInt(document.getElementById("DateExpirBrut").textContent),
        6:parseInt(document.getElementById("DateEmisBrut").textContent),
        '-260':{
            1:{
                v:[
                    {
                        "ci":document.getElementById("IDUniqueBrut").textContent,
                        "co":document.getElementById("PaysEmetteurBrut").textContent,
                        "dn":parseInt(document.getElementById("NumDoseBrut").textContent),
                        "dt":document.getElementById("DateVaccinBrut").textContent,
                        "is":document.getElementById("IssuerBrut").textContent,
                        "ma":document.getElementById("FabricantBrut").textContent,
                        "mp":document.getElementById("VaccinBrut").textContent,
                        "sd":parseInt(document.getElementById("TotalDoseBrut").textContent),
                        "tg":document.getElementById("MaladieBrut").textContent,
                        "vp":document.getElementById("TypeVaccBrut").textContent
                    }
                ],
                dob: document.getElementById("DateNaissBrut").textContent,
                nam:{
                    "fn":document.getElementById("NomBrut").textContent,
                    "gn":document.getElementById("PrenomBrut").textContent,
                    "fnt":document.getElementById("NomStdBrut").textContent,
                    'gnt':document.getElementById("PrenomStdBrut").textContent
                },
                ver:"1.3.0"
            }
        },
    });
}

function reconstructionCBOR(){
    var header = new Uint8Array(reconstructionHeaderQR());
    var payload = new Uint8Array(reconstructionPayloadQR());
    var signature = hexToBytes(document.getElementById("SignatureBrut").textContent);

    var cbor = new Uint8Array(CBOR.encode([header,{},payload,signature]));
    
    // Pour ajouter le tag cose_sign1
    var cosesignArray = new Uint8Array([210]);
    var cose = new Uint8Array([...cosesignArray,...cbor])

    return cose;
}