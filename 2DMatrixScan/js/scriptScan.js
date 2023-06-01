function idData(id,sizeMin,sizeMax) {
  return {'id' : id, 'sizeMin' : sizeMin, 'sizeMax' : sizeMax};
}

// mise en cache des images
new Image().src = "img/arrow.png";
new Image().src = "img/invalide.png";
new Image().src = "img/valide.png";

var tabIdData = {
  'B0': idData('Prenoms',0,60),
  'B1': idData('Prenom',0,20),
  'B2': idData('Nom',0,38),
  'B3': idData('NomUsage',0,38),
  'B4': idData('NomEpoux-se',0,38),
  'B5': idData('Nationalite',2,2),
  'B6': idData('Genre',1,1),
  'B7': idData('DateNaiss',8,8),
  'B8': idData('LieuNaiss',0,32),
  'B9' : idData('PaysNaiss',2,2),
  'BA' : idData('MentionObtenue',1,1),
  'BB' : idData('NumEtu',0,50),
  'BC' : idData('NumDiplome',0,20),
  'BD' : idData('DiplomeLevel',1,1),
  'BE' : idData('Credits',3,3),
  'BF' : idData('AnneeUniv',3,3),
  'BG' : idData('DiplomeType',2,2),
  'BH' : idData('Domaine',0,30),
  'BI' : idData('Mention',0,30),
  'BJ' : idData('Specialite',0,30),
  'BK' : idData('NumCVE',14,14)

}

var reglesValidQR = {
  regleNbDoses: schemas["qrcode"].regles[0].defaultValue,
  regleCheckBl: schemas["qrcode"].regles[1].defaultValue
};

function affichageDetail() {
    document.getElementById('FieldDetails').style.display = 'block';
    document.getElementById('butMask').innerHTML = 'Masquer';
    var fct = 'maskDetail()';
    document.getElementById('butMask').setAttribute('onclick',fct);
  }
  
  function maskDetail() {
    document.getElementById('FieldDetails').style.display = 'none';
    document.getElementById('butMask').innerHTML = 'Afficher';
    var fct = 'affichageDetail()';
    document.getElementById('butMask').setAttribute('onclick',fct)
  }

  function affichageDate(id,brutData,clearData ) {
    document.getElementById(id).style.display = 'table-row';
    document.getElementById(id+'Brut').innerHTML = brutData;
    document.getElementById(id+'Clair').innerHTML = clearData;
    var dec = parseInt(brutData, 16);
    var exp = 'La date est indiquée par le nombre de jours en hexadécimal depuis le 1er janvier 2000. S’il n’y a pas de date, la valeur est FFFF. Ici ' + brutData + ' en base16 correspond à ' + dec + ' jours.' 
    + ' Donc  1er janvier 2000 +' + dec + ' jours, nous donne la date : ' + clearData +'.';
    document.getElementById(id+'Explication').innerHTML = exp;
  }

  function affichageTypeDoc(brutData,clearData) {
    document.getElementById('TypeDoc').style.display = 'table-row';
    document.getElementById('TypeDocBrut').innerHTML = brutData;
    document.getElementById('TypeDocClair').innerHTML = clearData;
  }

  function affichageLambda(id,brutData,clearData,exp) {
    if(document.getElementById(id) == null){
      return;
    }
    document.getElementById(id).style.display = 'table-row';
    document.getElementById(id + 'Brut').innerHTML = brutData;
    document.getElementById(id + 'Clair').innerHTML = clearData;
    if (exp != null && exp != '') {
      document.getElementById(id + 'Explication').innerHTML = exp;
    }
  }


  function whatIndexTabId(n) {
    for (i in tabIdData) {
      if(tabIdData[i]['id'] == n) {
        return i;
      }
    }
  }



  function searchValue(tab, id) {
    console.log(tab,id);
    var input = document.getElementById('brutArea');
    if (input.value == '' || input.value == null) {
      return;
    }

    // si donnée du header (sans identifiant 2ddoc)
    if(tab == undefined){
      console.log(id+"Brut");
      var valueToSearch = document.getElementById(id+"Brut").textContent
      var offset = 0
    } else {
      console.log(tab['id']+"Brut");
      var valueToSearch = id + document.getElementById(tab['id']+"Brut").textContent
      var offset = 2;
    }
    

    console.log(valueToSearch);
    var index = (input.value).search(valueToSearch);
    input.setSelectionRange(index + offset, index + valueToSearch.length);
    input.focus();
    
    
  }

  function modificationDonnees(type){
    switch (type) {
      case "2ddoc":
        modificationDonnees2DDoc();
        break;
      case "qrcode":
        modificationDonneesQRCode();
        break;
      default:
        break;
    }
  }

  function validationNewData(type){
    switch (type) {
      case "2ddoc":
        validationNewData2DDoc();
        break;
      case "qrcode":
        validationNewDataQRCode();
        break;
      default:
        break;
    }
  }

