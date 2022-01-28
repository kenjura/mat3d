
var tokens = [
	{ name:'red', color: 0xFF0000, x: 0, y: 0, z: 0 },
	{ name:'blue', color: 0x00FF00, x: 2, y: 0, z: 0 },
	{ name:'green', color: 0x0000FF, x: -2, y: 2, z : 0 }
];
	
var selectedToken;


var moveSpeed = 100;
var rotateSpeed = (2*Math.PI)/360;
var acceleration = 20;
var rotateAcceleration = (2*Math.PI)/360/3;
var friction = 0.1;
var controls, momentum;

var selectedPoint = null;

var container, stats;
var camera, scene, renderer, projector;

var clothGeometry;
var sphere;
var object, arrow;
var LOD, grid;

var selectorCube;
var tokenGeo;
	
var gridSize = 100;

var ground;

var rotate = false;

setTimeout(function() {
	setupControls();
	init();
	animate();
},200);






function getRandomColor() {
	var r = Math.floor(Math.random()*255);
	var g = Math.floor(Math.random()*255);
	var b = Math.floor(Math.random()*255);
	
	var rgb = (r << 16) + (g << 8) + b;
	return rgb;
}

function createCells() {
	var nw = 150;
	var nh = 150;
	var w = 50;
	var h = 50;
	
	for( var r = -nw/2; r < nw/2; r++) {
		for ( var c = -nh/2; c < nh/2; c++) {
			var col = getRandomColor();		
			var mat = new THREE.MeshBasicMaterial( { color: getRandomColor() });
			var geo = new THREE.PlaneGeometry( w, h );
			var mesh = new THREE.Mesh( geo, mat );
			
			mesh.position.y = 0;
			mesh.rotation.x = -Math.PI/2;
			mesh.position.x = r * w + w/2;
			mesh.position.z = c * h + h/2;
			
			scene.add(mesh);
		}
	}
	
	
}

function createGrid(step,opacity) {
	var size = 50000;

	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: opacity, transparent: true } );
	material.linewidth = 0.1;
	

	for ( var i = - size; i <= size; i += step ) {

	    geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
	    geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

	    geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
	    geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

	}

	var line = new THREE.Line( geometry, material, THREE.LinePieces );
	//scene.add( line );
	return line;
}

//

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

	requestAnimationFrame( animate );

	var time = Date.now();


	//simulate(time);
	render();
	stats.update();

}

function getPositionFromGridCoords(x,y) {
	return {
		x: x*gridSize + gridSize/2,
		y: gridSize/2,
		z: y*gridSize + gridSize/2
	}
}
function getGridCoordsFromPosition(pos) {
	return {
		x: Math.round(pos.x/gridSize-0.5),
		y: Math.round(pos.z/gridSize-0.5)
	}
}
function gridMove(token,delta) {
	var gc = getGridCoordsFromPosition(token.position);
	info(token.position);
	info(gc);
	gc.x += delta.x;
	gc.y += delta.y;
	var p = getPositionFromGridCoords(gc.x,gc.y);
	token.position = new THREE.Vector3( p.x, token.position.y, p.z );
}