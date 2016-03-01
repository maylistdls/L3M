<?php

$delay = 30; //nombre de secondes à attendre avant le lancement d'une partie apres la derniere connexion

// Execution des calculs selon la requete envoyée
if (isset($_POST["requete"]))
{
    // Recupere le nombre de joueurs ayant lancés une partie
    try 
    {
        $listeARemplir = json_decode(file_get_contents('joueurs.json'));
    } 
    catch (Exception $e) 
    {
        // Si le fichier n'existe pas, on initialise ce nombre à zero
        $listeARemplir = 0;
    }

    // Incrémentation du nombre de joueurs ayant lancés une partie
    $listeARemplir+=1;
    
    // Sauvegarde du nombre de joueurs actualisé
    file_put_contents('joueurs.json', json_encode($listeARemplir));
    
    // L'identifiant du joueur correspond au numero du joueur
    $id = $listeARemplir;
    
    // Recuperation de la date à laquelle le joueur a lancé la partie 
    //time renvoie le nombre de secondes unix en php, Date() renvoie le nombre de millieme de secondes unix en javascript
    $time = time();
    // prise en compte du delai de lancement
    $time = $time+$delay; 
    
    // Sauvegarde de la derniere date
    file_put_contents('time.json', json_encode($time));

    // Tant qu'il n'y a pas 3 joueurs ayant lancé une partie
    while ($listeARemplir <3){
        // On met à jour le nombre de joueurs en lisant le fichier
        $listeARemplir = json_decode(file_get_contents('joueurs.json'));
    }
    
    // Des que le nombre de joueurs a été atteint
    // On recupere la valeur de la date à laquelle le dernier joueur a lancé une partie (date+offset)
    $time = json_decode(file_get_contents('time.json'));
    
    // Reset du nombre de joueurs dans la file d'attente
    file_put_contents('joueurs.json', json_encode(0));
    
    // Envoie de l'identifiant et de la date de début de partie
    echo json_encode(Array($id,$time));
}
else
{
    print_r($listeARemplir);
}

?>