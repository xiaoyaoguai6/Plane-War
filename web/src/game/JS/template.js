// 引入Three.js
import * as THREE from 'three';

//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

//声明对象
var containerX=100,containerY=50; //容器,飞机活动范围
var camera; //相机
var scene;  //场景
var renderer; //渲染器
var airPlane,planeX=0,planeY=50,planeSpeed=1;
var HEIGHT = window.innerHeight;  
var WIDTH = window.innerWidth;
var blade;


/* 场景 */
function initScene() {
    scene = new THREE.Scene();
    // scene.fog=new THREE.Fog(Colors.white,0,100);//雾化效果
}

/* 相机 */
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0,300, 0.1);
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


    renderer = new THREE.WebGLRenderer({alpha: true,antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(new THREE.Color(Colors.brownDark));//背景颜色
    // document.body.appendChild(renderer.domElement);
    renderer.shadowMapEnabled = true;

}

/* 灯光 */
function initLight() {
    scene.add(new THREE.AmbientLight(0x0c0c0c));//环境光，不产生阴影，弱化阴影，给场景提供一些其他的颜色
    let spotLight = new THREE.SpotLight(0xffffff);//聚光灯，类似台灯
    spotLight.position.set(-100, 200, 0);
    spotLight.castShadow = true;    // 让光源产生阴影
    let spotLight2 = new THREE.SpotLight(0xffffff);
    spotLight2.position.set(800, 800, 800);
    scene.add(spotLight);
    scene.add(spotLight2);
}
/*************************函数封装部分****************************/
function GetTexture(imgUrl,wNum,hNum){//设置贴图的图片和重复频率
    var textureGrass = THREE.ImageUtils.loadTexture(imgUrl);
    textureGrass.wrapS = THREE.RepeatWrapping;
    textureGrass.wrapT = THREE.RepeatWrapping;
    textureGrass.repeat.set(wNum, hNum);
    return textureGrass;
}
function checkBullet(p){
    if(p!=null)
        {
            p.bullet.rotation.z=step;
            p.bulletY-=planeSpeed/2;
            p.bullet.position.z=p.bulletY;
            if(p.bulletY<=-45)
            {
                scene.remove(p.bullet);
                p=null;
            }
        }
}
/*********************************************************************/

function AirPlane() {
this.mesh = new THREE.Object3D();

// 这里要做的是一个驾驶舱
var geomCockpit = new THREE.BoxGeometry(80,50,50,1,1,1);
var matCockpit = new THREE.MeshPhongMaterial({color:0x74983E, map: GetTexture('../jpg/bg.jpg',1,1)});
// geomCockpit.vertices[4].y-=10;
// geomCockpit.vertices[4].z+=20;
// geomCockpit.vertices[5].y-=10;
// geomCockpit.vertices[5].z-=20;
// geomCockpit.vertices[6].y+=20;
// geomCockpit.vertices[6].z+=20;
// geomCockpit.vertices[7].y+=20;
// geomCockpit.vertices[7].z-=20;

var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
cockpit.castShadow = true;
cockpit.receiveShadow = true;
this.mesh.add(cockpit);

// 还要有引擎盖
var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
var matEngine = new THREE.MeshPhongMaterial({color:Colors.brown});
var engine = new THREE.Mesh(geomEngine, matEngine);
engine.position.x = 40;
engine.castShadow = true;
engine.receiveShadow = true;
this.mesh.add(engine);

// 做个尾巴吧
var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
var matTailPlane = new THREE.MeshPhongMaterial({color:0xff0000});
var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
tailPlane.position.set(-35,25,0);
tailPlane.castShadow = true;
tailPlane.receiveShadow = true;
this.mesh.add(tailPlane);

// 机翼
var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
var matSideWing = new THREE.MeshPhongMaterial({color:Colors.brownDark,map: GetTexture('../jpg/tw.jpg',0.1,1)});
var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
sideWing.castShadow = true;
sideWing.receiveShadow = true;
this.mesh.add(sideWing);

// 飞机前端旋转的螺旋桨
var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
var matPropeller = new THREE.MeshPhongMaterial({color:0xff0000, });
this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
this.propeller.castShadow = true;
this.propeller.receiveShadow = true;

// 螺旋桨
var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
var matBlade = new THREE.MeshPhongMaterial({color:0xff00aa,});

blade = new THREE.Mesh(geomBlade, matBlade);
blade.position.set(8,0,0);
blade.castShadow = true;
blade.receiveShadow = true;
this.propeller.add(blade);
this.propeller.position.set(50,0,0);
this.mesh.add(this.propeller);

};

function createBullet() {

// 子弹
this.bulletX=planeX;
this.bulletY=planeY-20;

var geomSideWing = new THREE.BoxGeometry(2,2,4,1,1,1);
var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red});
this.bullet = new THREE.Mesh(geomSideWing, matSideWing);
this.bullet.castShadow = true;
this.bullet.receiveShadow = true;
this.bullet.position.set(this.bulletX,30,this.bulletY);
scene.add(this.bullet);

};


