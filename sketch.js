var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score;
var gameOver, gameOverImg, restart, restartImg;
var checkpointSound, dieSound, jumpSound;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  checkpointSound = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
} 

function setup() {
  createCanvas(windowWidth, windowHeight);
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  //criar grupos de Obstaculos e Nuvens 
  //  grupoObstaculos = createGroup();
  //grupoNuvens = createGroup();

  console.log("Hello" + 5);
 
  score = 0;
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  trex.debug = false;
  trex.setCollider("rectangle", 0,0,40,40);
}

function draw() {
  background("white");
  //exibindo pontuação
  text("Pontuação: "+ score, 1100,50);
  
  
  
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    //mover o solo
    ground.velocityX = -(4+3*score/100);
    //pontuação
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if(score>0 && score%300 === 0){
    checkpointSound.play()
    }
    //pular quando tecla espaço for pressionada
    if(touches.length>0 || keyDown("space")&& trex.y >= 600) {
      jumpSound.play()
        trex.velocityY = -13;
        touches = []
    }
    
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no solo
    spawnObstacles();
    if(obstaclesGroup.isTouching(trex))
    { gameState = END;
    dieSound.play() } 
  }else if (gameState === END){
  gameOver.visible = true;
  restart.visible = true;
  trex.velocityY = 0;

  trex.changeAnimation("collided",trex_collided);
   ground.velocityX = 0; 
   obstaclesGroup.setVelocityXEach(0);
   cloudsGroup.setVelocityXEach(0);
   obstaclesGroup.setLifetimeEach(-1);
   cloudsGroup.setLifetimeEach(-1);
  //impede o trex de cair

  if(mousePressedOver(restart)){
    //console.log("Reiniciar o jogo");
    reset() 
  }}
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  gameOver.visible = false;
  restart.visible = false;
  score = 0;
}
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(windowWidth,windowHeight-20,10,40);
   obstacle.velocityX = -(6+score/100);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribua dimensão e tempo de vida aos obstáculos         
    obstacle.scale = 0.5;
    obstacle.lifetime = 210;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
   if (frameCount % 60 === 0) {
    cloud = createSprite(windowWidth,100,40,10);
    cloud.y = Math.round(random(100,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 450;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
    }
}