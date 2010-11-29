/*All code copyright 2010 by Jay Crossler - CC BY/3.0 license */


//ToDo: Checking browser type is a kludge
var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

var Painter = {
	currentLayer: 0,
	tileToPaint: 0,
	optionPainterSelect: 0,
	init: function(){
		drawImageOnCanvas("painter_palette","images/tiles.png");
		Painter.listSelectableMaps("listofmaps");
	},
	addCanvasEvents: function(){
	  document.body.addEventListener('touchmove',ev_touch_body,false);
	  window.addEventListener('resize',Painter.sizeCanvasToMax,false);


	  var canv_obj = document.getElementById('main_canvas');
	  canv_obj.addEventListener('mousemove', ev_mousemove, false);
	  canv_obj.addEventListener('mouseup', ev_mouseup, false);
	  canv_obj.addEventListener('mousedown', ev_mousedown, false);	
	  canv_obj.addEventListener('touchstart', touchHandler, false);	
	  canv_obj.addEventListener('touchmove', touchHandler, false);	
	  canv_obj.addEventListener('touchend', touchHandler, false);	
      canv_obj.addEventListener("touchcancel", touchHandler, true);    


	  var paint_obj = document.getElementById('painter_palette');
	  paint_obj.addEventListener('click', ev_click_painter, false);	
	  
	  
	  Painter.optionPainterSelect = document.getElementById('painter_layer_num');
	  Painter.optionPainterSelect.addEventListener('change', ev_change_painter, false);


	  var footer_obj = document.getElementById('bottomLeft');
	  footer_obj.addEventListener('touchmove', ev_click_footer, false);
//	  footer_obj.addEventListener('click', ev_click_footer, false);

	},
	setLayerOptions: function(){ //add new message
		if(Painter.optionPainterSelect){
			for (var i=0;i<Game.numLayers;i++) {
				var opt_new = new Option(Game.tileEngine[i].layerName, i, false, false);
				Painter.optionPainterSelect.options[i] = opt_new;
			}	
		}
	},
	sizeCanvasToMax: function(){
		if (Game && Game.tileEngine) {
			var canv = Game.tileEngine[0].canvas; //TODO: Move Canvas out of TileEngine
			if (canv) {
				var ctx = canv.getContext("2d");
				//Set the canvas height based on the 1st layer size
				canv.setAttribute('width', document.body.clientWidth);
				canv.setAttribute('height',  document.body.clientHeight);
//				ctx.fillStyle = "rgb(1,1,1)";
//				ctx.fillRect (0,0, canv.clientWidth, canv.clientHeight);
				Game.hasChanged = true;
		
				//Game.tileEngine[0].canvas.setAttribute('width', (Game.tileEngine[0].tilesWide * Game.tileEngine[0].tileWidth)); //set attributes of canvas
				//Game.tileEngine[0].canvas.setAttribute('height', (Game.tileEngine[0].tilesHigh * Game.tileEngine[0].tileHeight));
			}
		}
	},
	listSelectableMaps: function(divContainer){
		var listHolder = document.getElementById(divContainer);
		var MapsList = MapModel.listMaps("local");
		var strItems = '<span onclick="MapModel.saveCurrentMap();">[SAVE]</span><br/>';

		for (var i=0;i<10;i++) {  //TODO: Update beyond temp
			if (MapsList[i]) 
				strItems += "<span onclick='MapModel.loadMapById("+i+");'>" + MapsList[i] + "</span> " +
				"[<span onclick='MapModel.deleteMap("+i+");'>DEL</span>]<br/>";
		}
		listHolder.innerHTML = strItems;
	}

	
};
 function ev_touch_body(event) {
  // Tell Safari not to move the window.
  event.preventDefault() ;
 }
 var isfooterdown = true;
 function ev_click_footer(event) {
	  var footer_obj = document.getElementById('bottomLeft');
	  if (isfooterdown) {
		  footer_obj.style.height = (document.getElementById('painter_palette').height+30)+"px"; 
		  // //TODO: Make based on amount of Mouse Move
		  footer_obj.style.width = document.getElementById('painter_palette').width+"px"; 
		  isfooterdown = false;
	  } else {
		  footer_obj.style.height = "60px";
		  footer_obj.style.width = "150px";
		  isfooterdown = true;
	  }
 }
 
