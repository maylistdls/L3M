<?php
try{
$dbmysql = new PDO("mysql:host=mysql-maxoutigrou62.alwaysdata.net;dbname=maxoutigrou62_auth;", '118258_maxime', 'Panthere1');
} catch (PDOException $e){
  print "Error!: ".$e->getMessage(). "<br/>";
  die();
}
$dbmysql->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$dbmysql->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
?>
