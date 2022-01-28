
function render() {

	var timer = Date.now() * 0.0002;

	//if (fpc&&fpc.update) fpc.update();

	if ( rotate ) {

		camera.position.x = Math.cos( timer ) * 1500;
		camera.position.z = Math.sin( timer ) * 1500;

	}
	
	// controls
	if (controls) {
		if (controls.rightMouse) {
			//console.log('foo');
			console.log({controls});
			console.log('x=',camera.position.x,' adding ',controls.movementX);
			if (isNaN(controls.movementX) || isNaN(controls.movementY)) {
				console.error(`cannot move camera. movementX=${controls.movementX} and movementY=${controls.movementY}, one of which isNaN `);
			} else {
				camera.position.x += controls.movementX;
				camera.position.z += controls.movementY;
			}
			controls.movementX = 0;
			controls.movementY = 0;
		}
		if (controls.leftMouse) {
			//console.log('bar');
		}
		
		var dx=0,dy=0,dz=0,drx=0,dry=0,drz=0;
		if (controls.forward) {
			// rotation.y = 0 means facing north
			//dz += -Math.cos(camera.rotation.y) * acceleration;
			dy += -acceleration;
		}
		if (controls.backward) {
			//dz += Math.cos(camera.rotation.y) * acceleration;
			dy += acceleration;
		}
		if (controls.left) {
			//dx += Math.sin(camera.rotation.y) * acceleration;
			dx += -acceleration;
		}
		if (controls.right) {
			//dx += -Math.sin(camera.rotation.y) * acceleration;
			dx += acceleration;
		}
		if (controls.up) {
			dz += acceleration;
		}
		if (controls.down) {
			dz -= acceleration;
		}
		if (controls.yawLeft) {
			dry += rotateAcceleration; 
		}
		if (controls.yawRight) { 
			dry += -rotateAcceleration; 
		}
		if (controls.pitchUp) {
			drx += Math.cos(camera.rotation.y) * rotateAcceleration;
			drz += -Math.sin(camera.rotation.y) * rotateAcceleration;
		}
		if (controls.pitchDown) { 
			drx += -Math.cos(camera.rotation.y) * rotateAcceleration;
			drz += Math.sin(camera.rotation.y) * rotateAcceleration;
		}
		
		
		momentum.x += dx;
		momentum.y += dy;
		momentum.z += dz;
		
		momentum.rx += drx;
		momentum.ry += dry;
		momentum.rz += drz;
		
		/*
		camera.position.x += momentum.x;
		camera.position.y += momentum.y;
		camera.position.z += momentum.z;
		*/
		
		// bounce off ground
		if (camera.position.y + momentum.y < 50) {
			camera.position.y = 50;
			momentum.y = 0;
		}
						
		camera.translateX( momentum.x );
		// camera.translateOnAxis(new THREE.Vector3(-10000,0,0), momentum.x);
		camera.translateY( momentum.y );
		camera.translateZ( momentum.z );
		
		camera.rotation.x += momentum.rx;
		camera.rotation.y += momentum.ry;
		camera.rotation.z += momentum.rz;
		
		
		momentum.x *= (1-friction);
		momentum.y *= (1-friction);
		momentum.z *= (1-friction);
		
		momentum.rx *= (1-friction);
		momentum.ry *= (1-friction);
		momentum.rz *= (1-friction);
		
		if (momentum.x > 0 && momentum.x < 0.001) momentum.x = 0;
		if (momentum.x < 0 && momentum.x > -0.001) momentum.x = 0;
		if (momentum.y > 0 && momentum.y < 0.001) momentum.y = 0;
		if (momentum.y < 0 && momentum.y > -0.001) momentum.y = 0;
		if (momentum.z > 0 && momentum.z < 0.001) momentum.z = 0;
		if (momentum.z < 0 && momentum.z > -0.001) momentum.z = 0;
		
		if (momentum.rx > 0 && momentum.rx < 0.001) momentum.rx = 0;
		if (momentum.ry > 0 && momentum.ry < 0.001) momentum.ry = 0;
		if (momentum.rz > 0 && momentum.rz < 0.001) momentum.rz = 0;
		if (momentum.rx < 0 && momentum.rx > -0.001) momentum.rx = 0;
		if (momentum.ry < 0 && momentum.ry > -0.001) momentum.ry = 0;
		if (momentum.rz < 0 && momentum.rz > -0.001) momentum.rz = 0;
	}
	
	// grid opacity
	var o = 1 / (camera.position.y / 100);
	if (o>1) o = 1;
	if (o<0) o = 0;
	//grid.material.opacity = o;
	
	// fog
	if (scene.fog) {
		scene.fog.far = camera.position.y * 50;
		var n = scene.fog.far / 100;
		if (n<0) n = 0;
		scene.fog.near = n;
	}

	//camera.lookAt( scene.position );
	//LOD.update(camera);
	
	if (selectedPoint) camera.lookAt(selectedPoint);

	if (selectedToken) selectedToken.rotation.y += 0.1;


	renderer.render( scene, camera );
	
	if (controls) {
		document.getElementById('mx').innerHTML = momentum.x;
		document.getElementById('my').innerHTML = momentum.y;
		document.getElementById('mz').innerHTML = momentum.z;
		document.getElementById('mrx').innerHTML = momentum.rx;
		document.getElementById('mry').innerHTML = momentum.ry;
		document.getElementById('mrz').innerHTML = momentum.rz;
	}
	document.getElementById('x').innerHTML = camera.position.x;
	document.getElementById('y').innerHTML = camera.position.y;
	document.getElementById('z').innerHTML = camera.position.z;
	document.getElementById('rx').innerHTML = camera.rotation.x;
	document.getElementById('ry').innerHTML = camera.rotation.y;
	document.getElementById('rz').innerHTML = camera.rotation.z;
	
	document.getElementById('compassNeedle').style.webkitTransform = 'rotate('+(-camera.rotation.y-(Math.PI/2))+'rad)';
}
