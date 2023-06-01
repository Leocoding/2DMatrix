#!/bin/bash

# Sync 2ddoc
DATAHEADER="//Mise à jour du $(date)\n"
echo -e "$DATAHEADER""const jsonBLContent = $(curl -s https://srv-dpi-proj-datamatrix-srv1.univ-rouen.fr/blacklist-certif.json)" > /var/www/html/2DMatrixScan/js/blacklist-certif-content.js


# Sync pass sanitaire
PASSHEADER="// depuis https://gitlab.inria.fr/tousanticovid-verif/tousanticovid-verif-ios/-/raw/master/Anticovid%20Verify/resources/prod/sync_certs.json\n// le $(date)\n"
AUTHORITIES="var authorities = $(curl -s https://gitlab.inria.fr/tousanticovid-verif/tousanticovid-verif-ios/-/raw/master/Anticovid%20Verify/resources/prod/sync_certs.json)"
echo -e "$PASSHEADER$AUTHORITIES" > /var/www/html/2DMatrixScan/authorities.js
