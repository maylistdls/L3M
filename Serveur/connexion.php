<?php
try{
$db = new PDO("pgsql:host=postgresql-maxoutigrou62.alwaysdata.net;dbname=maxoutigrou62_postgres;", 'maxoutigrou62', 'Panthere1');
} catch (PDOException $e){
  print "Error!: ".$e->getMessage(). "<br/>";
  die();
}
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
?>
