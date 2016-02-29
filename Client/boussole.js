document.addEventListener("DOMContentLoaded", function(event) {

	if (window.DeviceOrientationEvent) {
	  document.getElementById("notice").innerHTML = "Cool! L'API DeviceOrientationEvent est prise en charge par ce navigateur.";
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
      document.getElementById("tiltLR").innerHTML = Math.ceil(tiltLR);
      document.getElementById("tiltFB").innerHTML = Math.ceil(tiltFB);
      document.getElementById("direction").innerHTML = Math.ceil(dir);
      
      // Rotation de la flèche du compas
      var compassDisc = document.getElementById("map");
      compassDisc.style.webkitTransform = "rotate("+ -dir +"deg)";
      compassDisc.style.MozTransform = "rotate("+ -dir +"deg)"; // préfixe pour le navigateur Mozilla
      compassDisc.style.transform = "rotate("+ -dir +"deg)"; // préfixe pour les autres navigateurs
      
    }

});