<?php
$myError='' ;
function checkDieError(){ 
	global $myError;
	if ($myError)	dieError();
}
function dieError($error){
    global $myError;
	if ($error) $myError=$error; 
	if (!$myError)	$myError='très étrange erreur dans errorManager' ;
	die($myError) ; 
}
function checkDieErrorJson(){
	global $myError;
	if ($myError)	dieErrorJson();
}
function dieErrorJson($error){
	global $myError;
	if ($error) $myError=$error; 
	if (!$myError)	$myError='très étrange erreur dans errorManager' ;
	die( json_encode(array("erreur" => $myError)) );
}
?>