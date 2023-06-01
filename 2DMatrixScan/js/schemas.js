var schemas = {
    "qrcode": {
        values: {
            algo: {
                "-7": "ECDSA",
                "-37": "RSA"
            },
            paysEmetteur: countryCodes,
            fabricant: {
                "ORG-100001699": "AstraZeneca AB",
                "ORG-100030215": "Biontech Manufacturing GmbH",
                "ORG-100001417": "Janssen-Cilag International",
                "ORG-100031184": "Moderna Biotech Spain S.L.",
                "ORG-100006270": "Curevac AG",
                "ORG-100013793": "CanSino Biologics",
                "ORG-100020693": "China Sinopharm International Corp. - Beijing location",
                "ORG-100010771": "Sinopharm Weiqida Europe Pharmaceutical s.r.o. - Prague location",
                "ORG-100024420": "Sinopharm Zhijun (Shenzhen) Pharmaceutical Co. Ltd. - Shenzhen location",
                "ORG-100032020": "Novavax CZ a.s.",
                "Gamaleya-Research-Institute": "Gamaleya Research Institute",
                "Vector-Institute": "Vector Institute",
                "Sinovac-Biotech": "Sinovac Biotech",
                "Bharat-Biotech": "Bharat Biotech",
                "ORG-100001981": "Serum Institute Of India Private Limited",
                "Fiocruz": "Fiocruz",
                "ORG-100007893": "R-Pharm CJSC",
                "Chumakov-Federal-Scientific-Center": "Chumakov Federal Scientific Center for Research and Development of Immune-and-Biological Products",
                "ORG-100023050": "Gulf Pharmaceutical Industries",
                "CIGB": "Center for Genetic Engineering and Biotechnology",
                "Sinopharm-WIBP": "Sinopharm - Wuhan Institute of Biological Products",
                "ORG-100033914": "Medigen Vaccine Biologics Corporation",
                "ORG-100000788": "Sanofi Pasteur",
                "ORG-100036422": "Valneva France",

            },
            vaccin: {
                "EU/1/20/1528": "Comirnaty",
                "EU/1/20/1507": "Spikevax",
                "EU/1/21/1529": "Vaxzevria",
                "EU/1/20/1525": "COVID-19 Vaccine Janssen",
                "CVnCoV": "CVnCoV",
                "NVX-CoV2373": "NVX-CoV2373 (deprecated)",
                "Sputnik-V": "Sputnik-V",
                "Convidecia": "Convidecia",
                "EpiVacCorona": "EpiVacCorona",
                "BBIBP-CorV": "BBIBP-CorV",
                "Inactivated-SARS-CoV-2-Vero-Cell": "Inactivated SARS-CoV-2 (Vero Cell) (deprecated)",
                "CoronaVac": "CoronaVac",
                "Covaxin": "Covaxin (also known as BBV152 A, B, C)",
                "Covishield": "Covishield (ChAdOx1_nCoV-19)",
                "Covid-19-recombinant": "Covid-19 (recombinant)",
                "R-COVI": "R-COVI",
                "CoviVac": "CoviVac",
                "Sputnik-Light": "Sputnik Light",
                "Hayat-Vax": "Hayat-Vax",
                "Abdala": "Abdala",
                "WIBP-CorV": "WIBP-CorV",
                "MVC-COV1901": "MVC COVID-19 vaccine",
                "EU/1/21/1618": "Nuvaxovid",
                "Covovax": "Covovax",
                "Vidprevtyn": "Vidprevtyn",
                "VLA2001": "VLA2001",
                "EpiVacCorona-N": "EpiVacCorona-N",
                "Sputnik-M": "Sputnik M"
            },
            maladie: {
                "840539006": "COVID-19"
            },
            typeVaccin: {
                "1119349007": "SARS-CoV-2 mRNA vaccine",
                  "1119305005": "SARS-CoV-2 antigen vaccine",
                  "J07BX03": "covid-19 vaccines"
            }
        },
        itemsShort: [
            {
                p: "Date du pass sanitaire : ",
                value: {
                    type: "input",
                    id: "DatePass",
                    inputType: "text",
                    value: ""
                }
            },
            {
                p: "Nom & Prénom : ",
                value: {
                    type: "input",
                    id: "NomPrenomPass",
                    inputType: "text",
                    value: ""
                }
            },
            {
                p: "Validité : ",
                value: {
                    type: "img",
                    id: "validePass",
                    inputType: "text",
                    value: "En attente de données."
                }
            }
        ],
        itemsSteps: [
            {
                legend: "Préfixe",
                explication: "Le préfix 'HC1:' permet de déterminer la version du pass (Health Certificate 1), mais n'est pas utile dans la suite des transformations. Il est donc ignoré.",
                type: "div",
                divId: "divPrefix"
            },
            {
                legend: "Données au format base45",
                explication: "Les données sont encodées en base45. La base45 est une norme de codage compact proposée pour encoder des données avec 45 caractères. Le codage base45 consiste à écrire les données en base45 et utiliser la liste de symboles suivante 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./: qui correpond aux 45 caractères utilisables dans un QR-code (<a href='https://datatracker.ietf.org/doc/draft-faltstrom-base45/'>En savoir plus</a>)",
                type: "div",
                divId: "divB45"
            },
            {
                legend: "Données au format zlib-deflate",
                explication: "Les données sont compressées avec la bibliotèque Zlib au format deflate, qui est un format de compression de données sans perte. (<a href='https://datatracker.ietf.org/doc/html/rfc1951'>En savoir plus</a>)",
                type: "div",
                divId: "divZlib"
            },
            {
                legend: "Données au format cbor",
                explication: "CBOR (Concise Binary Object Representation en anglais) est un format d'échange de données informatiques pouvant être utilisé pour le stockage ou le transfert de données. C'est un format binaire de sérialisation de données dont les types sont inspirés du JSON, permettant de représenter des structures de données simples et des tableaux associatifs. Ici les différents champs suivant sont stockés dans une structure CBOR. (<a href='https://datatracker.ietf.org/doc/html/rfc7049'>En savoir plus</a>)",
                type: "div",
                divId: "divCbor"
            },
            {
                legend: "Données en clair",
                explication: "Les données ici, correspondent aux différents champs disponibles sur votre pass sanitaire. Le champ authId est la valeur calculée depuis le champ 4 du header et n'est en réalité pas présent et ne sert que pour notre outil de scan.",
                type: "textarea",
                divId: "divClair"
            }
        ],
        itemsTable: [
            {
                id: "trHead",
                tds: [
                    { id: "trHeadLblTDD", text: "Types de données" },
                    { id: "trHeadLblLue", text: "Donnée lue" },
                    { id: "trHeadLblExprimee", text: "Donnée exprimée" },
                    { id: "trHeadLblExpl", text: "Explication" }
                ]
            },
            {
                id: "Algo",
                tds: [
                    { id: "AlgoLbl", text: "Algorithme utilisé" },
                    { id: "AlgoBrut", text: "" },
                    { id: "AlgoClair", text: "" },
                    { id: "AlgoExplication", text: "Algorithme ayant servi à la signature des données. " }
                ]
            },
            {
                id: "AuthId",
                tds: [
                    { id: "AuthIdLbl", text: "Identifiant de l'autorité de certification" },
                    { id: "AuthIdBrut", text: "" },
                    { id: "AuthIdClair", text: "" },
                    { id: "AuthIdExplication", text: "Identifiant de l'autorité ayant signé les données. Permet de savoir quel organisme retrouvé dans l'annuaire, pour utiliser sa clé publique et ainsi vérifier la signature." }
                ]
            },
            {
                id: "DateExpir",
                tds: [
                    { id: "DateExpirLbl", text: "Date d'expiration" },
                    { id: "DateExpirBrut", text: "" },
                    { id: "DateExpirClair", text: "" },
                    { id: "DateExpirExplication", text: "Date à laquelle le pass ne sera plus valide. La valeur lue correspond au timestamp. Autrement-t dit, c'est le nombre de secondes entre le \"1er janvier 1970 à 00:00:00\"  et la date codée. Pour retrouver la date codé à partir du timestamp, il suffit de transformer ce dernier en jour/mois/années ainsi que heure:minute:seconde et de l'ajouter à la date du 1er janvier 1970 à 00:00:00.  " }
                ]
            },
            {
                id: "DateEmis",
                tds: [
                    { id: "DateEmisLbl", text: "Date d'émission" },
                    { id: "DateEmisBrut", text: "" },
                    { id: "DateEmisClair", text: "" },
                    { id: "DateEmisExplication", text: "Date à laquelle le pass a été émis. La valeur lue correspond au timestamp. Autrement-t dit, c'est le nombre de secondes entre le \"1er janvier 1970 à 00:00:00\"  et la date codée. Pour retrouver la date codé à partir du timestamp, il suffit de transformer ce dernier en jour/mois/années ainsi que heure:minute:seconde et de l'ajouter à la date du 1er janvier 1970 à 00:00:00.  " }
                ]
            },
            {
                id: "IDUnique",
                tds: [
                    { id: "IDUniqueLbl", text: "Identifiant unique" },
                    { id: "IDUniqueBrut", text: "" },
                    { id: "IDUniqueClair", text: "" },
                    { id: "IDUniqueExplication", text: "Identifiant unique pour chaque pass européen." }
                ]
            },
            {
                id: "PaysEmetteur",
                tds: [
                    { id: "PaysEmetteurLbl", text: "Pays émetteur" },
                    { id: "PaysEmetteurBrut", text: "" },
                    { id: "PaysEmetteurClair", text: "" },
                    { id: "PaysEmetteurExplication", text: "Pays ayant émis le pass européen. Pays sous format iso-3166." }
                ]
            },
            {
                id: "NumDose",
                tds: [
                    { id: "NumDoseLbl", text: "Numéro de la dose" },
                    { id: "NumDoseBrut", text: "" },
                    { id: "NumDoseClair", text: "" },
                    { id: "NumDoseExplication", text: "" }
                ]
            },
            {
                id: "DateVaccin",
                tds: [
                    { id: "DateVaccinLbl", text: "Date du vaccin" },
                    { id: "DateVaccinBrut", text: "" },
                    { id: "DateVaccinClair", text: "" },
                    { id: "DateVaccinExplication", text: "Date de la dernière dose de vaccination." },
                ]
            },
            {
                id: "Issuer",
                tds: [
                    { id: "IssuerLbl", text: "Organisme délivrant le pass" },
                    { id: "IssuerBrut", text: "" },
                    { id: "IssuerClair", text: "" },
                    { id: "IssuerExplication", text: "" }
                ]
            },
            {
                id: "Fabricant",
                tds: [
                    { id: "FabricantLbl", text: "Fabricant du vaccin" },
                    { id: "FabricantBrut", text: "" },
                    { id: "FabricantClair", text: "" },
                    { id: "FabricantExplication", text: "" }
                ]
            },
            {
                id: "Vaccin",
                tds: [
                    { id: "VaccinLbl", text: "Nom du vaccin" },
                    { id: "VaccinBrut", text: "" },
                    { id: "VaccinClair", text: "" },
                    { id: "VaccinExplication", text: "" }
                ]
            },
            {
                id: "TotalDose",
                tds: [
                    { id: "TotalDoseLbl", text: "Nombre total de doses" },
                    { id: "TotalDoseBrut", text: "" },
                    { id: "TotalDoseClair", text: "" },
                    { id: "TotalDoseExplication", text: "" }
                ]
            },
            {
                id: "Maladie",
                tds: [
                    { id: "MaladieLbl", text: "Maladie ciblée" },
                    { id: "MaladieBrut", text: "" },
                    { id: "MaladieClair", text: "" },
                    { id: "MaladieExplication", text: "" }
                ]
            },
            {
                id: "TypeVacc",
                tds: [
                    { id: "TypeVaccLbl", text: "Type de vaccin" },
                    { id: "TypeVaccBrut", text: "" },
                    { id: "TypeVaccClair", text: "" },
                    { id: "TypeVaccExplication", text: "" }
                ]
            },
            {
                id: "DateNaiss",
                tds: [
                    { id: "DateNaissLbl", text: "Date de naissance" },
                    { id: "DateNaissBrut", text: "" },
                    { id: "DateNaissClair", text: "" },
                    { id: "DateNaissExplication", text: "" }
                ]
            },
            {
                id: "Nom",
                tds: [
                    { id: "NomLbl", text: "Nom" },
                    { id: "NomBrut", text: "" },
                    { id: "NomClair", text: "" },
                    { id: "NomExplication", text: "" }
                ]
            },
            {
                id: "Prenom",
                tds: [
                    { id: "PrenomLbl", text: "Prénom" },
                    { id: "PrenomBrut", text: "" },
                    { id: "PrenomClair", text: "" },
                    { id: "PrenomExplication", text: "" }
                ]
            },
            {
                id: "NomStd",
                tds: [
                    { id: "NomStdLbl", text: "Nom standardisé" },
                    { id: "NomStdBrut", text: "" },
                    { id: "NomStdClair", text: "" },
                    { id: "NomStdExplication", text: "" }
                ]
            },
            {
                id: "PrenomStd",
                tds: [
                    { id: "PrenomStdLbl", text: "Prénom standardisé" },
                    { id: "PrenomStdBrut", text: "" },
                    { id: "PrenomStdClair", text: "" },
                    { id: "PrenomStdExplication", text: "" }
                ]
            },
            {
                id: "Signature",
                tds: [
                    { id: "SignatureLbl", text: "Signature" },
                    { id: "SignatureBrut", text: "" },
                    { id: "SignatureClair", text: "" },
                    { id: "SignatureExplication", text: "" }
                ]
            }
        ],
        validation: [
            {
                id: "validSignDetail",
                desc: "Authenticité des données : "
            },
            {
                id: "validBlacklistDetail",
                desc: "Non reconnu comme frauduleux par l'application TousAntiCovid Verif : "
            },
            {
                id: "validNbDosesDetail",
                desc: "Conditions sur les données (Nb doses) : "
            }
        ],
        regles: [
            {
                id: "regleNbDoses",
                desc: "Nombre de doses nécessaire : ",
                defaultValue : 3,
                fieldType : "number"
            },
            {
                id: "regleCheckBl",
                desc: "Prendre en compte la blacklist : ",
                defaultValue : true,
                fieldType : "checkbox"
            }
        ]
    },
    "2ddoc": {
        values: {
            "B5": countryCodes,
            "B6": {
                "M": "Homme",
                "F": "Femme",
                "X": "Autre"
            },
            "B9": countryCodes,
            "BA": {
                0: "aucune",
                1: "Passable",
                2: "Assez Bien",
                3: "Bien",
                4: "Très Bien",
                5: "Très Honorable",
                6: "Félicitations du jury"
            },
            "BD": {
                4: "Bac",
                5: "BTS/DUT",
                6: "Licence",
                7: "Master",
                8: "Doctorat"
            },
            "BG": {
                "BR": "Brevet des Collèges",
                "CA": "Certificat d'Aptitude Professionnelle (CAP)",
                "BE": "Brevet d'Etudes Professionnelles (BEP)",
                "BA": "Baccalauréat Général",
                "BP": "Baccalauréat Professionnel",
                "BS": "Baccalauréat Technologique",
                "BT": "Brevet Technicien Supérieur (BTS)",
                "DU": "Diplôme Universitaire de Technologie (DUT)",
                "LC": "Licence",
                "LP": "Licence Professionnelle",
                "DE": "Diplôme Européen d'Etudes Supérieures (DEES)",
                "MA": "Master",
                "MB": "Maîtrise en Administration des Affaires (MBA)",
                "IN": "Diplôme d'Ingénieur",
                "DR": "Doctorat"
            }
        },
        itemsShort: [
            {
                p: "Date du document : ",
                value: {
                    type: "input",
                    id: "DateDoc",
                    inputType: "text",
                    value: ""
                }
            },
            {
                p: "Nom & Prénom : ",
                value: {
                    type: "input",
                    id: "NomPrenomDoc",
                    inputType: "text",
                    value: ""
                }
            },
            {
                p: "Niveau du diplôme : ",
                value: {
                    type: "input",
                    id: "DiplomeLevelDoc",
                    inputType: "text",
                    value: ""
                }
            },
            {
                p: "Validité : ",
                value: {
                    type: "img",
                    id: "valideDoc",
                    inputType: "text",
                    value: "En attente de données."
                }
            }
        ],
        itemsTable: [
            {
                id: "trHead",
                tds: [
                    { id: "trHeadLblTDD", text: "Types de données" },
                    { id: "trHeadLblLue", text: "Donnée lue" },
                    { id: "trHeadLblExprimee", text: "Donnée exprimée" },
                    { id: "trHeadLblExpl", text: "Explication" }
                ]
            },
            {
                id: "Marqueur",
                tds: [
                    { id: "MarqueurLbl", text: "Marqueur d'identification" },
                    { id: "MarqueurBrut", text: "" },
                    { id: "MarqueurClair", text: "" },
                    { id: "MarqueurExplication", text: "" }
                ]
            },
            {
                id: "Version",
                tds: [
                    { id: "VersionLbl", text: "Version du protocole" },
                    { id: "VersionBrut", text: "" },
                    { id: "VersionClair", text: "" },
                    { id: "VersionExplication", text: "Version du protocole 2D-doc utiliser." }
                ]
            },
            {
                id: "IDAuthCert",
                tds: [
                    { id: "IDAuthCertLbl", text: "ID de l'autorité de certification" },
                    { id: "IDAuthCertBrut", text: "" },
                    { id: "IDAuthCertClair", text: "" },
                    { id: "IDAuthCertExplication", text: "" }
                ]
            },
            {
                id: "IDCert",
                tds: [
                    { id: "IDCertLbl", text: "ID du certificat" },
                    { id: "IDCertBrut", text: "" },
                    { id: "IDCertClair", text: "" },
                    { id: "IDCertExplication", text: "" }
                ]
            },
            {
                id: "DateEmi",
                tds: [
                    { id: "DateEmiLbl", text: "Date d'émission" },
                    { id: "DateEmiBrut", text: "" },
                    { id: "DateEmiClair", text: "" },
                    { id: "DateEmiExplication", text: "" }
                ]
            },
            {
                id: "DateSig",
                tds: [
                    { id: "DateSigLbl", text: "Date d'émission" },
                    { id: "DateSigBrut", text: "" },
                    { id: "DateSigClair", text: "" },
                    { id: "DateSigExplication", text: "" }
                ]
            },
            {
                id: "TypeDoc",
                tds: [
                    { id: "TypeDocLbl", text: "Type de document" },
                    { id: "TypeDocBrut", text: "" },
                    { id: "TypeDocClair", text: "" },
                    { id: "TypeDocExplication", text: "Type de document 2D-Doc présent. Ce champ permet de déterminer (avec le périmètre) quels autres champs sont contenus dans le 2D-doc." },
                ]
            },
            {
                id: "Perimetre",
                tds: [
                    { id: "PerimetreLbl", text: "Périmètre du document" },
                    { id: "PerimetreBrut", text: "" },
                    { id: "PerimetreClair", text: "" },
                    { id: "PerimetreExplication", text: "Périmètre du document. Ce champ permet de déterminer (avec le type de document) quels autres champs sont contenus dans le 2D-doc. Pour l'instant ce paramètre vaut toujours 01." },
                ]
            },
            {
                id: "PaysEmetteur",
                tds: [
                    { id: "PaysEmetteurLbl", text: "Pays Emetteur" },
                    { id: "PaysEmetteurBrut", text: "" },
                    { id: "PaysEmetteurClair", text: "" },
                    { id: "PaysEmetteurExplication", text: "Pays ayant émis le document. Le pays est stocké sous format ISO 3166 dans le 2D-doc." },
                ]
            },
            {
                id: "Prenoms",
                tds: [
                    { id: "PrenomsLbl", text: "Prénom" },
                    { id: "PrenomsBrut", text: "" },
                    { id: "PrenomsClair", text: "" },
                    { id: "PrenomsExplication", text: "" }
                ]
            },
            {
                id: "Prenom",
                tds: [
                    { id: "PrenomLbl", text: "Prénom" },
                    { id: "PrenomBrut", text: "" },
                    { id: "PrenomClair", text: "" },
                    { id: "PrenomExplication", text: "" }
                ]
            },
            {
                id: "Nom",
                tds: [
                    { id: "NomLbl", text: "Nom" },
                    { id: "NomBrut", text: "" },
                    { id: "NomClair", text: "" },
                    { id: "NomExplication", text: "" }
                ]
            },
            {
                id: "NomUsage",
                tds: [
                    { id: "NomUsageLbl", text: "Nom d'usage" },
                    { id: "NomUsageBrut", text: "" },
                    { id: "NomUsageClair", text: "" },
                    { id: "NomUsageExplication", text: "" }
                ]
            },
            {
                id: "NomEpoux-se",
                tds: [
                    { id: "NomEpoux-seLbl", text: "Nom d'époux / épouse" },
                    { id: "NomEpoux-seBrut", text: "" },
                    { id: "NomEpoux-seClair", text: "" },
                    { id: "NomEpoux-seExplication", text: "" }
                ]
            },
            {
                id: "Nationalite",
                tds: [
                    { id: "NationaliteLbl", text: "Nationalité" },
                    { id: "NationaliteBrut", text: "" },
                    { id: "NationaliteClair", text: "" },
                    { id: "NationaliteExplication", text: "" }
                ]
            },
            {
                id: "Genre",
                tds: [
                    { id: "GenreLbl", text: "Genre" },
                    { id: "GenreBrut", text: "" },
                    { id: "GenreClair", text: "" },
                    { id: "GenreExplication", text: "Genre de l'étudiant : F pour femme, M pour homme, X pour autre." }
                ]
            },
            {
                id: "DateNaiss",
                tds: [
                    { id: "DateNaissLbl", text: "Date de naissance" },
                    { id: "DateNaissBrut", text: "" },
                    { id: "DateNaissClair", text: "" },
                    { id: "DateNaissExplication", text: "" }
                ]
            },
            {
                id: "LieuNaiss",
                tds: [
                    { id: "LieuNaissLbl", text: "Lieu de Naissance" },
                    { id: "LieuNaissBrut", text: "" },
                    { id: "LieuNaissClair", text: "" },
                    { id: "LieuNaissExplication", text: "" }
                ]
            },
            {
                id: "PaysNaiss",
                tds: [
                    { id: "PaysNaissLbl", text: "Pays de Naissance" },
                    { id: "PaysNaissBrut", text: "" },
                    { id: "PaysNaissClair", text: "" },
                    { id: "PaysNaissExplication", text: "Le pays est stocké sous format ISO 3166 dans le 2D-doc." }
                ]
            },
            {
                id: "MentionObtenue",
                tds: [
                    { id: "MentionObtenueLbl", text: "Mention obtenue" },
                    { id: "MentionObtenueBrut", text: "" },
                    { id: "MentionObtenueClair", text: "" },
                    { id: "MentionObtenueExplication", text: "" }
                ]
            },
            {
                id: "NumEtu",
                tds: [
                    { id: "NumEtuLbl", text: "Numéro étudiant" },
                    { id: "NumEtuBrut", text: "" },
                    { id: "NumEtuClair", text: "" },
                    { id: "NumEtuExplication", text: "" }
                ]
            },
            {
                id: "NumDiplome",
                tds: [
                    { id: "NumDiplomeLbl", text: "Numéro du diplôme" },
                    { id: "NumDiplomeBrut", text: "" },
                    { id: "NumDiplomeClair", text: "" },
                    { id: "NumDiplomeExplication", text: "" }
                ]
            },
            {
                id: "DiplomeLevel",
                tds: [
                    { id: "DiplomeLevelLbl", text: "Niveau du diplôme" },
                    { id: "DiplomeLevelBrut", text: "" },
                    { id: "DiplomeLevelClair", text: "" },
                    { id: "DiplomeLevelExplication", text: "Le niveau du diplôme est stocké sous le format de classification de la CEC. Chaque diplôme correspond à un numéro." }
                ]
            },
            {
                id: "Credits",
                tds: [
                    { id: "CreditLbl", text: "Nombre de crédits ECTS obtenus" },
                    { id: "CreditsBrut", text: "" },
                    { id: "CreditsClair", text: "" },
                    { id: "CreditsExplication", text: "" }
                ]
            },
            {
                id: "AnneeUniv",
                tds: [
                    { id: "AnneeUnivLbl", text: "Année universitaire" },
                    { id: "AnneeUnivBrut", text: "" },
                    { id: "AnneeUnivClair", text: "" },
                    { id: "AnneeUnivExplication", text: "Année universitaire stocker en hexadécimal(base 16)." }
                ]
            },
            {
                id: "DiplomeType",
                tds: [
                    { id: "DiplomeTypeLbl", text: "Type du diplôme" },
                    { id: "DiplomeTypeBrut", text: "" },
                    { id: "DiplomeTypeClair", text: "" },
                    { id: "DiplomeTypeExplication", text: "Type de diplôme : bac générale, bts, dut ..." }
                ]
            },
            {
                id: "Domaine",
                tds: [
                    { id: "DomaineLbl", text: "Domaine d'étude" },
                    { id: "DomaineBrut", text: "" },
                    { id: "DomaineClair", text: "" },
                    { id: "DomaineExplication", text: "Domaine d'étude." }
                ]
            },
            {
                id: "Mention",
                tds: [
                    { id: "MentionLbl", text: "Mention" },
                    { id: "MentionBrut", text: "" },
                    { id: "MentionClair", text: "" },
                    { id: "MentionExplication", text: "Mention du diplôme." }
                ]
            },
            {
                id: "Specialite",
                tds: [
                    { id: "SpecialiteLbl", text: "Spécialité" },
                    { id: "SpecialiteBrut", text: "" },
                    { id: "SpecialiteClair", text: "" },
                    { id: "SpecialiteExplication", text: "Spécialité de l'étudiant." }
                ]
            },
            {
                id: "NumCVE",
                tds: [
                    { id: "NumCVELbl", text: "Numéro attestation CVE" },
                    { id: "NumCVEBrut", text: "" },
                    { id: "NumCVEClair", text: "" },
                    { id: "NumCVEExplication", text: "" }
                ]
            },
            {
                id: "Signature",
                tds: [
                    { id: "SignatureLbl", text: "Signature" },
                    { id: "SignatureBrut", text: "" },
                    { id: "SignatureClair", text: "" },
                    { id: "SignatureExplication", text: "" }
                ]
            }
        ],
        validation: [
            {
                id: "validSignDetail",
                desc: "Authenticité des données : "
            },
            {
                id: "validIsBlacklistDetail",
                desc: "La signature n'est pas présente dans la blacklist : "
            },
            {
                id: "validSignBlOKDetail",
                desc: "Les données de la blacklist sont authentiques : "
            }
        ]
    }
}