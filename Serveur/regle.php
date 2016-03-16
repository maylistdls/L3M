<?php

try {
    require 'connexion.php';
// ---- Initialisation ----
    $tour = $db->prepare('UPDATE perso SET regen=0, protec=1, recup=0, tir=0, assaut=0, etat=0 WHERE id=:id');
    $tour->bindParam(':id', $_POST['id']);
    $tour->execute();
// ---- OBSERVATION ----
    if ($_POST['etat'] == 'obs') {
        $stmt2 = $db->prepare('UPDATE perso SET obs=obs+50, regen=capa*0.25, etat=:etat WHERE id=:id');
        $stmt2->bindParam(':id', $_POST['id']);
        $stmt2->bindParam(':etat', $_POST['etat']);
        $stmt2->execute();
    }
// ---- ASSAUT ----
    elseif ($_POST['etat'] == 'assaut') {
        $stmt = $db->prepare('SELECT id FROM perso WHERE equipe!=(SELECT equipe FROM perso WHERE id=:id) AND
        (loc<->(SELECT loc FROM perso WHERE id=:id))<=18 ORDER BY loc<->(SELECT loc FROM perso WHERE id=:id) LIMIT 1');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->execute();
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            if ($row['id'] != '') {
                $ote = $db->prepare('UPDATE perso SET assaut=(SELECT capa FROM perso WHERE id=:id)/4 WHERE id=:ad');
                $ote->bindParam(':id', $_POST['id']);
                $ote->bindParam(':ad', $row['id'], PDO::PARAM_INT);
                $ote->execute();
                $stmt2 = $db->prepare('UPDATE perso SET regen=capa*0.25,obs=50,assaut=(SELECT capa FROM perso WHERE id=:ad)/10, etat=:etat WHERE id=:id');
                $stmt2->bindParam(':id', $_POST['id']);
                $stmt2->bindParam(':ad', $row['id'], PDO::PARAM_INT);
                $stmt2->bindParam(':etat', $_POST['etat']);
                $stmt2->execute();
            }
        }
        $stmt = $db->prepare('SELECT id FROM qg WHERE equipe!=(SELECT equipe FROM perso WHERE id=:id) AND
        (loc<->(SELECT loc FROM perso WHERE id=:id))<=18 ORDER BY loc<->(SELECT loc FROM perso WHERE id=:id) LIMIT 1');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->execute();
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            if ($row['id'] != '') {
                $ote = $db->prepare('UPDATE qg SET capa=capa-(SELECT capa FROM perso WHERE id=:id)/4 WHERE id=:ad');
                $ote->bindParam(':id', $_POST['id']);
                $ote->bindParam(':ad', $row['id'], PDO::PARAM_INT);
                $ote->execute();
            }
        }
    }
// ---- TIR ----
    elseif ($_POST['etat'] == 'tir') {
        $stmt = $db->prepare('SELECT id FROM perso WHERE
          (loc<->(SELECT loc FROM perso WHERE id=:id))<=100 AND
          (loc<->(SELECT loc FROM perso WHERE id=:id))>0 AND
          equipe!=(SELECT equipe FROM perso WHERE id=:id) AND
          degrees(acos((loc<->(SELECT loc FROM perso WHERE id=:id))/100))>=(:cap-45)%(360) AND
          degrees(acos((loc<->(SELECT loc FROM perso WHERE id=:id))/100))<=(:cap+45)%(360)');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->bindParam(':cap', $_POST['cap']);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            if ($row['id'] != '') {
                $up = $db->prepare('UPDATE perso SET tir=round(100000/(loc<->(SELECT loc FROM perso WHERE id=:id))) WHERE id=:ad');
                $up->bindParam(':id', $_POST['id']);
                $up->bindParam(':ad', $row['id'], PDO::PARAM_INT);
                $up->execute();
            }
        }
        $stmt = $db->prepare('SELECT id FROM qg WHERE
          (loc<->(SELECT loc FROM perso WHERE id=:id))<=100 AND
          (loc<->(SELECT loc FROM perso WHERE id=:id))>0 AND
          equipe!=(SELECT equipe FROM perso WHERE id=:id) AND
          degrees(acos((loc<->(SELECT loc FROM perso WHERE id=:id))/100))>=(:cap-45)%(360) AND
          degrees(acos((loc<->(SELECT loc FROM perso WHERE id=:id))/100))<=(:cap+45)%(360)');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->bindParam(':cap', $_POST['cap']);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            if ($row['id'] != '') {
                $up = $db->prepare('UPDATE qg SET capa=capa-round(100000/(loc<->(SELECT loc FROM perso WHERE id=:id))) WHERE id=:ad');
                $up->bindParam(':id', $_POST['id']);
                $up->bindParam(':ad', $row['id'], PDO::PARAM_INT);
                $up->execute();
            }
        }
        $stmt2 = $db->prepare('UPDATE perso SET regen=capa*0.25,obs=50, etat=:etat WHERE id=:id');
        $stmt2->bindParam(':id', $_POST['id']);
        $stmt2->bindParam(':etat', $_POST['etat']);
        $stmt2->execute();
    }
    /* trop puissant: à revoir plus tard
// ---- PROTECTION ----
    elseif ($_POST['etat'] == 'protec') {
        $stmt2 = $db->prepare('UPDATE perso SET protec=0.5, regen=capa*0.25,obs=50, etat=:etat WHERE id=:id');
        $stmt2->bindParam(':id', $_POST['id']);
        $stmt2->bindParam(':etat', $_POST['etat']);
        $stmt2->execute();
    }
    */