function creationChampsPass() {

  var p = document.createElement("p");
  p.setAttribute("id","goToTransfoDetails");
  p.textContent = "Données compressées : cliquez pour voir les détails des transformations";

  p.addEventListener("click",function(){
    affichageDetail();
    document.getElementById('butModifAp').scrollIntoView();
  });

  document.getElementById("brutArea").after(p);



  var exportBtn = document.getElementById("exportBtn");
  exportBtn.setAttribute("onclick","exportCode('qrcode')");

  var shortFieldSet = document.getElementById("FieldShort");
  if(shortFieldSet.lastElementChild.tagName == "LEGEND"){
    var itemsShort = schemas.qrcode.itemsShort;


    for (itemShortId in itemsShort){

      var itemShort = itemsShort[itemShortId];

      var div = document.createElement("div");
      var p = document.createElement("p");
      p.textContent = itemShort["p"];
      div.append(p);
      var content = document.createElement(itemShort.value.type);
      content.setAttribute("id", itemShort.value.id);
      if(itemShort.value.type == "img"){
        content.setAttribute("src","");
        content.setAttribute("alt", itemShort.value.value);
      } else if (itemShort.value.type == "input") {
        content.setAttribute("type", itemShort.value.inputType);
        content.setAttribute("disabled", "");
        content.setAttribute("value", itemShort.value.value);
      } 
      div.append(content);
      shortFieldSet.append(div);
    }
  }

  var detailFieldSet = document.getElementById("FieldDetails");
  detailFieldSet.classList.add('qrcode');
  detailFieldSet.classList.remove('datamatrix');

  if(detailFieldSet.lastElementChild.tagName == "LEGEND"){

    var itemsValidation = schemas["qrcode"].validation;
    for (itemId in itemsValidation){
      var item = itemsValidation[itemId];

      var div = document.createElement("div");
      div.classList.add("validationDetail");
      div.setAttribute("id", item.id);
      div.textContent = item.desc;
      detailFieldSet.append(div);

      var divExplication = document.createElement("div");
      divExplication.classList.add("validationDetailExp");
      divExplication.setAttribute("id", item.id+"Exp");
      detailFieldSet.append(divExplication);
    }

    var itemsRegles = schemas["qrcode"].regles;
    var divRegles = document.createElement("div");
    divRegles.setAttribute("id","reglesDiv")
    for (itemId in itemsRegles){
      var item = itemsRegles[itemId];

      var div = document.createElement("div");
      div.setAttribute("id", item.id);
      div.textContent = item.desc;
      var input = document.createElement("input");
      input.setAttribute("id", item.id + "Input");
      input.setAttribute("type", item.fieldType);
      if(item.fieldType == "checkbox"){
        input.checked = reglesValidQR[item.id];
      } else {
        input.value = reglesValidQR[item.id];
      }
      div.append(input);
      divRegles.append(div);
    }
    var applReglesBtn = document.createElement("button");
    applReglesBtn.textContent = "Appliquer";
    applReglesBtn.setAttribute("onclick", "appliquerRegles()");
    divRegles.append(applReglesBtn);
    detailFieldSet.append(divRegles);

    var modifBtnAv = document.createElement("button");
    modifBtnAv.setAttribute("id","butModifAv");
    modifBtnAv.setAttribute("onclick","modificationDonnees('qrcode')");
    modifBtnAv.textContent = "Modifier données";
    var modifDivAv = document.createElement("div");
    modifDivAv.append(modifBtnAv);
    detailFieldSet.append(modifDivAv);

    var table = document.createElement("table");

    var itemsTable = schemas.qrcode.itemsTable;
    
    
    for (itemTableId in itemsTable){
      var item = itemsTable[itemTableId];
      var tr = document.createElement("tr");
      tr.setAttribute("id", item.id);

      var tds = item.tds;
      for(tdId in tds){
        var td = tds[tdId];
        var tdElement = document.createElement("td");
        tdElement.setAttribute("id",td.id);
        tdElement.textContent = td.text;
        tr.append(tdElement);
      }
      table.append(tr);
    }

    detailFieldSet.append(table);

    var modifBtnAp = document.createElement("button");
    modifBtnAp.setAttribute("id","butModifAp");
    modifBtnAp.setAttribute("onclick","modificationDonnees('qrcode')");
    modifBtnAp.textContent = "Modifier données";
    var modifDivAp = document.createElement("div");
    modifDivAp.append(modifBtnAp);
    detailFieldSet.append(modifDivAp);


    var itemsSteps = schemas.qrcode.itemsSteps;


    for (itemId in itemsSteps){

     var item = itemsSteps[itemId];
     var div = document.createElement("div");
     div.innerHTML = item.explication;
     div.className = 'divDetails';


      var field = document.createElement("fieldset");
      var legend = document.createElement("legend");
      legend.textContent = item.legend;
      field.append(legend);
      var divEx = document.createElement("div");
      field.append(divEx);
      var divContent = document.createElement(item.type);
      divContent.setAttribute("id",item.divId);
      if(item.type == "textarea"){
        divContent.setAttribute("readonly","");
      }
      field.append(divContent);
      
      div.append(field);
      detailFieldSet.append(div);
      //detailFieldSet.append(field); 
    }

  }
}

