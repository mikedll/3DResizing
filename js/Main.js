
//define container of objects
var container, stats;
var objects = new Array();
var objectsProduct = new Array();
//bounding boxes
var figureBox, productBox;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

function onLoaded() {
	init();
	animate();
}

var Clothes = (function() {
    function Clothes(path, name) {
        this.path = path;
        this.name = name;
    }

    Clothes.prototype.fitAndAppend = function(target, scene, group) {
        var _this = this;

        var manager = new THREE.LoadingManager();
        manager.onProgress = function (item, loaded, total) {
            console.log(item, loaded, total);
        };

        var imageLoader = new THREE.ImageLoader(manager);
        imageLoader.load(this.path, function (object) {
                             object.traverse(function(child){
                                                 var productBox = new THREE.BoundingBoxHelper(object, 0xff0000);
                                                 productBox.update();
                                                 child.material.map = new THREE.Texture();
                                                 child.geometry.verticesNeedUpdate = true;
                                                 
                                             });
                             _this.obj = object;
                             _this.obj.name = this.name;
                             scene.add(this.obj);
                             group.add(this.obj);
                         });
        
        return;
    };
                   
    return Clothes;
})();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 250;

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight(0x101030);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    //group
    group = new THREE.Object3D();
    group.position.x = 0.0;
    group.position.y = 0.0;
    group.position.z = 0.0;
    scene.add(group);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xCCCCCC, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    /*	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener('mousedown', onDocumentMouseDown, false);*/
    //

    window.addEventListener('resize', onWindowResize, false);
    
    loadModels();
}

function loadModels() {

    // texture
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    // figure model load
    var loader = new THREE.OBJLoader(manager);
    loader.load('res/models/characters/man.obj', function (object) {

        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                var layerVertex = 1;  // represents layer on Y axes less then 5
                var layerVertex2 = 1; // represents layer on Y axes less then 10
                var layerVertex3 = 1; // represents layer on Y axes less then 15
                var layerVertex4 = 1;
                var layerVertex5 = 1;
                //Give each vertex a name so I will be able to find it when loading vertices of product
                //Goal is to transform layer by layer on Y axis

                for (var i = 0; i < child.geometry.vertices.length; i++) {
                    if (child.geometry.vertices[i].y < 5) {
                        child.geometry.vertices[i].name = "v1" + layerVertex.toString();
                        layerVertex++;
                    }
                    else if (child.geometry.vertices[i].y < 10) {
                        child.geometry.vertices[i].name = "v2" + layerVertex2.toString();
                        layerVertex2++;
                    }
                    else if (child.geometry.vertices[i].y < 15) {
                        child.geometry.vertices[i].name = "v3" + layerVertex3.toString();
                        layerVertex3++;
                    }
                    //var pom = new THREE.Vector3(0, 0, 0);
                    //pom.x = child.geometry.vertices[i].x;
                    //pom.y = child.geometry.vertices[i].y;
                    //pom.z = child.geometry.vertices[i].z;
                    //objects.push(pom);

                }
                console.log("Postava points " + objects.length.toString());

            }

        });
        object.name = "figure";

        figureBox = new THREE.BoundingBoxHelper(object, 0xff0000);
        //console.log(boundingBox.box.max);
        //console.log(boundingBox.box.min);
        figureBox.update();

        scene.add(object);
        group.add(object);
    }

    );

    var c1 = new Clothes('res/models/clothes/denim-jeans/denim-jeans.obj', 'product');
    c1.fitAndAppend(figureBox, scene, group);
}

