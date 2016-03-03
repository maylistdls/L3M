<?php

try {
    require 'connexion.php';

    $_POST['id'] = 6;
    $_POST['etat'] = 'tir';

    if ($_POST['etat'] == 'obs') {
        $stmt = $db->prepare('UPDATE perso SET obs=obs*1.5, regen=capa*0.25 WHERE id=:id');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->execute();
    } elseif ($_POST['etat'] == 'assaut') {
        /*$sq1 = "SELECT Indice FROM Question WHERE id='".$_POST['selection']."'";
    if ($result = mysqli_query($link, $sq1)) {
        while ($ligne = mysqli_fetch_assoc($result)) {
            $ind = $ligne['Indice'];
            echo '<p>'.utf8_encode($ind).'</p>';
        }
    }*/
    } elseif ($_POST['etat'] == 'tir') {
        $stmt = $db->prepare('UPDATE perso SET tir=100/
          (loc<->(SELECT loc FROM perso WHERE id=:id))
           WHERE id=
           (SELECT id FROM perso WHERE
             (loc<->(SELECT loc FROM perso WHERE id=:id)<=100))');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->execute();
    } elseif ($_POST['etat'] == 'protec') {
        /*$sq1="SELECT Quest,id FROM Question WHERE Theme='".$_POST['theme']."' AND id<>'".$_POST['selection']."' ORDER BY RAND() LIMIT 1;";
    if($result = mysqli_query($link, $sq1)){
        while($ligne = mysqli_fetch_assoc($result)){
            $qu=$ligne["Quest"];
            $id=$ligne["id"];
            echo "<p value=".$id.">".utf8_encode($qu)."</p>";
        }
    }*/
    } elseif ($_POST['etat'] == 'recup') {
        $stmt = $db->prepare('UPDATE perso SET recup=capa*10 WHERE id=:id');
        $stmt->bindParam(':id', $_POST['id']);
        $stmt->execute();
    }
} catch (Exception $e) {
    echo "<h1 align='center'>Error about the action!</h1>";
    echo $e;
}
