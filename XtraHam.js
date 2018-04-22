
//Called when application is started.
function OnStart()
{
    app.LoadScript("Html/jquery-3.min.js");
    fldr = app.GetPrivateFolder( "xtraham" );
    exists = app.FileExists( fldr + "/src.txt" );
    if (exists){app.DeleteFile(fldr + "/src.txt");}
      exists = app.FileExists( fldr + "/html.txt" );
    if (exists){app.DeleteFile(fldr + "/html.txt");}  
    app.EnableBackKey( false );
	//Create a layout with objects vertically centered.
	lay = app.CreateLayout( "linear", "VCenter,FillXY" );	

	//Create a web control.
	web = app.CreateWebView( 1, 1, "AllowRemote");
	web.SetUserAgent("Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36");
	lay.AddChild( web );
	web.LoadUrl( "start.html");
	web2 = app.CreateWebView( 0, 0, "AllowRemote");
	web2.SetUserAgent("Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36");
	lay.AddChild( web2 );
	app.AddLayout( lay );
	

}

//do as page loads
function web_OnProgess( progress )
{

}

function OnBack()
{
    if(web.CanGoBack())
    {
        web.Back();
    } else {
        app.Exit
    }
} 
 
//Send an http get request. 
 function SendRequest( url ) 
{ 
   var url = app.ReadFile("/sdcard/url.txt");
    var httpRequest = new XMLHttpRequest(); 
    httpRequest.onreadystatechange = function() { HandleReply(httpRequest); }; 
    httpRequest.open("GET", url, true); 

    httpRequest.send(null); 
 
    app.ShowProgress( "Scanning Source Code..." ); 
} 
 
//Handle the server's reply (a json object). 
function HandleReply( httpRequest ) 
{ 
    fldr = app.GetPrivateFolder( "xtraham" );
    if( httpRequest.readyState==4 ) 
    { 
        //If we got a valid response. 
        if( httpRequest.status==200 ) 
        { 
           var message = httpRequest.responseText;
            app.WriteFile("/sdcard/source.txt", message);
            var n1 = message.search("pictures_block");
            var n2 = message.search("gallery-info", n1);
            var n3 = message.slice(n1-12, n2-9);
            var myHtml ="<html><script src='file:///android_asset/app.js'></script><body onload='grabimg()'>" + n3 + "<script>function grabimg(){var images = document.querySelectorAll('img');var myPix = []; for(var i = 0;i < images.length;i++){var image = images[i];var x=image.src;var ext=x.substr(-4);var x2=x.slice(0, -7); x2 +='1000'+ext; myPix[i]=x2;}fldr=app.GetPrivateFolder('xtraham');app.WriteFile(fldr+'/src.txt', myPix); app.Execute('getUrls()');}</script></body></html>";
            app.WriteFile("/sdcard/myHtml.txt", myHtml);
            web2.LoadHtml(myHtml);
            
            
        } 
        //An error occurred 
        else 
           app.Alert( "Error: " + httpRequest.status + httpRequest.responseText); 
           app.HideProgress();
    } 
   
}

function getUrls(){
       web.LoadUrl("pics.html");

}



function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}