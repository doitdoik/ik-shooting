// 캔버스
let canvas;
let ctx;

// canvas = document.createElement("canvas");
canvas = document.getElementById("main_canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 800;
// document.body.appendChild(canvas);

let backgroundImg, spaceshipImg, bulletImg, enemyImg, gameOverImg;
let gameOver = false;
let score = 0;

// 시작 위치
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;

// 키보드 입력
let inputKeys = {};

function setupKeyboard(){
    document.addEventListener("keydown", (event)=>{
        inputKeys[event.keyCode] = true;
    });
    
    document.addEventListener("keyup", (event)=>{
        delete inputKeys[event.keyCode];

        if(event.keyCode == 32){
            createBullet();
        }
    });
}

// 총알
function createBullet(){
    let b = new callBullet();
    b.init();
}

let bulletList = [];

function callBullet(){
    this.x = 0;
    this.y = 0;

    this.init = ()=>{
        this.x = spaceshipX+20;
        this.y = spaceshipY;
        this.status = true;

        bulletList.push(this);
    }

    this.update = ()=>{
        this.y -= 7;
    }

    this.checkHit = ()=>{
        for(let i=0; i<enemyList.length; i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x-10 && this.x <= enemyList[i].x+40){
                score++;
                this.status = false;
                enemyList.splice(i, 1)
            }
        }
    }
}

// 적 비행기
let enemyList = [];

function callEnemy(){
    this.x = 0;
    this.y = 0;
    this.init = ()=>{
        this.y = 0;
        this.x = Math.floor(Math.random()*(canvas.width-64));

        enemyList.push(this);
    }

    this.update = ()=>{
        this.y += 2;
        
        if(this.y >= canvas.height - 64){
            gameOver = true;
        }
    }
}

function createEnemy(){
    const interval = setInterval(()=>{
        let e = new callEnemy();
        e.init();
    }, 1000)
}

// 위치 업데이트
function update(){
    // 우측
    if( 39 in inputKeys){
        spaceshipX += 4;
    }
    // 좌측
    if( 37 in inputKeys){
        spaceshipX -= 4;
    }
    // 이동범위
    if(spaceshipX <= 0){
        spaceshipX = 0;
    }
    if(spaceshipX >= canvas.width-64){
        spaceshipX = canvas.width-64;
    }
    // 총알 위치
    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].status){
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }
    // 적군 위치
    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    }
}

// 이미지 관련
function loadImage(){
    backgroundImg = new Image();
    backgroundImg.src = "img/space_bg.jpg";

    spaceshipImg = new Image();
    spaceshipImg.src = "img/spaceship.png";

    bulletImg = new Image();
    bulletImg.src = "img/bullet.png";

    enemyImg = new Image();
    enemyImg.src = "img/enemy.png";

    gameOverImg = new Image();
    gameOverImg.src = "img/gameover.png";
   
}

function renderImage(){
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImg, spaceshipX, spaceshipY);
    ctx.fillText(`Score:${score}`, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial"

    for(let i=0; i<bulletList.length; i++){
        if(bulletList[i].status){
            ctx.drawImage(bulletImg, bulletList[i].x, bulletList[i].y);
        }
    }

    for(let i=0; i<enemyList.length; i++){
        ctx.drawImage(enemyImg, enemyList[i].x, enemyList[i].y);
    }
}

// 캔버스를 계속 호출
function main(){
    if(!gameOver){
        update();
        renderImage();
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameOverImg, 5, 200, 390, 300);
    }

}

loadImage();
setupKeyboard();
createEnemy();
main();
