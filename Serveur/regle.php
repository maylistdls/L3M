<?php

try {
    require 'connexion.php';
    if ($_POST['etat'] == 'obs') {
        $stmt = $db->prepare('UPDATE perso SET obs=obs*1.5, regen=capa*0.25 WHERE id=:id');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->execute();
    } elseif ($_POST['etat'] == 'assaut') {
        $stmt = $db->prepare('UPDATE perso SET regen=capa*0.25 WHERE id=:id');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->execute();
        $stmt = $db->prepare('UPDATE perso SET assaut=capa/5 WHERE id=(SELECT id FROM perso WHERE min(loc<->(SELECT loc FROM perso)))');
        $stmt->execute();
    } elseif ($_POST['etat'] == 'tir') {
        $stmt = $db->prepare('UPDATE perso SET regen=capa*0.25 WHERE id=:id');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->execute();
        $stmt = $db->prepare('SELECT id FROM perso WHERE
           (loc<->(SELECT loc FROM perso WHERE id=:id)<=100) AND
            (loc<->(SELECT loc FROM perso WHERE id=:id)>0) AND
             equipe!=(SELECT equipe FROM perso WHERE id=:id) AND
              degrees(acos((loc<->(SELECT loc FROM perso WHERE id=:id))/100))<=(:cap-45)%(360) AND
              degrees(acos((loc<->(SELECT loc FROM perso WHERE id=:id))/100))>=(:cap+45)%(360)');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->bindParam(':cap', $_POST['cap']);
    		$stmt->execute();
    		$stmt->setFetchMode(PDO::FETCH_ASSOC);
    		$rows = $stmt->fetchAll();
        foreach($rows as $row) {
          $up = $db->prepare('UPDATE perso SET tir=100/(loc<->(SELECT loc FROM perso WHERE id=:id)) WHERE id=:ad');
          $up->bindParam(':id', $_POST['id']);
          $up->bindParam(':ad', $row[id], PDO::PARAM_INT);
          $up->execute();
        }
    } elseif ($_POST['etat'] == 'protec') {
      $stmt = $db->prepare('UPDATE perso SET protec=0.5, regen=capa*0.25 WHERE id=:id');
      $stmt->bindParam(':id', $_POST['id']);
      $stmt->execute();
    } elseif ($_POST['etat'] == 'recup') {
        $stmt = $db->prepare('UPDATE perso SET recup=capa*3,assaut=assaut*10,tir=tir*10 WHERE id=:id');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->execute();
    }
} catch (Exception $e) {
    echo "<h1 align='center'>Error about the action!</h1>";
    echo $e;
}
