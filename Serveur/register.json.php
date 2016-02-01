<?php
session_start();
include('connect.inc.php');
include('errorManager.inc.php');
// vérification des données en entrée
if (!(isset($_POST['login']) || empty($_POST['login'])))
  dieErrorJson('login absent');
if (!(isset($_POST['password']) || empty($_POST['password'])))
  dieErrorJson('mot de passe absent');
if (!(isset($_POST['email']) || empty($_POST['email'])))
  dieErrorJson('adresse email absente');

// Récupération des données contenues dans le champ inscription
$login=$_POST["login"];
$loginSQL=mysqli_real_escape_string($link, $login);
$email=mysqli_real_escape_string($link,$_POST["email"]);
$password = mysqli_real_escape_string($link, md5($login.$_POST["password"]));
// Pour des raisons de sécurité, le mdp est mélangé au login

//On récupère le nombre de lignes qui contiennent le login entré par le joueur et le email entré par le joueur
$q = "SELECT count(login) as nb_login FROM joueur WHERE login='$loginSQL'";
$r = mysqli_query($link, $q) or dieErrorJson(mysqli_error($link));
$s = mysqli_fetch_object( $r );
if (isset($s->nb_login) && $s->nb_login > 0)
  dieErrorJson('ce login déjà pris');
// Si le nombre de lignes > 0, c'est que le login (resp. le email) est pris par un joueur
$q = "SELECT count(email) as nb_email FROM joueur WHERE email='$email'";
$r = mysqli_query($link, $q) or dieErrorJson(mysqli_error($link));
$s = mysqli_fetch_object( $r );
if (isset($s->nb_login) && $s->nb_login > 0)
  dieErrorJson('cette adresse email est déjà prise');

// A partir d'ici, toutes les sources d'erreur sont nettoyées
// On peut maitenant créer un compte au joueur
$q = "INSERT INTO joueur ( login, password, email) VALUES( '$loginSQL', '$password', '$email')";
mysqli_query($link, $q);
$data=array();
$data['login']=$login;
$data['encours']=null;
// Renvoi du login en json

$_SESSION['login']=$login ;

checkDieErrorJson();
// include('../include/parties.inc.php');
?>
