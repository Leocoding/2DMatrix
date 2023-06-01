function displayInfoProj() {
    let div = document.getElementById('infoProj');
    let close = document.getElementById('close');
    let b1 = document.getElementById('bodyContent');
    if(div.style.display == 'none' || div.style.display == '') {
        div.style.display = 'block';
        close.style.display = 'block';
        b1.style.display = 'none';
    } else {
        div.style.display = 'none';
        let div2 = document.getElementById('infoLegale');
        let div3 = document.getElementById('fctProj');
        if((div2.style.display == 'none' || div2.style.display == '') 
        && (div3.style.display == 'none' || div3.style.display == '')) {
            close.style.display = 'none';
            b1.style.display = 'flex';
         }
    } 
    
}

function displayInfolegale() {
    let div = document.getElementById('infoLegale');
    let close = document.getElementById('close');
    let b1 = document.getElementById('bodyContent');
    if(div.style.display == 'none' || div.style.display == '') {
        div.style.display = 'block';
        close.style.display = 'block';
        b1.style.display = 'none';
    } else {
        div.style.display = 'none';
        let div2 = document.getElementById('infoProj');
        let div3 = document.getElementById('fctProj');
        if((div2.style.display == 'none' || div2.style.display == '') 
        && (div3.style.display == 'none' || div3.style.display == '')) {
            close.style.display = 'none';
            b1.style.display = 'flex';
         }
    }
}

function displayfctProj() {
    let div = document.getElementById('fctProj');
    let close = document.getElementById('close');
    let b1 = document.getElementById('bodyContent');
    if(div.style.display == 'none' || div.style.display == '') {
        div.style.display = 'block';
        close.style.display = 'block';
        b1.style.display = 'none';
    } else {
        div.style.display = 'none';
        let div2 = document.getElementById('infoLegale');
        let div3 = document.getElementById('infoProj');
        if((div2.style.display == 'none' || div2.style.display == '') 
        && (div3.style.display == 'none' || div3.style.display == '')) {
            close.style.display = 'none';
            b1.style.display = 'flex';
         }
    } 
}

function closeAllBox() {
    let div = document.getElementById('infoProj');
    let b1 = document.getElementById('bodyContent');
    div.style.display = 'none';
    div = document.getElementById('infoLegale');
    div.style.display = 'none';
    div = document.getElementById('fctProj');
    div.style.display = 'none';
    let close = document.getElementById('close');
    close.style.display = 'none';
    b1.style.display = 'flex';
}