function init() {

	// container = document.createElement( 'div' );
	// container.id = 'container';
	// document.body.appendChild( container );

	var container = document.getElementById('container');

	// scene

	scene = new THREE.Scene();

	scene.fog = new THREE.Fog( 0x000000, 0, 50000 );
	scene.fog.color.setHSV( 0.6, 0.2, 1 );

	// camera
	const width = 10000;
	const height = 10000;

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 100000 );
	// camera = new THREE.OrthographicCamera(  width / - 2, width / 2, height / 2, height / - 2, 1000, 1 );
	camera.position.y = 2500;
	// camera.position.z = 2500;
	camera.rotation.x = Math.PI * 0.5 * -1;
	scene.add( camera );

	// lights

	var light, materials;

	scene.add( new THREE.AmbientLight( 0x666666 ) );

	light = new THREE.DirectionalLight( 0xffffff, 1.75 );
	light.color.setHSV( 0.6, 0.125, 1 );
	light.position.set( 50, 200, 100 );
	light.position.multiplyScalar( 1.3 );

	light.castShadow = true;
	//light.shadowCameraVisible = true;

	light.shadowMapWidth = 2048;
	light.shadowMapHeight = 2048;

	var d = 300;

	light.shadowCameraLeft = -d;
	light.shadowCameraRight = d;
	light.shadowCameraTop = d;
	light.shadowCameraBottom = -d;

	light.shadowCameraFar = 1000;
	light.shadowDarkness = 0.5;

	scene.add( light );

	light = new THREE.DirectionalLight( 0xffffff, 0.35 );
	light.color.setHSV( 0.3, 0.95, 1 );
	light.position.set( 0, -1, 0 );

	scene.add( light );

	// arrow

	arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 50, 0xff0000 );
	arrow.position.set( -200, 0, -200 );
	// scene.add( arrow );

	// ground

	var initColor = new THREE.Color( 0x00ff00 );
	initColor.setHSV( 0.25, 0.85, 0.5 );
	var initTexture = THREE.ImageUtils.generateDataTexture( 1, 1, initColor );

	var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: initTexture } );

	var groundTexture = THREE.ImageUtils.loadTexture( "textures/terrain/grasslight-big.jpg", undefined, function() { groundMaterial.map = groundTexture } );
	groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	groundTexture.repeat.set( 100, 100 );
	groundTexture.anisotropy = 16;

	var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100000, 100000 ), groundMaterial );
	mesh.position.y = -5;
	mesh.rotation.x = - Math.PI / 2;
	mesh.receiveShadow = true;
	scene.add( mesh );
	
	ground = mesh;

	// poles

	var poleGeo = new THREE.CubeGeometry( 5, 375, 5 );
	var poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shiness: 100 } );

	var mesh = new THREE.Mesh( poleGeo, poleMat );
	mesh.position.x = -125;
	mesh.position.y = 192;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );

	var mesh = new THREE.Mesh( poleGeo, poleMat );
	mesh.position.x = 125;
	mesh.position.y = 192;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );

	var mesh = new THREE.Mesh( new THREE.CubeGeometry( 255, 5, 5 ), poleMat );
	mesh.position.y = 0 + 750/2;
	mesh.position.x = 0;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );

	var gg = new THREE.CubeGeometry( 10, 10, 10 );
	var mesh = new THREE.Mesh( gg, poleMat );
	mesh.position.y = 0;
	mesh.position.x = 125;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );

	var mesh = new THREE.Mesh( gg, poleMat );
	mesh.position.y = 0;
	mesh.position.x = -125;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );
	
	/*********** GRID *************/
	//initGrid();
	
	   LOD = new THREE.LOD();
	   //var grid;
	    
	   grid = createGrid(100,0.2);
	  // LOD.addLevel(grid);
	    /*
	   grid = createGrid(200,0.5);
	   LOD.addLevel(grid,1000);
	    
	   grid = createGrid(800,0.2);
	   LOD.addLevel(grid,4000);
	    */
	   //scene.add(LOD );
	  //  window.LOD = LOD;
	 
	 scene.add(grid);
	  
	
	
	//createCells();


	/****** selector cube ******/
	// var cubegeometry = new THREE.CubeGeometry(100,100,100);
	// var cubematerial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true } );
	// selectorCube = new THREE.Mesh( cubegeometry, cubematerial );
	// var coords = getPositionFromGridCoords(-1,-1);
	// scene.add( selectorCube );
	var geometry = new THREE.PlaneGeometry( 100, 100 );
	var material = new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} );
	selectorCube = new THREE.Mesh( geometry, material );
	var coords = getPositionFromGridCoords(-1,-1);
	scene.add( selectorCube );
	selectorCube.rotation.x = -Math.PI/2;
	selectorCube.position.x = coords.x;
	selectorCube.position.y = 1;
	selectorCube.position.z = coords.z;
	
	
	
	/*********** TOKENS ***********/
	for (var i = 0; i < tokens.length; i++) {
		tokens[i] = renderToken(tokens[i]);
		
	}
	function renderToken(args) {
		var mat = new THREE.MeshPhongMaterial( { color: args.color, specular: 0x111111, shiness: 10 } );		
		// var geo = new THREE.CubeGeometry( 100, 100, 100 );
		tokenGeo = new THREE.CylinderGeometry( 50, 50, 10 );
		var mesh = new THREE.Mesh( tokenGeo, mat );
		var coords = getPositionFromGridCoords(args.x,args.y);
		mesh.position.y = 0;
		mesh.position.x = coords.x;
		mesh.position.z = coords.z;
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		scene.add( mesh );
		return mesh;
	}


	/*********** RENDER *************/
	
	projector = new THREE.Projector();
	renderer = new THREE.WebGLRenderer( { alpha:true, antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	if (scene.fog) renderer.setClearColor( scene.fog.color );

	container.appendChild( renderer.domElement );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.physicallyBasedShading = true;

	renderer.shadowMapEnabled = true;

	//

	stats = new Stats();
	container.appendChild( stats.domElement );

	//

	window.addEventListener( 'resize', onWindowResize, false );

	//camera.lookAt( scene.position );

}

