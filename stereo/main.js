			var camera, scene, renderer, controls, effect;
			var mesh;
			init();
			animate();
			
			// block is a Three.Mesh object
			function removeInternalFaces(geometry, mesh) {
			    var face;
			    var toDelete = [];
			    var normal;
			    var blockRaycaster = new THREE.Raycaster();

			    // raycast itself from the center of each face (negated normal), and whichever face gets intersected
			    // is an inner face
			    for (i = 0; i < geometry.faces.length; i++) {
			        face = geometry.faces[i];
			        if (face) {
			            normal = face.normal.clone();
// 			            normal.negate();
// 						for each geometry.face[i].index 
// 					       geometry.vertices[geometry.face[i].index].x = 4; 
// 						blockRaycaster.set(face.centroid, normal);
						blockRaycaster.set(geometry.vertices[geometry.faces[i].a], normal);
			            var intersects = blockRaycaster.intersectObject(mesh);

// 			            for (j = 0; j < intersects.length; j++) {
// 			                toDelete.push(intersects[j].faceIndex);
// 			            }
			            if (intersects.length > 0) {
			            	console.log(face);
			            	toDelete.push(face);
			            }
			        }
			    }

			    // actually delete them
			    for (i = 0; i < toDelete.length; i++) {
			        delete geometry.faces[toDelete[i]];
			    }
			    geometry.faces = geometry.faces.filter( function(v) { return v; });
			    geometry.elementsNeedUpdate = true; // update faces
			}
			
			function addLine(scene) {
				var material = new THREE.LineBasicMaterial({ color: 0xAAFFAA });

				// crosshair size
				var x = 100, y = 100;

				var geometry = new THREE.Geometry();

				// crosshair
				geometry.vertices.push(new THREE.Vector3(0, y, 0));
				geometry.vertices.push(new THREE.Vector3(0, -y, 0));
				geometry.vertices.push(new THREE.Vector3(0, 0, 0));
				geometry.vertices.push(new THREE.Vector3(x, 0, 0));    
				geometry.vertices.push(new THREE.Vector3(-x, 0, 0));

				var crosshair = new THREE.Line( geometry, material );

				// place it in the center
				var crosshairPercentX = 50;
				var crosshairPercentY = 50;
				var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
				var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;

				crosshair.position.x = crosshairPositionX * camera.aspect;
				crosshair.position.y = crosshairPositionY;

				crosshair.position.z = -0.3;
				scene.add(crosshair);
			}
			
			function createMeshTypeSchraegDach() {
				var triangleShape = new THREE.Shape();
				triangleShape.moveTo(-100, 200);
				triangleShape.lineTo(100, 400);
				triangleShape.lineTo(100, 0);
				triangleShape.lineTo(-100, 0);
				triangleShape.lineTo(-100, 200);

				// Create a new geometry by extruding the triangleShape
				// The option: 'amount' is how far to extrude, 'bevelEnabled: false' prevents beveling
				var extrudedGeometry = new THREE.ExtrudeGeometry(triangleShape, {amount: 250, bevelEnabled: false});

				extrudedGeometry.computeFaceNormals();
				
				var material = new THREE.MeshNormalMaterial({wireframe: false, transparent: true, opacity: 0.5});
				mesh = new THREE.Mesh( extrudedGeometry, material );
				return mesh;
			}

			function createMeshTypeGrundPlatte() {
				var triangleShape = new THREE.Shape();
				triangleShape.moveTo(0, 0);
				triangleShape.lineTo(0, 50);
				triangleShape.lineTo(800, 50);
				triangleShape.lineTo(800, 0);
				triangleShape.lineTo(0, 0);

				// Create a new geometry by extruding the triangleShape
				// The option: 'amount' is how far to extrude, 'bevelEnabled: false' prevents beveling
				var extrudedGeometry = new THREE.ExtrudeGeometry(triangleShape, {amount: 250, bevelEnabled: false});

				extrudedGeometry.computeFaceNormals();
				
				var material = new THREE.MeshNormalMaterial({wireframe: false, transparent: true, opacity: 0.5});
				mesh = new THREE.Mesh( extrudedGeometry, material );
				return mesh;
			}

			function createMeshTypeFlachDach() {
				var triangleShape = new THREE.Shape();
				triangleShape.moveTo(-100, 250);
				triangleShape.lineTo(100, 250);
				triangleShape.lineTo(100, 0);
				triangleShape.lineTo(-100, 0);
				triangleShape.lineTo(-100, 200);

				// Create a new geometry by extruding the triangleShape
				// The option: 'amount' is how far to extrude, 'bevelEnabled: false' prevents beveling
				var extrudedGeometry = new THREE.ExtrudeGeometry(triangleShape, {amount: 250, bevelEnabled: false});

				extrudedGeometry.computeFaceNormals();
				
				var material = new THREE.MeshNormalMaterial({wireframe: false, transparent: true, opacity: 0.5});
				mesh = new THREE.Mesh( extrudedGeometry, material );
				
				var cylinder_geometry = new THREE.CylinderGeometry( 50, 50, 2000, 32 );
				var cylinder = new THREE.Mesh( cylinder_geometry, material );
				cylinder.translateZ(100);


				var flachdach_bsp = new ThreeBSP( mesh );
				var cylinder_bsp = new ThreeBSP( cylinder );
				
				var subtract_bsp = flachdach_bsp.subtract(cylinder_bsp);
				var result = subtract_bsp.toMesh(material);
				result.geometry.computeFaceNormals();

				return result;
			}

			function createMeshTypeSattelDach() {
				var triangleShape = new THREE.Shape();
				triangleShape.moveTo(-100, 200);
				triangleShape.lineTo(0, 400);
				triangleShape.lineTo(100, 200);
				triangleShape.lineTo(100, 0);
				triangleShape.lineTo(-100, 0);
				triangleShape.lineTo(-100, 200);

				// Create a new geometry by extruding the triangleShape
				// The option: 'amount' is how far to extrude, 'bevelEnabled: false' prevents beveling
				var extrudedGeometry = new THREE.ExtrudeGeometry(triangleShape, {amount: 250, bevelEnabled: false});

				extrudedGeometry.computeFaceNormals();
				
				var material = new THREE.MeshNormalMaterial({wireframe: false, transparent: true, opacity: 0.5});
				mesh = new THREE.Mesh( extrudedGeometry, material );
				return mesh;
			}
			
			
