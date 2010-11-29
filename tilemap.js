/*All code copyright 2010 by John Graham unless otherwise attributed*/
//Minor changes by Jay Crossler - CC BY/3.0 license

function newSourceImage(){ //image used to create tile 
	var SourceImage = {
		imageFilename: 0, //filename for image
		image: 0, //dom image object
		is_ready: 0, //is image loaded and ready to be drawn
		init: function(file){
			try{
				SourceImage.imageFilename = file;
				SourceImage.is_ready = false;
				SourceImage.image = new Image();  //create new image object
				//SourceImage.image.src = file; //load file into image object
				console.log("About to load sourceimage "+ file);
				Cash.loadToImg(file, SourceImage.image, false); //Added Cash saving

			} catch (exception) {
				if (exception == QUOTA_EXCEEDED_ERR) {
					console.log("Over cache quota!");
				} else {
					console.log("Other exception!");
				}			
			}
		}
	};
	return SourceImage;
}

function newTileSource(){ //image used to create tile 
	var TileSource = {
		canvas: 0, //main canvas object
		ctx: 0, //main canvas drawing context
		sourceImage: 0, //image source for this tile
		init: function(width, height, src_x, src_y, source){
			try {
				TileSource.sourceImage = source;  //set image source
				TileSource.canvas = document.createElement('canvas');
				TileSource.ctx = TileSource.canvas.getContext('2d'); //create main drawing canvas
				TileSource.canvas.setAttribute('width', width); //set tile source canvas size
				TileSource.canvas.setAttribute('height', height);
				TileSource.ctx.drawImage(TileSource.sourceImage.image, src_x, src_y, width, height, 0, 0, width, height); //draw image to tile source canvas
			} catch (exception) {
				console.log("Other exception!");
			}
		}
	};
	return TileSource;
}

/*** function to create and then return a new Tile object */
function newTile(){
	var Tile = {
		x: 0, // X position of this tile
		y: 0, //Y position of this tile
		width: 0, //width and height of this tile
		height: 0,
		sourceIndex: 0, //index of tile source in tile engine's source array
		init: function(x, y, width, height, source){ //initialize sprite
			try {
				Tile.x = x;
				Tile.y = y;
				Tile.width = width;
				Tile.height = height;
				Tile.sourceIndex = source; // set index of tile source for this tile
			} catch (exception) {
				Message.addMessage("Other exception!");
			}
		}
	};
	return Tile;  //returns newly created sprite object
};

function newZone(){
	var Zone = {
		canvas: 0, //zone canvas object
		tileEngine: 0, //the main tile engine object (used to fetch tile sources)
		ctx: 0, //zone canvas drawing context
		left: 0, //x position of this zone in the tile map
		top: 0, //y position of this zone in the tile map
		right: 0, //x position of right edge
		bottom: 0, //y position of bottom edge
		tileWidth: 0,
		tileHeight: 0,
		width: 0,
		height: 0,
		color: 0,
		tiles: 0, //array of tiles in this zone
		init: function(engine, left, top, tilesWide, tilesHigh, tileWidth, tileHeight, width, height){
			Zone.tileEngine = engine;
			Zone.left = left;
			Zone.top = top;
			Zone.right = left + width;
			Zone.bottom = top + height;
			Zone.tileWidth = tileWidth;
			Zone.tileHeight = tileHeight;
			Zone.width = width;
			Zone.height = height;
			Zone.canvas = document.createElement('canvas');
			Zone.ctx = Zone.canvas.getContext('2d'); //create main drawing canvas
			Zone.canvas.setAttribute('width', width); //set tile source canvas size
			Zone.canvas.setAttribute('height', height);
			Zone.tiles = new Array();
			
			var r = Math.floor(Math.random() * 255);
			var g =  Math.floor(Math.random() * 255);
			var b =  Math.floor(Math.random() * 255);
			Zone.color = "rgba(" + r + "," + g + "," + b + ",.6)";
		},
		addTile: function(tile){
			Zone.tiles.push(tile);	
		},
		arrangeTiles: function(){
			var tiles_wide = Zone.width / Zone.tileWidth;
			var tiles_high = Zone.height / Zone.tileHeight;
			var index = 0;
			for(var i = 0; i < tiles_high; i++)
			{
				for(var j = 0; j < tiles_wide; j++)
				{
					Zone.tiles[index].x = j * Zone.tileWidth;
					Zone.tiles[index].y = i * Zone.tileHeight;
					index++;
				}
			}
		},
		drawTiles: function(viewX, viewY, viewWidth, viewHeight){
			Zone.ctx.clearRect(0,0,Zone.width, Zone.height);//clear main canvas
			if(Zone.tiles){
				var drawTiles = new Array(); //array to hold only the tiles we are drawing
				var x = viewX;
				var y = viewY;
				var width = viewWidth; 
				var height = viewHeight;
				for(var i = 0, ii = Zone.tiles.length; i < ii; i++){
					var check_tile = Zone.tiles[i];
								
					//check to see if each tile is outside the viewport
					if((check_tile.x >= width || check_tile.y >= height) ||((check_tile.x + check_tile.width) < x || (check_tile.y + check_tile.height < y))){
						continue;//if it's outside, loop again	
					}
					else{
						drawTiles.push(check_tile);	//if it's inside add it to be drawn
					}
				}
				//now loop through and draw only what needs to be drawn
				for(var j = 0, jj = drawTiles.length; j < jj; j++){
					var tile = drawTiles[j];
					if(Zone.tileEngine.tileSource[tile.sourceIndex]){
						Zone.ctx.drawImage(Zone.tileEngine.tileSource[tile.sourceIndex].canvas, tile.x, tile.y); //draw tile based on its source index and position					
					}
				}
			}
			//Added check for optional colors
			if(Game.tileEngine.showZoneColors) {
				Zone.ctx.fillStyle = Zone.color;    
				Zone.ctx.fillRect(0,0,Zone.width, Zone.height);
			}
		}
	};
	return Zone;
}
	