function creationChamps2DDoc(){

  var exportBtn = document.getElementById("exportBtn");
  exportBtn.setAttribute("onclick","exportCode('2ddoc')");

  var shortFieldSet = document.getElementById("FieldShort");
  if(shortFieldSet.lastElementChild.tagName == "LEGEND"){
    var itemsShort = schemas["2ddoc"].itemsShort;


    for (itemShortId in itemsShort){

      var itemShort = itemsShort[itemShortId];

      var div = document.createElement("div");
      var p = document.createElement("p");
      p.textContent = itemShort["p"];
      div.append(p);
      var content = document.createElement(itemShort.value.type);
      content.setAttribute("id", itemShort.value.id);
      if(itemShort.value.type == "img"){
        content.setAttribute("src","");
        content.setAttribute("alt", itemShort.value.value);
      } else if (itemShort.value.type == "input") {
        content.setAttribute("type", itemShort.value.inputType);
        content.setAttribute("disabled", "");
        content.setAttribute("value", itemShort.value.value);
      } 
      div.append(content);
      shortFieldSet.append(div);
    }
  }

  var detailFieldSet = document.getElementById("FieldDetails");
  detailFieldSet.classList.add('datamatrix');
  detailFieldSet.classList.remove('qrcode');
  if(detailFieldSet.lastElementChild.tagName == "LEGEND"){

    var itemsValidation = schemas["2ddoc"].validation;
    for (itemId in itemsValidation){
      var item = itemsValidation[itemId];

      var div = document.createElement("div");
      div.classList.add("validationDetail");
      div.setAttribute("id", item.id);
      div.textContent = item.desc;
      detailFieldSet.append(div);

      var divExplication = document.createElement("div");
      divExplication.classList.add("validationDetailExp");
      divExplication.setAttribute("id", item.id+"Exp");
      detailFieldSet.append(divExplication);
    }

    var modifBtnAv = document.createElement("button");
    modifBtnAv.setAttribute("id","butModifAv");
    modifBtnAv.setAttribute("onclick","modificationDonnees('2ddoc')");
    modifBtnAv.textContent = "Modifier données";
    var modifDivAv = document.createElement("div");
    modifDivAv.append(modifBtnAv);
    detailFieldSet.append(modifDivAv);

    var table = document.createElement("table");
    
    var itemsTable = schemas["2ddoc"].itemsTable;
    for (itemTableId in itemsTable){
      var item = itemsTable[itemTableId];
      var tr = document.createElement("tr");
      tr.setAttribute("id", item.id);
      var idToSearch = (whatIndexTabId(item.id) == undefined ? "'"+item.id+"'" : "whatIndexTabId('"+item.id+"')");
      tr.setAttribute("onclick", "searchValue(tabIdData[whatIndexTabId('"+item.id+"')],"+idToSearch+")");

      var tds = item.tds;
      for(tdId in tds){
        var td = tds[tdId];
        var tdElement = document.createElement("td");
        tdElement.setAttribute("id",td.id);
        tdElement.textContent = td.text;
        tr.append(tdElement);
      }
      table.append(tr);
    }

    detailFieldSet.append(table);
    var modifBtnAp = document.createElement("button");
    modifBtnAp.setAttribute("id","butModifAp");
    modifBtnAp.setAttribute("onclick","modificationDonnees('2ddoc')");
    modifBtnAp.textContent = "Modifier données";
    var modifDivAp = document.createElement("div");
    modifDivAp.append(modifBtnAp);
    detailFieldSet.append(modifDivAp);

  }
}

function affichageComplet(type, data) {
  if(type == 'QR_CODE') {
    if (!data.startsWith('HC1:')) {
      alert('Ce QRCode n\'est pas celui d\'un pass sanitaire');
      document.getElementById("brutArea").textContent = data;
      return;
    }
    creationChampsPass();
    affichagePass(data);
  } else if (type == 'DATA_MATRIX'){
    creationChamps2DDoc();
    affichageDataMatrix(data);
  } else {
    alert("Ce code n'est pas pris en charge. Seul l'affichage brut sera affiché.");
    document.getElementById("brutArea").textContent = data;
  }
}

