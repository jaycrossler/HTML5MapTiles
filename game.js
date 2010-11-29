/*All code copyright 2010 by John Graham unless otherwise attributed*/
//Edits and additions by Jay Crossler, changes Creative Commons BY/3.0 license

/*
TODO:
X Multiple levels of tilemaps
X Drag to paint
X Dynamic Painter Layers
X Multple tilemaps
X Fix mousepress location on Painter Canvas
X Set Dirty Bit on drawing zone?  tile?
X Set Dirty Bit on drawing map
X On mousedown, set FPS to low, draw tile immediately
X When changing tile, change model
X Redraw correctly on start
X Save current map data as JSON
- Mousemove on painter box work better
- Make Painter mode optional and toggleable
- Crash when painter goes from paint-not-paint
X Need to load images from cache
- Paint new base dungeon maps

- Cash save canvas currently saving a blank image (only save if top pixel isn't white?
- Start with an image from last run, image as starting point from server for antique browsers

- In CASH.JS:
- Calculate the size of images, then switch to Application Cache after 5mb
- Save Date stored
- Save/load two lookup columns as well as name
- Sometimes crashing after 15 logs on iPad

- Tile layers can start at XY point in
- Sprite layers - location, size, heading, speed, icon, bbox, name, tags, type
- Lookup array of object names
- Onclick determines object selected (based on top-layer downward)
- Tile sizes can scale
- Move Painter events into Class

- JSON sync with server
x Save JSON as a set of maps
- Map viewport scrolls around within larger map
- Move TilesWide to each layer, have offsets
x Save snapshot of Canvas to HTML5 DB
x Save all map data into HTML5 DB
- Embed in portal
- Time-based changes to map and layers, method to scroll forward or back
- Multiple maps per page, multiple viewports per map
- Draw on map, pauses update, saves to new layer

TOCHECK ON VERSION UPDATE:
//In tileMapJS.setMapAttributes and gameJS.createTiles, tileOffsetX should be tileOffsetX 
//In Game, sourceTileAccross change to Across

*/

