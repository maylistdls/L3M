<?php

// Variables
$team1 =  Array(
    Array('loc'=>"(1,2)"),
    Array('loc'=>"(3,4)"),
    Array('loc'=>"(5,6)"));

$team2 =  Array(
    Array('loc'=>"(41,24)"),
    Array('loc'=>"(42,23.2)"),
    Array('loc'=>"(43,22)"));

$loc = Array($team1,$team2);








//Execution des calculs selon la requete envoyée
if (isset($_POST["id"]))
{
    //Retour (encodage des donnees)
    echo json_encode($loc);
}
else
{
    print_r($loc);
}

?>