function affichageDataMatrix(data) {
  document.getElementById("brutArea").textContent = data;
  document.getElementById('expliVerif2D').style.display = 'block';
  var dataRead = readDataMatrix(data);

  if(dataRead.error != undefined){
    alert(dataRead.error);
    emptyShortField();
    emptyDetail();
    return;
  }

  var header = dataRead.header;
  var content = dataRead.content;
  var signature = dataRead.signature;
  var annexe = dataRead.annexe;

  console.log(header)

  // Affichage données short
  document.getElementById('DateDoc').value = convertDate(header['dateCreationSignature']);
  document.getElementById('NomPrenomDoc').value = content["B2"] + " " + content["B1"];
  var diplomes = schemas["2ddoc"].values["BD"];
  document.getElementById("DiplomeLevelDoc").value = diplomes[content["BD"]];

  // Affichage données du header
  affichageLambda("Marqueur", header['marqueur'], header['marqueur']);
  affichageLambda("Version", header['version'], header['version']);
  affichageLambda("IDAuthCert", header['IDAutoriteCertification'], header['IDAutoriteCertification']);
  affichageLambda("IDCert", header['IDCertificat'], header['IDCertificat']);

  affichageDate('DateEmi',header["dateEmission"], convertDate(header["dateEmission"]));
  affichageDate('DateSig', header["dateCreationSignature"], convertDate(header["dateCreationSignature"]));
  
  affichageTypeDoc(header['codeIdentificationDocument'], 'Diplôme');
  affichageLambda("Perimetre", header['perimetre'], header['perimetre']);
  affichageLambda("PaysEmetteur", header['paysEmetteur'],countryCodes[header['paysEmetteur']]);

  // Affichage données content
  for(item in content){
    var id = tabIdData[item]["id"];
    var value = content[item];
    switch (item) {
      case 'B5':
        var nationalites = schemas["2ddoc"].values[item];
        affichageLambda(id,value,nationalites[value]);
        break;
      case 'B6':
        var genres = schemas["2ddoc"].values[item];
        affichageLambda(id,value,genres[value]);
        break;
      case 'B7':
        affichageLambda(id, value, birthdayDateToString(value));
        break;
      case 'B9':
        var pays = schemas["2ddoc"].values[item];
        affichageLambda(id,value,pays[value]);
        break;
      case 'BA':
        var mentions = schemas["2ddoc"].values[item];
        affichageLambda(id,value,mentions[value]);
        break;
      case 'BD':
        var diplomes = schemas["2ddoc"].values[item];
        affichageLambda(id,value,diplomes[value]);
        break;
      case 'BF':
        affichageLambda(id, value, convertYear(value));
        break;
      case 'BG':
        var diplomeTypes = schemas["2ddoc"].values[item];
        affichageLambda(id, value, diplomeTypes[value]);
        break;
      default:
        affichageLambda(id,value,value);
        break;
    }

    // affichage signature

    var msg = "Cette signature a été générée avec l'algorithme ECDSA. "
    + "Elle permet de vérifier l'authenticité des données en utilisant le certificat "+header['IDCertificat']
    + " de l'autorité "+header['IDAutoriteCertification']+". "
    + "Elle est encodé en base32.";
    affichageLambda("Signature",signature,"",msg);
  }

  // caractere de separation signature
  var dec = new TextDecoder();
  var char31 = dec.decode(new Uint8Array([31]));

  // récupération des données brutes
  var raw = data.split(char31)[0];

  var enc = new TextEncoder();
  var rawArray = enc.encode(raw);

  // decode la signature base32
  console.log(signature);
  var b32decoded;
  if(signature != undefined){
    b32decoded = base32.decode.asBytes(signature);
  } else {
    b32decoded = [];
  }
  var rawsignature = new Uint8Array(b32decoded);

  validation2DDoc(header, rawsignature, signature, rawArray);
}

function affichagePassHeader(header, authId){
  affichageLambda("Algo", header["1"], schemas.qrcode.values.algo[header["1"]]);
  affichageLambda("AuthId", header["4"], authId);
}

function affichagePassDivers(data){
  affichageLambda("DateExpir", data["4"], (new Date(data["4"]*1000)).toLocaleString());
  affichageLambda("DateEmis", data["6"], (new Date(data["6"]*1000)).toLocaleString());

}

function affichagePassVaccin(vacc){
  affichageLambda("IDUnique", vacc["ci"], vacc["ci"]);
  affichageLambda("PaysEmetteur", vacc["co"], schemas.qrcode.values.paysEmetteur[vacc["co"]]);
  affichageLambda("NumDose", vacc["dn"], vacc["dn"]);
  affichageLambda("DateVaccin", vacc["dt"], vacc["dt"]);
  affichageLambda("Issuer", vacc["is"], vacc["is"]);
  affichageLambda("Fabricant", vacc["ma"], schemas.qrcode.values.fabricant[vacc["ma"]]);
  affichageLambda("Vaccin", vacc["mp"], schemas.qrcode.values.vaccin[vacc["mp"]]);
  affichageLambda("TotalDose", vacc["sd"], vacc["sd"]);
  affichageLambda("Maladie", vacc["tg"], schemas.qrcode.values.maladie[vacc["tg"]]);
  affichageLambda("TypeVacc", vacc["vp"], schemas.qrcode.values.typeVaccin[vacc["vp"]]);

}

function affichagePassInfosPersos(data) {
  affichageLambda("DateNaiss", data["dob"], data["dob"]);
  affichageLambda("Nom", data["nam"]["fn"], data["nam"]["fn"]);
  affichageLambda("Prenom", data["nam"]["gn"], data["nam"]["gn"]);
  affichageLambda("NomStd", data["nam"]["fnt"], data["nam"]["fnt"]);
  affichageLambda("PrenomStd", data["nam"]["gnt"], data["nam"]["gnt"]);
}

function affichagePassSignature(data,algo,authId){
  var hexSignature = toHexString(data);
  var msg = "Cette signature a été générée avec l'algorithme "+algo+". "
    + "Elle permet de vérifier l'authenticité des données en utilisant le certificat de l'autorité "+authId+". "
    + "Pour une facilité de modification, elle est affichée en hexadécimal.";
  affichageLambda("Signature",hexSignature,"",msg);
}

