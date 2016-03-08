<?php

try {
    require 'connexion.php';
    $xg=0;
    $yg=0;
    $_POST['id']=1;
    $_POST['partie']=1;
    $stmt = $db->prepare('UPDATE sync SET d_sync=d_sync+1');
    $stmt->execute();
    $stmt = $db->prepare('SELECT * FROM sync');
    $stmt->execute();
    $rows = $stmt->fetch(PDO::FETCH_ASSOC);
    while ($rows['d_sync']<5) {
      sleep(10);
      $stmt = $db->prepare('SELECT d_sync FROM sync');
      $stmt->execute();
      $rows = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    if ($_POST['id']==1){
      $stmt = $db->prepare('SELECT loc FROM perso WHERE equipe=(SELECT equipe FROM perso WHERE id=:id)');
      $stmt->bindParam(':id', $_POST['id']);
      $stmt->execute();
      $stmt->setFetchMode(PDO::FETCH_ASSOC);
      $rows = $stmt->fetchAll();
      foreach ($rows as $row) {
        $xg=$xg+substr($row['loc'],1,strpos($row['loc'],",")-1);
        $yg=$yg+substr($row['loc'],strpos($row['loc'],",")+1,strpos($row['loc'],")")-1);
      }
      $stmt = $db->prepare('INSERT INTO qg (capa,equipe,qg_bat,loc,partie) VALUES (1000,(SELECT equipe FROM perso WHERE id=:id),TRUE,POINT(:x,:y),:partie)');
      $stmt->bindParam(':id', $_POST['id']);
      $xg = (float)$xg/3;
      $yg = (float)$yg/3;
      $stmt->bindParam(':x', $xg);
      $stmt->bindParam(':y', $yg);
      $stmt->bindParam(':partie', $_POST['partie']);
      $stmt->execute();
    }
    elseif ($_POST['id']==2){
      $stmt = $db->prepare('SELECT loc FROM perso WHERE equipe=(SELECT equipe FROM perso WHERE id=:id)');
      $stmt->bindParam(':id', $_POST['id']);
      $stmt->execute();
      $stmt->setFetchMode(PDO::FETCH_ASSOC);
      $rows = $stmt->fetchAll();
      foreach ($rows as $row) {
        $xg=$xg+substr($row['loc'],1,strpos($row['loc'],",")+1);
        $yg=$yg+substr($row['loc'],strpos($row['loc'],",")+1,strpos($row['loc'],")")+1);
      }
      $stmt = $db->prepare('INSERT INTO qg (capa,equipe,qg_bat,loc,partie) VALUES (1000,(SELECT equipe FROM perso WHERE id=:id),TRUE,POINT(:x,:y),:partie)');
      $stmt->bindParam(':id', $_POST['id']);
      $xg = (float)$xg/3;
      $yg = (float)$yg/3;
      $stmt->bindParam(':x', $xg);
      $stmt->bindParam(':y', $yg);
      $stmt->bindParam(':partie', $_POST['partie']);
      $stmt->execute();
    }
    else{
      sleep(2);
    }
    $stmt = $db->prepare('SELECT loc FROM qg WHERE equipe=(SELECT equipe FROM perso WHERE id=:id)');
    $stmt->bindParam(':id', $_POST['id']);
    $stmt->execute();
    $stmt->setFetchMode(PDO::FETCH_ASSOC);
    $locqg = $stmt->fetchAll();
    $stmt = $db->prepare('UPDATE sync SET d_sync=0');
    $stmt->execute();
    echo json_encode($locqg);
  } catch (Exception $e) {
      echo "<h1 align='center'>Error about the start!</h1>";
      echo $e;
    }
?>
