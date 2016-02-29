//Creation de l'objet map
var map = new google.maps.Map(document.getElementById("map"),
	{
		center:new google.maps.LatLng(0,0),
		zoom:18,
		
	});

	
// Pour passer en vue satellite 
//map.setMapTypeId(google.maps.MapTypeId.SATELLITE);	

// Pour passer en vue hybride 
//map.setMapTypeId(google.maps.MapTypeId.HYBRID);	

// Pour passer en vue TERRAIN
//map.setMapTypeId(google.maps.MapTypeId.TERRAIN);

// Chargement des tuiles (donnees google - vue satellite)
map.setMapTypeId(google.maps.MapTypeId.ROADMAP);


// Fonction de callback en cas de succès
function positionActuelle(position) {
    // Un nouvel objet LatLng pour Google Maps avec les paramètres de position
    latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map.panTo(latlng);
	window.setTimeout(function(){navigator.geolocation.getCurrentPosition(positionActuelle,errorCallback,{enableHighAccuracy : true, timeout:100000, maximumAge:100000});},8000);
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
    
//Gestion des evenements
    //Objet window
window.addEventListener('load',function (e){
    
    navigator.geolocation.getCurrentPosition(positionActuelle,errorCallback,{enableHighAccuracy : true, timeout:100000, maximumAge:100000});
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(eventData) {
	  
            // gamma: Incline l'appareil de gauche à droite. Incliner l'appareil vers la droite donnera lieu à une valeur positive.
            var tiltLR = eventData.gamma;

            // beta: Incline l'appareil de l'avant vers l'arrière. Incliner l'appareil vers l'avant se traduira par une valeur positive.
            var tiltFB = eventData.beta;

            // alpha: La direction de la boussole du dispositif est en degrés.
            var dir = eventData.alpha

        // Appelle la fonction qui utilise les données de la page
        deviceOrientationHandler(tiltLR, tiltFB, dir);
        }, false);
    } else {
        document.getElementById("notice").innerHTML = "Désolé. L'API DeviceOrientationEvent n'est pas prise en charge par ce navigateur."
    };
    
    function deviceOrientationHandler(tiltLR, tiltFB, dir) {
      // Rotation de la map
      var compassDisc = document.getElementById("map");
      compassDisc.style.webkitTransform = "rotate("+ -dir +"deg)";
      compassDisc.style.MozTransform = "rotate("+ -dir +"deg)"; // préfixe pour le navigateur Mozilla
      compassDisc.style.transform = "rotate("+ -dir +"deg)"; // préfixe pour les autres navigateurs
      
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    } ,false);






