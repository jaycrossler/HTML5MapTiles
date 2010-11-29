/*All code copyright 2010 by John Graham unless otherwise attributed*/
//Edits and additions by Jay Crossler, changes Creative Commons BY/3.0 license

/*
TODO:
X Multiple levels of tilemaps
X Drag to paint
X Dynamic Painter Layers
X Multple tilemaps
X Fix mousepress location on Painter Canvas
- Tile layers can start at XY point in
- Sprite layers
- Onclick determines object selected (based on top-layer downward)
- Tile sizes can scale
- Move Painter events into Class

- JSON sync with server
- Save JSON as a set of maps
- Map viewport scrolls around within larger map  //Mobe TilesWide to each layer, have offsets
- Save snapshot of Canvas to HTML5 DB
- Save all map data into HTML5 DB
- Embed in portal
- Time-based changes to map and layers, method to scroll forward or back
- Multiple maps per page, multiple viewports per map
- Draw on map, pauses update, saves to new layer

TOCHECK ON VERSION UPDATE:
//In tileMapJS.setMapAttributes and gameJS.createTiles, tileOffestX should be tileOffsetX 
//In Game, sourceTileAccross change to Across

*/

var inputJSON = {
  "tilesWide": 20,
  "tilesHigh": 20,
  "layers" : [
	  {"layerName": "Ground",
	  "sourceFiles": "images/tiles.png",
	  "sourceTileCounts": 254,
	  "sourceTileAcross": 22,
	  "tileOffestX": 0,
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
      },
	  {"layerName": "Boom",
	  "sourceFiles": "images/tiles.png",
	  "sourceTileCounts": 254,
	  "sourceTileAcross": 22,
	  "tileOffestX": 0,
	  "tileOffsetY": 32,
	  "tileWidth": 32,
	  "tileHeight": 32,
	  "zoneTilesWide": 10,
	  "zoneTilesHigh": 10,	  
	  "showZoneColors": false,
	  "tilesArray": [ -1 ]
	  },
	  {"layerName": "Flooring64",
	  "sourceFiles": "images/511n9k.png",
	  "sourceTileCounts": 32,
	  "sourceTileAcross": 8,
	  "tileOffestX": 0,
	  "tileOffsetY": 64, //Why?
	  "tileWidth": 64,
	  "tileHeight": 64,
	  "zoneTilesWide": 5,
	  "zoneTilesHigh": 5,	  
	  "showZoneColors": false,
	  "tilesArray": [ -1 ]
      },
	  {"layerName": "Batalhao",
	  "sourceFiles": "images/batalhao_tileset_cc_by_sa.png",
	  "sourceTileCounts": 48,
	  "sourceTileAcross": 16,
	  "tileOffestX": 0,
	  "tileOffsetY": 32, //Why?
	  "tileWidth": 32,
	  "tileHeight": 32,
	  "zoneTilesWide": 10,
	  "zoneTilesHigh": 10,	  
	  "showZoneColors": false,
	  "tilesArray": [ -1 ]
      },
	  {"layerName": "Rsyo0k",
	  "sourceFiles": "images/rsyo0k.png",
	  "sourceTileCounts": 256,
	  "sourceTileAcross": 16,
	  "tileOffestX": 0,
	  "tileOffsetY": 32, //Why?
	  "tileWidth": 32,
	  "tileHeight": 32,
	  "zoneTilesWide": 10,
	  "zoneTilesHigh": 10,	  
	  "showZoneColors": false,
	  "tilesArray": [ -1 ]
      },
	  {"layerName": "TileE",
	  "sourceFiles": "images/TileE-5.png",
	  "sourceTileCounts": 256,
	  "sourceTileAcross": 16,
	  "tileOffestX": 0,
	  "tileOffsetY": 32, //Why?
	  "tileWidth": 32,
	  "tileHeight": 32,
	  "zoneTilesWide": 10,
	  "zoneTilesHigh": 10,	  
	  "showZoneColors": false,
	  "tilesArray": [ -1 ]
      },
	  {"layerName": "MedusaChamber",
	  "sourceFiles": "images/mi20041007b_medusachamber.png",
	  "sourceTileCounts": 40,
	  "sourceTileAcross": 8,
	  "tileOffestX": 0,
	  "tileOffsetY": 150, //Why?
	  "tileWidth": 150,
	  "tileHeight": 150,
	  "zoneTilesWide": 5,
	  "zoneTilesHigh": 5,	  
	  "showZoneColors": false,
	  "tilesArray": [ -1 ]
      }
      
      
      
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
	tileEngine: [], //holds tile engine object
	fps: 0, //target fps for game loop
	mapModel: 0,
	numLayers: 0,
	initGame: function() { //initialize game
		Game.fps = 1; // 2500; //set target fps to 25
		Game.createTiles();
//		Message.addMessage("Tiles Ready");
		Game.startTimer(); //start game loop
//		Message.addMessage("Main Loop Started");
	},
	startTimer: function(){ //start game loop
		var interval = 1000 / Game.fps;
		Game.gameTimer = setInterval(Game.runLoop, interval);
	},
	runLoop: function(){ //code to run on each game loop
		Game.tileEngine[0].ctx.clearRect(0,0,Game.tileEngine[0].width, Game.tileEngine[0].height);  //clear main canvas
		for (var i=0;i<Game.numLayers;i++) {
			Game.tileEngine[i].drawFrame();
		}
		FPS.fps_count++;  //increments frame for fps display

	},
	createTiles: function(){ //create and initialize tile engine
//		Game.mapModel = newMapModel();

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
			obj.tileOffestX = inputJSON.layers[i].tileOffestX;
			obj.tileOffsetY = inputJSON.layers[i].tileOffsetY;
			obj.width = obj.tileWidth * obj.tilesWide;
			obj.height = obj.tileHeight * obj.tilesHigh;
			obj.tilesArray = inputJSON.layers[i].tilesArray;
			obj.showZoneColors = inputJSON.showZoneColors

			//Added - TODO: not working, check why
			obj.startX = 0;
			obj.startY = 0;
	
			Game.tileEngine[i].setMapAttributes(obj);
			Game.tileEngine[i].init();  //initialize tile engine object

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

if(canvas_support.check_canvas()){  //check canvas support before intializing
	Game.initGame(); //initialize game object
}
else {
	Message.addMessage('Your Browser Does not support this demo!');	
}



