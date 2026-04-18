const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const resultDisplay = document.getElementById('result');
const foodInput = document.getElementById('foodInput');
const addBtn = document.getElementById('addFoodButton');
const spinBtn = document.getElementById('spinButton');

// 初始数据
let foods = ["米饭", "面条", "火锅", "汉堡", "寿司", "猪脚饭"];
let rotation = 0; // 当前旋转的总弧度
let isSpinning = false;

/**
 * 核心绘制函数
 */
function drawWheel() {
    const n = foods.length;
    const arc = (Math.PI * 2) / n; // 动态计算每个扇区的角度
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    foods.forEach((food, i) => {
        const startAngle = rotation + i * arc;
        const endAngle = rotation + (i + 1) * arc;

        // 1. 绘制扇区颜色
        ctx.fillStyle = i % 2 === 0 ? '#60a5fa' : '#93c5fd';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
        
        // 绘制描边
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 2. 绘制文字
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + arc / 2); // 旋转到扇区中间
        ctx.fillStyle = "white";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "right";
        ctx.fillText(food, radius - 20, 10);
        ctx.restore();
    });

    // 3. 绘制中心装饰圆
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();

    // 4. 绘制固定指针（始终在12点钟位置，不随转盘旋转）
    drawPointer(cx);
}

function drawPointer(cx) {
    ctx.fillStyle = "#ef4444"; // 红色指针
    ctx.beginPath();
    ctx.moveTo(cx, 0);          // 尖端指向最上方
    ctx.lineTo(cx - 15, 25);
    ctx.lineTo(cx + 15, 25);
    ctx.closePath();
    ctx.fill();
}

/**
 * 点击开始旋转
 */
function spin() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    resultDisplay.textContent = "正在选餐...";

    // 随机初始速度，消除“顺序规律”
    let velocity = 0.2 + Math.random() * 0.15; 
    const friction = 0.985; // 模拟摩擦力，让它自然停下

    function animate() {
        if (velocity > 0.002) {
            rotation += velocity;
            velocity *= friction; // 速度递减
            drawWheel();
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            determineResult();
        }
    }
    animate();
}

/**
 * 结果判定逻辑（核心修正点）
 */
function determineResult() {
    const n = foods.length;
    const arc = (Math.PI * 2) / n;
    
    /* 原理说明：
       Canvas默认0度在3点钟方向，我们的指针在12点钟方向（即 1.5 * PI 位置）。
       我们需要找出哪个扇区在旋转结束后覆盖了 1.5 * PI 这个点。
    */
    let normalizedRotation = rotation % (Math.PI * 2);
    let index = Math.floor((1.5 * Math.PI - normalizedRotation) / arc) % n;
    
    if (index < 0) index += n; // 处理负数索引

    resultDisplay.textContent = `今晚吃：${foods[index]}！`;
}

// 事件监听：添加食物
addBtn.addEventListener('click', () => {
    const newFood = foodInput.value.trim();
    if (newFood && !foods.includes(newFood)) {
        foods.push(newFood); // 将新食物推入数组
        foodInput.value = "";
        drawWheel(); // 重新绘制，此时扇区会自动变多
    }
});

spinBtn.addEventListener('click', spin);

// 页面加载后的第一次初始化
drawWheel();
