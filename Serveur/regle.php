<?php

try {
    require 'connexion.php';
// ---- Initialisation ----
    $tour = $db->prepare('UPDATE perso SET regen=0, protec=1, recup=0, tir=0, assaut=0, etat=0 WHERE id=:id AND n_partie=:partie');
    $tour->bindParam(':id', $_POST['id']);
    $tour->bindParam(':partie', $_POST['partie']);
    $tour->execute();

// ---- OBSERVATION ----
    if ($_POST['etat']=== 'obs') {
        
        $stmt32 = $db->prepare('SELECT obs FROM perso WHERE id=:id AND n_partie=:partie');
        $stmt32->bindParam(':partie', $_POST['partie']);
        $stmt32->bindParam(':id', $_POST['id']);
        $stmt32->execute();
        $rows2 = $stmt32->fetch(PDO::FETCH_ASSOC);
        $obs=$rows2["obs"]+50;
            if ($obs > 150)
            {
                $obs = 150;
            }

        $stmt2 = $db->prepare('UPDATE perso SET obs=:obs, regen=capa*0.10, etat=:etat WHERE id=:id AND n_partie=:partie');
        $stmt2->bindParam(':id', $_POST['id']);
        $stmt2->bindParam(':etat', $_POST['etat']);
        $stmt2->bindParam(':partie', $_POST['partie']);
        $stmt2->bindParam(':obs', $obs);
        $stmt2->execute();

    }
// ---- ASSAUT ----
    elseif ($_POST['etat'] === 'assaut') {
        $stmt = $db->prepare('SELECT id FROM perso WHERE equipe!=:equipe AND n_partie=:partie AND
        (loc<->(SELECT loc FROM perso WHERE id=:id))<=18 AND capa > 0 ORDER BY loc<->(SELECT loc FROM perso WHERE id=:id) LIMIT 1');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->bindParam(':equipe', $_POST['equipe']);
        $stmt->bindParam(':partie', $_POST['partie']);
        $stmt->execute();
        $rows = $stmt->fetchAll();
        foreach ($rows as $row) {
            if ($row['id'] !== '') {
                $ote = $db->prepare('UPDATE perso SET assaut=(SELECT capa FROM perso WHERE id=:id)/4 WHERE id=:ad AND n_partie=:partie');
                $ote->bindParam(':id', $_POST['id']);
                $ote->bindParam(':partie', $_POST['partie']);
                $ote->bindParam(':ad', $row['id'], PDO::PARAM_INT);
                $ote->execute();
                $stmt2 = $db->prepare('UPDATE perso SET regen=capa*0.10,obs=50,assaut=(SELECT capa FROM perso WHERE id=:ad)/10, etat=:etat WHERE id=:id AND n_partie=:partie');
                $stmt2->bindParam(':id', $_POST['id']);
                $stmt2->bindParam(':ad', $row['id'], PDO::PARAM_INT);
                $stmt2->bindParam(':partie', $_POST['partie']);
                $stmt2->bindParam(':etat', $_POST['etat']);
                $stmt2->execute();
            }
        }
    }
// ---- TIR ----
    elseif ($_POST['etat'] === 'tir') {
      $capInf=((int)$_POST['cap']-45)%360;
      $capSup=((int)$_POST['cap']+45)%360;
        $stmt = $db->prepare('SELECT id FROM perso WHERE
          (loc<->(SELECT loc FROM perso WHERE id=:id))<=100 AND
          (loc<->(SELECT loc FROM perso WHERE id=:id))>0 AND
          equipe!=(SELECT equipe FROM perso WHERE id=:id) AND
          ((CAST(270-(degrees(atan2(((Select loc[1] from perso where id =:id)-loc[1]),((Select loc[0] from perso where id=:id)-loc[0])))) as bigint) %360)) >=:capInf AND
          ((CAST(270-(degrees(atan2(((Select loc[1] from perso where id =:id)-loc[1]),((Select loc[0] from perso where id=:id)-loc[0])))) as bigint) %360))<=:capSup AND
           n_partie=:partie');
        $stmt->bindParam(':partie', $_POST['partie']);
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->bindParam(':capInf', $capInf);
        $stmt->bindParam(':capSup', $capSup);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $row) {
            
            $up = $db->prepare('UPDATE perso SET tir=tir+round(0.01/((loc<->(SELECT loc FROM perso WHERE id=:id AND n_partie=:partie)))) WHERE id=:ad AND n_partie=:partie');
            //$up = $db->prepare('UPDATE qg SET capa=capa-30 WHERE id=:ad AND n_partie=:partie');
            $up->bindParam(':partie', $_POST['partie']);
            $up->bindParam(':ad', $row['id']);
            $up->bindParam(':id', $_POST['id']);
            $up->execute();
    
        }
        $stmt = $db->prepare('SELECT id FROM qg WHERE
          (loc<->(SELECT loc FROM perso WHERE id=:id))<=100 AND
          (loc<->(SELECT loc FROM perso WHERE id=:id))>0 AND
          equipe!=(SELECT equipe FROM perso WHERE id=:id) AND
          ((CAST(270-(degrees(atan2(((Select loc[1] from perso where id =:id)-loc[1]),((Select loc[0] from perso where id=:id)-loc[0])))) as bigint) %360)) >=:capInf AND
          ((CAST(270-(degrees(atan2(((Select loc[1] from perso where id =:id)-loc[1]),((Select loc[0] from perso where id=:id)-loc[0])))) as bigint) %360))<=:capSup AND
           n_partie=:partie');
        $stmt->bindParam(':partie', $_POST['partie']);
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->bindParam(':capInf', $capInf);
        $stmt->bindParam(':capSup', $capSup);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as $row) {
            
            $up = $db->prepare('UPDATE qg SET capa=capa-round(0.01/((loc<->(SELECT loc FROM perso WHERE id=:id AND n_partie=:partie)))) WHERE id=:ad AND n_partie=:partie');
            //$up = $db->prepare('UPDATE qg SET capa=capa-30 WHERE id=:ad AND n_partie=:partie');
            $up->bindParam(':partie', $_POST['partie']);
            $up->bindParam(':ad', $row['id']);
            $up->bindParam(':id', $_POST['id']);
            $up->execute();
    
        }

        $stmt2 = $db->prepare('UPDATE perso SET regen=capa*0.10,obs=50, etat=:etat WHERE id=:id AND n_partie=:partie');
        $stmt2->bindParam(':id', $_POST['id']);
        $stmt2->bindParam(':etat', $_POST['etat']);
        $stmt2->bindParam(':partie', $_POST['partie']);
        $stmt2->execute();
    }
    /* trop puissant: à revoir plus tard
// ---- PROTECTION ----
    elseif ($_POST['etat'] == 'protec') {
        $stmt2 = $db->prepare('UPDATE perso SET protec=0.5, regen=capa*0.10,obs=50, etat=:etat WHERE id=:id');
        $stmt2->bindParam(':id', $_POST['id']);
        $stmt2->bindParam(':etat', $_POST['etat']);
        $stmt2->execute();
    }
    */
// ---- RECUPERATION ----
    elseif ($_POST['etat'] === 'recup') {
        $stmt2 = $db->prepare('UPDATE perso SET recup=capa,assaut=assaut*10,tir=tir*10,obs=50, etat=:etat WHERE id=:id AND n_partie=:partie');
        $stmt2->bindParam(':id', $_POST['id']);
        $stmt2->bindParam(':etat', $_POST['etat']);
        $stmt2->bindParam(':partie', $_POST['partie']);
        $stmt2->execute();
    }
// ---- Verification de l'execution de toutes les requetes ----
    $stmt = $db->prepare('SELECT etat FROM perso WHERE n_partie=:partie');
    $stmt->bindParam(':partie', $_POST['partie']);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $rows = $stmt->fetchAll();
    $compte = 0;
    foreach ($rows as $row) {
        if ($row['etat'] !== '0') {
            $compte = $compte + 1;
        }
    }
    $compte = 6;
// ---- Declenchement des calculs ----
    if ($compte > 5) {
        $stmt = $db->prepare('SELECT id FROM perso WHERE n_partie=:partie');
        $stmt->bindParam(':partie', $_POST['partie']);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $row) {
            $stmt32 = $db->prepare('SELECT capa,regen,recup,protec,tir,assaut FROM perso WHERE id=:id AND n_partie=:partie');
            $stmt32->bindParam(':partie', $_POST['partie']);
            $stmt32->bindParam(':id', $row['id']);
            $stmt32->execute();
            $rows2 = $stmt32->fetch(PDO::FETCH_ASSOC);
            $capa=$rows2["capa"]+$rows2["regen"]+$rows2["recup"]-($rows2["protec"]*$rows2["tir"])-$rows2["assaut"];
            if ($capa > 100)
            {
                $capa = 100;
            }
            if ($capa < 0)
            {
                $capa = 0;
            }
            $stmt = $db->prepare('UPDATE perso SET capa=:capa WHERE id=:id AND n_partie=:partie');
            $stmt->bindParam(':partie', $_POST['partie']);
            $stmt->bindParam(':id', $row['id']);
            $stmt->bindParam(':capa', $capa);
            $stmt->execute();
        }
        $stmt = $db->prepare('UPDATE sync SET c_sync=TRUE, t_sync=:temps');
        $time = time();
        $stmt->bindParam(':temps',$time);
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
    $stmt2 = $db->prepare('SELECT capa,obs FROM perso WHERE id=:id AND n_partie=:partie');
    $stmt2->bindParam(':partie', $_POST['partie']);
    $stmt2->bindParam(':id', $_POST['id']);
    $stmt2->execute();
    $envoi1 = $stmt2->fetch(PDO::FETCH_ASSOC);
    $stmt2 = $db->prepare('SELECT * FROM qg WHERE n_partie=:partie');
    $stmt2->bindParam(':partie', $_POST['partie']);
    $stmt2->execute();
    $envoi2 = $stmt2->fetchAll();
    $envoi = array($envoi2,$envoi1);
    echo json_encode($envoi);
    sleep(3);
    $tour2 = $db->prepare('UPDATE sync SET c_sync=FALSE');
    $tour2->execute();
} catch (Exception $e) {
    echo "<h1 align='center'>Error about the action!</h1>";
    echo $e;
}
