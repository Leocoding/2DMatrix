
function createXhrObject()
{
    if (window.XMLHttpRequest)
        return new XMLHttpRequest();

    if (window.ActiveXObject)
    {
        var names = [
            "Msxml2.XMLHTTP.6.0",
            "Msxml2.XMLHTTP.3.0",
            "Msxml2.XMLHTTP",
            "Microsoft.XMLHTTP"
        ];
        for(var i in names)
        {
            try{ return new ActiveXObject(names[i]); }
            catch(e){}
        }
    }
    window.alert("Votre navigateur ne prend pas en charge l'objet XMLHTTPRequest.");
    return null; // non supporté
}


let Lname;
let Fname;
let dateBirth;
let pays;
let genre;
let type;
let numDoc;
let degree;
let domaine;
let mention;
let spe;
let chiffrement;


function validateData(){
    var perror = document.getElementById("status");
    perror.textContent = "";

    Lname = document.getElementById("Lname").value;

    if(Lname.length < 0 && Lname.length > 38) {
        perror.textContent = "Veuillez entrer un nom valide.";
        perror.classList.add("visible");
        document.getElementById("Lname").classList.add("invalid");
        document.getElementById("Lname").focus();
        return false;
    }
    if (!/^[a-zA-Z ]+$/.test(Lname)) {
        perror.textContent = "Veuillez entrer un nom valide.";
        perror.classList.add("visible");
        document.getElementById("Lname").classList.add("invalid");
        document.getElementById("Lname").focus();
        return false;
    }

    Lname = Lname.toUpperCase();
    document.getElementById("Lname").classList.remove("invalid");

   

    Fname = document.getElementById("Fname").value;

    if(Fname.length < 0 && Fname.length > 20) {
        perror.textContent = "Veuillez entrer un prenom valide.";
        perror.classList.add("visible");
        document.getElementById("Fname").classList.add("invalid");
        document.getElementById("Fname").focus();
        return false;
    }
    if (!/^[a-zA-Z ]+$/.test(Fname)) {
        perror.textContent = "Veuillez entrer un prenom valide.";
        perror.classList.add("visible");
        document.getElementById("Fname").classList.add("invalid");
        document.getElementById("Fname").focus();
        return false;
    }

    Fname = Fname.toUpperCase();
    document.getElementById("Fname").classList.remove("invalid");

   
    

    dateBirth = document.getElementById("dateBirth").value;

    let dateB = new Date(dateBirth);
    if(dateB == null || dateB == undefined || dateB =="Invalid Date") {
        perror.textContent = "Veuillez entrer une date valide.";
        perror.classList.add("visible");
        document.getElementById("dateBirth").classList.add("invalid");
        document.getElementById("dateBirth").focus();
        return false;
    }
    let today = new Date();
    let minDate= today;
    minDate = minDate.setFullYear(today.getFullYear() -10)
    if (today <= dateB &&  minDate <= dateB ) {
        perror.textContent = "Veuillez entrer une date valide.";
        perror.classList.add("visible");
        document.getElementById("dateBirth").classList.add("invalid");
        document.getElementById("dateBirth").focus();
        return false;
    }

    dateBirth = ("0" + (dateB.getMonth() + 1)).slice(-2) + ("0" + (dateB.getDay() + 1)).slice(-2) + dateB.getFullYear().toString();

 


    if(dateBirth == null || dateBirth == undefined) {
        perror.textContent = "Veuillez entrer une date valide.";
        perror.classList.add("visible");
        document.getElementById("dateBirth").classList.add("invalid");
        document.getElementById("dateBirth").focus();
        return false;
    }

    document.getElementById("dateBirth").classList.remove("invalid");

    

    pays = document.getElementById("pays").value;

    let listePays = document.getElementById('paysListe').options;
    let boolVerif1 = false;
    for (let i=0; i<listePays.length; ++i) {
        if(pays == listePays[i].value){
            boolVerif1 = true;
            break;
        }
    }
    if (boolVerif1 == false) {
        perror.textContent = "Veuillez entrer un pays valide.";
        perror.classList.add("visible");
        document.getElementById("pays").classList.add("invalid");
        document.getElementById("pays").focus();
        return false;
    }

    if(pays.length != 2) {
        perror.textContent = "Veuillez entrer un pays valide.";
        perror.classList.add("visible");
        document.getElementById("pays").classList.add("invalid");
        document.getElementById("pays").focus();
        return false;
    }


    pays = pays.toUpperCase();
    document.getElementById("pays").classList.remove("invalid");
    
    genre= document.getElementById("genre").value;

    if (genre == ""){
        perror.textContent = "Veuillez entrer un genre valide.";
        perror.classList.add("visible");
        document.getElementById("genre").classList.add("invalid");
        document.getElementById("genre").focus();
        return false;
    }

    if(genre.length != 1) {
        perror.textContent = "Veuillez entrer un genre valide.";
        perror.classList.add("visible");
        document.getElementById("genre").classList.add("invalid");
        document.getElementById("genre").focus();
        return false;
    }
    if(genre != "M" && genre != "F" && genre != "X") {
        perror.textContent = "Veuillez entrer un genre valide.";
        perror.classList.add("visible");
        document.getElementById("genre").classList.add("invalid");
        document.getElementById("genre").focus();
        return false;
    }

    document.getElementById("genre").classList.remove("invalid");



    numDoc = document.getElementById("numDoc").value;

    if(numDoc.length < 0 && numDoc.length > 20) {
        perror.textContent = "Veuillez entrer un numéro de document valide.";
        document.getElementById("numDoc").classList.add("invalid");
        document.getElementById("numDoc").focus();
        perror.classList.add("visible");
        return false;
    }
    if (!/^[a-zA-Z1-9 ]+$/.test(numDoc)) {
        perror.textContent = "Veuillez entrer un numéro de document valide.";
        document.getElementById("numDoc").classList.add("invalid");
        document.getElementById("numDoc").focus();
        perror.classList.add("visible");
        return false;
    }

    numDoc = numDoc.toUpperCase();
    document.getElementById("numDoc").classList.remove("invalid");



    degree = document.getElementById("degree").value;

    if(degree.length != 1) {
        perror.textContent = "Veuillez entrer un niveau valide.";
        perror.classList.add("visible");
        document.getElementById("degree").classList.add("invalid");
        document.getElementById("degree").focus();
        return false;
    } 

    if(degree != "4" && degree != "5" && degree != "6" && degree != "7" 
        && degree != "8") {
            perror.textContent = "Ça ne sera pas aussi simple que ça ;)";
            perror.classList.add("visible");
            document.getElementById("degree").classList.add("invalid");
            document.getElementById("degree").focus();
            return false;
    }

    document.getElementById("degree").classList.remove("invalid");
    
    type = document.getElementById("type").value;

    if(type.length != 2) {
        perror.textContent = "Veuillez entrer un type de diplome valide.";
        perror.classList.add("visible");
        document.getElementById("type").classList.add("invalid");
        document.getElementById("type").focus();
        return false;
    }
    type = type.toUpperCase();
    document.getElementById("type").classList.remove("invalid");

   

    let listeType = document.getElementById('typeList').options;
    let boolVerif2 = false;
    for (let i=0; i<listeType.length; ++i) {
        if(type == listeType[i].value){
            boolVerif2 = true;
            break;
        }
    }
    if (boolVerif2 == false) {
        perror.textContent = "Veuillez entrer un diplome valide.";
        perror.classList.add("visible");
        document.getElementById("type").classList.add("invalid");
        document.getElementById("type").focus();
        return false;
    }

    document.getElementById("type").classList.remove("invalid");

    domaine = document.getElementById("domaine").value;

    if(domaine.length < 0 && domaine.length > 30) {
        perror.textContent = "Veuillez entrer un domaine valide.";
        perror.classList.add("visible");
        document.getElementById("domaine").classList.add("invalid");
        document.getElementById("domaine").focus();
        return false;
    }
    if (!/^[a-zA-Z1-9 ]+$/.test(domaine)) {
        perror.textContent = "Veuillez entrer un domaine valide.";
        perror.classList.add("visible");
        document.getElementById("domaine").classList.add("invalid");
        document.getElementById("domaine").focus();
        return false;
    }

    domaine = domaine.toUpperCase();

    document.getElementById("domaine").classList.remove("invalid");


    mention = document.getElementById("mention").value;

    if(mention.length < 0 && mention.length > 30) {
        perror.textContent = "Veuillez entrer une mention valide.";
        perror.classList.add("visible");
        document.getElementById("mention").classList.add("invalid");
        document.getElementById("mention").focus();
        return false;
    }
    if (!/^[a-zA-Z1-9 ]+$/.test(mention)) {
        perror.textContent = "Veuillez entrer une mention valide.";
        perror.classList.add("visible");
        document.getElementById("mention").classList.add("invalid");
        document.getElementById("mention").focus();
        return false;
    }
    mention = mention.toUpperCase();

    document.getElementById("mention").classList.remove("invalid");

    spe = document.getElementById("spe").value;

    if(spe.length < 0 && spe.length > 30) {
        perror.textContent = "Veuillez entrer une spécialité valide.";
        perror.classList.add("visible");
        document.getElementById("spe").classList.add("invalid");
        document.getElementById("spe").focus();
        return false;
    }
    if (!/^[a-zA-Z1-9 ]+$/.test(spe)) {
        perror.textContent = "Veuillez entrer une spécialité valide.";
        perror.classList.add("visible");
        document.getElementById("spe").classList.add("invalid");
        document.getElementById("spe").focus();
        return false;
    }

    spe = spe.toUpperCase();

    document.getElementById("spe").classList.remove("invalid");

    chiffrement = document.getElementById("chiffrement").checked

    certif = document.getElementById("certif").value;

    var content;
    const xhr = createXhrObject();
    if(xhr == null) {
        alert('Votre navigateur ne prend pas en charge les requêtes AJAX');
        return false;
    }
    xhr.open('POST', 'datamatrixCreate/traitement.php', false);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                content = xhr.responseText;
            } else if (xhr.status == 422) {
                perror.textContent = "Ça ne sera pas aussi simple que ça ;)";
                return false;
            } else {
                perror.textContent = "Erreur de traitement du serveur, veuillez réessayer.";
                return false;
            }
        } 

    }
    xhr.send("Lname=" + Lname + "&Fname=" + Fname + "&dateBirth=" + dateBirth + "&pays=" + pays
            + "&genre=" + genre + "&type=" + type + "&numDoc=" + numDoc + "&degree=" + degree
            + "&domaine=" + domaine + "&mention=" + mention + "&spe=" + spe + "&certif=" + certif
            + "&chiffrement="+chiffrement);

    console.log(content);
    var canvas = bwipjs.toCanvas('mycanvas', {
        bcid: 'datamatrix',
        text: content,
        scale: 3,
        padding: 5,
        backgroundcolor:"00000000",
        includetext: false,
        //cause trop de probleme au scan
/*         textsize: 7,
        textyoffset: 2,
        textxoffet: 2,
        alttext: "2D-DOC" */
    });
    var url = canvas.toDataURL("image/png");
    var gif = document.getElementById("dataContent");
    if(gif != null) {
        gif.remove();
    }
    document.getElementById("attenteLbl").classList.add("hide");
    var dataContent = document.getElementById("mycanvas");
    dataContent.replaceWith(canvas);
    dataContent.setAttribute("id", "mycanvas");
    var download = document.getElementById('telecharge');
    download.setAttribute('href', url);
    download.setAttribute('download', 'datamatrix.png');

    download.classList.add("active");

    perror.classList.remove("visible");
    return true;
}