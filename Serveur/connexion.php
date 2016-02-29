<?php
$db = new PDO('pgsql:host=postgresql-maxoutigrou62.alwaysdata.net;dbname=maxoutigrou62_postgres;charset=utf8', 'maxoutigrou62', 'Panthere1');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

/*
<?php
$link = @pg_connect("host= dbname= user= password=");
if (!$link) dieErrorJson('Erreur de connexion');
?>*/
