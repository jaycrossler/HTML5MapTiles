/*All code copyright 2010 by Jay Crossler unless otherwise attributed - BY/3.0 License */

var MapModel = { //object to parse JSON and update map model
	//MapModel.putMapIdDataName(0,MapModel.mapAsJSON(),"Tank Map","local");
	//MapModel.listMaps("local")
	//MapModel.getMapById(0,"local");
	message: 0, //hold element where messages will be added
	init: function(){
		Message.message = document.getElementById('message');
	},
	getMapById: function(mapid, source) {
		var mapdata;
		if (source=="local") { //use local HTML5 Storage
			mapdata = localStorage.getItem("SMORGmap" + mapid);
		}
		return mapdata;
	},
	loadMapById: function(mapid, source) {
		var mapdata = MapModel.getMapById(mapid, "local");
		Game.createTiles(mapdata);
	},
	putMapIdDataName: function(mapid, mapdata, mapname, source) {
		if (source=="local") { //use local HTML5 Storage
		//TODO: Check for overflow
			localStorage.setItem("SMORGmap" + mapid, mapdata); //saves to the database, “key”, “value”
			localStorage.setItem("SMORGmapName" + mapid, mapname); //saves to the database, “key”, “value”
		}	
	},
	saveCurrentMap: function(source) {
		var MapsList = MapModel.listMaps("local");
		var countMaps = MapsList.length;
		MapModel.putMapIdDataName(countMaps, MapModel.mapAsJSON(), "Map "+countMaps,"local");
		Painter.listSelectableMaps("listofmaps");
	},
	listMaps: function(source, filter) {
		var listOfMapNames = [];
		if (source=="local") { //use local HTML5 Storage
		//TODO: Temporary solution - assumes two variables saved for every map
			for (var i=0;i<10;i++) {
				var mapname = "SMORGmapName" + i;
				var mapdataname = localStorage.getItem(mapname);
				if (mapdataname) {
					listOfMapNames.push(mapdataname);
				}
			}
		}
		return listOfMapNames;	
	},
	deleteMap: function(mapid, source) {
		localStorage.removeItem("SMORGmap" + mapid); 
		localStorage.removeItem("SMORGmapName" + mapid);
	Painter.listSelectableMaps("listofmaps");
	},
	initJSON: function(msg){ //add new message
//TODO
	},
	mapAsJSON: function(){ //add new message
		var strL, layer, strJSON =
			'{"tilesWide": ' + Game.tileEngine[0].tilesWide + ', ' +
			'"tilesHigh": ' + Game.tileEngine[0].tilesHigh + ', ' +
			'"layers": [';
		for (var i=0;i<Game.numLayers;i++) {
			layer = Game.tileEngine[i];
			strL = '{"layerName": "'+ layer.layerName + '", ' +
				'"sourceFiles": "'+ layer.sourceFiles + '", ' +
				'"sourceTileCounts": '+ layer.sourceTileCounts + ', ' +
				'"sourceTileAcross": '+ layer.sourceTileAcross + ', ' +
				'"tileOffsetX": '+ layer.tileOffsetX + ', ' +
				'"tileOffsetY": '+ layer.tileOffsetY + ', ' +
				'"tileWidth": '+ layer.tileWidth + ', ' +
				'"tileHeight": '+ layer.tileHeight + ', ' +
				'"zoneTilesWide": '+ layer.zoneTilesWide + ', ' +
				'"zoneTilesHigh": '+ layer.zoneTilesHigh + ', ' +
				'"showZoneColors": '+ layer.showZoneColors + ', ' +
				'"tilesArray": [';
			for (var t=0;t<layer.tilesArray.length-1;t++)
				strL += vJS(layer.tilesArray[t]) + ', ';
			strL += vJS(layer.tilesArray[layer.tilesArray.length -1]) + ']},';
			strJSON += strL;
		}
		strJSON = strJSON.substring(0, strJSON.length-1);
		strJSON += ']}';
		return strJSON;
	},
	updateMapTiles: function(msg){ //add new message
//TODO
	},
	updateMapTileAtXY: function(x,y,num,engine){ //add new message
		if (is_firefox) {
			var selecteditem = document.getElementById('painter_layer_num').selectedIndex;
		} else {
			var selecteditem = paint.painter_layer_num.selectedIndex ;
		}
	    if (engine === undefined) {
			if (is_firefox) {
				engine = document.getElementById('painter_layer_num').options[ selecteditem ].value[0];
			} else {
				engine = paint.painter_layer_num.options[ selecteditem ].value[0] ; 
			}	    
		}
		if(Game.tileEngine[engine]){
			var tilenum = this.zoneAndTileNumBasedOnMapXY(x,y,engine);
			var TileEngine = Game.tileEngine[engine];
			TileEngine.zones[tilenum.zone].tiles[tilenum.tile].sourceIndex = num;
			
			//Draw just this layer+zone for speed reasons, it will be redrawn soon
			TileEngine.zones[tilenum.zone].drawTiles(0,0,TileEngine.width, TileEngine.height);
			TileEngine.ctx.drawImage(TileEngine.zones[tilenum.zone].canvas, TileEngine.zones[tilenum.zone].left, TileEngine.zones[tilenum.zone].top);
			TileEngine.tilesArray[tilenum.tileid] = num;
		}		
	},
	addSprite: function(msg){ //add new message
//TODO
	},
	updateSprite: function(msg){ //add new message
//TODO
	},
	tileNumBasedOnScreenXY: function(x,y){ 
	  var tilepos = MapModel.tileScreenXYBasedOnMouseOverXY(x,y);
	  var tileval = MapModel.tileValBasedOnArrayNum(MapModel.tileArrayNumBasedOnMapXY(tilepos.x, tilepos.y));
	  return tileval;
	},
	tileScreenXYBasedOnMouseOverXY: function(x,y,engine){
		var pos_x=0, pos_y=0, border_size=0;
	    if (engine === undefined) {
		  engine = Painter.currentLayer;
	    }		
		if(Game.tileEngine[engine]){	
			//TODO: Position seems to have an 8 pixel border when there is no border assigned, make it dynamic?
			pos_x = Math.ceil((x - border_size) / Game.tileEngine[engine].tileWidth) -1;
			pos_y = Math.ceil((y - border_size) / Game.tileEngine[engine].tileHeight) -1;
		}
		return {"x":pos_x, "y":pos_y};
	},
	zoneAndTileNumBasedOnMapXY: function(x,y,engine){
		var tile_x, tile_y, zone_x, zone_y, zone_tot, zone=0, tile=0, zonesinwidth, tilewidthofzone,tile_eng;
	    if (engine === undefined) {
		  engine = Painter.currentLayer;
	    }		
		tile_eng = Game.tileEngine[engine];
		
		if(tile_eng && tile_eng.zones[zone]){	
			zone_x = Math.ceil((x+1) / tile_eng.zoneTilesWide);
			zone_y = Math.ceil((y+1) / tile_eng.zoneTilesHigh);
			zone_tot = (y * tile_eng.tilesWide) + x;
			zonesinwidth = Math.ceil(tile_eng.tilesWide / tile_eng.zoneTilesWide);
			zone = ((zone_y-1) * zonesinwidth) + zone_x -1;
			
			if (tile_eng.zones[zone] && tile_eng.zones[zone].tiles) {
				//Handle the case where the leftmost zone is "sliced off" by the board
				tilewidthofzone = Math.ceil((tile_eng.zones[zone].tiles.length / (tile_eng.zoneTilesWide * tile_eng.zoneTilesHigh)) *tile_eng.zoneTilesWide);
				tile_x = Math.ceil(x % tile_eng.zoneTilesWide);
				tile_y = Math.ceil(y % tile_eng.zoneTilesHigh);
				tile = (tile_y * tilewidthofzone) + tile_x;
			}
		}
		return {"zone":zone, "tile":tile, "tileid":zone_tot};
	},
	tileArrayNumBasedOnMapXY: function(x,y,engine){
		var val=0;
	    if (engine === undefined) {
		  engine = Painter.currentLayer;
	    }		
		if(Game.tileEngine[engine]){	
			val=x + (y * Game.tileEngine[engine].tilesWide);
		}
		return val;
	},
	tileValBasedOnArrayNum: function(i,engine){
		var val=0;
	    if (engine === undefined) {
		  engine = Painter.currentLayer;
	    }		
		if(Game.tileEngine[engine]){	
			val=Game.tileEngine[engine].tilesArray[i];
		}
		return val;
	}


};

function vJS (val) { //returns string version of a JSON value
	if (val) return val
	else return -1;
}

MapModel.init();
