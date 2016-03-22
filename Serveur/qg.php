<?php

try {
    require 'connexion.php';
    require 'connexionJoueur.php';
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
      $stmt = $dbmysql->prepare('UPDATE partie SET numeroPartie=numeroPartie+1');
      $stmt->execute();
    }

// ---- Attente des 6 joueurs ----
    
    while ($rows['d_sync'] < 6) {
        sleep(5);
        $stmt = $db->prepare('SELECT d_sync FROM sync');
        $stmt->execute();
        $rows = $stmt->fetch(PDO::FETCH_ASSOC);
    }
// ---- Recupere l'id de la partie ----
    $stmt = $dbmysql->prepare('SELECT numeroPartie FROM partie');
    $stmt->execute();
    $idpartie = $stmt->fetch(PDO::FETCH_ASSOC);
// ---- Chef d'equipe = 1 ou 2 ----
    if ($id==1 | $id==2){
      $chef=1;
    }
    else{
      $chef=0;
    }
// ---- Appartenance a l'equipe ----
    if($id%2=0){
      $equipe=2;
    }
    else{
      $equipe=1;
    }
// ---- Initialise la partie (equipe) ----
    $stmt = $dbmysql->prepare('UPDATE joueur_partie SET idjoueur=:idj,idpartie=:idp,equipe=:equipe,chef=:chef');
    $stmt->bindParam(':idj', $id);
    $stmt->bindParam(':idp', $idpartie);
    $stmt->bindParam(':equipe', $equipe);
    $stmt->bindParam(':chef', $chef);
    $stmt->execute();
// ---- Initialise la partie (jeu) ----
    $stmt = $db->prepare('UPDATE perso SET id=:id, n_partie=:partie')
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':partie', $idpartie);
    $stmt->execute();
// ---- Envoi de l'identifiant et du numero de partie ----
    $debut=Array($id,$idpartie,$equipe);
    echo $debut;
// ---- Remise a zero du compteur de joueurs ----
    sleep(6);
    $stmt = $db->prepare('UPDATE sync SET d_sync=0');
    $stmt->execute();
} catch (Exception $e) {
    echo "<h1 align='center'>Error about the sync!</h1>";
    echo $e;
}
