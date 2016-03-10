<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
        <title>
			Carte Google Orientée
        </title>
		<link rel="stylesheet" href="style.css" />
		<link rel="stylesheet" href="boussole.css" />
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js" ></script>
		
    </head>
    <body>
        <div id="compteARebours">
        </div>
        <div id="partieLancee">
            <div id="jauges">
                <p>QG :
                    <progress id="QGavancement" value="1" max="1"></progress> 
                    <span id="QGpourcentage"></span>
                </p>
                <p>capacite :
                    <progress id="avancement" value="1" max="1"></progress> 
                    <span id="pourcentage"></span>
                </p>
            </div>
            
            <div id="derniereAction"> 
            </div>
                <div id="parametrageDerniereAction">
                </div>
            <div id="placement_carte_cercle">
                <div id="rotationSliderContainer">
                    <div id="rotationSlider"></div>
                    <!--<div id="rotationSliderDegrees">0&deg;</div>-->
                    <div id="map"></div>
                </div>
            </div>		
            
            <div id="boutons">
                <button id="observation" style="background-color:#98FB98" >Observation</button>
                <button id="assaut" style="background-color:#B0E0E6">Assaut</button>
                <button id="tir" style="background-color:#F4A460">Tir</button>
                <button id="protection" style="background-color:#FFD700">Protection</button>
                <button id="recup" style="background-color:#CD5C5C">Récupération</button>
            </div>			
		</div>
		<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=geometry"></script>
		<script src="google.js"></script>
    </body>
</html>




