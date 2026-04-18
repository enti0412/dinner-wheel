const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

// 初始食物列表
let foods = ["米饭", "面条", "火锅", "汉堡", "寿司", "猪脚饭"];
let numSegments = foods.length; // 转盘的扇区数
const anglePerSegment = 2 * Math.PI / numSegments; // 每个扇区的角度

// 绘制转盘
function drawWheel(rotation = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空画布

    const radius = canvas.width / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 绘制转盘的扇区
    for (let i = 0; i < numSegments; i++) {
        const angleStart = rotation + i * anglePerSegment;
        const angleEnd = rotation + (i + 1) * anglePerSegment;

        ctx.fillStyle = i % 2 === 0 ? '#f5a623' : '#f6c8a6'; // 设置扇区颜色
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, angleStart, angleEnd);
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // 绘制食物名称
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const midAngle = (angleStart + angleEnd) / 2;
        const x = centerX + Math.cos(midAngle) * (radius - 50); // 调整文本位置
        const y = centerY + Math.sin(midAngle) * (radius - 50);
        ctx.fillText(foods[i], x, y);
    }

    // 绘制固定的指针
    drawPointer(centerX, centerY);
}

// 绘制指针（固定不动）
function drawPointer(centerX, centerY) {
    const pointerLength = 20;
    const pointerX = centerX;
    const pointerY = centerY - canvas.width / 2 - pointerLength; // 指针指向顶部

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY); // 指针起点
    ctx.lineTo(pointerX, pointerY); // 指针终点
    ctx.stroke();
}

// 动画：转盘旋转
let spinning = false;
let rotation = 0;
let spinSpeed = 0;
const maxSpeed = 0.1; // 最大旋转速度
const deceleration = 0.0005; // 减速速度

function spinWheel() {
    if (spinning) return; // 防止按钮重复点击

    spinning = true;
    spinSpeed = 0.1; // 初始化旋转速度

    // 动画循环：每帧更新旋转角度
    function animate() {
        if (spinSpeed > 0) {
            rotation += spinSpeed; // 增加旋转角度
            spinSpeed -= deceleration; // 逐渐减速
            drawWheel(rotation); // 绘制新的转盘状态
            requestAnimationFrame(animate); // 继续下一个动画帧
        } else {
            spinning = false;
            showResult(rotation); // 显示结果
        }
    }

    animate(); // 启动动画
}

// 显示结果：计算最终结果并显示
function showResult(rotation) {
    const finalAngle = rotation % (2 * Math.PI); // 确保角度在 0 到 2π 之间
    const index = Math.floor((finalAngle / anglePerSegment) + numSegments / 2) % numSegments; // 计算最终选中的食物索引
    document.getElementById('result').textContent = `今晚吃：${foods[index]}`;
}

// 动态添加食物到列表
document.getElementById('addFoodButton').addEventListener('click', function() {
    const newFood = document.getElementById('foodInput').value.trim();  // 获取输入的食物
    if (newFood && !foods.includes(newFood)) {
        foods.push(newFood);  // 添加新的食物到列表
        numSegments = foods.length;  // 更新食物数量
        drawWheel(rotation);  // 重新绘制转盘
        document.getElementById('foodInput').value = '';  // 清空输入框
    }
});

// 绑定点击事件
document.getElementById('spinButton').addEventListener('click', spinWheel);

// 初始化绘制转盘
drawWheel();
