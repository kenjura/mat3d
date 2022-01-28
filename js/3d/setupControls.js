
var keyMode = 'fly'; // other modes: 'token'

function setupControls() {

	window.addEventListener('keydown',function(e) {
		console.log('keydown '+e.keyCode, 'mode=',keyMode);;
		switch(keyMode) {
			case 'fly':
				switch(e.keyCode) {
					case 87: /* w */ controls.forward = true; break;
					case 65: /* a */ controls.left = true; break;
					case 83: /* s */ controls.backward = true; break;
					case 68: /* d */ controls.right = true; break;
					case 32: /* space */ controls.up = true; break;
					case 67: /* c */ controls.down = true; break;
					case 38: /* up */ controls.pitchUp = true; break;
					case 39: /* right */ controls.yawRight = true; break;
					case 40: /* down */ controls.pitchDown = true; break;
					case 37: /* left */ controls.yawLeft = true; break;
					case char.open_bracket: /* [ */ selectorCube.rotation.x += 0.1; break;
					case char.close_bracket: /* ] */ selectorCube.rotation.x -= 0.1; break;
					case char.single_quote: selectorCube.position.y += 1; break;
					case char.semi_colon: selectorCube.position.y -= 1; info(selectorCube.position); break;
				}
				break;
			case 'token':
				switch(e.keyCode) {
					case 37: /* left */ gridMove(selectedToken,{x:-1,y:0}); break;
					case 38: /* up */ gridMove(selectedToken,{x:0,y:-1}); break;
					case 39: /* right */ gridMove(selectedToken,{x:1,y:0}); break;
					case 40: /* down */ gridMove(selectedToken,{x:0,y:1}); break;
					case char.c: selectedToken.position.y -= 5; info(selectedToken.position); break;
					case char.space_bar: selectedToken.position.y += 5; info(selectedToken.position); break;
					case 27: /* esc */ selectedToken=null; keyMode='fly'; break;
				}
		}
	});
	window.addEventListener('keyup',function(e) {
		//console.log('keyup '+e.keyCode);
		switch(e.keyCode) {
			case 87: controls.forward = false; break;
			case 65: controls.left = false; break;
			case 83: controls.backward = false; break;
			case 68: controls.right = false; break;
			case 32: controls.up = false; break;
			case 67: controls.down = false; break;
			case 38: controls.pitchUp = false; break;
			case 39: controls.yawRight = false; break;
			case 40: controls.pitchDown = false; break;
			case 37: controls.yawLeft = false; break;
		}
	});

	window.addEventListener("mousewheel", MouseWheelHandler, false);
	function MouseWheelHandler(e) {
		e.preventDefault();

		// cross-browser wheel delta
		var e = window.event || e; // old IE support
		//console.log(e);
		//var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		var delta = e.wheelDelta;
		//console.log('delta='+delta);

		/*
		var z = camera.position.z;
		z -= (delta*0.5);
		//document.getElementById('map').style.webkitTransform = 'perspective(500) translateZ('+z+'px
		camera.position.z = z
		console.log(camera.position.z);
		*/

		if (delta>0) delta=1;
		if (delta<0) delta=-1;

		var dy = camera.position.y * 0.1;
		dy *= -delta;
		camera.position.y += dy;
		/*
		var ry = 1/((camera.position.y-500)/5000) - Math.PI*0.5;
		if (ry>0) ry = 0;
		camera.rotation.x = ry;
		*/
		if (selectedPoint) camera.lookAt(selectedPoint);
	};

	controls = {
		leftMouse: false,
		rightMouse: false,
		forward: false,
		backward: false,
		left: false,
		right: false,
		pitchUp: false,
		pitchDown: false,
		yawLeft: false,
		yawRight: false,
		up: false,
		down: false,
		movementX: 0,
		movementY: 0,
		movementFactor: 10,
		acceleration: 1
	}
	momentum = {
		x: 0,
		y: 0,
		z: 0,
		rx: 0,
		ry: 0,
		rz: 0
	}
	window.addEventListener('mousedown',function(e) {
		switch(e.button) {
			//case 0: controls.leftMouse = true; return;
			case 2:
				controls.rightMouse = true;
				controls.movementX = 0;
				controls.movementY = 0;
				return;
		}
		// console.warn('left click disabled');

		// return;
		if (e.button==0) {
			var x, y;
			x = ( e.clientX / window.innerWidth ) * 2 - 1;
			y = - ( e.clientY / window.innerHeight ) * 2 + 1;

			var vector = new THREE.Vector3( x, y, 0.5 );
			projector.unprojectVector( vector, camera );

			var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

			var groundIntersects = ray.intersectObjects( [ground] );
			var tokenIntersects = ray.intersectObjects( tokens );
			info(tokenIntersects);

			if (tokenIntersects.length>0) {
				camera.lookAt(tokenIntersects[0].point);
				selectedToken = tokenIntersects[0].object;
				keyMode = 'token';
			} else if (groundIntersects.length>0) {
				camera.lookAt(groundIntersects[0].point);
				selectedPoint = groundIntersects[0].point;
			}
		}
	});
	window.addEventListener('mouseup',function(e) {
		switch(e.button) {
			case 0: controls.leftMouse = false; return;
			case 2: controls.rightMouse = false; return;
		}
	});
	window.addEventListener('mousemove',function(e) {
		controls.movementX += e.movementX * (camera.position.y/50);
		controls.movementY += e.movementY *  (camera.position.y/50);

		// find square/token under the cursor
		var x, y;
		x = ( e.clientX / window.innerWidth ) * 2 - 1;
		y = - ( e.clientY / window.innerHeight ) * 2 + 1;

		var vector = new THREE.Vector3( x, y, 0.5 );
		projector.unprojectVector( vector, camera );

		var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

		var groundIntersects = ray.intersectObjects( [ground] );
		var tokenIntersects = ray.intersectObjects( tokens );

		if (tokenIntersects.length>0) {
			info('intersecting a token');
			info(tokenIntersects[0]);
			var obj = tokenIntersects[0].object;
			var gc = getGridCoordsFromPosition(obj.position);
			// console.log('token at: ',gc);

			scene.remove(selectedTokenOutline);
			var outlineMaterial2 = new THREE.MeshBasicMaterial( { color: 0x330033, side: THREE.BackSide } );
			selectedTokenOutline = new THREE.Mesh( tokenGeo, outlineMaterial2 );
			selectedTokenOutline.position = obj.position;
			selectedTokenOutline.scale.multiplyScalar(1.05);
			scene.add( selectedTokenOutline );

		} else if (groundIntersects.length>0) {
			// info('intersecting ground');
			// info(groundIntersects[0]);
			var obj = groundIntersects[0].point;
			var gc = getGridCoordsFromPosition(obj);
			var pos = getPositionFromGridCoords(gc.x,gc.y);

			selectorCube.position = new THREE.Vector3( pos.x, 0, pos.z );
			// console.log('ground at: ',gc);
		}
	});

}

