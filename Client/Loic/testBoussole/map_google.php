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
    
        <div id="map"></div>
        <div id="infoposition"></div>
        <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=geometry"></script>

        <script src="google.js"></script>
		<script src="boussole.js"></script>
		
		<div class="orientation-data">
			<div>Tilt-back : <span id="tiltFB"></span></div>
			<div>Inclinaison gauche - droite : <span id="tiltLR"></span></div>
			<div>Orientation : <span id="direction"></span></div>
		</div>
		
    </body>
</html>




