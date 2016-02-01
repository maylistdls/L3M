<?php
session_start();
include('errorManager.inc.php');
include('connect.inc.php');
// vérification des données en entrée
if (!(isset($_POST['login']) || empty($_POST['login'])))
  dieErrorJson('login absent');
if (!(isset($_POST['password']) || empty($_POST['password'])))
  dieErrorJson('mot de passe absent');
if (!(isset($_POST['email']) || empty($_POST['email'])))
  dieErrorJson('adresse email absente');

// Récupération des données contenues dans le champ inscription
$login=mysqli_real_escape_string($link,$_POST["login"]);
$email=mysqli_real_escape_string($link,$_POST["email"]);
$password = mysqli_real_escape_string($link, md5($login.$_POST["password"]));
// Pour des raisons de sécurité, le mdp est mélangé au login. Voir register.json.php

//echo ($password . '<br>' . $login . '<br>' . $email  . '<br>' );

//On récupère le nombre de lignes qui contiennent le triplet (login, email, password)
$q = "SELECT login FROM joueur WHERE login='$login' AND password='$password'AND email='$email'";
$r = mysqli_query($link, $q) or dieErrorJson('problème connexion BD');
$s = mysqli_fetch_object( $r );
if (!isset($s->login) || $s->login!=$login)
  dieErrorJson('problème avec cet identifiant');
checkDieErrorJson();

// A partir d'ici, toutes les sources d'erreur sont nettoyées
// On peut soit désactiver le joueur, soit le supprimer. Pour le moment, on supprime.
$_SESSION['login']='' ;
$q = "DELETE FROM joueur WHERE login='$login'";
if (!mysqli_query($link, $q))
  dieErrorJson('erreur dans la suppression de $login');

mysqli_close($link);
die( json_encode(array("message" => "$login a été supprimé de la base")) );
?>
