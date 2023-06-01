<?php 
session_start();
session_unset();
session_destroy();
?>

<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Page de connexion</title>
  <link rel="stylesheet" type="text/css" href="index.css">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="footer.js"></script>
</head>
<body>
    <h1>Connexion au serveur de Gestion 2DMatrix</h1>
    <p>Si vous êtes un Administrateur ou Utilisateur appartenant à un organisme connectez-vous avec vos identifiants. Sinon merci de passer par l'interface de connexion par authentification forte.</p>
    <div id="loginContainer">
    <div class="login">
      <form action="/other/connexion.php" method="post">
        <?php 
          if(isset($_GET['infoMsg'])) {
            $msg = htmlspecialchars($_GET['infoMsg']);
            if($msg == "errorAuth") echo "<p class='errorlogin'>Mauvais identifiants</p>";
          }
          ?>
        <div id="inputArea">
        <div id="userDiv" class="fieldArea">
          <label>Utilisateur</label>
          <input name="username" type="text" placeholder="username">
        </div>
        <div id="passDiv" class="fieldArea">
          <label>Mot de passe</label>
          <input name="passwd" type="password" placeholder="password">
        </div>
          <input class="validation" value="Se connecter" type="submit" name='btnSubmit'>
        </div>
      </form>
    </div></div>
    <div id="StrongAuthLink">
      <a href="/2DMatrixManage/superAdmin/SuperAdminController.php">
        <img id="StrongAuthImg" src="img/certificate.png " alt="StrongAuth"/>
      </a>
    </div>
    
    <img id="close" src="img/close.png" alt="bouton fermeture" onclick="closeAllBox()">
    <div id="infoLegale" class="footBox">
        <fieldset>
            <legend>Informations légales</legend>
            <p>
                Projet réalisé par des étudiants de Master 1 Informatique branche sécurité à la demande de Mme. Bardet<br/>
                BELABDOUN Billal <br/>
                DURAND Alan <br/>
                FONTENIL Adrien <br/>
                MENUDE Leo<br/>

            </p>
            <img src="img/team.jpg" alt="team">
        </fieldset>
    </div>
    <div id="infoProj" class="footBox">
        <fieldset>
            <legend>Informations sur le projet</legend>
            <p>Notre projet se déroule dans le cadre de la matière applications informatique en première année de master informatique. Notre projet consisté à exploiter le protocole Français 2D-doc pour valider un diplôme. Pour cela nous devions créer un outil capable de lire des 2D-doc contenu dans un datamatrix et dans un second temps avoir un outil capable d'en générer. Enfin, du fait de la pandémie, nous avons ajouté à l'outil de scan la possibilité de lire et comprendre le pass sanitaire (resp. vaccinale) Européen.</p>
            <img src="img/team.jpg" alt="team">
        </fieldset>
    </div>
    <div id="fctProj" class="footBox">
        <fieldset>
            <legend>Fonctionnement Projet</legend>
            <p>Le projet est constitué de 3 outils : tout d'abord vous avez l'outil 2DMatrix-Scan qui permet d'authentifier des 2d-doc (créer par l'outil create) et pass sanitaires. À la manière de TousAntiCovid-verif mais en vous apportant plus de détails et de possibilité d'actions que ce dernier. Ensuite vous avez 2DMatrix-Create permettant de créer des 2d-doc authentifiant des diplômes issue de l'enseignement supérieur. Et enfin il y a l'outil manage permettant de gérer les accès à l'outil create.<br/></p>
            <img src="img/team.jpg" alt="team">
        </fieldset>
    </div>
    <footer>
        <div id="footer1">
            <h3 onclick="displayInfolegale()">Informations légales</h3>
        </div>
        <div id="footer2" >
            <h3 onclick="displayInfoProj()">Information Projet</h3>
        </div>
        <div id="footer3">
            <h3 onclick="displayfctProj()">Fonctionnement Projet</h3>
        </div>
    </footer>
  </body>
</html>