var inputJSON = {
  "tilesWide": 40,
  "tilesHigh": 32,
  "layers" : [
	  {"layerName": "Ground",
	  "sourceFiles": "images/tiles.png",
	  "sourceTileCounts": 254,
	  "sourceTileAcross": 22,
	  "tileOffsetX": 0,
	  "tileOffsetY": 32,
	  "tileWidth": 32,
	  "tileHeight": 32,
	  "zoneTilesWide": 10,
	  "zoneTilesHigh": 10,	  
	  "showZoneColors": false,
	  "tilesArray": [ 71,71,70,71,71,71,71,71,71,71,71,71,70,71,71,71,71,71,71,71,71,71,70,71,71,71,71,71,71,71,71,71,70,71,71,71,71,71,71,71,
			  135,135,92,135,135,135,135,135,135,135,135,135,92,135,135,135,135,135,135,135,135,135,92,135,135,135,135,135,135,135,135,135,92,135,135,135,135,135,135,135,
			  72,72,90,72,72,72,72,72,72,72,72,72,90,72,72,72,72,72,72,72,72,72,90,72,72,72,72,72,72,72,72,72,90,72,72,72,72,72,72,72,
			  134,134,91,134,134,134,134,134,134,134,134,134,91,134,134,134,134,134,134,134,134,134,91,134,134,134,134,134,134,134,134,134,91,134,134,134,134,134,134,134,
			  70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,
			  71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,
			  71,27,71,71,71,49,50,71,71,71,71,27,71,71,71,49,50,71,71,71,71,27,71,71,71,49,50,71,71,71,71,27,71,71,71,49,50,71,71,71,
			  71,22,73,71,71,66,66,73,71,71,71,22,73,71,71,66,66,73,71,71,71,22,73,71,71,66,66,73,71,71,71,22,73,71,71,66,66,73,71,71,
			  71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,
			  71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,
			  135,135,92,135,135,135,135,135,135,135,135,135,92,135,135,135,135,135,135,135,135,135,92,135,135,135,135,135,135,135,135,135,92,135,135,135,135,135,135,135,
			  72,72,72,72,72,72,72,72,72,71,72,72,72,72,72,72,72,72,72,71,72,72,72,72,72,72,72,72,72,71,72,72,72,72,72,72,72,72,72,71,
			  134,134,91,134,134,134,134,134,134,134,134,134,91,134,134,134,134,134,134,134,134,134,91,134,134,134,134,134,134,134,134,134,91,134,134,134,134,134,134,134,
			  70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,
			  71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,
			  71,27,71,71,71,49,50,71,71,71,71,27,71,71,71,49,50,71,71,71,71,27,71,71,71,49,50,71,71,71,71,27,71,71,71,49,50,71,71,71,
			  71,22,73,71,71,66,66,73,71,71,71,22,73,71,71,66,66,73,71,71,71,22,73,71,71,66,66,73,71,71,71,22,73,71,71,66,66,73,71,71,
			  71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,
			  71,71,70,71,71,71,71,71,71,71,71,71,70,71,71,71,71,71,71,71,71,71,70,71,71,71,71,71,71,71,71,71,70,71,71,71,71,71,71,71,
			  135,135,92,135,135,135,135,135,135,135,135,135,92,135,135,135,135,135,135,135,135,135,92,135,135,135,135,135,135,135,135,135,92,135,135,135,135,135,135,135,
			  72,72,90,72,72,72,72,72,72,72,72,72,90,72,72,72,72,72,72,72,72,72,90,72,72,72,72,72,72,72,72,72,90,72,72,72,72,72,72,72,
			  134,134,91,134,134,134,134,134,134,134,134,134,91,134,134,134,134,134,134,134,134,134,91,134,134,134,134,134,134,134,134,134,91,134,134,134,134,134,134,134,
			  70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,
			  71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,
			  71,27,71,71,71,49,50,71,71,71,71,27,71,71,71,49,50,71,71,71,71,27,71,71,71,49,50,71,71,71,71,27,71,71,71,49,50,71,71,71,
			  71,22,73,71,71,66,66,73,71,71,71,22,73,71,71,66,66,73,71,71,71,22,73,71,71,66,66,73,71,71,71,22,73,71,71,66,66,73,71,71,
			  71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,
			  71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,
			  135,135,92,135,135,135,135,135,135,135,135,135,92,135,135,135,135,135,135,135,135,135,92,135,135,135,135,135,135,135,135,135,92,135,135,135,135,135,135,135,
			  72,72,72,72,72,72,72,72,72,71,72,72,72,72,72,72,72,72,72,71,72,72,72,72,72,72,72,72,72,71,72,72,72,72,72,72,72,72,72,71,
			  134,134,91,134,134,134,134,134,134,134,134,134,91,134,134,134,134,134,134,134,134,134,91,134,134,134,134,134,134,134,134,134,91,134,134,134,134,134,134,134,
			  70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,
			  71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,
			  71,27,71,71,71,49,50,71,71,71,71,27,71,71,71,49,50,71,71,71,71,27,71,71,71,49,50,71,71,71,71,27,71,71,71,49,50,71,71,71,
			  71,22,73,71,71,66,66,73,71,71,71,22,73,71,71,66,66,73,71,71,71,22,73,71,71,66,66,73,71,71,71,22,73,71,71,66,66,73,71,71,
			  71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71,71			  
			  ]
      },{"layerName": "Boom", "sourceFiles": "images/tiles.png", "sourceTileCounts": 254, "sourceTileAcross": 22, "tileOffsetX": 0, "tileOffsetY": 32, "tileWidth": 32, "tileHeight": 32, "zoneTilesWide": 10, "zoneTilesHigh": 10, "showZoneColors": false, "tilesArray": [0, 1, 2]},{"layerName": "Flooring64", "sourceFiles": "images/511n9k.png", "sourceTileCounts": 32, "sourceTileAcross": 8, "tileOffsetX": 0, "tileOffsetY": 64, "tileWidth": 64, "tileHeight": 64, "zoneTilesWide": 5, "zoneTilesHigh": 5, "showZoneColors": false, "tilesArray": [-1]},{"layerName": "Batalhao", "sourceFiles": "images/batalhao_tileset_cc_by_sa.png", "sourceTileCounts": 48, "sourceTileAcross": 16, "tileOffsetX": 0, "tileOffsetY": 32, "tileWidth": 32, "tileHeight": 32, "zoneTilesWide": 10, "zoneTilesHigh": 10, "showZoneColors": false, "tilesArray": [-1]},{"layerName": "Rsyo0k", "sourceFiles": "images/rsyo0k.png", "sourceTileCounts": 256, "sourceTileAcross": 16, "tileOffsetX": 0, "tileOffsetY": 32, "tileWidth": 32, "tileHeight": 32, "zoneTilesWide": 10, "zoneTilesHigh": 10, "showZoneColors": false, "tilesArray": [-1]},{"layerName": "TileE", "sourceFiles": "images/TileE-5.png", "sourceTileCounts": 256, "sourceTileAcross": 16, "tileOffsetX": 0, "tileOffsetY": 32, "tileWidth": 32, "tileHeight": 32, "zoneTilesWide": 10, "zoneTilesHigh": 10, "showZoneColors": false, "tilesArray": [-1]}
   ]
};
	  


//function to detect canvas support by alterebro (http://code.google.com/p/browser-canvas-support/)
var canvas_support = {
	canvas_compatible : false,
	check_canvas : function() {
		try {
			this.canvas_compatible = !!(document.createElement('canvas').getContext('2d')); // S60
		} catch(e) {
			this.canvas_compatible = !!(document.createElement('canvas').getContext); // IE
		} 
		return this.canvas_compatible;
	}
} 

