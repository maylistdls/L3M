<?php

try {
    require '../../../Serveur/connexion.php';
    $tmps=time();
    $stmt = $db->prepare('UPDATE sync SET d_sync=5, s_sync=5, r_sync=:temps');
    $stmt->bindParam(':temps',$tmps);
    $stmt->execute();

} catch (Exception $e) {
    echo "<h1 align='center'>Error about the start!</h1>";
    echo $e;
}
?>
