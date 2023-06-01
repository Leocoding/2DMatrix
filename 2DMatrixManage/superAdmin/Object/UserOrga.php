<?php 

class UserOrga {

    private $id;
    private $organizationID;
    private $firstName;
    private $lastName;
    private $creationDate;
    private $username;
    private $password;

    public function __construct($id, $organizationID, $firstName, $lastName, $creation_date, $username, $password) {
        $this->id = $id;
        $this->organizationID = strtoupper($organizationID);
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->creationDate = $creation_date;
        $this->username = $username;
        $this->password = $password;
    }

    public function getID() {
        return $this->id;
    }

    public function getOrganizationID() {
        return $this->organizationID;
    }

    public function getFirstName() {
        return $this->firstName;
    }

    public function getLastName() {
        return $this->lastName;
    }

    public function getDate() {
        return $this->creationDate;
    }

    public function getUsername() {
        return $this->username;
    }

    public function getPassword() {
        return $this->password;
    }
}

?>