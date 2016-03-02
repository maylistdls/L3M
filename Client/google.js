//Creation de l'objet map
var map = new google.maps.Map(document.getElementById("map"),
	{
		center:new google.maps.LatLng(0,0),
		zoom:18,
		
	});
    
var id = 4;

// Définition du rayon de vue initial
var rayon = 70;	

// Pour passer en vue satellite 
//map.setMapTypeId(google.maps.MapTypeId.SATELLITE);	

// Pour passer en vue hybride 
//map.setMapTypeId(google.maps.MapTypeId.HYBRID);	

// Pour passer en vue TERRAIN
//map.setMapTypeId(google.maps.MapTypeId.TERRAIN);

// Chargement des tuiles (donnees google - vue satellite)
map.setMapTypeId(google.maps.MapTypeId.ROADMAP);

//Variables globales
var listeMarker = []; //Pour pouvoir supprimer les marqueurs
var bounds = new google.maps.LatLngBounds();
var outerbounds = [ // covers the (mercator projection) world
        new google.maps.LatLng(85,180),
        new google.maps.LatLng(85,90),
        new google.maps.LatLng(85,0),
        new google.maps.LatLng(85,-90),
        new google.maps.LatLng(85,-180),
        new google.maps.LatLng(0,-180),
        new google.maps.LatLng(-85,-180),
        new google.maps.LatLng(-85,-90),
        new google.maps.LatLng(-85,0),
        new google.maps.LatLng(-85,90),
        new google.maps.LatLng(-85,180),
        new google.maps.LatLng(0,180),
        new google.maps.LatLng(85,180)];
		

/*
// A decommenter si on a besoin de requete ajax

//Fonction d'ajout de marqueurs
function addMarkers (data) 
{
    for (var tremblement in data)
    {
        //Creation du marqueur
        var marker = new google.maps.Marker(
        {
            position: new google.maps.LatLng
            (
                data[tremblement].latitude,
                data[tremblement].longitude
            )
        }); 
        
        //Personnalisation du marqueur
            //Ajout d'une popup
        var infowindow = new google.maps.InfoWindow();
        makeInfoWindowEvent(map, infowindow, "<b>Magnitude :</b> " + data[tremblement].magnitude, marker);    
          
        //Ajout du marqueur à la liste des marqueurs (pour les supprimer)
        listeMarker.push(marker);
        
        //Ajout du marqueur à la carte
        marker.setMap(map);
    }
}  


//Fonction d'affichage
function affiche(data)
{ 
    //Suppression des anciens markers
    markerDelAgain();
    
    //Ajout des marqueurs
    addMarkers(data);
} 

//Fonction pour ajouter une popup pour plusieurs markers
function makeInfoWindowEvent(map, infowindow, contentString, marker) {
    google.maps.event.addListener(marker, 'click', function() 
        {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        },false);
}*/

/*
//Requete Ajax
	function requeteAjax(e,nombre) 
	{
		//Connexion au fichier php
		var ajax = new XMLHttpRequest(); 
		ajax.open('POST', 'server.php', true); 
		## id=idBonhomme <= entier & loc = '(x,y)' <= chaine de caractere 
		ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
		
		//Ecoute de la reponse
		ajax.addEventListener('readystatechange', 
			function(e) 
			{ 
				if(ajax.readyState == 4 && ajax.status == 200)  //Si le .php a bien renvoyé des données
				{
					var data = JSON.parse(ajax.responseText); //Decodage des donnees		
					affiche(data); //Execution de l'affichage
					# position = [equipeAmie, equipeAdverse]
					# equipeAmie = [(x,y),(x,y)]
					# equipeAdverse = [(x,y),(x,y)] <= adversaire (que l'on voit)
				} 
			}
		); 
		
		//Generation de la requete
		var data = "requete=addTdt&nbr="+nombre;
		
		//Envoi de la requete
		ajax.send(data);
	};        
*/

var observation = document.getElementById("observation");

dezoom = function (event) {

	// Requete Ajax
	function requeteAjax(e,requete) 
	{
		// Connexion au fichier php
		var ajax = new XMLHttpRequest(); 
		ajax.open('POST', 'loc.php', true);
		//## id=idBonhomme <= entier & loc = '(x,y)' <= chaine de caractere 
		ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
		
		// Ecoute de la reponse
		ajax.addEventListener('readystatechange', 
			function(e) 
			{ 
				if(ajax.readyState == 4 && ajax.status == 200)  // Si le .php a bien renvoyé des données
				{
					var data = JSON.parse(ajax.responseText); // Decodage des donnees		
					affiche(data); // Execution de l'affichage
					if (data == true) {
						rayon = rayon*1.18;
					}
					else 
						console.log("pas le droit de changer le rayon de vue");
				} 
			}
		); 
		
		// Envoi de la requete
		ajax.send(requete);
	};      
}
	
