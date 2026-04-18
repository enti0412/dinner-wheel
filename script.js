const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const resultDiv = document.getElementById('result');
const foodInput = document.getElementById('foodInput');
const addBtn = document.getElementById('addBtn');
const spinBtn = document.getElementById('spinBtn');

let foods = ["米饭", "面条", "火锅", "汉堡", "寿司", "猪脚饭"];
let rotation = 0;
let isSpinning = false;

function draw() {
    const n = foods.length;
    const arc = (Math.PI * 2) / n;
    const cx = 200, cy = 200, r = 180;

    ctx.clearRect(0, 0, 400, 400);

    foods.forEach((food, i) => {
        const startAngle = rotation + i * arc;
        const endAngle = rotation + (i + 1) * arc;

        // 1. 绘制扇区
        ctx.fillStyle = i % 2 === 0 ? '#60a5fa' : '#93c5fd';
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, endAngle);
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 2. 绘制文字（修正：不再跟随扇区歪斜）
        ctx.save();
        // 计算扇区中心线的角度
        const textAngle = startAngle + arc / 2;
        // 计算文字应该放置的坐标位置（放在半径的 2/3 处比较美观）
        const textX = cx + Math.cos(textAngle) * (r * 0.65);
        const textY = cy + Math.sin(textAngle) * (r * 0.65);
        
        ctx.translate(textX, textY);
        // 这里不需要 rotate 了，或者只根据视觉微调
        ctx.fillStyle = "white";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(food, 0, 0); 
        ctx.restore();
    });

    // 3. 绘制中心点
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();

    // 4. 指针校准：尖端朝下
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(cx - 15, 0); // 左上角
    ctx.lineTo(cx + 15, 0); // 右上角
    ctx.lineTo(cx, 30);     // 尖端指向下方（30像素位置）
    ctx.closePath();
    ctx.fill();
}

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;

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

function calculateResult() {
    const n = foods.length;
    const arc = (Math.PI * 2) / n;
    let normalized = rotation % (Math.PI * 2);
    // 依然是计算 12 点方向（1.5 * PI）
    let index = Math.floor((1.5 * Math.PI - normalized) / arc) % n;
    if (index < 0) index += n;
    
    resultDiv.textContent = `今晚吃：${foods[index]}`;
}

addBtn.onclick = () => {
    const val = foodInput.value.trim();
    if (val && !foods.includes(val)) {
        foods.push(val);
        foodInput.value = "";
        draw();
    }
};

spinBtn.onclick = spin;
draw();
