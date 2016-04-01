<?php

try {
    require '../../../Serveur/connexion.php';
    require '../../../Serveur/connexionJoueur.php';
    $tmps=time();
    $stmt = $db->prepare('UPDATE sync SET d_sync=5, s_sync=5, r_sync=:temps');
    $stmt->bindParam(':temps',$tmps);
    $stmt->execute();
    $stmt = $db->prepare('DELETE FROM perso');
    $stmt->execute();
    $stmt = $db->prepare('DELETE FROM qg');
    $stmt->execute();
    $obs = 'obs';
    $stmt = $db->prepare('INSERT INTO perso(id,loc,capa,etat, equipe, regen, obs,protec,recup,tir,assaut,n_partie) VALUES (2,POINT(48.3,2.58),100,:obs,2,25,50,1,0,0,0,2)');

    $stmt->bindParam(':obs',$obs);
    $stmt->execute();
    $stmt = $db->prepare('INSERT INTO perso(id,loc,capa,etat, equipe, regen, obs,protec,recup,tir,assaut,n_partie) VALUES (3,POINT(48.3,2.59),100,:obs,1,25,50,1,0,0,0,2)');
    $stmt->bindParam(':obs',$obs);
    $stmt->execute();
    $stmt = $db->prepare('INSERT INTO perso(id,loc,capa,etat, equipe, regen, obs,protec,recup,tir,assaut,n_partie) VALUES (4,POINT(48.35,2.58),100,:obs,2,25,50,1,0,0,0,2)');
    $stmt->bindParam(':obs',$obs);
    $stmt->execute();
    $stmt = $db->prepare('INSERT INTO perso(id,loc,capa,etat, equipe, regen, obs,protec,recup,tir,assaut,n_partie) VALUES (5,POINT(48.32,2.57),100,:obs,1,25,50,1,0,0,0,2)');
    $stmt->bindParam(':obs',$obs);
    $stmt->execute();
    $stmt = $db->prepare('INSERT INTO perso(id,loc,capa,etat, equipe, regen, obs,protec,recup,tir,assaut,n_partie) VALUES (6,POINT(48.32,2.59),100,:obs,2,25,50,1,0,0,0,2)');
    $stmt->bindParam(':obs',$obs);
    $stmt->execute();
    $stmt = $dbmysql->prepare('DELETE FROM joueur_partie');
    $stmt->execute();
    $stmt = $dbmysql->prepare('UPDATE partie SET numeroPartie=1');
    $stmt->execute();

} catch (Exception $e) {
    echo "<h1 align='center'>Error about the start!</h1>";
    echo $e;
}
?>
