function assaut() 
{
    //Connexion au fichier php
	var ajax = new XMLHttpRequest(); 
	ajax.open('POST', 'serverRequeteMaxime.php', true); 
	ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); 
	
    //Ecoute de la reponse
    ajax.addEventListener('readystatechange', 
		function(e) 
        { 
			if(ajax.readyState == 4 && ajax.status == 200)  //Si le .php a bien renvoyé des données
			{
                console.log("assaut lancé");
			} 
		}
	); 
	
    //Generation de la requete
	var data = "idJoueur="+idJoueur+"&requete=assaut";
    
    //Envoi de la requete
	ajax.send(data);
};