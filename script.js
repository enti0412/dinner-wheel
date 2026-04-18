const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const resultDiv = document.getElementById('result');
const foodInput = document.getElementById('foodInput');
const addBtn = document.getElementById('addBtn');
const spinBtn = document.getElementById('spinBtn');

let foods = ["米饭", "面条", "火锅", "汉堡", "寿司", "猪脚饭"];
let rotation = 0;
let isSpinning = false;

// 1. 绘制转盘
function draw() {
    const n = foods.length;
    const arc = (Math.PI * 2) / n;
    const cx = 200, cy = 200, r = 180;

    ctx.clearRect(0, 0, 400, 400);

    foods.forEach((food, i) => {
        const startAngle = rotation + i * arc;
        const endAngle = rotation + (i + 1) * arc;

        // 扇区颜色交替
        ctx.fillStyle = i % 2 === 0 ? '#60a5fa' : '#93c5fd';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 文字
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + arc / 2);
        ctx.fillStyle = "white";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(food, r - 20, 5);
        ctx.restore();
    });

    // 绘制中心点
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();

    // 2. 指针校准：绘制顶部的红色指针
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx - 15, 25);
    ctx.lineTo(cx + 15, 25);
    ctx.closePath();
    ctx.fill();
}

// 3. 旋转逻辑
function spin() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    resultDiv.textContent = "选餐中...";

    // 随机力度
    let velocity = 0.2 + Math.random() * 0.2;
    const friction = 0.985;

    function animate() {
        if (velocity > 0.002) {
            rotation += velocity;
            velocity *= friction;
            draw();
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            calculateResult();
        }
    }
    animate();
}

// 4. 结果判定（修复偏移问题）
function calculateResult() {
    const n = foods.length;
    const arc = (Math.PI * 2) / n;
    // 指针在 1.5 * PI (270度)
    let normalizedRotation = rotation % (Math.PI * 2);
    let index = Math.floor((1.5 * Math.PI - normalizedRotation) / arc) % n;
    if (index < 0) index += n;
    
    resultDiv.textContent = `今晚吃：${foods[index]}！`;
}

// 5. 事件绑定
addBtn.onclick = () => {
    const val = foodInput.value.trim();
    if (val && !foods.includes(val)) {
        foods.push(val); // 数组增加，不替换
        foodInput.value = "";
        draw(); // 立即重新分块绘制
    }
};

spinBtn.onclick = spin;

// 初始化渲染
draw();
