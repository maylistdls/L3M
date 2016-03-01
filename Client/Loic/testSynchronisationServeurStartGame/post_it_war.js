// Requete Ajax
function requeteAjax(e,requete) 
{
    // Connexion au fichier php
	var ajax = new XMLHttpRequest(); 
	ajax.open('POST', 'serveur.php', true); 
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
    console.log(data);
}; 


// Preparation de la requete ajax
function calculeMontant(e)
{
    requeteAjax(e,"requete=2");
}

window.addEventListener("load",function(e){
    var boutonMontant = document.getElementById("boutonMontant");

    // Calcul du montant
boutonMontant.addEventListener("click",function(e){calculeMontant(e)},true);
    
}, false);
