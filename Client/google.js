//Creation de l'objet map
var map = new google.maps.Map(document.getElementById("map"),
    {
        center:new google.maps.LatLng(0,0),
        zoom:18,
    });
    
    
    
//Chargement des tuiles (donnees google - vue satellite)
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
}


//Requete Ajax
function requeteAjax(e,nombre) 
{
    //Connexion au fichier php
	var ajax = new XMLHttpRequest(); 
	ajax.open('POST', 'server.php', true); 
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
	
    //Ecoute de la reponse
    ajax.addEventListener('readystatechange', 
		function(e) 
        { 
			if(ajax.readyState == 4 && ajax.status == 200)  //Si le .php a bien renvoyé des données
			{
                var data = JSON.parse(ajax.responseText); //Decodage des donnees		
				affiche(data); //Execution de l'affichage
			} 
		}
	); 
	
    //Generation de la requete
	var data = "requete=addTdt&nbr="+nombre;
    
    //Envoi de la requete
	ajax.send(data);
};        
           
*/     

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
    
    
    
//Recuperation position utilisateur
var latlng;
var orientation;
var fogWarCircle;
var superposition = 0;




// Fonction de callback en cas de succès
function maPosition(position) {
    console.log(position.coords.latitude );
 
    var infopos = "Position déterminée :\n";
    infopos += "Latitude : "+position.coords.latitude +"\n";
    infopos += "Longitude: "+position.coords.longitude+"\n";
    infopos += "Altitude : "+position.coords.altitude +"\n";
    infopos += "Vitesse  : "+position.coords.speed +"\n";
    infopos += "Orientation : "+position.coords.heading + "\n";
    document.getElementById("infoposition").innerHTML = infopos;
    
    // Un nouvel objet LatLng pour Google Maps avec les paramètres de position
    latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    
    // Permet de centrer la carte sur la position latlng
    map.panTo(latlng);
    
    
    // options for the polygon
    var fogWar = {
      strokeColor: '#444444',
      strokeOpacity: 0.1,
      strokeWeight: 0,
      fillColor: '#444444',
      fillOpacity: 0.5,
      map: map,
      paths: [outerbounds,drawCircle(latlng,10,-1)]
    };
    
    // Add the circle to the map
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
        radius: 5
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

    var marker = new google.maps.Marker(
    {
        position: latlng
    }); 
    //Ajout du marqueur à la liste des marqueurs (pour les supprimer)
    listeMarker.push(marker);
    //Ajout du marqueur à la carte
    marker.setMap(map);
    
    
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
window.addEventListener('load',function (e){navigator.geolocation.getCurrentPosition(maPosition,errorCallback,{enableHighAccuracy : true, timeout:100000, maximumAge:100000});} ,false);
