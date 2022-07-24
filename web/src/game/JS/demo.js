// 引入Three.js
import * as THREE from 'three';
// import { Color } from 'three';
// 使普通数据变响应式的函数  
import { storeToRefs } from "pinia";
import { mainStore } from "../../stores/counter";
// 实例化仓库
const store = mainStore();
// 解构并使数据具有响应式
const { score } = storeToRefs(store);
const { status } = storeToRefs(store);


//COLORS
var Colors = {
    red: 0xf25346,
    white: 0xd8d0d1,
    brown: 0x59332e,
    pink: 0xF5986E,
    brownDark: 0x23190f,
    blue: 0x68c3c0,
};

//声明对象
var containerX = 100, containerY = 50; //容器,飞机活动范围
var camera; //相机
var scene;  //场景
var renderer; //渲染器
var game;
var deltaTime = 0;
var airPlane, planeX = 0, planeY = 50, planeSpeed = 1;
var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;
var blade;
var targetX, targetY
var ennemiesPool = [];
var particlesPool = [];

function resetGame() {
    game = {
        speed: 0,
        initSpeed: .00035,
        baseSpeed: .00035,
        distance: 0,

        status: "playing",
    };
    // fieldLevel.innerHTML = Math.floor(game.level);
}

/* 场景 */
function initScene() {
    scene = new THREE.Scene();
    // scene.fog=new THREE.Fog(Colors.white,0,100);//雾化效果
    window.addEventListener('resize', handleWindowResize, false);
}

