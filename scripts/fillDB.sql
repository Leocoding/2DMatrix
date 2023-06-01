-- Compte et Organisme de Test --

USE 2DMATRIX_DATABASE;

INSERT INTO ORGANIZATION (id, organization_name, organization_country, organization_city, creation_date, organization_pkey) 
VALUES ('2DMX','2DMatrix', 'FR', 'Paris', '2022-04-01', 'MHcCAQEEINbI/xP+yGOgp79v7qibvYs03x+cSIaiKzpOhJsScwDDoAoGCCqGSM49AwEHoUQDQgAEqY8NfM1igIiTvsTUNuedGDSh1uAB1w8cTNzNnZ4v4in3JAUU6N3AypjQx0QMnMSShJoPvac/w5L02grgf4TCPA==');

INSERT INTO USER_ACCOUNT(id, organization_id, first_name, last_name, creation_date, username_account, password_account, isAdmin)
VALUES(1, '2DMX', 'TestFirstname', 'TestLastname', '2022-04-01', 'test', SHA2('pass', 256), false);

INSERT INTO JSON_KEY_DATA(json_pkey) VALUES ('MHcCAQEEIAy3hslOZk48MgM6YqJ5CEPZMoqVrWLy016mavuT7vpFoAoGCCqGSM49AwEHoUQDQgAEoL+jy/sxHqnb8NXKkE/brgkMCa/6VBEFGc3LJcUxtFzHTiOzGMu7V60dUEYXWcArxwWf52aqpLplIW1Xma+zag==');
