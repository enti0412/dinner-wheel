const defaultFoods = [
  "火锅",
  "麻辣烫",
  "兰州拉面",
  "黄焖鸡",
  "寿司",
  "披萨",
  "沙县小吃",
  "煲仔饭",
  "牛肉面",
  "炒饭"
];

let allFoods = [...new Set(defaultFoods)];
let remainingFoods = [...allFoods];
let pickedFoods = [];
let spinning = false;

const wheelDisplay = document.getElementById("wheelDisplay");
const resultText = document.getElementById("resultText");
const startBtn = document.getElementById("startBtn");
const foodInput = document.getElementById("foodInput");
const addBtn = document.getElementById("addBtn");
const remainingList = document.getElementById("remainingList");
const pickedList = document.getElementById("pickedList");

function renderTags(container, list, emptyMessage) {
  container.innerHTML = "";
  if (list.length === 0) {
    const tip = document.createElement("span");
    tip.className = "empty-tip";
    tip.textContent = emptyMessage;
    container.appendChild(tip);
    return;
  }

  list.forEach((item) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item;
    container.appendChild(tag);
  });
}

function renderAll() {
  renderTags(remainingList, remainingFoods, "已经没有可选项了");
  renderTags(pickedList, pickedFoods, "暂时还没有记录");
}

function setControlsDisabled(disabled) {
  startBtn.disabled = disabled;
  addBtn.disabled = disabled;
  foodInput.disabled = disabled;
}

function addFood() {
  const value = foodInput.value.trim();
  if (!value) {
    resultText.textContent = "请输入食物名称再添加";
    return;
  }

  if (allFoods.includes(value)) {
    resultText.textContent = `“${value}”已经在列表中了`;
    foodInput.value = "";
    return;
  }

  allFoods.push(value);
  remainingFoods.push(value);
  foodInput.value = "";
  resultText.textContent = `已添加：${value}`;
  renderAll();
}

function spinPick() {
  if (spinning) return;

  if (remainingFoods.length === 0) {
    wheelDisplay.textContent = "已全部选完";
    resultText.textContent = "没有可选食物了，可先添加新食物";
    return;
  }

  spinning = true;
  setControlsDisabled(true);
  resultText.textContent = "转盘启动中...";

  const target = remainingFoods[Math.floor(Math.random() * remainingFoods.length)];
  const totalDuration = 2800 + Math.random() * 1600;
  const startTime = performance.now();

  function tick() {
    const now = performance.now();
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / totalDuration, 1);

    const tempFood = remainingFoods[Math.floor(Math.random() * remainingFoods.length)];
    wheelDisplay.textContent = tempFood;

    if (progress < 1) {
      // 前快后慢：延时从约40ms逐渐增长到300ms
      const delay = 40 + Math.pow(progress, 2) * 260;
      setTimeout(tick, delay);
    } else {
      wheelDisplay.textContent = target;
      resultText.textContent = `今晚就吃：${target}`;

      pickedFoods.push(target);
      remainingFoods = remainingFoods.filter((item) => item !== target);

      renderAll();
      spinning = false;
      setControlsDisabled(false);
    }
  }

  tick();
}

startBtn.addEventListener("click", spinPick);
addBtn.addEventListener("click", addFood);
foodInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addFood();
});

renderAll();
