<?php
try {
    require ("connexion.php");
    $partie = $_POST["partie"];
    $equipe = $_POST["equipe"];

    $stmt = $db->prepare("UPDATE perso SET loc=:loc WHERE id=:id AND n_partie=:partie");
		$stmt->bindParam(':loc',$_POST['loc']);
		$stmt->bindParam(':id',$_POST['id']);
		$stmt->bindParam(':partie',$partie);
    $stmt->execute();

		$select = $db->prepare("SELECT loc,id FROM perso WHERE equipe=:equipe AND n_partie = :partie");
		$select->bindParam(':equipe',$equipe);
		$select->bindParam(':partie',$partie);
		$select->execute();
		$select->setFetchMode(PDO::FETCH_ASSOC);
		$ami = $select->fetchAll();

		$slct = $db->prepare("SELECT loc,id FROM perso WHERE equipe!=:equipe AND n_partie = :partie");
		$slct->bindParam(':equipe',$equipe);
		$slct->bindParam(':partie',$partie);
		$slct->execute();
		$slct->setFetchMode(PDO::FETCH_ASSOC);
		$enemy = $slct->fetchAll();

		$loc = Array ($ami,$enemy);

		echo json_encode($loc);


} catch (Exception $e) {
    echo "<h1 align='center'>Error about the localization!</h1>";
}
