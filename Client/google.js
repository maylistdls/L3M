// VARIABLES GLOBALES

//Variables globales pour la carte
var map;
var listeMarker = []; //Pour pouvoir supprimer les marqueurs
var lstMarkerQG = [];
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
var latlng;
var orientation;
var fogWarCircle;
var superposition = 0;	


//Variables globales pour le jeu 
var capaMax = 200;
var capa = capaMax;
var dureeTourDeJeu = 30000; //120000 = 2 minutes
var dureePartie = 60000; //120000 = 2 minutes
var id = 4;
var etat = 'obs';
var directionTir = '0';
var rayonObs = '70';
var directionProtect = '0';
var envoieRequete;
var roundDeg;
var rayon = 70;	
var angleParRapportAuNord = 0;
var equipe = 1;
var listeQG = new Object();
var listeBatterie = new Object();
var partie = 0;


// Variables globales pour l'interface
var derniereAction;
var parametrageDerniereAction;
var observation;
var assaut;
var tir ;
var protection;
var recup;
var progressBar;
var QGBar;
var initialisation;
var information_initialisation;
var map_initialisation;
var etape_en_cours;
var nombreBalise;
var nombreTotalDeBaliseAPlacer;
var nombreTotalDeBaliseParEquipe;
var listeObjetQGBatterie;





// FONCTIONNALITES
// Fonctionnalites cartographiques

 

function pinSymbolJoueur(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
   };
}

function pinSymbolBatterie(color) {
    return {
        path: 'M24-8c0 4.4-3.6 8-8 8h-32c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h32c4.4 0 8 3.6 8 8v32z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 0.5,
   };
}


function pinSymbolQG(color) {
    return {
        path: 'M18.8-31.8c.3-3.4 1.3-6.6 3.2-9.5l-7-6.7c-2.2 1.8-4.8 2.8-7.6 3-2.6.2-5.1-.2-7.5-1.4-2.4 1.1-4.9 1.6-7.5 1.4-2.7-.2-5.1-1.1-7.3-2.7l-7.1 6.7c1.7 2.9 2.7 6 2.9 9.2.1 1.5-.3 3.5-1.3 6.1-.5 1.5-.9 2.7-1.2 3.8-.2 1-.4 1.9-.5 2.5 0 2.8.8 5.3 2.5 7.5 1.3 1.6 3.5 3.4 6.5 5.4 3.3 1.6 5.8 2.6 7.6 3.1.5.2 1 .4 1.5.7l1.5.6c1.2.7 2 1.4 2.4 2.1.5-.8 1.3-1.5 2.4-2.1.7-.3 1.3-.5 1.9-.8.5-.2.9-.4 1.1-.5.4-.1.9-.3 1.5-.6.6-.2 1.3-.5 2.2-.8 1.7-.6 3-1.1 3.8-1.6 2.9-2 5.1-3.8 6.4-5.3 1.7-2.2 2.6-4.8 2.5-7.6-.1-1.3-.7-3.3-1.7-6.1-.9-2.8-1.3-4.9-1.2-6.4z',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
   };
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
                    icon: pinSymbolJoueur(color)
                }); 
                
                //Ajout du marqueur à la liste des marqueurs (pour les supprimer)
                listeMarker.push(marker);
                //Ajout du marqueur à la carte
                marker.setMap(map);
            }
        }
    }
}; 





// Fonction de callback en cas de succès
function maPosition(position) {
    
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
	
	// Ajout du cercle 1 à la carte
    fogWarCircle = new google.maps.Polygon(fogWar);
	
    
    superposition = 1;
    
    //Suppression des marqueurs joueurs
    markerDelAgain();
    //Creation du marqueur
    
    var marker = new google.maps.Marker(
    {
        position: latlng,
        icon: pinSymbolJoueur("#0F0")
    }); 
    //Ajout du marqueur à la liste des marqueurs (pour les supprimer)
    listeMarker.push(marker);
    //Ajout du marqueur à la carte
    marker.setMap(map);
    requeteAjaxLocalisation("id="+id+"&loc=("+position.coords.latitude+","+position.coords.longitude+")&partie="+partie+"&equipe="+equipe);
    
    
    
	window.setTimeout(function(){navigator.geolocation.getCurrentPosition(maPosition,errorCallback,{enableHighAccuracy : true, timeout:100000, maximumAge:100000});},8000);
 
}





//Fonction de suppression de marqueurs
function markerDelAgain() 
{
    for(i=0;i<listeMarker.length;i++) 
    {
        listeMarker[i].setMap(null);
	}  
}

