/*All code copyright 2010 by Jay Crossler unless otherwise attributed - CC BY/3.0 License */

/* 
Ver 0.3 - 3 Nov 2010

TODO:
- Calculate the size of images, then switch to Application Cache after 5mb
- Save Date stored
- Save/load two lookup columns as well as name
X Have is_ready work from parent .js
x Save in App Cache
- Save canvas in app cache?
*/
var Cash = { //object to save images into HTML5 DB
	//Note, the biggest issue with dealing with an HTML5 Database is that all calls are asynchronous
	db: 0, //database id
	imageList: [], //list of currently cached images
	storeInAppCache: true, // if false, use HTML5-db. if true, use App Cache
	is_ready: false,
	loadToImg: function(src, img, makecanvas) { // load src into img from cache if exists 
	  if (Cash.storeInAppCache) {
    	if (Cash.imgInCache(src)) { //  Check the array of cached objects
			img.src = localStorage.getItem('img:'+src);
			console.log('Loaded from app cache: ' + src);
		} else {
			img.addEventListener('load', function() {
				Cash.saveImage(src, img);
			}, false);

			img.src = src;	
			console.log('Img ' + src + ' is not in app cache. Loading normally.');
		}
	  }else{ //Store in HTML5 DB
	    if (Cash.db) {
	    	if (Cash.imgInCache(src)) { //  Check the array of cached objects
				Cash.db.readTransaction(function (transaction) { //Select from dDB
					transaction.executeSql('SELECT data FROM cache_images WHERE src = ?', [src],
					  function (transaction, r) {
						if (r.rows && r.rows.length > 0) { //If Exists
							//get photodata, write to img.src
							img.src = r.rows.item(0)['data'];
							console.log('Loaded from db cache: ' + src);
						} else {
							//somehow doesn't exist, load normally
							img.src = src;
							console.log('Img should be in DB cache array, is not.');
							//TODO: SaveData of img?
						}
					}, function (transaction, e) { // couldn't read database
					  console.log('(db err: ' + e.message + ')');
					});
				});
			} else { // Not in Cache Array
//TODO: Check on iPad, make sure memory allows this
//				if (makecanvas) { //If true, store as a canvas, then enter into cache
					img.addEventListener('load', function() {
						Cash.saveImage(src, img);
					}, false);
//				}
				img.src = src;
				console.log('Img not in cache array, loading normally');
			}			
		} else {// No cache, just load img src
			img.src = src;
			console.log('No cache, standard loading of '+src);
		}
	  }
	},
	loadToCanvas: function(src, canvas, should_forceload) { // load src into canvas from cache if exists 
	  if (Cash.storeInAppCache) {
    	if (Cash.imgInCache(src)) { //  Check the array of cached objects
			Cash.drawImageOnCanvas(localStorage.getItem('img:'+src), canvas);
			console.log('Loaded from app cache: ' + src);
		} else {
			Cash.drawImageOnCanvas(src, canvas);
			console.log('Img ' + src + ' is not in app cache. Loading normally.');
		}
	  }else{ //Store in HTML5 DB
	    if (Cash.db) {
	    	if (should_forceload || Cash.imgInCache(src)) { //  Check the array of cached objects
				Cash.db.readTransaction(function (transaction) { //Select from dDB
					transaction.executeSql('SELECT data FROM cache_images WHERE src = ?', [src],
					  function (transaction, r) {
						if (r.rows && r.rows.length > 0) { //If Exists
							//get photodata, write to canvas
							Cash.drawImageOnCanvas(r.rows.item(0)['data'], canvas);
							console.log('Loaded into canvas from cache: ' + src);
						}
					}, function (transaction, e) { // couldn't read database
					  console.log('(db err: ' + e.message + ')');
					});
				});
			} else { // Not in Cache Array
				console.log('Canvas src '+ src + ' not in cache array, not loading.');
			}			
		} else {// No cache, just load img src
			console.log('No image cache, Canvas not loading');
		}
	  }
	},	
	imgInCache: function(src) { //Is src saved in the array list
		var isfound = false;
		for (var i=0;i<Cash.imageList.length;i++) {
			var endString = Cash.imageList[i].substring(Cash.imageList[i].length - src.length);
			if (endString == src) { //check if array ends with src (to account for full domain urls)
				isfound = true;
				continue;
			}
		}
		return isfound;
	},
	saveData: function(src, data, should_overwrite) { // save to cache
		var should_update = false;
		var should_try = false;

	  if (Cash.storeInAppCache) {
    	if (Cash.imgInCache(src)) { //  Check the array of cached objects
			if (should_overwrite) { 
				should_update = true;
				should_try = true;
			}
		} else { //doesn't exist, so write
			should_try = true;
		}
		if (should_try) { //double-check that img still isn't in array, happens due to threading
			try {
				localStorage.setItem('img:'+src,data);
				Cash.imageList.push(src); //Is this too early?  should it be in the transaction block?
				console.log('Saved to app cache: ' + src + ' : ' + data.length);
			} catch(ex) {
				console.log('Exception saving to app cache');
			}
		} else {
			console.log('Tried to save an image that is already in app cache');
		}
	  }else{ //Store in HTML5 DB
	    if (Cash.db) {
	    	if (Cash.imgInCache(src)) { //if already exists, Only write if overwrie=true
	    		if (should_overwrite) { 
		    		should_update = true;
		    		should_try = true;
		    	}
	    	} else { //doesn't exist, so write
    			should_try = true;
	    	}
	    	if (should_try) { //double-check that img still isn't in array, happens due to threading
				Cash.imageList.push(src); //Is this too early?  should it be in the transaction block?
				Cash.db.transaction(
					function (transaction) {
						if (should_update) {
							transaction.executeSql("UPDATE cache_images SET data='?' WHERE src='?';", [data,src] );
						} else {
							transaction.executeSql("INSERT INTO cache_images (src, data) VALUES (?, ?)", [src, data] );
						}
						console.log('Saved to db cache: ' + src + ' : ' + data.length);
					}
				);
			} else {
				console.log('Tried to save an image that is already in db cache');
			}
		}
	  }
	},
	saveImage: function(src, img) { // save to cache
	    if (Cash.db || Cash.storeInAppCache) {
	    	if (src.substring(0,6) == "data:,") {
	    		// Somehow tried to save raw image data as the source, abort
	    	} else {
				var canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				canvas.getContext("2d").drawImage(img, 0, 0);
				Cash.saveData(src, canvas.toDataURL());
				canvas = null;
			}
		}
	},
	createList: function() {//create a list of cached images
	  if (Cash.storeInAppCache) {
		  if (localStorage.length > 0) {  
			for (var i=0; i  <  localStorage.length; i++){
				var key = localStorage.key(i);
				Cash.imageList.push(key);
			} 
			console.log('Created imageList lookup array with '+localStorage.length);
		  } else {
			  console.log('No images found in app cache_image database');
		  }
	  }else{ //Pull from HTML5 DB
	    if (Cash.db) {
		  Cash.db.transaction(
		  	function (transaction) {
			  transaction.executeSql('SELECT src FROM cache_images', [], 
				function (transaction, results) { //Function to run when successful
				  if (results.rows && (results.rows.length > 0)) {  //NOTE: Use .item(0), not [0] when accessing array
					  for (var i=0;i<results.rows.length;i++) {
					  	Cash.imageList.push(results.rows.item(i)['src']);
					  }
					  console.log('Created imageList lookup array with '+results.rows.length);
				  } else {
					  console.log('No images found in cache_image database');
				  }
				},
				function (t, e) { //Funciton to run when error
				  // couldn't read database
					console.log('Database Error: ' + e.message);
				}
			  );
			}
		  );
		}
	  }
	},
	list: function(span) { //update span with # count
	  if (Cash.storeInAppCache) {
		  span.textContent = localStorage.length + " imgs";
	  }else{ //Pull from HTML5 DB

	    if (Cash.db) {
		  Cash.db.transaction(
		  	function (transaction) {
				transaction.executeSql('SELECT COUNT(*) AS c FROM cache_images', [], 
				function (transaction, results) {
				//Function to run when successful
				  if (results.rows && results.rows.item(0)) {  //NOTE: Use .item(0), not [0] when accessing array
					  span.textContent = results.rows.item(0)['c'] + " imgs";
//					  console.log('Cache holds: ' + results.rows.item(0)['c'] + ' items');
				  } else {
					  span.textContent = '(db error)';
					  console.log('Database Error');
				  }
				},
				function (t, e) {//Funciton to run when error
				  // couldn't read database
					span.textContent = '(db err: ' + e.message + ')';
					console.log('Database Error: ' + e.message);
			});
		  });
		}
	  }
	},
	prepare: function(ready, error) { //TODO: What does Ready do?
	    if (!window.openDatabase) {
	        Message.newMessage('HTML5 DBs not supported in this browser');
	    } else {
		  Cash.db = openDatabase('cache_imgs', '1.0', 'Offline image storage', 5*1024*1024);

		  Cash.db.transaction(
		  	function(t) {
			  t.executeSql('CREATE TABLE cache_images (src, data)', []);
			  //TODO: Also store metadata?, catch errors
		  });
		console.log("DB and Tables created");
		}
	},
	deleteAll: function() { // delete all images
	    if (Cash.db) {
		  Cash.db.transaction(
		  	function (transaction) {
				transaction.executeSql('DELETE FROM cache_images', [], [], []);
				console.log("Database table cache_images cleared");
			}
		  );
		 }
	},
	drawImageOnCanvas: function(data, canvas, runWhenDone) {
	    var img = new Image();
	    img.onload = function() {
	        canvas.width = img.width;
	        canvas.height = img.height;
	        canvas.getContext("2d").drawImage(img, 0, 0);
	        img = null; //TODO: Check this removes from memory
//	        runWhenDone(); 
	    };
	    img.src = data;
	},
	serializeCanvasByID:function(canvas) {
		var serializedVal = 'data:,';
		if (canvas.toDataURL) serializedVal = canvas.toDataURL();
	    return serializedVal;
	},
	init: function(){
		Cash.is_ready = false;
		Cash.prepare();
		Cash.loadToCanvas('LastTileMap',document.getElementById('main_canvas'),true);

		Cash.createList();
		Cash.is_ready = true;
		//TODO: If prepared is done, should it set a ready variable?
	},
	test: function(){
		Cash.deleteAll();
//Cash.drawImageOnCanvas(
//"data:image/png;base64,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",
//document.getElementById('main_canvas'));

	}

}

Cash.init(); //should be called as first js script, then contain a call to start other loops