function deadCode() {

    // texture 3 - pants
    var manager3 = new THREE.LoadingManager();
    manager3.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    // var loader3 = new THREE.ImageLoader(manager3);
    // loader3.load('res/models/clothes/denim-jeans/diffuse-map.jpg', function (image3) {

    //     texture3.image = image3;
    //     texture3.needsUpdate = true;

    // });

    // objekt 3 - pants

    var texture3 = new THREE.Texture();
    var loader3 = new THREE.OBJLoader(manager3);
    loader3.load('res/models/clothes/denim-jeans/denim-jeans.obj', function (object3) {

        object3.traverse(function (child) {

            if (child instanceof THREE.Mesh) {
                console.log("Kalhoty");
                var productBox = new THREE.BoundingBoxHelper(object3, 0xff0000);
                productBox.update();

                //get correct scale of product
                child.scale.y = ((Math.abs(figureBox.box.max.y) + Math.abs(figureBox.box.min.y)) / 2) / (Math.abs(productBox.box.max.y) + Math.abs(productBox.box.min.y));
                child.scale.x = ((Math.abs(figureBox.box.max.x) + Math.abs(figureBox.box.min.x)) / 2) / (Math.abs(productBox.box.max.x) + Math.abs(productBox.box.min.x));
                child.scale.z = (Math.abs(figureBox.box.max.z) + Math.abs(figureBox.box.min.z)) / (Math.abs(productBox.box.max.z) + Math.abs(productBox.box.min.z));
                child.material.map = texture3;
                child.geometry.verticesNeedUpdate = true;
                console.log("Pants points " + child.geometry.vertices.length.toString());
                //child.scale.set(0.5, 0.5, 0.5);
                console.log("Pants points " + child.geometry.vertices.length.toString());

                var layerVertex = 1;
                var layerVertex2 = 1;
                var layerVertex3 = 1;
                var layerVertex4 = 1;
                var layerVertex5 = 1;

                //name vertices of product
                for (var i = 0; i < child.geometry.vertices.length; i++) {
                    if (child.geometry.vertices[i].y < 5) {
                        child.geometry.vertices[i].name = "v1" + layerVertex.toString();
                        layerVertex++;
                    }
                    else if (child.geometry.vertices[i].y < 10) {
                        child.geometry.vertices[i].name = "v2" + layerVertex2.toString();
                        layerVertex2++;
                    }
                    else if (child.geometry.vertices[i].y < 15) {
                        child.geometry.vertices[i].name = "v3" + layerVertex3.toString();
                        layerVertex3++;
                    }
                }
				/*
                // this loop tries to find matches of vertices 
                for (var j = 0; j < child.geometry.vertices.length; j++) {

                    group.children[0].traverse(function (childPostava) {

                        if (childPostava instanceof THREE.Mesh) {

                            for (var i = 0; i < childPostava.geometry.vertices.length; i++) {
                                console.log(child.geometry.vertices[j].name);
                                console.log(childPostava.geometry.vertices[i].name);
                                //if (child.geometry.vertices[j].name == childPostava.geometry.vertices[i].name)
                                //{
                                //    child.geometry.vertices[j].set(childPostava.geometry.vertices[i].x,
                                //        childPostava.geometry.vertices[i].y,
                                //        childPostava.geometry.vertices[i].z);
                                //}
                            }
                        }
                    })
                };
				*/
                for (var i = 0; i < objectsProduct.length; i++) {

                }
                /*
                var c = 0;
                for (var i = 0; i < child.geometry.vertices.length; i++) {
                    //child.geometry.vertices[i].set(child.geometry.vertices[i].x, child.geometry.vertices[i].y - 20, child.geometry.vertices[i].z);

                    for (var j = 0; j < objects; j++) {
                        child.geometry.vertices[i].set(objects[c].x, objects[c].y, objects[c].z);

                    }

                }

                */
            }

        });


        object3.name = "product";
        scene.add(object3);

        group.add(object3);

        // logs object names
        //if (object3.geometry) {
        //for (j = 0; j < object3.geometry.vertices.length; j++) {
        //    console.log(object3.geometry.vertices);
        //}
        //}
   });	    
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
    event.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
}

function onDocumentMouseMove(event) {
    /*   mouseXOnMouseDown = event.clientX - windowHalfX;
    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;
    */

    mouseX = event.clientX - windowHalfX;

    targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;
}

function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentTouchStart(event) {
    if (event.touches.length == 1) {

        event.preventDefault();

        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;
    }
};

function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
    }
};

//

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    camera.position.x = (mouseX - camera.position.x) * .25;
    camera.position.y = (40);
    group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
    camera.lookAt(scene.position);
    group.scale.set(2, 2, 2);
    group.position.y = -30;
    renderer.render(scene, camera);
    /*
    for (i = 1; i < group.children.length; i++) {
        var obj = group.children[i];
        console.log(obj.name);
        if (group.children[i].geometry) {
            for (j = 0; j < group.children[i].geometry.vertices.length; j++) {
                console.log("a");
            }
        }
    }*/
}