function createPlane(){
    airPlane = new AirPlane();
    airPlane.mesh.scale.set(.25,.25,.25);
    airPlane.mesh.rotation.y=0.5*Math.PI;
    airPlane.mesh.position.set(0,30,planeY);
    scene.add(airPlane.mesh);
}



// /* 场景中的内容 */
function initContent() {

    /*创建背景平面*/
    var BgMaterial = new THREE.MeshLambertMaterial({map: GetTexture('../jpg/tk.jpg',1,1)});// 设置背景平面的颜色、透明度、贴图等
    var BgGeometry = new THREE.PlaneGeometry(450,320,1,1);// 设置背景平面宽高，宽330、高220
    // BgMaterial.side=THREE.DoubleSide;//使平面的反面也可以显示，这里看不到反面所以不需要
    var Bg = new THREE.Mesh(BgGeometry, BgMaterial);    // 创建平面
    Bg.receiveShadow = true; //平面接收投影
    Bg.rotation.x = -0.5*Math.PI;    // 绕x轴旋转90度
    Bg.position.set(0,0,0);    // 平面坐标位置
    scene.add(Bg); 

    createPlane();
}



var step=0,fpsnum=0;
var enemyPlane0=null,enemyPlane1=null,enemyPlane2=null,enemyPlane3=null,enemyPlane4=null,enemyPlane5=null;
var p0=null,p1=null,p2=null,p3=null,p4=null,p5=null;
/* 组件动画 */
function action() {
    blade.rotation.x=step;//飞机螺旋桨的旋转

    checkBullet(p0);
    checkBullet(p1);
    checkBullet(p2);
    checkBullet(p3);
    checkBullet(p4);
    checkBullet(p5);

    if(fpsnum==25)
        p0=new createBullet();
    else if(fpsnum==50)
        p1=new createBullet();
    else if(fpsnum==75)
        p2=new createBullet();
    else if(fpsnum==100)
        p3=new createBullet();
    else if(fpsnum==125)
        p4=new createBullet();
    else if(fpsnum==150)
        p5=new createBullet();
    else if(fpsnum>=151){
        fpsnum=0;
        }
    
    fpsnum++;
    step+=planeSpeed/5;
    }

/* 数据更新 */
function update() {
    action();
}

/* 窗口变动触发 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/* 主函数-初始化 */
function init() {
    initScene();
    initCamera();
    initRender();
    initLight();
    initContent();
    

    window.addEventListener('resize',onWindowResize,false)//添加全局监听器：尺寸改变
}
init(); //初始化
animate();

/* 循环渲染 */
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    update();
    
}


/*键盘监听事件*/
$(document).keydown(function(event){
    if(event.which==37&&planeX>-containerX){
        planeX-=planeSpeed;
        airPlane.mesh.position.set(planeX,30,planeY);
        
    }
    if(event.which==39&&planeX<containerX){
        planeX+=planeSpeed;
        airPlane.mesh.position.set(planeX,30,planeY);
        
    }
    if(event.which==38&&planeY>-containerY){
        planeY-=planeSpeed;
        airPlane.mesh.position.set(planeX,30,planeY); 
    }
    if(event.which==40&&planeY<containerY){
        planeY+=planeSpeed;
        airPlane.mesh.position.set(planeX,30,planeY);
    }
});


export { //很关键
    renderer
   };