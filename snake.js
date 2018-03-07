var conent = document.getElementById('conent');
var start = document.getElementById('start');
var restart = document.getElementById('restart');
var timer;
var speed = 100;
var lock = true;
var lock1 = true;
init();
//初始化
function init() {
    //游戏区域
    this.mapW = parseInt(getComputedStyle(conent).width); //取到conent边界宽度的数值
    this.mapH = parseInt(getComputedStyle(conent).height); //getComputerStyle()只能获取dom元素的样式
    this.mapDiv = conent;
    //食物小苹果
    this.foodW = 20;
    this.foodH = 20;
    this.foodX = 0;
    this.foodY = 0;
    //蛇
    this.snakeW = 20;
    this.snakeH = 20;
    this.snakeBody = [
        [3, 1, 'head'],
        [2, 1, 'body'],
        [1, 1, 'body']
    ];
    //游戏玩法
    this.direct = 'right';
    this.right = false;
    this.left = false;
    this.up = true;
    this.down = true;
    this.score = 0;
    document.getElementById('score').innerHTML = this.score;
    speedChange();
    bindEvent();
}
//start开始点击事件
function bindEvent() {
    start.onclick = function() {
        lock1 = false; //点击选择完速度之后不可再次选择速度，所以将速度锁锁上
        start.style.display = 'none';
        food();
        snake();
        timer = setInterval(function() {
            move();
        }, speed)
        keyDown();
    }
}
//随机生成食物
function food() {
    var food = document.createElement('div');
    food.style.width = this.foodW + 'px';
    food.style.height = this.foodH + 'px';
    food.style.position = 'absolute';
    this.foodX = (Math.floor(Math.random() * (this.mapW / 20)));
    this.foodY = (Math.floor(Math.random() * (this.mapH / 20)));
    food.style.left = this.foodX * 20 + 'px';
    food.style.top = this.foodY * 20 + 'px';
    this.mapDiv.appendChild(food).setAttribute('class', 'food');
}
//生成初始位置的蛇
function snake() {
    // console.log(1);
    for (i = this.snakeBody.length - 1; i > -1; i--) { //也可以写成for(i = 0; i < this.snakeBody.length; i++)
        // console.log(i);
        // this.snake[i][0] = this.snake[i - 1][0];
        // this.snake[i][1] = this.snake[i - 1][1];
        var snake = document.createElement('div');
        snake.style.width = this.snakeW + 'px';
        snake.style.height = this.snakeH + 'px';
        snake.style.position = 'absolute';
        snake.style.left = this.snakeBody[i][0] * 20 + 'px';
        snake.style.top = this.snakeBody[i][1] * 20 + 'px';
        snake.classList.add(this.snakeBody[i][2]);
        this.mapDiv.appendChild(snake).classList.add('snake');
        //改变蛇头方向
        switch (this.direct) {
            case 'right':
                break;
            case 'left':
                snake.style.transform = 'rotate(180deg)';
                break;
            case 'up':
                snake.style.transform = 'rotate(270deg)';
                break;
            case 'down':
                snake.style.transform = 'rotate(90deg)';
                break;
        }
    }
}

