
var ajax;
var jason;
var map;
var calqueMarkers;
var icon ;


function init() {
	map = new OpenLayers.Map("map");
	map.addLayer(new OpenLayers.Layer.OSM());
	map.addControl(new OpenLayers.Control.LayerSwitcher({'ascending':false}));
   	map.zoomTo(3);
}

function entrer(event) {
        if (event.which == 13 || event.keyCode == 13) {
            encode()
        }
    };

function langue(){
	var selectElmt = document.getElementById("select");
	var valeur=selectElmt.options[selectElmt.selectedIndex].value;
	if(valeur==2){
		document.getElementById("rafraichir").innerHTML="Refresh";
		selectElmt.options[0].innerHTML="French";
		selectElmt.options[1].innerHTML="English";
		document.getElementById("lier").innerHTML="Linking tweets";
		document.getElementById("Grossir").innerHTML="Larger tweets according to their importance";
	}
	if(valeur==1){
		document.getElementById("rafraichir").innerHTML="Rafraichir";
		selectElmt.options[0].innerHTML="Francais";
		selectElmt.options[1].innerHTML="Anglais";
		document.getElementById("lier").innerHTML="Lier les tweets";
		document.getElementById("Grossir").innerHTML="Grossir les tweets selon leur importance";
	}
}

function encode(){
	var uri = document.getElementById("hashtag").value;
	if(uri!=""){
		document.getElementById("tweet").style.display="block";
		var urlEncoder="geotweet.php?twitter_query=";
		var res = encodeURIComponent(uri);
		var lien = "https://api.twitter.com/1.1/search/tweets.json?q=";
		var url = encodeURIComponent(lien+res);
		urlEncoder+= url;
		ajax = creeRequete();
		ajax.onreadystatechange = ecoute;
		envoyerRequete(ajax,urlEncoder);
	}
}


function creeRequete(){
	var xmlhttp;
	if (window.XMLHttpRequest)
 	 {// code for IE7+, Firefox, Chrome, Opera, Safari
  		xmlhttp=new XMLHttpRequest();
  	}
	else
 	 {// code for IE6, IE5
  		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  	}
	return xmlhttp;
}


function envoyerRequete(xmlhttp,url){
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
}

function ecoute(){
	if (ajax.readyState == 4)
   	 {
        	if (ajax.status == 200)
        	{	
					jason=eval('(' + ajax.responseText + ')');
					console.log(jason);
					document.getElementById("contenuTweet").innerHTML="";
					var x;
					var y; 
					var reg=new RegExp(/@[a-zA-Z0-9_-]*/);;
					for(i=0;i<jason.search_metadata.count;i++){ 
						if(jason.statuses[i].geo!=undefined){
							var coord = jason.statuses[i].geo.coordinates;
							 y = coord[0];
							 x = coord[1];
							if(jason.statuses[i].retweeted_status!=undefined){
								document.getElementById("contenuTweet").innerHTML+="<div id='unTweetGeo' onclick='marker("+x+","+y+")'><img src='"+jason.statuses[i].user.profile_image_url_https+"'/>"+jason.statuses[i].user.name+" <a href='http://www.twitter.com/"+jason.statuses[i].user.screen_name+"' target='_blank'>@"+jason.statuses[i].user.screen_name+"</a></br>"+ processTweetLinks(jason.statuses[i].text)+"</br>tweet crée le "+jason.statuses[i].retweeted_status.created_at+"  et retweeté:"+jason.statuses[i].retweet_count+" fois<hr></div>";
							}
							else{
								document.getElementById("contenuTweet").innerHTML+="<div id='unTweetGeo' onclick='marker("+x+","+y+")'><img src='"+jason.statuses[i].user.profile_image_url_https+"'/>"+jason.statuses[i].user.name+" <a href='http://www.twitter.com/"+jason.statuses[i].user.screen_name+"' target='_blank'>@"+jason.statuses[i].user.screen_name+"</a></br>"+ processTweetLinks(jason.statuses[i].text)+"</br><hr></div>";
							}
						}
						else{
							if(jason.statuses[i].retweeted_status!=undefined){
								document.getElementById("contenuTweet").innerHTML+="<div id='unTweet'><img src='"+jason.statuses[i].user.profile_image_url_https+"'/>"+jason.statuses[i].user.name+" <a href='http://www.twitter.com/"+jason.statuses[i].user.screen_name+"' target='_blank'>@"+jason.statuses[i].user.screen_name+"</a></br>"+ processTweetLinks(jason.statuses[i].text)+"</br>tweet crée le "+jason.statuses[i].retweeted_status.created_at+"  et retweeté:"+jason.statuses[i].retweet_count+" fois<hr></div>";
							}
							else{
								document.getElementById("contenuTweet").innerHTML+="<div id='unTweet'><img src='"+jason.statuses[i].user.profile_image_url_https+"'/>"+jason.statuses[i].user.name+" <a href='http://www.twitter.com/"+jason.statuses[i].user.screen_name+"' target='_blank'>@"+jason.statuses[i].user.screen_name+"</a></br>"+ processTweetLinks(jason.statuses[i].text)+"</br><hr></div>";
							}
						}
					} 
	        }
    	}
  
}

function processTweetLinks(text) {
	var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
	text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
	exp = /(^|\s)#(\w+)/g;
	text = text.replace(exp, "$1<a href='http://search.twitter.com/search?q=%23$2' target='_blank'>#$2</a>");
	exp = /(^|\s)@(\w+)/g;
	text = text.replace(exp, "$1<a href='http://www.twitter.com/$2' target='_blank'>@$2</a>");
	return text;
	}
function marker(x,y){
 
    var lonLat = new OpenLayers.LonLat( x ,y )
          .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
          );
 
    var zoom=16;
 
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
 
    markers.addMarker(new OpenLayers.Marker(lonLat));
 
    map.setCenter (lonLat, zoom);
}