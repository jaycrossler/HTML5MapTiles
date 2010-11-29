/*All code copyright 2010 by Jay Crossler unless otherwise attributed - BY/3.0 License */

var MapModel = { //object to parse JSON and update map model
	message: 0, //hold element where messages will be added
	init: function(){
		Message.message = document.getElementById('message');
	},
	initJSON: function(msg){ //add new message
//TODO
	},
	updateJSON: function(msg){ //add new message
//TODO
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
	    if (engine === undefined) {
		  engine = Painter.currentLayer;
	    }		
		if(Game.tileEngine[engine]){
			var tilenum = this.zoneAndTileNumBasedOnMapXY(x,y,engine);
			Game.tileEngine[engine].zones[tilenum.zone].tiles[tilenum.tile].sourceIndex = num;
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
		var tile_x, tile_y, zone_x, zone_y, zone=0, tile=0, zonesinwidth, tilewidthofzone,tile_eng;
	    if (engine === undefined) {
		  engine = Painter.currentLayer;
	    }		
		tile_eng = Game.tileEngine[engine];
		
		if(tile_eng && tile_eng.zones[zone]){	
			zone_x = Math.ceil((x+1) / tile_eng.zoneTilesWide);
			zone_y = Math.ceil((y+1) / tile_eng.zoneTilesHigh);
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
		return {"zone":zone, "tile":tile};
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


MapModel.init();
