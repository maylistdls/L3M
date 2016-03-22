<?php
try {
    require '../../../Serveur/connexion.php';
    /*
    if (isset($_POST["joueur"]) && isset($_POST["Batterielon"]) && isset($_POST["Batterielat"]))
    {
        // Stockage de la localisation de la batterie dans la base de donnees
    }
    */
    if (isset($_POST["listeQG"]) && isset($_POST["listeBatterie"]))
    {
        // On reinitialise les qg des parties précédentes
        $stmt = $db->prepare('DELETE FROM qg');
        $stmt->execute();
        

        $QG = json_decode($_POST["listeQG"],true);
        $BATTERIE = json_decode($_POST["listeBatterie"],true);
        
        
        foreach ($QG as $name => $value) {
            $numEquipe = explode("equipe", $name)[1];
            $lat = $value["lat"];
            $lng = $value["lng"];
            
            $stmt = $db->prepare('INSERT INTO qg (capa,equipe,qg_bat,loc) VALUES (1000,:equipe,true,POINT(:x,:y))');
            $stmt->bindParam(':equipe', $numEquipe);
            $stmt->bindParam(':x', $lat);
            $stmt->bindParam(':y', $lng);
            $stmt->execute();

        }

        foreach ($BATTERIE as $name => $numBatterie) {
            $numEquipe = explode("equipe", $name)[1];
            foreach ($numBatterie as $key => $value)
            {
            $lat = $value["lat"];
            $lng = $value["lng"];
            
            $stmt = $db->prepare('INSERT INTO qg (capa,equipe,qg_bat,loc) VALUES (1000,:equipe,false,POINT(:x,:y))');
            $stmt->bindParam(':equipe', $numEquipe);
            $stmt->bindParam(':x', $lat);
            $stmt->bindParam(':y', $lng);
            $stmt->execute();
            }
        }
    }



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
    /*
    while ($rows['s_sync']<6) {
      sleep(5);
      $stmt = $db->prepare('SELECT s_sync FROM sync');
      $stmt->execute();
      $rows = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    */
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
    $envoi = $stmt->fetchAll();

// ---- Mise en forme et envoi des donnees ----
    $start=Array($envoi,$tps);
    echo json_encode($start);

    






} catch (Exception $e) {
    echo "<h1 align='center'>Error about the sync!</h1>";
    echo $e;
}



?>