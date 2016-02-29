<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
        <title>
			Carte Google Orientée
        </title>
		<link rel="stylesheet" href="style.css" />
		<link rel="stylesheet" href="boussole.css" />
		
    </head>
    <body>
    	<div id="jauges">
    		<p>capacite :
    			<progress id="avancement" value="50" max="100"></progress> 
    			<span id="pourcentage"></span>
    		</p>
    	</div>


        <div id="map"></div>
        <div id="infoposition"></div>
        <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=geometry"></script>

		<button id="observation" class="bouton_observation"> Observation </button>
		
        <script src="google.js"></script>
		<script src="boussole.js"></script>
		
		<div class="orientation-data">
			<div>Tilt-back : <span id="tiltFB"></span></div>
			<div>Inclinaison gauche - droite : <span id="tiltLR"></span></div>
			<div>Orientation : <span id="direction"></span></div>
		</div>

		<div id="boutons">
			<button id="obs" style="background-color:#98FB98" >Observation</button>
			<button id="assaut" style="background-color:#B0E0E6">Assaut</button>
			<button id="tir" style="background-color:#F4A460">Tir</button>
			<button id="protection" style="background-color:#FFD700">Protection</button>
			<button id="recup" style="background-color:#CD5C5C">Récupération</button>
		</div>
		
    </body>
</html>