//----------------
//From: http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript
//Intercepts iOs and Android touch events, turns into drag events
function touchHandler(event)
{
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
         switch(event.type)
    {
        case "touchstart": type="mousedown"; break;
        case "touchmove":  type="mousemove"; break;        
        case "touchend":   type="mouseup"; break;
        default: return;
    }

    //initMouseEvent(type, canBubble, cancelable, view, clickCount, 
    //           screenX, screenY, clientX, clientY, ctrlKey, 
    //           altKey, shiftKey, metaKey, button, relatedTarget);
    
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                              first.screenX, first.screenY, 
                              first.clientX, first.clientY, false, 
                              false, false, false, 0/*left*/, null);

    first.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

//----------------
var isMouseDownOnCanvas = false;
function ev_mousemove (ev) {
  var coords = getCoords(ev);
  
  var tilepos = MapModel.tileScreenXYBasedOnMouseOverXY(coords.x,coords.y);
  var zoneinf = MapModel.zoneAndTileNumBasedOnMapXY(tilepos.x, tilepos.y);
  var tileval = MapModel.tileValBasedOnArrayNum(MapModel.tileArrayNumBasedOnMapXY(tilepos.x, tilepos.y));
  Message.newMessageSingle("Tile: " + tilepos.x + " " + tilepos.y + " - Zone:" + zoneinf.zone + " Tile:" + zoneinf.tile + " - Val:" + tileval);
  
  if(isMouseDownOnCanvas) {
    MapModel.updateMapTileAtXY(tilepos.x, tilepos.y, Painter.tileToPaint);
    Game.hasChanged = true;
  }
};
function ev_mousedown (ev) {
  isMouseDownOnCanvas = true;
  var coords = getCoords(ev);
  
  Game.fps = 0.1;
  Game.startTimer();
  var tiles = MapModel.tileScreenXYBasedOnMouseOverXY(coords.x,coords.y);
  MapModel.updateMapTileAtXY(tiles.x, tiles.y, Painter.tileToPaint);
  Game.hasChanged = true;

};
function ev_mouseup (ev) {
	isMouseDownOnCanvas = false;
	Game.fps = Game.fpsOld;
    Game.startTimer();

};
//-------------------

function ev_click_painter (ev) {
  var canvas = ev.currentTarget;
  var coords = getCoords(ev);

  var i = Painter.currentLayer;
  var pos_x=0, pos_y=0, tile=0, border_size=0;
  
  pos_x = Math.floor(coords.x / Game.tileEngine[i].tileWidth);
  pos_y = Math.ceil(coords.y / Game.tileEngine[i].tileHeight);
  tile = ((pos_y -1) * Game.tileEngine[i].sourceTileAcross) + pos_x;
  Message.newMessageSingle("Tile to paint with: #" + tile + " from layer " + i);

  Painter.tileToPaint = tile;
};

function ev_change_painter (ev) {
	var i = Painter.optionPainterSelect.selectedIndex;
	Painter.currentLayer = i;
	Painter.tileToPaint = 0;
	drawImageOnCanvas("painter_palette",Game.tileEngine[i].sourceFiles);
	if (!isfooterdown) {
	  var img = new Image();
	  img.onload = function(){
		document.getElementById('bottomLeft').style.width = img.width+"px"; 
		document.getElementById('bottomLeft').style.height = (img.height+30)+"px"; 
	  }
	  img.src = Game.tileEngine[i].sourceFiles;
	}
}


//-------------------
function drawImageOnCanvas(canvasid, imgsrc) {
  var canv= document.getElementById(canvasid);
  if (canv) {
	  var ctx = canv.getContext('2d');
	  var img = new Image();
	  img.onload = function(){
		canv.width = img.width;
		canv.height = img.height;
		ctx.drawImage(img,0,0);
	  }
	  img.src = imgsrc;
   }
}
function getCoords(e) {
	var posx = 0;
	var posy = 0;
	if (!e) var e = window.event;
	if (e.pageX || e.pageY) 	{
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) 	{
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	if (e.currentTarget) {
		//ToDo: Recursively find parent's OffsetTops, not just one level up


		posx -= (e.currentTarget.offsetLeft + e.currentTarget.parentNode.offsetLeft) ;
		posy -= (e.currentTarget.offsetTop + e.currentTarget.parentNode.offsetTop);		
	}

	// posx and posy contain the mouse position relative to the document
	// Do something with this information
	return {"x": posx, "y": posy};
}