observation.addEventListener("click", dezoom, false);

/*

// Requete Ajax
function requeteAjax(e,requete) 
{
    // Connexion au fichier php
	var ajax = new XMLHttpRequest(); 
	ajax.open('POST', 'regle.php', true); 
    ## id=idBonhomme <= entier & etat = 'obs' ou 'tir' ou 'assaut' ou 'protec' ou 'recup' <= chaine de caractere & directionTir = angleParRapportAuNord <= chaine de caractere & rayonObs = '1.8' <= chaine de caractere &  directionProtec = angleParRapportAuNord <= chaine de caractere
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
	
    // Ecoute de la reponse
    ajax.addEventListener('readystatechange', 
		function(e) 
        { 
			if(ajax.readyState == 4 && ajax.status == 200)  // Si le .php a bien renvoyé des données
			{
                var data = JSON.parse(ajax.responseText); // Decodage des donnees		
                affiche(data); // Execution de l'affichage
			} 
		}
	); 
    
    // Envoi de la requete
	ajax.send(requete);
};      
           
*/     


// Requete Ajax pour la mise à jour de la localisation
function requeteAjaxLocalisation(requete) 
{
    // Connexion au fichier php
	var ajax = new XMLHttpRequest(); 
	ajax.open('POST', '../Serveur/loc.php', true); 
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
	
    // Ecoute de la reponse
    ajax.addEventListener('readystatechange', 
		function(e) 
        { 
			if(ajax.readyState == 4 && ajax.status == 200)  // Si le .php a bien renvoyé des données
			{
                var data = JSON.parse(ajax.responseText); // Decodage des donnees		
                afficheLoc(data); // Execution de l'affichage
			} 
		}
	); 
    
    // Envoi de la requete
	ajax.send(requete);
};       


function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
   };
} 

// Resultat de la requete ajax
function afficheLoc(data)
{
    var regExp = /\(([^)]+)\)/g;
        
    for	(index = 0; index < data.length; index++) {
        console.log("changement equipe ");
        var equipe = data[index];
        if (index == 0 )
        {
            
            var color = "#F00";
        }
        else 
        {
            
            var color = "#FF0";
        }
        for	(index_equipe = 0; index_equipe < equipe.length; index_equipe++) {
            var point = equipe[index_equipe];
            var coordonnees = point.loc;
            
            var matches = coordonnees.match(regExp);
            coordonnees = coordonnees.substring(1, coordonnees.length - 1);
            coordonnees = coordonnees.split(",");
            var x = parseFloat(coordonnees[0]);
            var y = parseFloat(coordonnees[1]);
            console.log(x,y);
            if (point.id != id)
            {
                latlng = new google.maps.LatLng(x, y);
                var marker = new google.maps.Marker(
                {
                    position: latlng,
                    icon: pinSymbol(color)
                }); 
                
                //Ajout du marqueur à la liste des marqueurs (pour les supprimer)
                listeMarker.push(marker);
                //Ajout du marqueur à la carte
                marker.setMap(map);
            }
        }
    }
}; 


//Fonction de suppression de marqueurs
function markerDelAgain() 
{
    for(i=0;i<listeMarker.length;i++) 
    {
        listeMarker[i].setMap(null);
	}  
}


//Fog of war
function drawCircle(point, radius, dir) 
{ 
    // input radius in metres
    
    radius = radius * 0.000621371
    var d2r = Math.PI / 180;   // degrees to radians 
    var r2d = 180 / Math.PI;   // radians to degrees 
    var earthsradius = 3963; // 3963 is the radius of the earth in miles
    var points = 32; 

    // find the radius in lat/lon 
    var rlat = (radius / earthsradius) * r2d; 
    var rlng = rlat / Math.cos(point.lat() * d2r); 

    var extp = new Array(); 
    if (dir==1)   
        {var start=0;var end=points+1} // one extra here makes sure we connect the ends
    else      
        {var start=points+1;var end=0}
    
    for (var i=start; (dir==1 ? i < end : i > end); i=i+dir) 
    { 
        var theta = Math.PI * (i / (points/2)); 
        ey = point.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta) 
        ex = point.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta) 
        extp.push(new google.maps.LatLng(ex, ey)); 
    } 
    return extp;
}  
    
    
/*
function drawMultiplesCircles(tableau)
{
    var radius = 10;
    var listeCircles=new Array();
    var sortie = new Array();
    
    // Creation de tous les cercles 
    for (var i=0; i<tableau.length; i++)
    {
        listeCircles.push(new google.maps.Circle({
            center: tableau[i],
            radius:radius
        }));
    }
    
    // Parcours de chaque coordonnees des delimiteurs de chacun des cercles
    for (var i=0; i<tableau.length; i++) 
    {
        var extp = drawCircle(tableau[i],10,-1);
        
        for (var j=0; j<extp.length; j++)
        {
            // Teste pour chacun de ces points s'il est dans un des polygones. Si ce n'est pas le cas, on l'ajoute à la liste.
            var estDedans=0;
            for (var k=0; k<listeCircles.length; k++) 
            {
                console.log(extp[j]);
                console.log(listeCircles[j]);
                if (typeof listeCircles[j] !== "undefined")
                {
                    if (listeCircles[j].getBounds().contains(extp[j])==true)
                    {
                        estDedans=1;
                        break;
                    }
                }                
            }
            if (!estDedans)
            {
                sortie.push(extp[j]);
            }
        }               
    }
    console.log(sortie);
    
    return sortie;
}    
*/
    
