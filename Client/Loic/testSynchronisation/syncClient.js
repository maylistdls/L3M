
var HeureServeurOffset = new Date();
HeureServeurOffset = (Math.floor(HeureServeurOffset.getTime()/1000)+5)*1000; // Delai de 5 secondes 


function boucle2(){
    var now = new Date();
    now = Math.floor(now.getTime()/1000)*1000
    if (now > HeureServeurOffset)
    {
        console.log("time's up");
        return false;
    }
    return true;
}
function test(){
    console.log(new Date);
    
    console.log("+10");
    window.setTimeout(function(){test();},10000);
}
window.addEventListener('load',function (e){
    console.log(new Date())
    while(boucle2()){};
    test();
    } ,false);