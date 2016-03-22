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

// ---- Attente des 6 joueurs ----
    
    while ($rows['d_sync'] < 6) {
        sleep(5);
        $stmt = $db->prepare('SELECT d_sync FROM sync');
        $stmt->execute();
        $rows = $stmt->fetch(PDO::FETCH_ASSOC);
    }
// ---- Envoi de l'identifiant ----
    echo $id;
// ---- Remise a zero du compteur de joueurs ----
    sleep(6);
    $stmt = $db->prepare('UPDATE sync SET d_sync=0');
    $stmt->execute();
} catch (Exception $e) {
    echo "<h1 align='center'>Error about the sync!</h1>";
    echo $e;
}