function newTileEngine(){
	var TileEngine = { //main canvas and demo container
		canvas: 0, //main canvas object
		ctx: 0, //main canvas drawing context
		tiles: 0, //array of tiles
		zones: 0, //array of tile zones
		sources: 0, //array of source images
		tileSource: 0, //array of tile source objects, one for each unique tile
		width: 0, //width of tile map
		height: 0,  //height of tile map
		zoneTilesWide: 0, //width in tiles of a zone
		zoneTilesHigh: 0,  //height in tiles of a zone
		tilesHigh: 0, //height in tiles of entire map
		tilesWide: 0, //width in tiles of entire map
		tileWidth: 0, //width in pixels single tile
		tileHeight: 0, //height in pixels of single tile
		layerName: "no name",
		sourceFiles: 0,
		sourceTileCounts: 0,
		sourceTileAcross: 0,
		tileOffsetX: 0,
		tileOffsetY: 0,
		tilesArray: 0,
		showZoneColors: 0,
		init: function(){ //initialize experiment
			TileEngine.canvas = document.getElementById('main_canvas');  //get canvas element from html
			TileEngine.ctx = TileEngine.canvas.getContext('2d'); //create main drawing canvas
//			TileEngine.canvas.setAttribute('width', TileEngine.width); //set attributes of canvas
//			TileEngine.canvas.setAttribute('height', TileEngine.height);
			TileEngine.sources = new Array();
			TileEngine.loadSource();
			TileEngine.sources[0].image.onload = function(){  //event handler for image load 
				TileEngine.sources[0].is_ready = true; // image source is ready when image is loaded
				TileEngine.tileSource = new Array();
				TileEngine.createTileSource(TileEngine.sourceTileCounts, TileEngine.sourceTileAcross);	//create tile sources using image source		
				Game.hasChanged = true; //added to force a redraw
//				Cash.saveImage(TileEngine.sources[0].image.src, TileEngine.sources[0].image);  //TODO: If not exist

			}
			TileEngine.tiles = new Array();
			TileEngine.zones = new Array();
			TileEngine.createTiles();  //create tiles - uses tilesArray declared below
			
		},
		setMapAttributes: function(obj){ //this function must be called prior to initializing tile engine
			TileEngine.width = obj.width;
			TileEngine.height = obj.height;
			TileEngine.tileWidth = obj.tileWidth;
			TileEngine.tileHeight = obj.tileHeight;
			TileEngine.zoneTilesWide = obj.zoneTilesWide;
			TileEngine.zoneTilesHigh = obj.zoneTilesHigh;
			TileEngine.tilesWide = obj.tilesWide;
			TileEngine.tilesHigh = obj.tilesHigh;
			TileEngine.sourceFiles = obj.sourceFiles;
			TileEngine.sourceTileCounts = obj.sourceTileCounts;
			TileEngine.sourceTileAcross = obj.sourceTileAcross;
			TileEngine.tileOffsetX = obj.tileOffsetX;
			TileEngine.tileOffsetY = obj.tileOffsetY;
			TileEngine.tilesArray = obj.tilesArray;
			TileEngine.showZoneColors = obj.showZoneColors;

//Added
			TileEngine.layerName = obj.layerName;
			TileEngine.startX = obj.startX;
			TileEngine.startY = obj.startY;
		},
		loadSource: function(){ //create and initialize image source
			var source = newSourceImage();  
			source.init(TileEngine.sourceFiles);
			TileEngine.sources.push(source);
		},
		drawFrame: function(){ //main drawing function
//			TileEngine.ctx.clearRect(0,0,TileEngine.width, TileEngine.height);  //clear main canvas
			if(TileEngine.zones){
				for(var i = 0, ii = TileEngine.zones.length; i < ii; i++){
					var check_zone = TileEngine.zones[i];
					//check to see if each zone is outside the viewport
					if((check_zone.x >= TileEngine.width || check_zone.y >= TileEngine.height)||((check_zone.x + check_zone.width) < TileEngine.x || (check_zone.y + check_zone.height < TileEngine.y))){ //only draw zones that are in the viewport
						continue;//if it's outside, loop again	
					}
					else{
						TileEngine.zones[i].drawTiles(0,0,TileEngine.width, TileEngine.height);
						TileEngine.ctx.drawImage(TileEngine.zones[i].canvas, TileEngine.zones[i].left, TileEngine.zones[i].top);
					}
				}
	
			}
		},
		createTileSource: function(count, accross){ //create tiles sources
			var accross_count = 0;
			var x = 0;
			var y = 0;
			for(var i = 0; i < count; i++){
				var new_tileSource = newTileSource();
				new_tileSource.init(TileEngine.tileWidth, TileEngine.tileHeight, x, y, TileEngine.sources[0]);
				TileEngine.tileSource.push(new_tileSource);
				accross_count++;
				x += TileEngine.tileWidth;
				if(accross_count >= accross){
					accross_count = 0;
					y += TileEngine.tileHeight;
					x = 0;
				}
			}
		},
		createZones: function(){//create array of zones for map
			//caluculate how many zones we need (width by height)
			var zone_wide = Math.ceil(TileEngine.tilesWide/TileEngine.zoneTilesWide);
			var zone_high = Math.ceil(TileEngine.tilesHigh/TileEngine.zoneTilesHigh);

			/*these are used if tilemap is not evenly divisible by size of zones in tiles
			**they are used to define the size of zones on the right and bottom edges of the
			**map */
			var x_remainder = TileEngine.tilesWide%TileEngine.zoneTilesWide;
			var y_remainder = TileEngine.tilesHigh%TileEngine.zoneTilesHigh;
			
			for(var h = 0; h < zone_high; h++){ //loop through zone rows
				for(var i = 0; i < zone_wide; i++) //loop through zone columns
				{
					var new_zone = newZone(); //create new zone
					var x = i * TileEngine.zoneTilesWide * TileEngine.tileWidth //set x pos of new zone
					var y = h * TileEngine.zoneTilesHigh * TileEngine.tileHeight //set y pos of new zone
					var width = TileEngine.zoneTilesWide * TileEngine.tileWidth; //set width of new zone
					var tiles_wide = TileEngine.zoneTilesWide //set tiles wide for new zone
					if(i == (zone_wide - 1) && x_remainder > 0)  //if is last zone on horizontal row and tiles divide unevenly into zones
					{
						tiles_wide = x_remainder; //change new zone tiles wide to be correct
						width = tiles_wide * TileEngine.tileWidth;  //change new zone width to be correct
					}
					var height = TileEngine.zoneTilesHigh * TileEngine.tileHeight; //set height of new zone
					var tiles_high = TileEngine.zoneTilesHigh //set tiles high for new zone
					if(h == (zone_high - 1) && y_remainder > 0) //if last zones on bottom and tiles divide unevenly into zones
					{
						tiles_high = y_remainder; //adjust tiles high
						height = tiles_high * TileEngine.tileHeight; //adjust zone height
					}
					
					new_zone.init(TileEngine, x, y, tiles_wide, TileEngine.zoneTilesHigh, TileEngine.tileWidth, TileEngine.tileHeight, width, height); //intitialize new zone
					TileEngine.zones.push(new_zone); //push zone to tile engine array
				}
			}
			
		},
		createTiles: function() { //load tile array
			TileEngine.createZones();  //create zones
			var tile_index = 0;  //track current position in tile array
			var y_zone = 0; //used to determine which zone to add tile to
			var x_zone = 0; //used to determine which zone to add tile to
			var zone_index = 0; //track current position in zone array
			var zone_wide = Math.ceil(TileEngine.tilesWide/TileEngine.zoneTilesWide); //how many zones are there horizontally
			for(var h = 0, hh = TileEngine.tilesHigh; h < hh; h++)
			{
				y_zone = Math.floor(h/TileEngine.zoneTilesHigh); //calculate which vertical zone we are in
				for(var i = 0, ii = TileEngine.tilesWide; i < ii; i++){ //cycle through each row
					
					x_zone = Math.floor(i/TileEngine.zoneTilesWide);// calculate which horizontal zone we are in
					var new_tile = newTile(); //create new tile object
					new_tile.init(0, 0, TileEngine.tileWidth, TileEngine.tileHeight, TileEngine.tilesArray[tile_index]); //init tile
					zone_index = (y_zone * zone_wide) + x_zone;//find what zone to add to using vert and horizontal positions
					TileEngine.zones[zone_index].addTile(new_tile); //add tile to zone
					tile_index++;
				}
				 x_zone = 0; //reset horizontal position when we loop to new row
			}
			
			for(var j = 0, jj = TileEngine.zones.length; j < jj; j++){
				TileEngine.zones[j].arrangeTiles(); //go throughh and arange x and y positions of tiles in zones
			}
		}
	}
	return TileEngine;
};