// 更新渲染器的高度和宽度以及相机的纵横比
function handleWindowResize() {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

/* 相机 */
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(-0.1, 350, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

/* 渲染器 */
function initRender() {
    // renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // renderer.setSize(WIDTH, HEIGHT);
    // renderer.shadowMap.enabled = true;
    // container = document.getElementById('world');
    // container.appendChild(renderer.domElement);

    // window.addEventListener('resize', handleWindowResize, false);


    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(new THREE.Color(Colors.brownDark));//背景颜色
    // document.body.appendChild(renderer.domElement);
    renderer.shadowMapEnabled = true;

}
//光源
var hemisphereLight, shadowLight;
function createLights() {
    // 半球光就是渐变的光；
    // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    // 方向光是从一个特定的方向的照射
    // 类似太阳，即所有光源是平行的
    // 第一个参数是关系颜色，第二个参数是光源强度
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    // 设置光源的方向。  
    // 位置不同，方向光作用于物体的面也不同，看到的颜色也不同
    shadowLight.position.set(150, 350, 0);

    // 开启光源投影
    shadowLight.castShadow = true;

    // 定义可见域的投射阴影
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // 定义阴影的分辨率；
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // 为了使这些光源呈现效果，只需要将它们添加到场景中
    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

//函数封装
function GetTexture(imgUrl, wNum, hNum) {//设置贴图的图片和重复频率
    var textureGrass = THREE.ImageUtils.loadTexture(imgUrl);
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(wNum, hNum);
    return textureGrass;
}
var ennemybox, bulletbox;
function checkBullet2(p) {
    if (p != null) {
        if (fpsnum == 0 && t > 1 && z >= 4) {
            p.bulletY = -65;
            t = 0; z = 0;
        }
        else {
            if (status.value == 1) { p.bulletY += 0.5 }
            else { p.bulletY += planeSpeed; }
            p.ennemy.position.x = -p.bulletY;
            p.box3d = new THREE.Box3().setFromObject(p.ennemy);
            p.boxHelper.update();
            // this.box3d = new THREE.Box3().setFromObject(p.mesh);
            // this.boxHelper = new THREE.BoxHelper(p.mesh, 0xff0000 );
            // scene.add(p.mesh, p.boxHelper);
            ennemybox = p.box3d;
            var flag = ennemybox.intersectsBox(bulletbox);
            if (flag) {
                scene.remove(p.ennemy);
                scene.remove(p.boxHelper);
                scene.remove(p.box3d);
                p.bulletY = -10000;
                p = null;
                score.value++;
                planeSpeed += 0.05
                return
                // game.distance+=1;
            }
        }
        if (status.value == 1) {
            if (p.bulletY >= 20) {
                scene.remove(p.ennemy);
                p = null;
            }
        }
        else {
            if (p.bulletY >= 80) {
                scene.remove(p.ennemy);
                p = null;
                status.value = 1;
            }
        }
    }
}
function checkBullet(p) {
    if (p != null) {
        if (fpsnum == 0) {
            p.bulletY = targetY + 15;

        }
        else {

            p.bulletY += planeSpeed * 3;
            p.bullet.position.x = p.bulletY;
            p.box3d = new THREE.Box3().setFromObject(p.bullet);
            p.boxHelper.update();
            bulletbox = p.box3d;

            // var flag = ennemybox.intersectsBox(bulletbox);
            // if(flag)
            // {
            //     scene.remove(p.bullet);
            //     p = null;
            // }

        }
        // p.bulletY+= planeSpeed/2;
        // p.bullet.position.x=p.bulletY;



        // p.bullet.position.x=p.bulletY;
        if (p.bulletY >= 65) {
            scene.remove(p.bullet);
            p = null;
        }
    }
}


var AirPlane = function () {

    this.mesh = new THREE.Object3D();

    // 创建机舱
    var geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
    var matCockpit = new THREE.MeshPhongMaterial({
        color: Colors.red,
    });
    var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

    // 创建引擎
    var geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    var matEngine = new THREE.MeshPhongMaterial({
        color: Colors.white,

    });
    var engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // 创建机尾
    var geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    var matTailPlane = new THREE.MeshPhongMaterial({
        color: Colors.red,

    });
    var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-35, 25, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);

    // 创建机翼
    var geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
    var matSideWing = new THREE.MeshPhongMaterial({
        color: Colors.white,
        map: GetTexture('../jpg/tw.jpg', 1, 1)
    });
    var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);

    // 创建螺旋桨
    var geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    var matPropeller = new THREE.MeshPhongMaterial({
        color: Colors.brown,

    });
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    // 创建螺旋桨的桨叶
    var geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    var matBlade = new THREE.MeshPhongMaterial({
        color: Colors.brownDark,

    });

    var blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.propeller.add(blade);
    this.propeller.position.set(50, 0, 0);
    this.mesh.add(this.propeller);
};

var airplane;

function createPlane() {
    airplane = new AirPlane();
    airplane.mesh.scale.set(.25, .25, .25);
    airplane.mesh.position.y = 35;
    scene.add(airplane.mesh);

}

function createBullet() {

    // 子弹
    this.bulletX = mousePos.y * 100 + 15;
    this.bulletY = mousePos.x * 200;

    var geomSideWing = new THREE.SphereGeometry(1, 32, 32);
    var matSideWing = new THREE.MeshPhongMaterial({ color: Colors.red });
    this.bullet = new THREE.Mesh(geomSideWing, matSideWing);
    this.bullet.castShadow = true;
    this.bullet.rotation.z = -90;
    this.bullet.receiveShadow = true;
    this.bullet.position.set(this.bulletX, 35, this.bulletY);

    // scene.add(this.bullet);
    // 创建他的包围盒的辅助线
    this.boxHelper = new THREE.BoxHelper(this.bullet, Colors.brownDark);
    // 创建包围盒
    this.box3d = new THREE.Box3().setFromObject(this.bullet);
    scene.add(this.bullet, this.boxHelper);
};

var step = 0, fpsnum = 0;
var enemyPlane0 = null, enemyPlane1 = null, enemyPlane2 = null, enemyPlane3 = null, enemyPlane4 = null, enemyPlane5 = null;
var p0 = null, p1 = null, p2 = null, p3 = null, p4 = null, p5 = null;
var p = [];
var q = []
var i = 0;
var j = 0;
var t, z = 0,jk;
/* 组件动画 */
function action() {


    // for( j=i;j>0;j--){}
    if(jk!=status.value)
    planeSpeed=1;
    
    jk=status.value;

     checkBullet2(q[j - 1]) 

    checkBullet(p[i - 1])

    // checkBullet2(p0);
    // checkBullet2(p1);
    // checkBullet2(p2);
    // checkBullet2(p3);
    // checkBullet2(p4);
    // checkBullet2(p5);

    // if(fpsnum==25)
    //     {p0=new createBullet();checkBullet(p0);}
    // else if(fpsnum==50)
    //     {p1=new createBullet();checkBullet(p1);}
    // else if(fpsnum==75)
    //     {p2=new createBullet();checkBullet(p2);}
    // else if(fpsnum==100)
    //     {p3=new createBullet();checkBullet(p3);}
    // else if(fpsnum==125)
    //     {p4=new createBullet();checkBullet(p4);}
    // else if(fpsnum==150)
    //     {p5=new createBullet();checkBullet(p5);}
    // else if(fpsnum>=151){
    //     fpsnum=0;
    //     }

    // fpsnum=fpsnum+1;
    // checkBullet(p[0]);

    // // checkBullet(p[i-1]);
    // checkBullet(p[1]);
    // checkBullet(p[2]);
    // checkBullet(p[3]);
    // checkBullet(p[4]);
    // checkBullet(p[5]);
    // checkBullet(p[6]);
    // checkBullet(p[7]);
    // checkBullet(p[8]);
    // checkBullet(p[9]);

    if (fpsnum / 50 == 1) {
        p[i] = new createBullet();
        t = Math.random() * 2;
        if (t > 1 && z >= 3) { q[j] = new createEnnemy(); j++; }
        fpsnum = 0;
        i++;
        z++;
    }
    else
        fpsnum++;

    step += planeSpeed;
}


/* 数据更新 */
function update() {
    action();
}

var mousePos = { x: 0, y: 0 };

// mousemove 事件处理函数

function handleMouseMove(event) {

    // 这里我把接收到的鼠标位置的值转换成归一化值，在-1与1之间变化
    // 这是x轴的公式:

    var tx = -1 + (event.clientX / WIDTH) * 2;

    // 对于 y 轴，我们需要一个逆公式
    // 因为 2D 的 y 轴与 3D 的 y 轴方向相反

    var ty = 1 - (event.clientY / HEIGHT) * 2;
    mousePos = { x: tx, y: ty };
}

window.addEventListener('load', init, false);
var fieldDistance;
function init() {

    status.value = 0;
    fieldDistance = document.getElementById("distValue");
    initScene();
    initCamera();
    initRender();
    createLights();
    createPlane();
    //添加监听器
    document.addEventListener('mousemove', handleMouseMove, false);


    loop();
    // initLight();
    // initContent();


    // window.addEventListener('resize',onWindowResize,false)//添加全局监听器：尺寸改变
}

// function handleMouseUp(event){
//     if (status.value == 1){

//     }
//   }

function loop() {
    // if(game.states=="game over"){

    // }
    //playing
    // 更新每帧的飞机
    updatePlane();
    //分数
    updateDistance();
    // if(j>1)
    // refreshPos(p[i-1]);

    renderer.render(scene, camera);
    requestAnimationFrame(loop);

}

function updateDistance() {

    // fieldDistance.innerHTML = Math.floor(score);

    // @ts-ignore
    // window.functionForJs("aaa")
}
function updatePlane() {

    // 让我们在x轴上-100至100之间和y轴25至175之间移动飞机
    // 根据鼠标的位置在-1与1之间的范围，我们使用的 normalize 函数实现（如下）

    // targetY = normalize(mousePos.y, -1, 1, -100, 50);
    // targetX = normalize(mousePos.x, -1, 1, -145, 125);
    if (status.value == 0) {
        targetY = mousePos.y * 100,
            targetX = mousePos.x * 200,
            // // 更新飞机的位置
            // airplane.mesh.position.x = targetY;
            // airplane.mesh.position.z = targetX;

            airplane.mesh.position.x = mousePos.y * 100;
        airplane.mesh.position.z = mousePos.x * 200;
    }
    else if (status.value == 1) {
        targetY = 10000,
            targetX = 10000,
            airplane.mesh.position.x = targetY
        airplane.mesh.position.z = targetX
    }

}

function normalize(v, vmin, vmax, tmin, tmax) {

    var nv = Math.max(Math.min(v, vmax), vmin);
    var dv = vmax - vmin;
    var pc = (nv - vmin) / dv;
    var dt = tmax - tmin;
    var tv = tmin + (pc * dt);
    return tv;
}
//障碍物
function createEnnemy() {
    this.bulletX = 65;
    this.bulletY = Math.random() * 200 - 100;
    var geom = new THREE.SphereGeometry(6, 6, 6);
    var mat = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shininess: 0,
        specular: 0xffffff,
    });
    this.ennemy = new THREE.Mesh(geom, mat);
    this.ennemy.castShadow = true;
    this.ennemy.receiveShadow = true;
    this.ennemy.position.set(this.bulletX, 35, this.bulletY);
    // scene.add(this.mesh);

    // 创建他的包围盒的辅助线
    this.boxHelper = new THREE.BoxHelper(this.ennemy, Colors.brownDark);
    // 创建包围盒
    this.box3d = new THREE.Box3().setFromObject(this.ennemy);
    scene.add(this.ennemy, this.boxHelper);
}

