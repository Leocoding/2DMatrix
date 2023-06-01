function modificationDonnees2DDoc(){
    var itemsTable = schemas["2ddoc"].itemsTable;
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

            //suppression fonction de surlignage au click
            document.getElementById(item.id).setAttribute("onclick", "");


            var butsModif = document.querySelectorAll("#butModifAv, #butModifAp");
            butsModif.forEach(but => {
                but.setAttribute("onclick", "validationNewData('2ddoc')");
                but.textContent = "Valider modifications";
            });
        }
    }
}

function validationNewData2DDoc(){
    var itemsTable = schemas["2ddoc"].itemsTable;
    for (itemTableId in itemsTable){
        var item = itemsTable[itemTableId];

        if(item.id!="trHead"){
            var input = document.getElementById(item.id+"BrutInput");
            var dataContent = input.value;

            var dataField = document.getElementById(item.id+"Brut");
            dataField.textContent = dataContent;

            var tr = document.getElementById(item.id);
            var idToSearch = (whatIndexTabId(item.id) == undefined ? "'"+item.id+"'" : "whatIndexTabId('"+item.id+"')");
            tr.setAttribute("onclick", "searchValue(tabIdData[whatIndexTabId('"+item.id+"')],"+idToSearch+")");

            var butsModif = document.querySelectorAll("#butModifAv, #butModifAp");
            butsModif.forEach(but => {
                but.setAttribute("onclick", "modificationDonnees('2ddoc')");
                but.textContent = "Modifier données";
            });
        }
    }


    var new2ddoc = reconstruction2ddoc();
    removeFields();
    affichageComplet("DATA_MATRIX",new2ddoc);
}

function reconstruction2ddoc(){
    var header = reconstructionHeader2ddoc();
    var payload = reconstructionPayload2ddoc();

    // separateur payload/signature <US>
    var sep = new TextDecoder().decode(new Uint8Array([31]));


    var signature = document.getElementById("SignatureBrut").textContent;
    console.log(header+payload+sep+signature);
    return header+payload+sep+signature;
}

function reconstructionHeader2ddoc(){
    var headerObj = {
        marqueur : document.getElementById("MarqueurBrut"),
        version : document.getElementById("VersionBrut"),
        idAuth : document.getElementById("IDAuthCertBrut"),
        idCert : document.getElementById("IDCertBrut"),
        dateEmission : document.getElementById("DateEmiBrut"),
        dateSignature : document.getElementById("DateSigBrut"),
        typeDoc : document.getElementById("TypeDocBrut"),
        perimetre : document.getElementById("PerimetreBrut"),
        paysEmetteur : document.getElementById("PaysEmetteurBrut")
    }

    headerStr = "";
    for(item in headerObj){
        headerStr += headerObj[item].textContent;
    }

    return headerStr;
}

function reconstructionPayload2ddoc(){
    var payloadStr = "";
    for(item in tabIdData){
        var fieldId = tabIdData[item].id;
        var field = document.getElementById(fieldId+"Brut");
        if(field != null && field.textContent != ""){
            var sep = ""
            if(tabIdData[item].sizeMin != tabIdData[item].sizeMax){
                // separateur de champs si taille non fixe <GS>
                sep = new TextDecoder().decode(new Uint8Array([29]));
            }
            payloadStr += item+field.textContent+sep;
        }
    }

    if(payloadStr[payloadStr.length - 1] == sep){
        var strArray = new TextEncoder().encode(payloadStr);
        var buffer = strArray.buffer;
        
        var newStrArray = new Uint8Array(buffer.slice(0,payloadStr.length - 1));
        var deco = new TextDecoder();
        var newPayloadStr = deco.decode(newStrArray);
        return newPayloadStr;
    }

    return payloadStr;
}
