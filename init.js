
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

function encode(){
	document.getElementById("map").style.width="60%";
	document.getElementById("tweet").style.display="block";
	var urlEncoder="geotweet.php?twitter_query=";
	var uri = document.getElementById("hashtag").value;
	var res = encodeURIComponent(uri);
	var lien = "https://api.twitter.com/1.1/search/tweets.json?q=";
	var url = encodeURIComponent(lien+res);
	urlEncoder+= url;
	ajax = creeRequete();
	ajax.onreadystatechange = ecoute;
	envoyerRequete(ajax,urlEncoder);
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
					for(i=0;i<jason.search_metadata.count;i++){
						if(jason.statuses[i].geo!=null){
							var coord = jason.statuses[i].geo.coordinates;
							 y = coord[0];
							 x = coord[1];
						document.getElementById("contenuTweet").innerHTML+="<div id='unTweet' onclick='marker("+x+","+y+")'><img src='"+jason.statuses[i].user.profile_image_url_https+"'/>"+jason.statuses[i].user.name+" @"+jason.statuses[i].user.screen_name+"</br>"+ jason.statuses[i].text+"<hr></br></div>";
						}
						else{
							document.getElementById("contenuTweet").innerHTML+="<div id='unTweet'><img src='"+jason.statuses[i].user.profile_image_url_https+"'/>"+jason.statuses[i].user.name+" @"+jason.statuses[i].user.screen_name+"</br>"+ jason.statuses[i].text+"<hr></br></div>";
						}
					} 
	        }
    	}
  
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