function getB45Formula(){
  return 'ABC => [a,b,c] => i = a + 45*b + 45^2*c => x=i/256 | y=i%256 => [x,y]';
}

function getB45Values(str){

  var A = str[0];
  var B = str[1];
  var C = str[2];

  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
  var arr = [];
  for(var i = 0; i < str.length; i++){
    arr.push(chars.indexOf(str[i]))
  }
  var a = arr[0];
  var b = arr[1];
  var c = arr[2];

  var i = a + b*45 + c*45*45;

  var x = Math.trunc(i/256);
  var y = i%256;

  return {A:A,B:B,C:C,a:a,b:b,c:c,i:i,x:x,y:y};
}

function affichagePass(data) {
  document.getElementById("brutArea").textContent = data;  // afficher les données brute

  document.getElementById("divPrefix").textContent = "HC1:";

  var qrSansPrefixe = removePrefix(data);
  document.getElementById("divB45").innerHTML = qrSansPrefixe;

  ////
  var divTransfoB45 = document.createElement("div");
  divTransfoB45.setAttribute("id", "divTransfoB45");
  divTransfoB45.classList.add("divTransfo");
  var arrow = document.createElement("img");
  arrow.setAttribute("src","img/arrow.png");
  divTransfoB45.append(arrow);


  var divTransfoFormulas = document.createElement("div");
  divTransfoFormulas.setAttribute("id","divTransfoFormulas");
  
  var desc = document.createElement("p");
  desc.textContent = "Exemple de conversion avec les 3 premiers caractères :";
  divTransfoFormulas.append(desc);

  var b45result = getB45Values(qrSansPrefixe.substring(0,3));

  var formula = document.createElement("div");
  formula.classList.add('b45ExempleExp');
  var node = document.createElement("div");
  node.textContent = `${b45result.A}${b45result.B}${b45result.C} = [${b45result.a},${b45result.b},${b45result.c}]`;
  formula.append(node);
  node = document.createElement("div");
  node.classList.add("b45ExempleExpDetail");
  node.textContent = `${b45result.A} est le ${b45result.a}ème caractère de la liste de symboles`;
  formula.append(node);
  node = document.createElement("div");
  node.classList.add("b45ExempleExpDetail");
  node.textContent = `${b45result.B} est le ${b45result.b}ème caractère de la liste de symboles`;
  formula.append(node);
  node = document.createElement("div");
  node.classList.add("b45ExempleExpDetail");
  node.textContent = `${b45result.C} est le ${b45result.c}ème caractère de la liste de symboles`;
  formula.append(node);
  divTransfoFormulas.append(formula);

  formula = document.createElement("div");
  formula.classList.add('b45ExempleExp');
  node = document.createElement("div");
  node.textContent = `${b45result.a} + ${b45result.b}*45 + ${b45result.c}*45\u00b2 = ${b45result.i}`;
  formula.append(node);
  divTransfoFormulas.append(formula);

  formula = document.createElement("div");
  formula.classList.add('b45ExempleExp');
  node = document.createElement("div");
  node.textContent = `${b45result.i}/256 = ${b45result.x}`;
  formula.append(node);
  node = document.createElement("div");
  node.textContent = `${b45result.i}%256 = ${b45result.y}`;
  formula.append(node);
  divTransfoFormulas.append(formula);

  formula = document.createElement("div");
  formula.classList.add('b45ExempleExp');
  node = document.createElement("div");
  node.textContent = `[${b45result.x},${b45result.y}]`;
  formula.append(node);
  divTransfoFormulas.append(formula);

  divTransfoB45.append(divTransfoFormulas);

  document.getElementById("divB45").parentElement.after(divTransfoB45);
  ////
  var qrDecodedB45 = decodeB45(qrSansPrefixe);
  document.getElementById("divZlib").innerHTML = qrDecodedB45;

  var divTransfoDecompress = document.createElement("div");
  divTransfoDecompress.setAttribute("id", "divTransfoDecompress");
  divTransfoDecompress.classList.add("divTransfo");
  var arrow = document.createElement("img");
  arrow.setAttribute("src","img/arrow.png");
  divTransfoDecompress.append(arrow);
  document.getElementById("divZlib").parentElement.after(divTransfoDecompress);

  ////
  var qrDecompressed = decompress(qrDecodedB45);
  var cbor = getCBOR(qrDecompressed);
  document.getElementById("divCbor").innerHTML = cbor;
  
  var divTransfoCBOR = document.createElement("div");
  divTransfoCBOR.setAttribute("id", "divTransfoCBOR");
  divTransfoCBOR.classList.add("divTransfo");
  var arrow = document.createElement("img");
  arrow.setAttribute("src","img/arrow.png");
  divTransfoCBOR.append(arrow);
  document.getElementById("divCbor").parentElement.after(divTransfoCBOR);
  ////


  var dcc = getDCC(cbor);

  document.getElementById('divClair').textContent = JSON.stringify(dcc, null, 4); //données en claire
  
  if(dcc.payload['-260']['1']['v'] == undefined){
    var type;
    if(dcc.payload['-260']['1']['r'] != undefined){
      type = "rétablissement";
    } else {
      type = "test";
    }

    alert("Seules les données de vaccinations sont interprétées. Vous avez scanné un certificat de "+type);
  }

  if(dcc.payload['-260']['1']['v'] != undefined){
    document.getElementById('DatePass').value = dcc.payload['-260']['1']['v'][0]['dt']; //Mettre la date du pass sanitaire en claire
  }
  document.getElementById('NomPrenomPass').value = dcc.payload['-260']['1']['nam']['gn'] + ' ' + dcc.payload['-260']['1']['nam']['fn']; //mettre nom et prenom du pass en claire
  
  affichagePassHeader(dcc.header, dcc.authId);
  affichagePassDivers(dcc.payload);
  if(dcc.payload['-260']['1']['v'] != undefined){
    affichagePassVaccin(dcc.payload['-260']['1']['v'][0]);
  }
  affichagePassInfosPersos(dcc.payload['-260']['1']);
  var algo = schemas.qrcode.values.algo[dcc.header["1"]];
  var authId = dcc.authId;
  affichagePassSignature(dcc.signature,algo,authId);
  document.getElementById('expliVerifPass').style.display = 'block';
  validationPass(dcc, qrDecompressed);
}