//Recuperation position utilisateur
var latlng;
var orientation;
var fogWarCircle;
var superposition = 0;


// Fonction de callback en cas de succès
function maPosition(position) {
    //console.log(position.coords.latitude );
 
    var infopos = "Position déterminée :\n";
    infopos += "Latitude : "+position.coords.latitude +"\n";
    infopos += "Longitude: "+position.coords.longitude+"\n";
    infopos += "Altitude : "+position.coords.altitude +"\n";
    infopos += "Vitesse  : "+position.coords.speed +"\n";
    infopos += "Orientation : "+position.coords.heading + "\n";
    document.getElementById("infoposition").innerHTML = infopos;
    
    // Un nouvel objet LatLng pour Google Maps avec les paramètres de position
    latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //console.log(position.coords.latitude);
    //latlng2 = new google.maps.LatLng(position.coords.latitude+1, position.coords.longitude+1);

    var listeCircle = new Array();
    listeCircle.push(latlng);
    //listeCircle.push(latlng2);
    // Permet de centrer la carte sur la position latlng
    map.panTo(latlng);
	
			
    // Options du cercle 1 
    var fogWar = {
      strokeColor: '#444444',
      strokeOpacity: 0.1,
      strokeWeight: 0,
      fillColor: '#444444',
      fillOpacity: 0.5,
      map: map,
      paths: [outerbounds,drawCircle(latlng,rayon,-1)]//drawMultiplesCircles(listeCircle)]
    };
    

    // Ajout du cercle 1 à la carte
    fogWarCircle = new google.maps.Polygon(fogWar);
	

    // Marqueur position utilisateur
    var positionMarker = new google.maps.Circle({
        strokeColor: '#0000FF',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#0000FF',
        fillOpacity: 0.35,
        map: map,
        center: latlng,
        radius: position.coords.accuracy
    });
    
    if (superposition==1)
    {
        removePolygone();
        positionMarker.setMap(null);
    }
    
    superposition = 1;
    
    //Suppression des marqueurs joueurs
    markerDelAgain();
    //Creation du marqueur
    
    var color = "#0F0";
    var marker = new google.maps.Marker(
    {
        position: latlng,
        icon: pinSymbol(color)
    }); 
    //Ajout du marqueur à la liste des marqueurs (pour les supprimer)
    listeMarker.push(marker);
    //Ajout du marqueur à la carte
    marker.setMap(map);
    requeteAjaxLocalisation("id="+id+"&loc=("+position.coords.latitude+","+position.coords.longitude+")");
    
    
    
	window.setTimeout(function(){navigator.geolocation.getCurrentPosition(maPosition,errorCallback,{enableHighAccuracy : true, timeout:100000, maximumAge:100000});},8000);
 
}

//Fonction de callback en cas d'echec
function errorCallback(error){
    
  switch(error.code){
    case error.PERMISSION_DENIED:
      console.log("L'utilisateur n'a pas autorisé l'accès à sa position");
      break;      
    case error.POSITION_UNAVAILABLE:
      console.log("L'emplacement de l'utilisateur n'a pas pu être déterminé");
      break;
    case error.TIMEOUT:
      console.log("Le service n'a pas répondu à temps");
      break;
    }
    
};

//Fonction pour éviter la superposition du brouillard de guerre
function removePolygone() 
{
  fogWarCircle.setMap(null);
}



//Gestion des evenements
    //Objet window
window.addEventListener('load',function (e){
	navigator.geolocation.getCurrentPosition(maPosition,errorCallback,{enableHighAccuracy : true, timeout:100000, maximumAge:100000});} ,false);