var Game = {
	gameTimer: 0, //holds id of main game timer
	initTimer: 0, //holds id of init game timer //added
	tileEngine: [], //holds tile engine object
	fps: 0, //target fps for game loop
	fpsOld: 0, //Added
	mapModel: 0,
	numLayers: 0,
	hasChanged: 0,
	prepareInit: function() { //waits until other js is loaded and ready before initing the game
		var interval = 1000;
		Game.initTimer = setInterval(Game.checkInitReady, interval);
	},
	checkInitReady: function() { //waits until other js is loaded and ready before initing the game
		if (Cash.is_ready) {
			console.log("Cash ready, starting game.");
			clearInterval(Game.initTimer);
			Game.initGame();
			Painter.init();
		} else {
			console.log("Cash not ready, waiting...");
		}
	},
	initGame: function() { //initialize game
		//Load last screenshot if exists
		Game.fps = 2; // 2500; //set target fps to 25
	    Game.fpsOld = 2; // After painting, go back to this # of fps

		Game.createTiles();
//		Message.addMessage("Tiles Ready");
		Game.startTimer(); //start game loop
//		Message.addMessage("Main Loop Started");
		Game.hasChanged = true;
	},
	startTimer: function(){ //start game loop
		var interval = 1000 / Game.fps;
		if (Game.gameTimer) {
			clearInterval(Game.gameTimer); //Added, so only one timer
		}
		Game.hasChanged = true;
		Game.gameTimer = setInterval(Game.runLoop, interval);
	},
	runLoop: function(){ //code to run on each game loop
		if (Game.hasChanged) { //added

			Game.tileEngine[0].ctx.clearRect(0,0,Game.tileEngine[0].width, Game.tileEngine[0].height);  //clear main canvas
			for (var i=0;i<Game.numLayers;i++) {
				Game.tileEngine[i].drawFrame();
			}
			Game.hasChanged = false;
			//Save the last map //TODO: This is saving a blank image... possibly due to refresh?
			if (Math.random()>0.66) //Save map every 3 changes to reduce local db load
				Cash.saveData('LastTileMap',document.getElementById('main_canvas').toDataURL(),true);
		}
		Cash.list(Message.message);
		FPS.fps_count++;  //increments frame for fps display

	},
	createTiles: function(mapJSONData){ //create and initialize tile engine
		if (mapJSONData) { //Added optional init data
			//Reload maps
			inputJSON = eval("("+mapJSONData+")");  //TODO, Change away from Eval for security reasons
			for (var i=0;i<Game.numLayers;i++) {
				Game.tileEngine[i].sources[0].image = null;
			}
			Game.tileEngine = [];
		}

		Game.numLayers = inputJSON.layers.length;
		for (var i=0;i<Game.numLayers;i++) {
			Game.tileEngine.push(newTileEngine()); //create tile engine object
			var obj = new Object(); //create tile engine initializer object
			
			obj.tilesWide = inputJSON.tilesWide;
			obj.tilesHigh = inputJSON.tilesHigh;
			
			obj.layerName = inputJSON.layers[i].layerName;
			obj.tileWidth = inputJSON.layers[i].tileWidth;
			obj.tileHeight = inputJSON.layers[i].tileHeight;
			obj.zoneTilesWide = inputJSON.layers[i].zoneTilesWide;
			obj.zoneTilesHigh = inputJSON.layers[i].zoneTilesHigh;
			obj.sourceFiles = inputJSON.layers[i].sourceFiles;
			obj.sourceTileCounts = inputJSON.layers[i].sourceTileCounts;
			obj.sourceTileAcross = inputJSON.layers[i].sourceTileAcross;
			obj.tileOffsetX = inputJSON.layers[i].tileOffsetX;
			obj.tileOffsetY = inputJSON.layers[i].tileOffsetY;
			obj.width = obj.tileWidth * obj.tilesWide;
			obj.height = obj.tileHeight * obj.tilesHigh;
			obj.tilesArray = inputJSON.layers[i].tilesArray;
			obj.showZoneColors = inputJSON.layers[i].showZoneColors

			//Added - TODO: not working, check why
			obj.startX = 0;
			obj.startY = 0;
	
			Game.tileEngine[i].setMapAttributes(obj);
			Game.tileEngine[i].init();  //initialize tile engine object
			Game.hasChanged = true;

		}

		if (is_firefox) {
			setTimeout("Painter.sizeCanvasToMax()",1000);
		} else {
			Painter.sizeCanvasToMax();  //TODO: Set so not timer in Firefox
		}
		Painter.addCanvasEvents();
		Painter.setLayerOptions();
	}
};

//TODO: Have a setInterval that checks everything is ready before firing?
if(canvas_support.check_canvas()){  //check canvas support before intializing
	Game.prepareInit(); //initialize game object if Cash is ready //changes
}
else {
	Message.addMessage('Your Browser Does not support this demo!');	
}