function isBl2ddocStillValid(dateStr, margeMax){
  var date = new Date(dateStr);
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  var diff = today - date;
  return diff <= margeMax;
}

function validation2DDoc(header,rawsignature,b32sig,raw){
  /*verif blacklist */

  var isDMValidCode = isDatamatrixValid(header["IDAutoriteCertification"],header["IDCertificat"],b32sig);
  var errorMsg = "";

  // on part du principe que par defaut un 2ddoc est toujours valide
  document.getElementById('valideDoc').src = 'img/valide.png';
  document.getElementById('validIsBlacklistDetail').classList.add("valide");
 
  switch (isDMValidCode) {
    case 0:
      errorMsg = "2DDoc non blacklisté";
      break;
    case -1:
      document.getElementById('valideDoc').src = 'img/invalide.png';
      document.getElementById('validIsBlacklistDetail').classList.remove("valide");
      document.getElementById('validIsBlacklistDetailExp').textContent = errorMsg;
      break;
    case -2:
      errorMsg = "Autorité non trouvée";
      break;
    case -3:
      errorMsg = "Certificat archivé";
      break;
    case -4:
      errorMsg = "Certificat non trouvé";
      break;
    default:
      errorMsg = "Code d'erreur inconnu";
      break;
  }


  /* On vérifie si la liste de révocation est bien valide */

  var certificateJSON = 'MIIBhzCCASwCFC+qElBrd+EqYIkAV7nvcbSQMEDLMAoGCCqGSM49BAMCMD8xCzAJBgNVBAYTAkZSMQ4wDAYDVQQIDAVSb3VlbjERMA8GA1UECgwIMkRNYXRyaXgxDTALBgNVBAMMBDJETVAwHhcNMjIwNDIxMjE0NTI2WhcNMjMwNDIxMjE0NTI2WjBMMQswCQYDVQQGEwJGUjETMBEGA1UECAwKU29tZS1TdGF0ZTEYMBYGA1UECgwPMkRNYXRyaXggVExTL0JMMQ4wDAYDVQQDDAUyRFRCUzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJJYgBaUSX3o2hIObmCa4lQM8pc6f8C4nQl5R8H3VcvRwqjQepFNcJvpiW/qNv/D6WK2deze6OrysCWyeLRxgZ8wCgYIKoZIzj0EAwIDSQAwRgIhAOAdN87I4jhcMoAbCmRenIjWpEgV3/1xqyTFUqQf02rhAiEAkGhnvGkTeOHk6t6/dL60rECvQ9HIeVtbNhoZof0jI5E=';
  
  var x509cert = getx509FromPem(certificateJSON);
  var x509Infos = getX509Infos2ddoc(x509cert);
  var pubkey = getPublicKey2DDoc(x509cert);

  const ALGO = {
    name: "ECDSA",
    namedCurve: "P-256",
    hash: {
        name: 'SHA-256'
    }
  };


  var revocSignature = jsonBLContent["Sign"];
  var b32RevocSigDecoded = base32.decode.asBytes(revocSignature);
  var rawRevocSignature = new Uint8Array(b32RevocSigDecoded);
    
  var data = {};
  data["Signatures"] = jsonBLContent["Signatures"];
  data["Authorities"] = jsonBLContent["Authorities"];
  data["Archives"] = jsonBLContent["Archives"];
  data["Date"] = jsonBLContent["Date"];

  var str = JSON.stringify(data, null, 0);
  var enc = new TextEncoder();
  var rawJson = enc.encode(str);

  window.crypto.subtle.importKey("raw",pubkey.buffer, ALGO, false, ["verify"])
  .then(function(publicKey) {
      window.crypto.subtle.verify(ALGO, publicKey, rawRevocSignature, rawJson)
      .then(function(isvalid){
        const MARGEMAX = 86400000; // 1jour
        var blDateValid = isBl2ddocStillValid(jsonBLContent["Date"],MARGEMAX);
        if(isvalid && blDateValid) {
          document.getElementById('validSignBlOKDetail').classList.add("valide");
        } else {
          if(!isvalid){
            console.log("LISTE DE REVOCATION INVALIDE");
            document.getElementById('validSignBlOKDetail').classList.remove("valide");
            document.getElementById('valideDoc').src = 'img/invalide.png';
            document.getElementById('validSignBlOKDetailExp').textContent = "La signature n'est pas valide";
          } else if (!blDateValid) {
            console.log("LISTE DE REVOCATION INVALIDE");
            document.getElementById('validSignBlOKDetail').classList.remove("valide");
            document.getElementById('valideDoc').src = 'img/invalide.png';
            document.getElementById('validSignBlOKDetailExp').textContent = "La blacklist n'a pas été signée depuis plus d'1 jour!";
          }

        }
      })
      .catch(function(err){
          console.error(err);
      });
  })
  .catch(function(err) {
      console.error(err);
  });


  if(isDMValidCode < -1 && isDMValidCode != -3){
    document.getElementById('valideDoc').src = 'img/invalide.png';
    document.getElementById('validSignDetail').classList.remove("valide");
    document.getElementById('validSignDetailExp').textContent = errorMsg;
    return;
  }

  /* Puis on vérifie la signature */
  var certificatePEM = getCertificate2DDoc(header["IDAutoriteCertification"],header["IDCertificat"]);

  if(certificatePEM == undefined || certificatePEM == ""){
    msg = "Certificat vide";
    document.getElementById('valideDoc').src = 'img/invalide.png';
    document.getElementById('validSignDetailExp').textContent = msg;
    return;
  }

  x509cert = getx509FromPem(certificatePEM);
  x509Infos = getX509Infos2ddoc(x509cert);
  pubkey = getPublicKey2DDoc(x509cert);


  /* verif sign */
  window.crypto.subtle.importKey("raw",pubkey.buffer, ALGO, false, ["verify"])
  .then(function(publicKey) {
      window.crypto.subtle.verify(ALGO, publicKey, rawsignature, raw)
      .then(function(isvalid){
        console.log("Signature valid : "+isvalid);
        if(isvalid) { //2ddoc signature valide
            document.getElementById('validSignDetail').classList.add("valide");
            var msg = "Validé par le certificat "
              + x509Infos.cnCert + " (" + x509Infos.oCert + ") "
              + "émis par " + x509Infos.cnIssuer + " (" + x509Infos.oIssuer +")";
            if(isDMValidCode == -3){
              msg += ` /!\\ ${errorMsg} /!\\`;
            }
            document.getElementById("validSignDetailExp").textContent = msg;
          } else { //2ddoc signature invalide
            document.getElementById('valideDoc').src = 'img/invalide.png';
            document.getElementById('validSignDetail').classList.remove("valide");
            document.getElementById('validSignDetailExp').textContent = "La signature n'est pas valide";
          }
      })
      .catch(function(err){
          console.error(err);
      });
  })
  .catch(function(err) {
      console.error(err);
  });

}

