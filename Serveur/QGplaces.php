<?php
try {

    require 'connexion.php';
    if (isset($_POST["equipe"]) && isset($_POST["QGlon"]) && isset($_POST["QGlat"]))
    {
        $stmt = $db->prepare('INSERT INTO qg (capa,equipe,qg_bat,loc) VALUES (1000,:equipe,true,POINT(:x,:y))');
        $stmt->bindParam(':equipe', $_POST["equipe"]);
        $stmt->bindParam(':x', $_POST["QGlon"]);
        $stmt->bindParam(':y', $_POST["QGlat"]);
        $stmt->execute();
    }



    // ---- Compteur de joueurs ----
    $stmt = $db->prepare('UPDATE sync SET d_sync=d_sync+1');
    $stmt->execute();
// ---- Recupere le nombre de joueurs en attente ----
    $stmt = $db->prepare('SELECT d_sync FROM sync');
    $stmt->execute();
    $rows = $stmt->fetch(PDO::FETCH_ASSOC);
   
// ---- Attente des 6 joueurs ----
    /*
    while ($rows['d_sync'] < 6) {
        sleep(5);
        $stmt = $db->prepare('SELECT d_sync FROM sync');
        $stmt->execute();
        $rows = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    */
// ---- Envoi de l'identifiant ----
    echo json_encode("chooseYourBatteryLocation");
// ---- Remise a zero du compteur de joueurs ----
    sleep(6);
    $stmt = $db->prepare('UPDATE sync SET d_sync=0');
    $stmt->execute();



} catch (Exception $e) {
    echo "<h1 align='center'>Error about the sync!</h1>";
    echo $e;
}



?>