function onDocumentMouseDown( event ) {                
	var mouse = new THREE.Vector2();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	// update the picking ray with the camera and mouse position
	var raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );

	for ( var i = 0; i < intersects.length; i++ ) {
		intersects[ i ].object.material.opacity =  intersects[ i ].object.material.opacity * 1.2;
	}
}

			function init() {
                try {
				camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 20000 );
				camera.position.z = 3000;
				camera.position.y = 50;
				camera.position.x = 1500;
				scene = new THREE.Scene();

				scene.add(createMeshTypeSattelDach());
				
				var objectFlachDach = createMeshTypeFlachDach()
				objectFlachDach.translateX(250); 
				scene.add(objectFlachDach);
				
				var objectSchraegDach = createMeshTypeSchraegDach();
				objectSchraegDach.translateX(500); 
				scene.add(objectSchraegDach);

				var objectGrundPlatte = createMeshTypeGrundPlatte();
				objectGrundPlatte.translateY(-75);
				objectGrundPlatte.translateX(-150);
				scene.add(objectGrundPlatte);

				addLine(scene);

				renderer = new THREE.WebGLRenderer();
//				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.setClearColor( 0xffffff, 1 );
				controls = new THREE.OrbitControls( camera );
				// Our preferred controls via DeviceOrientation
function setOrientationControlsInner(e) {
		          controls.update();
render();
}
		        function setOrientationControls(e) {
		        try {
		          controls = new THREE.DeviceOrientationControls(camera, true);
		          controls.connect();
		          controls.update();
		          
		          // controls.addEventListener( 'change', render );
		          window.removeEventListener('deviceorientation', setOrientationControls, true);
			window.addEventListener('deviceorientation', setOrientationControlsInner, true);
		        } catch (e) {
		        	alert(e);
		        }
		        }
		        window.addEventListener('deviceorientation', setOrientationControls, true);
				
				document.body.appendChild( renderer.domElement );
				controls.addEventListener( 'change', render );
				effect = new THREE.StereoEffect(renderer);
				effect.setSize( window.innerWidth, window.innerHeight );

				renderer.domElement.addEventListener( 'click', onDocumentMouseDown );
				resize();
				render();
				window.addEventListener('resize', resize, true);
				} catch (e) {
                	console.log(e);
                }
			}
			
			function resize() {
		        var width = window.innerWidth;
		        var height = window.innerHeight;

		        camera.aspect = width / height;
		        camera.updateProjectionMatrix();

		        renderer.setSize(width, height);
		        effect.setSize(width, height);
		        camera.updateProjectionMatrix();

			}
			
			function animate() {
// 				requestAnimationFrame( animate );
				mesh.rotation.x += 0.005;
				mesh.rotation.y += 0.01;
				effect.render( scene, camera );
			}
			
			function render() {
				resize();
				  renderer.render( scene, camera );
				  effect.render( scene, camera );
				}
