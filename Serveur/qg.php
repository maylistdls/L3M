<?php

try {
    require 'connexion.php';
// ---- Compteur de joueurs ----
    $stmt = $db->prepare('UPDATE sync SET d_sync=d_sync+1');
    $stmt->execute();
// ---- Recupere le nombre de joueurs en attente ----
    $stmt = $db->prepare('SELECT d_sync FROM sync');
    $stmt->execute();
    $rows = $stmt->fetch(PDO::FETCH_ASSOC);
// ---- Identifiant dans le jeu (correspond à l'ordre d'arrivee) ----
    $id = $rows['d_sync'];
// ---- Initialise le numero de partie ----
    if ($id==1){
      $stmt = $db->prepare('UPDATE sync SET n_partie=n_partie+1');
      $stmt->execute();
    }
// ---- Attente des 6 joueurs ----
    while ($rows['d_sync'] < 6) {
        sleep(5);
        $stmt = $db->prepare('SELECT d_sync FROM sync');
        $stmt->execute();
        $rows = $stmt->fetch(PDO::FETCH_ASSOC);
    }
// ---- Selectionne le numero de partie ----
    $stmt = $db->prepare('SELECT n_partie FROM sync');
    $stmt->execute();
    $partie = $stmt->fetch(PDO::FETCH_ASSOC);
    $debut=Array($id,$partie);
// ---- Envoi de l'identifiant et du numero de partie ----
    echo $debut;
// ---- Remise a zero du compteur de joueurs ----
    sleep(6);
    $stmt = $db->prepare('UPDATE sync SET d_sync=0');
    $stmt->execute();
} catch (Exception $e) {
    echo "<h1 align='center'>Error about the sync!</h1>";
    echo $e;
}