//Fonction de suppression de marqueurs
function markerDelAgainQG() 
{
    for(i=0;i<lstMarkerQG.length;i++) 
    {
        lstMarkerQG[i].setMap(null);
    }  
    lstMarkerQG=[];
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


// Fonctionnalites interface

var tourne_camembert = function (angle){
	document.getElementById("camembert").style.transform = "scale(2) rotate("+angle+"deg)";
}




	
function tooltipVal2(args) {
	var roundDeg = args.value;
	angleParRapportAuNord = roundDeg;
    parametrageDerniereAction.innerHTML = "Angle : "+roundDeg+" degrés";
    tourne_camembert(roundDeg);
			
    return roundDeg+"°";
}

/*
$(function(){
    var $zoneEcouteur = $('body');
    var $container = $('#rotationSliderContainer');
    var $slider = $('#rotationSlider');
	//var $camembert = $('#camembert');
    var $degrees = $('#rotationSliderDegrees');
    
    var sliderWidth = $slider.width();
    var sliderHeight = $slider.height();
    var radius = $container.width()/2;
    var deg = 0;    
    
    X = Math.round(radius* Math.sin(deg*Math.PI/180));
    Y = Math.round(radius*  -Math.cos(deg*Math.PI/180));
    $slider.css({ left: X+radius-sliderWidth/2, top: Y+radius-sliderHeight/2 });
    
    var mdown = false;
    $zoneEcouteur
    .mousedown(function (e) { mdown = true; e.originalEvent.preventDefault(); })
    .touchstart(function (e) { mdown = true; e.originalEvent.preventDefault(); })
    .mouseup(function (e) { mdown = false; })
    .touchend(function (e) { mdown = false; })
    .mousemove(function (e) {
        if(mdown && document.getElementById("rotationSlider").style.visibility == "visible")
        {
            
            // firefox compatibility
            if(typeof e.offsetX === "undefined" || typeof e.offsetY === "undefined") {
               var targetOffset = $(e.target).offset();
               e.offsetX = e.pageX - targetOffset.left;
               e.offsetY = e.pageY - targetOffset.top;
            }
            
            if($(e.target).is('#rotationSliderContainer'))
                var mPos = {x: e.offsetX, y: e.offsetY};
            else
                var mPos = {x: e.target.offsetLeft + e.offsetX, y: e.target.offsetTop + e.offsetY};
                
            var atan = Math.atan2(mPos.x-radius, mPos.y-radius);
            deg = -atan/(Math.PI/180) + 180; // final (0-360 positive) degrees from mouse position 
            
            
            // for attraction to multiple of 90 degrees
            var distance = Math.abs( deg - ( Math.round(deg / 90) * 90 ) );
            
            if( distance <= 5 )
                deg = Math.round(deg / 90) * 90;
                
            if(deg == 360)
                deg = 0;
            
            X = Math.round(radius* Math.sin(deg*Math.PI/180));
            Y = Math.round(radius*  -Math.cos(deg*Math.PI/180));

            $slider.css({ left: X+radius-sliderWidth/2, top: Y+radius-sliderHeight/2 });
            
            roundDeg = Math.round(deg);
            
            $degrees.html(roundDeg + '&deg;');
            $('#imageRotateDegrees').val(roundDeg);
            
            angleParRapportAuNord = roundDeg;
            parametrageDerniereAction.innerHTML = "Angle : "+roundDeg+" degrés";
            tourne_camembert(roundDeg);
                
        }
    })
	.touchmove(function (e) {
        if(mdown && document.getElementById("rotationSlider").style.visibility == "visible")
        {
			
			
			var touchobj = e.changedTouches[0] // reference first touch point (ie: first finger)
			
			var startx = parseInt(touchobj.clientX) // get x position of touch point relative to left edge of browser
			var starty = parseInt(touchobj.clientY) // get x position of touch point relative to left edge of browser
			
			// firefox compatibility
            if(typeof e.offsetX === "undefined" || typeof e.offsetY === "undefined") {
               var targetOffset = $(e.target).offset();
               startx = e.pageX - targetOffset.left;
               starty = e.pageY - targetOffset.top;
            }
			
			
            
            if($(e.target).is('#rotationSliderContainer'))
                var mPos = {x: startx, y: starty};
            else
                var mPos = {x: e.target.offsetLeft + startx, y: e.target.offsetTop + startx};
                
            var atan = Math.atan2(mPos.x-radius, mPos.y-radius);
            deg = -atan/(Math.PI/180) + 180; // final (0-360 positive) degrees from mouse position 
            
            
            // for attraction to multiple of 90 degrees
            var distance = Math.abs( deg - ( Math.round(deg / 90) * 90 ) );
            
            if( distance <= 5 )
                deg = Math.round(deg / 90) * 90;
                
            if(deg == 360)
                deg = 0;
            
            X = Math.round(radius* Math.sin(deg*Math.PI/180));
            Y = Math.round(radius*  -Math.cos(deg*Math.PI/180));

            $slider.css({ left: X+radius-sliderWidth/2, top: Y+radius-sliderHeight/2 });
            
            roundDeg = Math.round(deg);
            
            $degrees.html(roundDeg + '&deg;');
            $('#imageRotateDegrees').val(roundDeg);
            
            angleParRapportAuNord = roundDeg;
            parametrageDerniereAction.innerHTML = "Angle : "+roundDeg+" degrés";
            tourne_camembert(roundDeg);
                
        }
    });
});
*/




createCamember = function(){
    var zone_mobile = new Image();
	zone_mobile.setAttribute('id','camembert');
	zone_mobile.src = 'camembert3.png'
	document.getElementById("map").appendChild(zone_mobile);
	zone_mobile.style.position = "relative";
	zone_mobile.style.zIndex = "10";
	zone_mobile.style.width = "500px";
	zone_mobile.style.height = "500px";
	zone_mobile.style.transform = "scale(2)";
	zone_mobile.style.opacity = "0.4";
    zone_mobile.style.visibility = "hidden";
    
}





zone_tir = function (event) {
    document.getElementById("rotationSlider").style.visibility = "visible";
    document.getElementById("camembert").style.visibility = "visible";
    document.getElementById("rotationSliderContainer").style.border = "1px solid";
    
}





function compte_a_rebours_TOUR()
{
	var compte_a_rebours = document.getElementById("compteARebours");
	var date_actuelle = new Date();
	var total_secondes = Math.floor((DateDeFinEnMilliSeconde - date_actuelle) / 1000);
    var minutes = "";
    var secondes = "";
    var suffixe = "";
	var prefixe = "Fin du tour dans ";
	if (total_secondes < 0)
	{
        var point="";
        switch (Math.abs(total_secondes)%3)
        {
            case 0:
            point = ".";
            break;
            case 1: 
            point = "..";
            break;
            case 2 : 
            point = "...";
            break;
        }
		prefixe = "Attente du serveur"+point;
        if (envoieRequete)
        {
            requeteAjaxAction(preparationRequete());
        }
        // envoie donnees tour de jeu
	}
    else
	{
        secondes = total_secondes % 60;
        minutes = (total_secondes - secondes) / 60;
        
        if (secondes < 10)
        {
            secondes = "0"+secondes;
        }
        suffixe = minutes + ':' + secondes;
        envoieRequete = true;
	}
    
    compte_a_rebours.innerHTML = prefixe +" "+ suffixe;

	var actualisation = setTimeout("compte_a_rebours_TOUR();", 1000);
}





function compte_a_rebours_DEBUT_PARTIE()
{
	var compte_a_rebours = document.getElementById("compteARebours");
	var date_actuelle = new Date();
	var total_secondes = Math.floor((DateDeFinEnMilliSeconde - date_actuelle) / 1000);
    var minutes = "";
    var secondes = "";
    var suffixe = "";
	var prefixe = "Lancement de la partie dans ";
    //console.log(total_secondes);
	if (total_secondes < 0)
	{
        document.getElementById("partieLancee").style.visibility = "visible";
        DateDeFinEnMilliSeconde+=dureeTourDeJeu;
        compte_a_rebours_TOUR();
        navigator.geolocation.getCurrentPosition(maPosition,errorCallback,{enableHighAccuracy : true, timeout:100000, maximumAge:100000});
    
        
	}
    else
	{
        secondes = total_secondes % 60;
        minutes = (total_secondes - secondes) / 60;
        
        if (secondes < 10)
        {
            secondes = "0"+secondes;
        }
        suffixe = minutes + ':' + secondes;
        
        compte_a_rebours.innerHTML = prefixe +" "+ suffixe;
        var actualisation = setTimeout("compte_a_rebours_DEBUT_PARTIE();", 1000);
	}	
}





function hide_zone_tir()
{
    document.getElementById("rotationSlider").style.visibility = "hidden";
    document.getElementById("camembert").style.visibility = "hidden";
    document.getElementById("rotationSliderContainer").style.border = "0px solid";
};




function functionAction(cible)
{
    derniereAction.innerHTML = cible;
    switch (cible)
    {
        case "observation":
            etat = 'obs';
            document.body.style.background="#98FB98";
            hide_zone_tir();
            parametrageDerniereAction.innerHTML = "";
            break;
        case "assaut":
            etat = 'assaut';
            document.body.style.background="#B0E0E6";
            hide_zone_tir();
            parametrageDerniereAction.innerHTML = "";
            break;
        case "tir":
            etat = 'tir';
            document.body.style.background="#F4A460";
            zone_tir();
            break;
        case "protection":
            etat = 'protect';
            document.body.style.background="#FFD700";
            zone_tir();
            break;
        case "recup":
            etat = 'recup';
            document.body.style.background="#CD5C5C";
            hide_zone_tir();
            parametrageDerniereAction.innerHTML = "";
            break;
    }
};



// Fonctionnalites echange serveur 

preparationRequete = function()
{
    return "id="+id+"&etat="+etat+"&cap='"+angleParRapportAuNord+"'&rayonObs='"+rayon+"'&directionProtec='"+angleParRapportAuNord+"'&equipe="+equipe+"&partie="+partie;
}





// Requete Ajax pour la mise à jour de la localisation
function requeteAjaxAction(requete) 
{
    // Connexion au fichier php
	var ajax = new XMLHttpRequest(); 
	ajax.open('POST', '../Serveur/regle.php', true); 
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
	//## id=idBonhomme <= entier & etat = 'obs' ou 'tir' ou 'assaut' ou 'protec' ou 'recup' <= chaine de caractere & directionTir = angleParRapportAuNord <= chaine de caractere & rayonObs = '1.8' <= chaine de caractere &  directionProtec = angleParRapportAuNord <= chaine de caractere
    // Ecoute de la reponse
    ajax.addEventListener('readystatechange', 
		function(e) 
        { 
			if(ajax.readyState == 4 && ajax.status == 200)  // Si le .php a bien renvoyé des données
			{
                console.log("nouveau tour ! ");
                DateDeFinEnMilliSeconde = dateProchainEnvoi; 
                var data = JSON.parse(ajax.responseText); // Decodage des donnees	           
                console.log(data); // Execution de l'affichage
                listeObjetQGBatterie = data[0];
                afficherQG(listeObjetQGBatterie);

                rayon = parseInt(data[1].obs);
                capa = parseInt(data[1].capa);
                progressBar.value = capa;
                
			} 
		}
	); 
    var dateProchainEnvoi = new Date().getTime() + dureeTourDeJeu;
    // Envoi de la requete
    envoieRequete = false;
    console.log(requete);
	ajax.send(requete);
};





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






function requeteAjaxPlacementQG() 
{
    // Connexion au fichier php
	var ajax = new XMLHttpRequest(); 
	ajax.open('POST', 'Loic/testServeur/recupIdentifiant.php', true); 
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
	
    // Ecoute de la reponse
    ajax.addEventListener('readystatechange', 
		function(e) 
        { 
			if(ajax.readyState == 4 && ajax.status == 200)  // Si le .php a bien renvoyé des données
			{
				var data = JSON.parse(ajax.responseText); // Decodage des donnees
				id = data.identifiant;
                equipe = data.equipe;

                initialisation.style.visibility = "visible";

                if (id == 1 || id == 2 )
                {
                    information_initialisation.innerHTML+="Vous êtes le capitaine de l'équipe "+equipe+"! Rassemblez vos équipiers et choisissez la localisation de votre QG";
                    document.getElementById("map_initialisation").style.visibility = "visible";
                    marker = new google.maps.Marker({
                      map: map_initialisation,
                      draggable: true,
                      animation: google.maps.Animation.DROP,
                      position: latlng
                    });

                    google.maps.event.addListener(marker, 'dragend', function()
                    {
                        console.log(marker.getPosition().lat(), marker.getPosition().lng());
                    });

                    var btnValider = document.createElement("BUTTON");        // Create a <button> element
                    var text = document.createTextNode("Valider");       // Create a text node
                    btnValider.appendChild(text);                                // Append the text to <button>
                    initialisation.appendChild(btnValider);                    // Append <button> to <body>
                    btnValider.addEventListener("click", function(){
                        console.log(marker.getPosition().lat(), marker.getPosition().lng());
                        initialisation.style.visibility = "hidden";

                        document.getElementById("map_initialisation").style.visibility = "hidden";
                        requeteAjaxPlacementBatterie("equipe="+equipe+"&QGlat="+marker.getPosition().lat()+"&QGlon="+marker.getPosition().lng()) 
                    });

                    
                }
                else
                {
                    information_initialisation.innerHTML+="Rejoignez le capitaine de l'équipe "+equipe+" pour déterminer la localisation de votre QG";
                    requeteAjaxPlacementBatterie("");
                }
                

               


				//DateDeFinEnMilliSeconde = debutPartie*1000;
				//compte_a_rebours_DEBUT_PARTIE();
    
			} 
		}
	); 
    
    // Envoi de la requete
	ajax.send();
};





function requeteAjaxInformationJoueur() 
{
    // Connexion au fichier php
	var ajax = new XMLHttpRequest(); 
	ajax.open('POST', '../Serveur/qg.php', true); 
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
	
    // Ecoute de la reponse
    ajax.addEventListener('readystatechange', 
		function(e) 
        { 
			if(ajax.readyState == 4 && ajax.status == 200)  // Si le .php a bien renvoyé des données
			{
				var data = JSON.parse(ajax.responseText); // Decodage des donnees
				id = data.identifiant;
                equipe = data.equipe;
                partie = data.identifiantPartie;
                document.getElementById("equipe").innerHTML="Equipe "+equipe;
                initialisation.style.visibility = "visible";

                if (id == 1)
                {
                    information_initialisation.innerHTML+="Vous êtes le joueur "+id+". C'est à vous de configurer la partie."
                    
                    var init = 0;
                    var equipeEnCours = 1;
                    etape_en_cours.innerHTML+="Veuillez choisir la position du QG de l'équipe "+equipeEnCours;
                    document.getElementById("map_initialisation").style.visibility = "visible";
                    marker = new google.maps.Marker({
                      map: map_initialisation,
                      draggable: true,
                      animation: google.maps.Animation.DROP,
                      position: latlng
                    });

                    google.maps.event.addListener(marker, 'dragend', function()
                    {
                        console.log(marker.getPosition().lat(), marker.getPosition().lng());
                    });

                    var btnValider = document.createElement("BUTTON");        // Create a <button> element
                    btnValider.setAttribute("id", "boutonValider")
                    var text = document.createTextNode("Suivant");       // Create a text node
                    btnValider.appendChild(text);                                // Append the text to <button>
                    initialisation.appendChild(btnValider);                    // Append <button> to <body>
                    btnValider.addEventListener("click", function(){
                		if (init==0)
                		{
                			equipeEnCours+=1;
                			console.log(marker.getPosition().lat(), marker.getPosition().lng());
	                        initialisation.style.visibility = "hidden";
	                        document.getElementById("map_initialisation").style.visibility = "hidden";

	                        etape_en_cours.innerHTML="Veuillez choisir la position du QG de l'equipe "+equipeEnCours;
	                        initialisation.style.visibility = "visible";
	                        document.getElementById("map_initialisation").style.visibility = "visible";

	                        // Save the location of the marker
	                        QG = new Object;
	                        QG.lat = marker.getPosition().lat();
	                        QG.lng = marker.getPosition().lng();

	                        listeQG.equipe1 = QG;

	                        console.log(QG);
	                        init+=1;
	                        marker.setMap(null);
                    		marker = new google.maps.Marker({
		                      map: map_initialisation,
		                      draggable: true,
		                      animation: google.maps.Animation.DROP,
		                      position: latlng
		                    });

                		}
                		else if (init==1)
                		{
                			console.log(marker.getPosition().lat(), marker.getPosition().lng());
	                        initialisation.style.visibility = "hidden";
	                        document.getElementById("map_initialisation").style.visibility = "hidden";

	                        etape_en_cours.innerHTML="Veuillez choisir le nombre de batterie par équipe ";
	                        initialisation.style.visibility = "visible";

	                        // Save the location of the marker
	                        QG = new Object;
	                        QG.lat = marker.getPosition().lat();
	                        QG.lng = marker.getPosition().lng();

	                        listeQG.equipe2 = QG;

	                        console.log(listeQG);
	                        init+=1;
	                        marker.setMap(null);
                    		

		                    nombreBalise = document.createElement("INPUT");
							nombreBalise.setAttribute("type", "number");
							nombreBalise.value = "1";
							nombreBalise.min = "0";
							nombreBalise.max = "6";

							initialisation.insertBefore(nombreBalise,document.getElementById("map_initialisation"));

                		}
                		else if (init==2 && nombreBalise.value != 0)
                		{	
                			
	                			nombreTotalDeBaliseAPlacer = 2*parseInt(nombreBalise.value);
	                			nombreTotalDeBaliseParEquipe = parseInt(nombreBalise.value);
	                			nombreTotalDeBaliseParEquipePosee = 1;
	                			equipeEnCours=1;
	                			var baliseRestante = nombreTotalDeBaliseParEquipe-nombreTotalDeBaliseParEquipePosee;
		                        initialisation.style.visibility = "hidden";
		                        document.getElementById("map_initialisation").style.visibility = "hidden";

		                        etape_en_cours.innerHTML="Veuillez choisir la position de la batterie "+nombreTotalDeBaliseParEquipePosee+" de l'équipe "+equipeEnCours;
		                        initialisation.style.visibility = "visible";
		                        document.getElementById("map_initialisation").style.visibility = "visible";

		                        init+=1;
		                        marker.setMap(null);
	                    		marker = new google.maps.Marker({
			                      map: map_initialisation,
			                      draggable: true,
			                      animation: google.maps.Animation.DROP,
			                      position: latlng
			                    });
			                    initialisation.removeChild(initialisation.getElementsByTagName("input")[0]);
			                    for (var j=1; j<=2; j++)
			                    {
			                    	batterie = new Object;
				                    for (var i=1; i<=nombreTotalDeBaliseParEquipe; i++)
				                    {
				                    	batterie["numero"+i] = new Object;
				                    }
				                    listeBatterie["equipe"+j] = batterie;
			                    }
	                    	
		                    
		                    

                		}
                		else if (init==3 && nombreBalise.value!="0")
                		{
                			console.log(listeBatterie);
                			listeBatterie['equipe'+equipeEnCours]['numero'+nombreTotalDeBaliseParEquipePosee].lat = marker.getPosition().lat();
		                    listeBatterie['equipe'+equipeEnCours]['numero'+nombreTotalDeBaliseParEquipePosee].lng = marker.getPosition().lng();
                			
                			var baliseRestante = nombreTotalDeBaliseParEquipe-nombreTotalDeBaliseParEquipePosee;
                			if (baliseRestante==0)
                			{
                				nombreTotalDeBaliseParEquipePosee = 0
                				equipeEnCours+=1;
                			}
                			console.log(nombreTotalDeBaliseAPlacer);
                			nombreTotalDeBaliseAPlacer-=1;
                			nombreTotalDeBaliseParEquipePosee+=1;
                			console.log("balises restantes : ", baliseRestante);
                			
            				initialisation.style.visibility = "hidden";
	                        document.getElementById("map_initialisation").style.visibility = "hidden";

	                        etape_en_cours.innerHTML="Veuillez choisir la position de la batterie "+nombreTotalDeBaliseParEquipePosee+" de l'équipe "+equipeEnCours;
	                        initialisation.style.visibility = "visible";
	                        document.getElementById("map_initialisation").style.visibility = "visible";

	                        // SAVE THE LOCATION OF THE BATTERIE HERE
		                    marker.setMap(null);
                    		marker = new google.maps.Marker({
		                      map: map_initialisation,
		                      draggable: true,
		                      animation: google.maps.Animation.DROP,
		                      position: latlng
		                    });

		                    


		                    
		                    if (nombreTotalDeBaliseAPlacer==1)
		                    {
		                    	init+=1
		                    }

                		}
                		else if (init == 4 || nombreBalise.value =="0")
                		{
                			if (nombreBalise.value != "0")
                			{

	                			listeBatterie['equipe'+equipeEnCours]['numero'+nombreTotalDeBaliseParEquipePosee].lat = marker.getPosition().lat();
			                    listeBatterie['equipe'+equipeEnCours]['numero'+nombreTotalDeBaliseParEquipePosee].lng = marker.getPosition().lng();
                			}
                			else
                			{
                				init ==4;
                			}
                			console.log("toutes les balises ont été placées")
                			console.log(listeBatterie);
                			marker.setMap(null);
                			//initialisation.style.visibility = "hidden";
	                        document.getElementById("map_initialisation").style.visibility = "hidden";
	                        etape_en_cours.innerHTML="Tous les QG ont été placés. Toutes les batteries ont été placées";
	                        btnValider.textContent="Lancement de la partie";
	                        init+=1;
	                        
                		}
                		else if (init == 5)
                		{
                            initialisation.style.visibility = "hidden";
                            requeteAjaxDebutPartie2("listeQG="+JSON.stringify(listeQG)+"&listeBatterie="+JSON.stringify(listeBatterie)+"&partie="+partie);
                		}
                        
                        //requeteAjaxPlacementQG("equipe="+equipe+"&QGlat="+marker.getPosition().lat()+"&QGlon="+marker.getPosition().lng()) 

                    });

                    
                }
                else
                {
                    information_initialisation.innerHTML+="Rejoignez le joueur 1 pour déterminer les paramètres de la partie";

                    var btnLancement = document.createElement("BUTTON");        // Create a <button> element
                    var text = document.createTextNode("Lancer la partie");       // Create a text node
                    btnLancement.appendChild(text);                                // Append the text to <button>
                    initialisation.appendChild(btnLancement);                    // Append <button> to <body>
                    btnLancement.addEventListener("click", function(){
                        initialisation.style.visibility = "hidden";
                        //requeteAjaxPlacementBatterie("equipe="+equipe+"&QGlat="+marker.getPosition().lat()+"&QGlon="+marker.getPosition().lng())
                        requeteAjaxDebutPartie2("partie="+partie); 
                    });
                }
                

               


				//DateDeFinEnMilliSeconde = debutPartie*1000;
				//compte_a_rebours_DEBUT_PARTIE();
    
			} 
		}
	); 
    
    // Envoi de la requete
	ajax.send();
};




// Requete Ajax pour la mise à jour de la localisation
function requeteAjaxPlacementBatterie(requete) 
{
    // Connexion au fichier php
    var ajax = new XMLHttpRequest(); 
    ajax.open('POST', 'Loic/testServeur/QGplaces.php', true); 
    ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    
    // Ecoute de la reponse
    ajax.addEventListener('readystatechange', 
        function(e) 
        { 
            if(ajax.readyState == 4 && ajax.status == 200)  // Si le .php a bien renvoyé des données
            {
                var data = JSON.parse(ajax.responseText); // Decodage des donnees       
                console.log(data); // Execution de l'affichage
                if (data=="chooseYourBatteryLocation")
                {
                    console.log("ok");
                    information_initialisation.innerHTML = "Maintenant choississez la position de votre batterie";
                    initialisation.style.visibility = "visible";
                    document.getElementById("map_initialisation").style.visibility = "visible";
                    marker.setMap(null);
                    initialisation.removeChild(initialisation.getElementsByTagName("button")[0]);
                    marker = new google.maps.Marker({
                      map: map_initialisation,
                      draggable: true,
                      animation: google.maps.Animation.DROP,
                      position: latlng
                    });

                    google.maps.event.addListener(marker, 'dragend', function()
                    {
                        console.log(marker.getPosition().lat(), marker.getPosition().lng());
                    });

                    var btnValider = document.createElement("BUTTON");        // Create a <button> element
                    var text = document.createTextNode("Valider la batterie");       // Create a text node
                    btnValider.appendChild(text);                                // Append the text to <button>
                    initialisation.appendChild(btnValider);                    // Append <button> to <body>
                    btnValider.addEventListener("click", function(){
                        console.log(marker.getPosition().lat(), marker.getPosition().lng());
                        initialisation.style.visibility = "hidden";

                        document.getElementById("map_initialisation").style.visibility = "hidden";
                        requeteAjaxDebutPartie("joueur="+id+"&Batterielat="+marker.getPosition().lat()+"&Batterielon="+marker.getPosition().lng()) 
                    });

                }
            } 
        }
    ); 
    
    // Envoi de la requete
    ajax.send(requete);
};






function requeteAjaxDebutPartie(requete) 
{
    // Connexion au fichier php
    var ajax = new XMLHttpRequest(); 
    ajax.open('POST', 'Loic/testServeur/startGame.php', true); 
    ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    
    // Ecoute de la reponse
    ajax.addEventListener('readystatechange', 
        function(e) 
        { 
            if(ajax.readyState == 4 && ajax.status == 200)  // Si le .php a bien renvoyé des données
            {
                marker.setMap(null);
                document.body.removeChild(initialisation);
                var data = JSON.parse(ajax.responseText); // Decodage des donnees
                console.log(data)
                var debutPartie = data[1];
                listeObjetQGBatterie = data[0];
                var regExp = /\(([^)]+)\)/g;
                var color = "#FF0";
                console.log(listeObjetQGBatterie)
                for (index_listeObjetQGBatterie = 0; index_listeObjetQGBatterie < listeObjetQGBatterie.length; index_listeObjetQGBatterie++) {
                    var point = equipe[index_listeObjetQGBatterie];
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
                            icon: pinSymbolJoueur(color)
                        }); 
                        
                        //Ajout du marqueur à la liste des marqueurs (pour les supprimer)
                        listeMarker.push(marker);
                        //Ajout du marqueur à la carte
                        marker.setMap(map);
                    }
                }




                DateDeFinEnMilliSeconde = debutPartie*1000;
                compte_a_rebours_DEBUT_PARTIE();
    
            } 
        }
    ); 
    
    // Envoi de la requete
    ajax.send(requete);
};

