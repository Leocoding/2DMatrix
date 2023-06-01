<?php

class Organization {

    private $organizationID;
    private $organizationName;
    private $country;
    private $province;
    private $certificate;
    private $creationDate;
    private $keypair;
    private $username;
    private $pkey;

    public function __construct($organizationID, $organizationName, $country, $province, $validTime, $date, $username) {
        
        // Path to OpenSSL config file
        $opensslcnf = "/etc/ssl/openssl.cnf";

        // If you want a new couple of KeyPair/Cert specify a positive valid time
        if ($validTime > 0) {
            
            // Get Master Cert and associated PKey
            $CA = file_get_contents("../../CA/certificate.pem");
            $CAPrivKey = file_get_contents("../../CA/private-key.pem");

            // Config KeyPair
            $config = array(
                "private_key_type" => OPENSSL_KEYTYPE_EC,
                "curve_name" => "prime256v1",
                "config" => $opensslcnf
            );
 
            // Generate KeyPair
            $keypair = openssl_pkey_new($config);

            // Test KeyPair Generation
            if (!$keypair) {
                echo "ERREUR GENERATION KEYPAIR";
                exit;
            }

            // Get PKey
            openssl_pkey_export($keypair, $pkey, null, array("config" => $opensslcnf));

            // Config Certificate Datas
            $dn = array(
                "countryName" => $country,
                "stateOrProvinceName" => $province,
                "organizationName" => $organizationName,
                "commonName" => $organizationID
            );

            // Option CSR
            $opt = array(
                "digest_alg" => "sha256", 
                "curve_name" => "prime256v1",
                "config" => $opensslcnf
            );
            // Generate a CSR (Certificate Signing Request)
            if (($csr = openssl_csr_new($dn, $keypair, $opt)) == false) {
                echo "ERROR GENERATION CRS";
                exit;
            }
            // Sign the CSR with our Master Authority
            if (($x509 = openssl_csr_sign($csr, $CA, $CAPrivKey, $validTime, array('digest_alg' => 'sha256', 'config' => $opensslcnf))) == false) {
                echo "ERROR GENERATION x509";
                exit;
            }
            // Assignment
            $this->pkey = $pkey;
            $this->keypair = $keypair;
            $this->certificate = $x509;
            // No nee²d to generate certificate ==>
        }
        // Assignment
        $this->username = $username;
        $this->country = $country;
        $this->province = $province;
        $this->organizationID = strtoupper($organizationID);
        $this->organizationName = $organizationName;
        $this->creationDate = $date;
    }

    public function getAdminUsername() {
        return $this->username;
    }

    public function getCountry() {
        return $this->country;
    }

    public function getProvince() {
        return $this->province;
    }

    public function getOrganizationID() {
        return $this->organizationID;
    }

    public function getOrganizationName() {
        return $this->organizationName;
    }

    public function getDate() {
        return $this->creationDate;
    }

    public function getKeyPair() {
        return $this->keypair;
    }

    // Get PKey without blank character or BEGIN/END 
    public function getPKey() {
        if ($this->pkey == NULL) {
            return NULL;
        }
        $strPkey = str_replace("-----BEGIN EC PRIVATE KEY-----", "", $this->pkey);
        $strPkey = str_replace("-----END EC PRIVATE KEY-----", "", $strPkey);
        $strPkey = str_replace(" ","", $strPkey);
        return $strPkey;
    }

    // Get Certificate without blank character or BEGIN/END 
    public function getCertificate() {
        if (openssl_x509_export($this->certificate, $res)) {
            $strCert = str_replace("-----BEGIN CERTIFICATE-----", "", $res);
            $strCert = str_replace("-----END CERTIFICATE-----", "", $strCert);
            $strCert = str_replace(" ","", $strCert);
            $strCert = str_replace("\n","", $strCert);
            return $strCert;
        }
    }
}

?>