<?php
try {
    require '../../../Serveur/connexion.php';
    /*
    if (isset($_POST["joueur"]) && isset($_POST["Batterielon"]) && isset($_POST["Batterielat"]))
    {
        // Stockage de la localisation de la batterie dans la base de donnees
    }
    */

    $tmp = time();
// ---- Compteur de joueurs et mise en place du temps pour la synchronisation du jeu ----
    $stmt = $db->prepare('UPDATE sync SET s_sync=s_sync+1, r_sync=:temps');
    $stmt->bindParam(':temps',$tmp);
    $stmt->execute();
// ---- Recupere le nombre de joueurs en attente ----
    $stmt = $db->prepare('SELECT s_sync FROM sync');
    $stmt->execute();
    $rows = $stmt->fetch(PDO::FETCH_ASSOC);
// ---- Attente des 6 joueurs ----
    while ($rows['s_sync']<6) {
      sleep(5);
      $stmt = $db->prepare('SELECT s_sync FROM sync');
      $stmt->execute();
      $rows = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    sleep(6);
// ---- Selection du temps pour le debut de partie (ici 30 secondes plus tard) ----
    $stmt = $db->prepare('SELECT r_sync FROM sync');
    $stmt->execute();
    $tps = $stmt->fetch(PDO::FETCH_ASSOC);
    $tps=(int)$tps['r_sync']+30;
// ---- Remise a zero du compteur de joueurs ----
    $stmt = $db->prepare('UPDATE sync SET s_sync=0');
    $stmt->execute();
// ---- Selection des localisations, capa, type d'objet et equipe ----
    $stmt = $db->prepare('SELECT * FROM qg');
    $stmt->execute();
    $envoi = $stmt->fetch(PDO::FETCH_ASSOC);
// ---- Mise en forme et envoi des donnees ----
    $start=Array($envoi,$tps);
    echo json_encode($start);



} catch (Exception $e) {
    echo "<h1 align='center'>Error about the sync!</h1>";
    echo $e;
}



?>