function requeteAjaxDebutPartie2(requete) 
{
    // Connexion au fichier php
    var ajax = new XMLHttpRequest(); 
    ajax.open('POST', '../Serveur/start.php', true); 
    ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
    
    // Ecoute de la reponse
    ajax.addEventListener('readystatechange', 
        function(e) 
        { 
            if(ajax.readyState == 4 && ajax.status == 200)  // Si le .php a bien renvoyé des données
            {
                document.body.removeChild(initialisation);
                var data = JSON.parse(ajax.responseText); // Decodage des donnees
                console.log(data)
                var debutPartie = data[1];
                console.log(debutPartie);
                listeObjetQGBatterie = data[0];
                afficherQG(listeObjetQGBatterie);

                
                DateDeFinEnMilliSeconde = debutPartie*1000;
                compte_a_rebours_DEBUT_PARTIE();
    
            } 
        }
    ); 
    
    // Envoi de la requete
    ajax.send(requete);
};


  

       



//Fonction pour ajouter une popup pour plusieurs markers
function makeInfoWindowEvent(map, infowindow, contentString, marker) {
    google.maps.event.addListener(marker, 'click', function() 
        {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
        },false);
}




function afficherQG(listeObjetQGBatterie)
{
    markerDelAgainQG();
    // IL FAUT RECUPERER POUR CHAQUE OBJET DE CE TABLEAU listeObjetQGBatterie LES COORDONNEES lat lng pour afficher les marqueurs correspondant au QG 
    var regExp = /\(([^)]+)\)/g;
    var color = "#FF0";
    console.log(listeObjetQGBatterie)
    for (index_listeObjetQGBatterie = 0; index_listeObjetQGBatterie < listeObjetQGBatterie.length; index_listeObjetQGBatterie++) {

        var point = listeObjetQGBatterie[index_listeObjetQGBatterie];
        var coordonnees = point.loc;
        
        var matches = coordonnees.match(regExp);
        coordonnees = coordonnees.substring(1, coordonnees.length - 1);
        coordonnees = coordonnees.split(",");
        var x = parseFloat(coordonnees[0]);
        var y = parseFloat(coordonnees[1]);
        

        if (point.equipe == "1" )
        {
            
            var color = "#F00";
        }
        else 
        {
            
            var color = "#FF0";
        }


        latlng = new google.maps.LatLng(x, y);
        
        if (point.qg_bat)
        {
            var marker = new google.maps.Marker(
            {
                position: latlng,
                icon: pinSymbolQG(color),
               
            }); 
        }
        else
        {
            var marker = new google.maps.Marker(
            {
                position: latlng,
                icon: pinSymbolBatterie(color),
                
            }); 
        }
        
        
        lstMarkerQG.push(marker);
        

        var infowindow = new google.maps.InfoWindow();
        makeInfoWindowEvent(map, infowindow, "<b>Capacite :</b> " + point.capa, marker);    



        marker.setMap(map);
    
    }
}
    
   
    