// function refreshPos (x,y) {

//     this.ennemy.position.x = x;
//     this.ennemy.position.y = y;
//     this.box3d = new THREE.Box3().setFromObject(this.ennemy);
//     this.box3d.setFromObject(this.ennemy);
//     this.boxHelper.update();


// }

//  function  EnnemiesHolder (){
//     this.mesh = new THREE.Object3D();
//     this.ennemiesInUse = [];
//   }

//   EnnemiesHolder.prototype.spawnEnnemies = function(){
//     var nEnnemies = game.level;

//     for (var i=0; i<nEnnemies; i++){
//       var ennemy;
//       if (ennemiesPool.length) {
//         ennemy = ennemiesPool.pop();
//       }else{
//         ennemy = new Ennemy();
//       }

//       ennemy.angle = - (i*0.1);
//       ennemy.distance = game.seaRadius + game.planeDefaultHeight + (-1 + Math.random() * 2) * (game.planeAmpHeight-20);
//       ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle)*ennemy.distance;
//       ennemy.mesh.position.x = Math.cos(ennemy.angle)*ennemy.distance;

//       this.mesh.add(ennemy.mesh);
//       this.ennemiesInUse.push(ennemy);
//     }
//   }

//   EnnemiesHolder.prototype.rotateEnnemies = function(){
//     for (var i=0; i<this.ennemiesInUse.length; i++){
//       var ennemy = this.ennemiesInUse[i];
//       ennemy.angle += game.speed*deltaTime*game.ennemiesSpeed;

