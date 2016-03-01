<?php

$delay = 30; //nombre de secondes � attendre avant le lancement d'une partie apres la derniere connexion

// Execution des calculs selon la requete envoy�e
if (isset($_POST["requete"]))
{
    // Recupere le nombre de joueurs ayant lanc�s une partie
    try 
    {
        $listeARemplir = json_decode(file_get_contents('joueurs.json'));
    } 
    catch (Exception $e) 
    {
        // Si le fichier n'existe pas, on initialise ce nombre � zero
        $listeARemplir = 0;
    }

    // Incr�mentation du nombre de joueurs ayant lanc�s une partie
    $listeARemplir+=1;
    
    // Sauvegarde du nombre de joueurs actualis�
    file_put_contents('joueurs.json', json_encode($listeARemplir));
    
    // L'identifiant du joueur correspond au numero du joueur
    $id = $listeARemplir;
    
    // Recuperation de la date � laquelle le joueur a lanc� la partie 
    //time renvoie le nombre de secondes unix en php, Date() renvoie le nombre de millieme de secondes unix en javascript
    $time = time();
    // prise en compte du delai de lancement
    $time = $time+$delay; 
    
    // Sauvegarde de la derniere date
    file_put_contents('time.json', json_encode($time));

    // Tant qu'il n'y a pas 3 joueurs ayant lanc� une partie
    while ($listeARemplir <3){
        // On met � jour le nombre de joueurs en lisant le fichier
        $listeARemplir = json_decode(file_get_contents('joueurs.json'));
    }
    
    // Des que le nombre de joueurs a �t� atteint
    // On recupere la valeur de la date � laquelle le dernier joueur a lanc� une partie (date+offset)
    $time = json_decode(file_get_contents('time.json'));
    
    // Reset du nombre de joueurs dans la file d'attente
    file_put_contents('joueurs.json', json_encode(0));
    
    // Envoie de l'identifiant et de la date de d�but de partie
    echo json_encode(Array($id,$time));
}
else
{
    print_r($listeARemplir);
}

?>