var selectedTokenOutline;


var char = {
	backspace: 8,
	tab: 9,
	enter: 13,
	shift: 16,
	ctrl: 17,
	alt: 18,
	pause_break: 19,
	caps_lock: 20,
	escape: 27,
	space_bar: 32,
	page_up: 33,
	page_down: 34,
	end: 35,
	home: 36,
	left_arrow: 37,
	up_arrow: 38,
	right_arrow: 39,
	down_arrow: 40,
	insert: 45,
	del: 46,
	_0: 48,
	_1: 49,
	_2: 50,
	_3: 51,
	_4: 52,
	_5: 53,
	_6: 54,
	_7: 55,
	_8: 56,
	_9: 57,
	a: 65,
	b: 66,
	c: 67,
	d: 68,
	e: 69,
	f: 70,
	g: 71,
	h: 72,
	i: 73,
	j: 74,
	k: 75,
	l: 76,
	m: 77,
	n: 78,
	o: 79,
	p: 80,
	q: 81,
	r: 82,
	s: 83,
	t: 84,
	u: 85,
	v: 86,
	w: 87,
	x: 88,
	y: 89,
	z: 90,
	left_window_key: 91,
	right_window_key: 92,
	select_key: 93,
	numpad_0: 96,
	numpad_1: 97,
	numpad_2: 98,
	numpad_3: 99,
	numpad_4: 100,
	numpad_5: 101,
	numpad_6: 102,
	numpad_7: 103,
	numpad_8: 104,
	numpad_9: 105,
	multiply: 106,
	add: 107,
	subtract: 109,
	decimal_point: 110,
	divide: 111,
	f1: 112,
	f2: 113,
	f3: 114,
	f4: 115,
	f5: 116,
	f6: 117,
	f7: 118,
	f8: 119,
	f9: 120,
	f10: 121,
	f11: 122,
	f12: 123,
	num_lock: 144,
	scroll_lock: 145,
	semi_colon: 186,
	equal_sign: 187,
	comma: 188,
	dash: 189,
	period: 190,
	forward_slash: 191,
	grave_accent: 192,
	open_bracket: 219,
	back_slash: 220,
	close_bracket: 221,
	single_quote: 222
};