//Gestion des evenements
    //Objet window
window.addEventListener('load',function (e){
	map = new google.maps.Map(document.getElementById("map"),
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
	
	derniereAction = document.getElementById("derniereAction");
	parametrageDerniereAction = document.getElementById("parametrageDerniereAction");
		
	progressBar = document.getElementById("avancement");
	progressBar.max = capaMax;
	progressBar.value = capaMax;

    QGBar = document.getElementById("QGavancement");
    QGBar.max = capaMax;
    QGBar.value = capaMax;
	
	createCamember();
	
	observation = document.getElementById("observation");
	observation.addEventListener("click", function(){functionAction("observation")}, false);

	assaut = document.getElementById("assaut");
	assaut.addEventListener("click", function(){functionAction("assaut")}, false);

	tir = document.getElementById("tir");
	tir.addEventListener("click", function(){functionAction("tir")}, false);

	protection = document.getElementById("protection");
	protection.addEventListener("click", function(){functionAction("protection")}, false);

	recup = document.getElementById("recup");
	recup.addEventListener("click", function(){functionAction("recup")}, false);


    $("#rotationSlider").roundSlider({
    sliderType: "min-range",
    min: 0,
    max: 359,
    value: 0,
    startAngle: 90,
    tooltipFormat: tooltipVal2
	});

    
    document.getElementById("rotationSlider").style.visibility = "hidden";
    document.getElementById("rotationSlider").style.opacity = "0.4";
    document.getElementById("rotationSlider").style.position = "relative";
    document.getElementById("rotationSlider").style.width = "100%";
    document.getElementById("rotationSlider").style.height = "100%";
    document.getElementById("rotationSlider").style.borderRadius = "550px";
    //document.getElementById("rotationSlider").style.zIndex = "-1";
    document.getElementById("rotationSlider").style.border = "0px solid";


    document.getElementsByClassName("rs-container")[0].style.position = "relative";
    document.getElementsByClassName("rs-container")[0].style.width = "100%";
    document.getElementsByClassName("rs-container")[0].style.height = "100%";


    initialisation = document.getElementById("initialisation");
    information_initialisation = document.getElementById("information_initialisation");    
    etape_en_cours = document.getElementById("etape_en_cours");
    

    initialisation.style.visibility = "hidden";
    map_initialisation = new google.maps.Map(document.getElementById("map_initialisation"),
    {
        center:new google.maps.LatLng(0,0),
        zoom:18,
        
    });

    map_initialisation.setMapTypeId(google.maps.MapTypeId.ROADMAP);

    document.getElementById("map_initialisation").style.visibility = "hidden";
    navigator.geolocation.getCurrentPosition(function(position){
        latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map_initialisation.panTo(latlng);

    },errorCallback,{enableHighAccuracy : true, timeout:100000, maximumAge:100000});
    
    
	requeteAjaxInformationJoueur();
    
    } ,false);
