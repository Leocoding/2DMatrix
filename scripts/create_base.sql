--
-- MySQL Script for DataBase of 2DMatrix Project
-- 

CREATE DATABASE IF NOT EXISTS 2DMATRIX_DATABASE;
USE 2DMATRIX_DATABASE;

DROP USER IF EXISTS 'your_user'@'your_host';

CREATE USER 'your_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON 2DMATRIX_DATABASE.* TO '2DMatrix'@'localhost';
FLUSH PRIVILEGES;

DROP TABLE IF EXISTS USER_ACCOUNT;
DROP TABLE IF EXISTS ORGANIZATION;

CREATE TABLE ORGANIZATION (
    id VARCHAR(4) NOT NULL,
    organization_name VARCHAR(60) NOT NULL,
    organization_country VARCHAR(30) NOT NULL,
    organization_city VARCHAR(30) NOT NULL,
    creation_date DATE,
    organization_pkey VARCHAR(256) NOT NULL,
    PRIMARY KEY (id));

CREATE TABLE USER_ACCOUNT (
    id INT NOT NULL AUTO_INCREMENT,
    organization_id VARCHAR(4) NOT NULL,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    creation_date DATE,
    username_account VARCHAR(30) NOT NULL,
    password_account VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_account FOREIGN KEY
    USER_ACCOUNT(organization_id) REFERENCES
    ORGANIZATION(id));

CREATE TABLE JSON_KEY_DATA (
    json_pkey VARCHAR(256) NOT NULL,
    PRIMARY KEY (json_pkey)
);