//       if (ennemy.angle > Math.PI*2) ennemy.angle -= Math.PI*2;

//       ennemy.mesh.position.y = -game.seaRadius + Math.sin(ennemy.angle)*ennemy.distance;
//       ennemy.mesh.position.x = Math.cos(ennemy.angle)*ennemy.distance;
//       ennemy.mesh.rotation.z += Math.random()*.1;
//       ennemy.mesh.rotation.y += Math.random()*.1;

//       //var globalEnnemyPosition =  ennemy.mesh.localToWorld(new THREE.Vector3());
//       var diffPos = airplane.mesh.position.clone().sub(ennemy.mesh.position.clone());
//       var d = diffPos.length();
//       if (d<game.ennemyDistanceTolerance){
//         // ParticlesHolder.prototype.spawnParticles(ennemy.mesh.position.clone(), 15, Colors.red, 3);

//         ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
//         this.mesh.remove(ennemy.mesh);
//         game.planeCollisionSpeedX = 100 * diffPos.x / d;
//         game.planeCollisionSpeedY = 100 * diffPos.y / d;
//         // ambientLight.intensity = 2;

//         removeEnergy();
//         i--;
//       }else if (ennemy.angle > Math.PI){
//         ennemiesPool.unshift(this.ennemiesInUse.splice(i,1)[0]);
//         this.mesh.remove(ennemy.mesh);
//         i--;
//       }
//     }
//   }

//   function removeEnergy(){
//     game.energy -= game.ennemyValue;
//     game.energy = Math.max(0, game.energy);
//   }

//    function ParticlesHolder(){
//     this.mesh = new THREE.Object3D();
//     this.particlesInUse = [];
//   }

//   ParticlesHolder.prototype.spawnParticles = function(pos, density, color, scale){

//     var nPArticles = density;
//     for (var i=0; i<nPArticles; i++){
//       var particle;
//       if (particlesPool.length) {
//         particle = particlesPool.pop();
//       }else{
//         particle = new particle();
//       }
//       this.mesh.add(particle.mesh);
//       particle.mesh.visible = true;
//       var _this = this;
//       particle.mesh.position.y = pos.y;
//       particle.mesh.position.x = pos.x;
//       particle.explode(pos,color, scale);
//     }
//   }

init(); //初始化
animate();

/* 循环渲染 */
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    update();

}
function gameover() {

}

export { //很关键
    renderer,
};