function validationPass(dcc, qrDecompressed) {
// Validation à effectuer
  var authId = dcc.authId;
  var x509 = getX509(authId);

  if(x509 == undefined || x509 == null){
    msg = "Autorité non trouvée";
    document.getElementById('validePass').src = 'img/invalide.png';
    document.getElementById('validSignDetailExp').textContent = msg;
    return;
  }

  document.getElementById('validePass').src = 'img/valide.png';

  if(reglesValidQR.regleCheckBl){
    console.log("check bl");
    CheckIfPassBlacklisted(dcc);
  } else {
    document.getElementById('validBlacklistDetail').classList.add('valide');
    msg = "Recherche désactivée par les règles de validation."
    document.getElementById('validBlacklistDetailExp').innerHTML = msg
  }

  if(dcc.header[1] == -7){
    var publicKey = getPublicKey(x509);
    var xy = getXY(publicKey);
  
    var x509Infos = getX509Infos(x509);
  
    validSig(qrDecompressed, xy, function(result){
      console.log("Signature valid : "+result);
      if(result) { //Pass Valide
        document.getElementById('validSignDetail').classList.add('valide');
        
        var msg = "Validé par le certificat "
          + x509Infos.cnCert + " (" + x509Infos.oCert + ") "
          + "émis par " + x509Infos.cnIssuer + " (" + x509Infos.oIssuer +")";
        document.getElementById("validSignDetailExp").textContent = msg;
      } else {
        //Pass Invalide
        document.getElementById('validePass').src = 'img/invalide.png';
        document.getElementById('validSignDetail').classList.remove('valide');
      }

      verificationRegles(dcc);
    });
  } else {
    msg = "Les algorithmes autres que ECDSA ne sont pas supportés";
    document.getElementById('validePass').src = 'img/invalide.png';
    document.getElementById('validSignDetailExp').textContent = msg;

    verificationRegles(dcc);
  }
}

