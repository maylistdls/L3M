<?php
session_start();
// mettre en UTF8;
include('connect.inc.php');
include('errorManager.inc.php');

/*	// En cas de déconnexion, on détruit la session
	if (isset($_GET['deconnect'])) {
		session_destroy();
		$_SESSION = array();
	}
*/

// sans paramètre, auth.json.php sert de déconnecteur
if ( isset($_SESSION['login']) && $_SESSION['login']!=''
    && (!isset($_POST['login']) || empty($_POST['login']))
    && (!isset($_POST['password']) || empty($_POST['password']))   ) {
  $_SESSION['login']='' ;
  die( json_encode(array("message" => "déconnexion OK")) ) ;
}

// vérification des données en entrée
if (!isset($_POST['login']) || empty($_POST['login']))
  dieErrorJson('login absent');
if (!isset($_POST['password']) || empty($_POST['password']))
  dieErrorJson('mot de passe absent');

// Vérification de la correspondance du login avec le mot de passe dans la base de données
$login=$_POST["login"];
$loginSQL=mysqli_real_escape_string($link,$login);
$password = mysqli_real_escape_string($link, md5($login.$_POST["password"]));
// Pour des raisons de sécurité, le mdp est mélangé au login. Voir register.json.php
$q = "SELECT login, password FROM joueur where login='$loginSQL' and password='$password' ";
$r = mysqli_query($link, $q);
if (mysqli_num_rows($r) != 1)
  dieErrorJson('erreur sur le mot de passe');

// à partir d'ici, le login et le mot de passe correspondent,
// On stocke le login en session
$_SESSION['login']=$login ;
$_SESSION['loginSQL']=$loginSQL ;


// on peut envoyer la liste des parties
// include('parties.inc.php');
header("Location: ../Client/map_google.php");
die();
?>
