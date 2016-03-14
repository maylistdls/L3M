<?php
try {
    require ("connexion.php");

    $stmt = $db->prepare("UPDATE perso SET loc=:loc WHERE id=:id");
		$stmt->bindParam(':loc',$_POST['loc']);
		$stmt->bindParam(':id',$_POST['id']);
    $stmt->execute();

    $stmt = $db->prepare("UPDATE perso SET loc=:loc WHERE id=:id");
		$stmt->bindParam(':loc',$_POST['loc']);
		$stmt->bindParam(':id',$_POST['id']);
    $stmt->execute();

		$select = $db->prepare("SELECT loc,id FROM perso WHERE equipe=(SELECT equipe FROM perso WHERE id=:id)");
		$select->bindParam(':id',$_POST['id']);
		$select->execute();
		$select->setFetchMode(PDO::FETCH_ASSOC);
		$ami = $select->fetchAll();

		$slct = $db->prepare("SELECT loc,id FROM perso WHERE equipe!=(SELECT equipe FROM perso WHERE id=:id)");
		$slct->bindParam(':id',$_POST['id']);
		$slct->execute();
		$slct->setFetchMode(PDO::FETCH_ASSOC);
		$enemy = $slct->fetchAll();

		$loc = Array ($ami,$enemy);

		echo json_encode($loc);


} catch (Exception $e) {
    echo "<h1 align='center'>Error about the localization!</h1>";
}