async function CheckIfPassBlacklisted(dcc){
  var co = dcc.payload[-260][1]["v"][0]["co"];
  var ci = dcc.payload[-260][1]["v"][0]["ci"];
  var strToHash = co+ci;

  var encoder = new TextEncoder();
  var data = encoder.encode(strToHash);

  var hash = await crypto.subtle.digest('SHA-256', data);
  var hashArray = Array.from(new Uint8Array(hash));                    
  var hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  if(blacklistDCC.liste.includes(hashHex)){
    document.getElementById('validePass').src = 'img/invalide.png';
    document.getElementById('validBlacklistDetail').classList.remove('valide');
    msg = `/!\\ Ce pass fait partie des ${blacklistDCC.liste.length} passes blacklistés (en date du ${blacklistDCC.updateDate}) dans l'application TousAntiCovid Verif (<a target='_blank' href='https://www.liberation.fr/checknews/comment-des-pass-sanitaires-valides-de-bob-leponge-ou-adolf-hitler-ont-ils-pu-se-retrouver-en-ligne-20211028_GKJOCBG345EDZLVQRWT2WY5FVA/'>Plus d'informations</a>)`;
    document.getElementById('validBlacklistDetailExp').innerHTML = msg
  } else {
    document.getElementById('validBlacklistDetail').classList.add('valide');
  };
}

function verificationRegles(dcc){
  var nbDose = dcc.payload['-260']['1']['v'][0]["dn"];
  const nbDoseValid = reglesValidQR.regleNbDoses;
  document.getElementById("validNbDosesDetailExp").textContent = nbDose+" dose(s) detectée(s) sur "+nbDoseValid;
  if (nbDose >= nbDoseValid){
    document.getElementById('validNbDosesDetail').classList.add('valide');
  } else {
    document.getElementById('validePass').src = 'img/invalide.png';
    document.getElementById('validNbDosesDetail').classList.remove('valide');
  }
}

function appliquerRegles() {
  reglesValidQR.regleNbDoses = document.getElementById("regleNbDosesInput").value;
  reglesValidQR.regleCheckBl = document.getElementById("regleCheckBlInput").checked;
  var dcc = document.getElementById("brutArea").textContent;
  removeFields();
  affichageComplet("QR_CODE",dcc);
}


function exportCode(type){
  var data = document.getElementById("brutArea").textContent;

  if(data == ""){
    alert("Données vides");
    return;
  }
  switch (type) {
    case "qrcode":

      var canvas = bwipjs.toCanvas('exportedCanvas', {
        bcid: 'qrcode',      
        text: data,   
        scale: 3,               
        padding: 5,
        backgroundcolor:"00000000"
      });

      var url = canvas.toDataURL("image/png");

      var download = document.createElement('a');
      download.setAttribute('href',url);
      download.setAttribute('download','qrcode.png');
      download.style.display = "none";
      document.body.appendChild(download);
      download.click();
      document.body.removeChild(download);

      break;

    case "2ddoc":

      var canvas = bwipjs.toCanvas('exportedCanvas', {
        bcid: 'datamatrix',      
        text: data,   
        scale: 3,               
        padding: 5,
        backgroundcolor:"00000000",
        includetext: false,
        // cause trop de pb au scan a cause du decalage
/*         textfont:"Times-Roman",
        textsize:7,
        textyoffset:1,
        alttext: "2D-DOC" */
      });

      var url = canvas.toDataURL("image/png");


      var download = document.createElement('a');
      download.setAttribute('href',url);
      download.setAttribute('download','datamatrix.png');
      download.style.display = "none";
      document.body.appendChild(download);
      download.click();
      document.body.removeChild(download);

      break;

    default:
      alert("Type d'export non reconnu");
      break;
  }
}

// Pour pouvoir exporer en qrcode par defaut (si pas premier scan)
function resetExportBtn(){
  var exportBtn = document.getElementById("exportBtn");
  exportBtn.setAttribute("onclick","exportCode('qrcode')");
}

// vide les donnees brutes
function emptyBrut(){
  document.getElementById('brutArea').textContent = "";
  var goToTransfo = document.getElementById("goToTransfoDetails");
  if(goToTransfo != null){
    goToTransfo.remove();
  }
}
// suppresion divs short
function emptyShortField(){
  var divsShort = document.querySelectorAll("#FieldShort > div");
  divsShort.forEach((div) => div.remove());
}

// suppression fields details et table
function emptyDetail(){
  var fields = document.querySelectorAll("#FieldDetails > fieldset, #FieldDetails > table, #FieldDetails > div");
  fields.forEach((field) => field.remove());
  document.getElementById('expliVerifPass').style.display = 'none';
  document.getElementById('expliVerif2D').style.display = 'none';
}

// supprime les champs pour avoir un environnement propre a chaque scan
function removeFields(){
  emptyBrut();
  emptyShortField();
  emptyDetail();
  resetExportBtn();
}

/*
 * Fonction appelée lors de la réussite d'un scan
 */
function onScanSuccess(decodedText, decodedResult) {
  console.log(decodedResult.result.format.formatName+" detected");
  removeFields();
  affichageComplet(decodedResult.result.format.formatName,decodedText);
}

/*
* Fonction appelée lors de l'échec d'un scan
*/
function onScanFailure(error) {
  if (html5QrcodeScanner.currentScanType == 1) {
    removeFields();
  }
}