function move() {
    sTop();
    if (lock) {
        // console.log(1);
        //蛇的移动通过数组里，后一位等于前一位
        for (i = this.snakeBody.length - 1; i > 0; i--) {
            this.snakeBody[i][0] = this.snakeBody[i - 1][0];
            this.snakeBody[i][1] = this.snakeBody[i - 1][1];
        }
        //判断键盘按下方向
        switch (this.direct) {
            //向右时数组第一位也就是蛇头的X坐标值+1，以此类推
            case 'right':
                this.snakeBody[0][0] += 1;
                break;
            case 'left':
                this.snakeBody[0][0] -= 1;
                break;
            case 'up':
                this.snakeBody[0][1] -= 1;
                break;
            case 'down':
                this.snakeBody[0][1] += 1;
                break;
            default:
                break;
        }
        //删除原来的蛇
        removeClass('snake');
        //渲染新的蛇
        snake();
        //当蛇头和食物的XY相等时
        while (this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY) {
            //取到最后一个蛇身
            var snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
            var snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
            //判断上下左右之后再加一个蛇身
            switch (this.direct) {
                //向右Y固定，X+1可参考101行，以此类推
                case 'right':
                    this.snakeBody.push([snakeEndX + 1, snakeEndY, 'body']);
                    break;
                case 'left':
                    this.snakeBody.push([snakeEndX - 1, snakeEndY, 'body']);
                    break;
                case 'up':
                    this.snakeBody.push([snakeEndX, snakeEndY - 1, 'body']);
                    break;
                case 'down':
                    this.snakeBody.push([snakeEndX, snakeEndY + 1, 'body']);
                    break;
                default:
                    break;
            }
            this.score += 1;
            document.getElementById('score').innerHTML = this.score;
            removeClass('food');
            food();
        }
        //当蛇头和左右边界相撞即X坐标值为0或边界宽度除以自身大小20px时结束游戏
        while (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW / 20) {
            // alert("得分：" + this.score);
            reGame();

        }
        //当蛇头和上下边界相撞时结束游戏
        while (this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH / 20) {
            // alert("得分：" + this.score);
            reGame();
        }
        //取到蛇头的X,Y坐标值
        var snakeHX = this.snakeBody[0][0];
        var snakeHY = this.snakeBody[0][1];
        for (var i = 1; i < this.snakeBody.length; i++) {
            //当蛇头和蛇身相撞即XY坐标值相同时结束游戏
            while (snakeHX == this.snakeBody[i][0] && snakeHY == this.snakeBody[i][1]) {
                // alert("得分：" + this.score);
                reGame();
            }
        }
    }
}
//重新开始游戏
function reGame() {
    removeClass('snake');
    removeClass('food');
    clearInterval(timer);
    document.getElementById('restart').style.display = 'block';
    document.getElementById('scores').innerHTML = this.score;
    //再次初始化
    this.snakeW = 20;
    this.snakeH = 20;
    this.snakeBody = [
        [3, 1, 'head'],
        [2, 1, 'body'],
        [1, 1, 'body']
    ];
    this.direct = 'right';
    this.right = false;
    this.left = false;
    this.up = true;
    this.down = true;
    this.score = 0;
    document.getElementById('score').innerHTML = this.score;
    lock1 = true; //重新开始可再次选择速度
    // speedChange();
    //点击再来一局事件，开始新的一局
    document.getElementById('btn').onclick = function() {
        lock1 = false; //点击开始后再次将速度选择锁锁上
        document.getElementById('restart').style.display = 'none';
        food();
        snake();
        timer = setInterval(function() {
            move();
        }, speed)
        keyDown();
    }
}
//移除类名
function removeClass(className) {
    var ele = document.getElementsByClassName(className);
    while (ele.length > 0) {
        ele[0].parentNode.removeChild(ele[0]);
    }
}
//这里为了reurn的this.direct时全局的，所以要单独写一个functionsetDerict，
//如果写在KeyDown里面的话，return的this.direct会在函数keyDown里，从而导致其他函数里
//无法调用找不到this.direct,从而使得按下键盘蛇的运动方向不变（编程时遇到的问题，自己觉得是这个原因,）
//作用域链的问题：当在本作用域中找不到相关的变量时会沿着上一级直至全局查找
function setDerict(code) {
    //又设置一个锁，从而使得可以通过按下空格来实现暂停开始的切换
    if (lock) {
        switch (code) {
            case 32:
                lock = false;
                document.getElementById('stop1').style.display = 'block';
                document.getElementById('stop').style.display = 'none';
                break; //这个break开始忘记加了，然后出现了一个bug就是暂停之后在按空格开始，当蛇上下暂停时蛇会自动向左转
            case 37:
                //设置锁，蛇在向右移动时只能向上下改变方向，以此类推
                // console.log(1);
                if (this.left) {
                    this.direct = 'left';
                    this.left = false;
                    this.right = false;
                    this.up = true;
                    this.down = true;
                }
                break;
            case 38:
                // console.log(2);
                if (this.up) {
                    this.direct = 'up';
                    this.up = false;
                    this.down = false;
                    this.left = true;
                    this.right = true;
                }
                break;
            case 39:
                // console.log(3);
                if (this.right) {
                    this.direct = 'right';
                    this.up = true;
                    this.down = true;
                    this.left = false;
                    this.right = false;
                }
                break;
            case 40:
                // console.log(4);
                if (this.down) {
                    this.direct = 'down';
                    this.up = false;
                    this.down = false;
                    this.left = true;
                    this.right = true;
                }
                break;
            default:
                break;
        }
    } else {
        switch (code) {
            case 32:
                lock = true;
                document.getElementById('stop1').style.display = 'none';
                document.getElementById('stop').style.display = 'block';
        }
    }
}
//键盘按下事件
function keyDown() {
    document.onkeydown = function(e) {
        var code = e.keyCode; //获取上下左右的ACSII码值
        setDerict(code);
    }
}
//暂停点击函数
function sTop() {
    document.getElementById('stop').onclick = function() {
        lock = false;
        document.getElementById('stop1').style.display = 'block';
        document.getElementById('stop').style.display = 'none';
    }
    document.getElementById('stop1').onclick = function() {
        lock = true;
        document.getElementById('stop1').style.display = 'none';
        document.getElementById('stop').style.display = 'block';
    }
}
//速度选择器
function speedChange() {
    document.getElementById('btn1').onclick = function() {
        if (lock1) {
            document.getElementById('btn1').style.opacity = '0.2';
            document.getElementById('btn2').style.opacity = '1';
            document.getElementById('btn3').style.opacity = '1';
            speed = 200;
        }
    }
    document.getElementById('btn2').onclick = function() {
        if (lock1) {
            document.getElementById('btn2').style.opacity = '0.2';
            document.getElementById('btn1').style.opacity = '1';
            document.getElementById('btn3').style.opacity = '1';
            speed = 100;
        }
    }
    document.getElementById('btn3').onclick = function() {
        if (lock1) {
            document.getElementById('btn3').style.opacity = '0.2';
            document.getElementById('btn1').style.opacity = '1';
            document.getElementById('btn2').style.opacity = '1';
            speed = 50;
        }
    }
}
//背景动画飘雪canvas
window.onload = function() {
    //canvas init
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");


    var W = window.innerWidth;
    var H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;


    var mp = 25;
    var particles = [];
    for (var i = 0; i < mp; i++) {
        particles.push({
            x: Math.random() * W, //x-
            y: Math.random() * H, //y-
            r: Math.random() * 4 + 1, //radius
            d: Math.random() * mp
        })
    }


    function draw() {
        ctx.clearRect(0, 0, W, H); //清除（x，y，宽，高）

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; //白色canvas
        ctx.beginPath(); //开始绘制
        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            ctx.moveTo(p.x, p.y); //路径目标位置x，y
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true); //画圆：(圆心x，圆心y，半径，起始角（弧度制），结束角，true：顺时针)
        }
        ctx.fill(); //填充canvas
        update();
    }


    var angle = 0;
    //运动函数
    function update() {
        angle += 0.01;
        for (var i = 0; i < mp; i++) {
            var p = particles[i];

            p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
            p.x += Math.sin(angle) * 2;


            if (p.x > W + 5 || p.x < -5 || p.y > H) {
                if (i % 3 > 0) {
                    particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d };
                } else {

                    if (Math.sin(angle) > 0) {

                        particles[i] = { x: -5, y: Math.random() * H, r: p.r, d: p.d };
                    } else {

                        particles[i] = { x: W + 5, y: Math.random() * H, r: p.r, d: p.d };
                    }
                }
            }
        }
    }


    setInterval(draw, 33);
}