// ---- RECUPERATION ----
    elseif ($_POST['etat'] == 'recup') {
        $stmt2 = $db->prepare('UPDATE perso SET recup=capa*3,assaut=assaut*10,tir=tir*10,obs=50, etat=:etat WHERE id=:id');
        $stmt2->bindParam(':id', $_POST['id']);
        $stmt2->bindParam(':etat', $_POST['etat']);
        $stmt2->execute();
    }
// ---- Non-Jeu ----
    else {
        $stmt2 = $db->prepare('UPDATE perso SET regen=capa*0.25, etat=1,obs=50 WHERE id=:id');
        $stmt2->bindParam(':id', $_POST['id']);
        $stmt2->execute();
    }
// ---- Verification de l'execution de toutes les requetes ----
    $stmt = $db->prepare('SELECT etat FROM perso');
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $rows = $stmt->fetchAll();
    foreach ($rows as $row) {
        if ($row['etat'] != 0) {
            $compte = $compte + 1;
        }
    }
// ---- Declenchement des calculs ----
    if ($compte > 5) {
        $stmt = $db->prepare('SELECT id FROM perso');
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            $stmt = $db->prepare('UPDATE perso SET capa=capa+regen+recup-(protec*tir)-assaut WHERE id=:id');
            $stmt->bindParam(':id', $row['id']);
            $stmt->execute();
        }
        $stmt = $db->prepare('UPDATE sync SET c_sync=TRUE, t_sync=:temps');
        $stmt->bindParam(':temps', time());
        $stmt->execute();
    }
// ---- Attente ----
    else {
        $stmt = $db->prepare('SELECT * FROM sync');
        $stmt->execute();
        $rows = $stmt->fetch(PDO::FETCH_ASSOC);
        while ($rows['c_sync'] != 1) {
            sleep(2);
            $stmt = $db->prepare('SELECT c_sync FROM sync');
            $stmt->execute();
            $rows = $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }
    $stmt2 = $db->prepare('SELECT capa,obs FROM perso WHERE id=:id');
    $stmt2->bindParam(':id', $_POST['id']);
    $stmt2->execute();
    $envoi1 = $stmt2->fetch(PDO::FETCH_ASSOC);
    $stmt2 = $db->prepare('SELECT capa FROM qg');
    $stmt2->bindParam(':id', $_POST['id']);
    $stmt2->execute();
    $envoi2 = $stmt2->fetch(PDO::FETCH_ASSOC);
    $envoi = array($envoi1, $envoi2);
    echo json_encode($envoi);
    sleep(3);
    $tour2 = $db->prepare('UPDATE sync SET c_sync=FALSE');
    $tour2->execute();
} catch (Exception $e) {
    echo "<h1 align='center'>Error about the action!</h1>";
    echo $e;
}
