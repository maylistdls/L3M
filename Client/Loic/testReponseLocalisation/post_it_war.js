// Requete Ajax
function requeteAjax(e,requete) 
{
    // Connexion au fichier php
	var ajax = new XMLHttpRequest(); 
	ajax.open('POST', '../../../Serveur/loc.php', true); 
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


// Resultat de la requete ajax
function affiche(data)
{
    var regExp = /\(([^)]+)\)/g;
        
    for	(index = 0; index < data.length; index++) {
        console.log("changement equipe ");
        var equipe = data[index];
        for	(index_equipe = 0; index_equipe < equipe.length; index_equipe++) {
            var point = equipe[index_equipe];
            var coordonnees = point.loc;
            var matches = coordonnees.match(regExp);
            coordonnees = coordonnees.substring(1, coordonnees.length - 1);
            coordonnees = coordonnees.split(",");
            var x = parseFloat(coordonnees[0]);
            var y = parseFloat(coordonnees[1]);
            console.log(x,y);
        }
    }
}; 


// Preparation de la requete ajax
function calculeMontant(e)
{
    requeteAjax(e,"id=1");
}

window.addEventListener("load",function(e){
    var boutonMontant = document.getElementById("boutonMontant");

    // Calcul du montant
boutonMontant.addEventListener("click",function(e){calculeMontant(e)},true);
    
}, false);
