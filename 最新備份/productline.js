// 抓取所有燈號
const lights = document.querySelectorAll('.indicator-light');
let currentIndex = 0;

function rotateLights() {
    // 1. 先移除所有燈號的 active 狀態
    lights.forEach(light => light.classList.remove('active'));

    // 2. 點亮目前的燈號
    lights[currentIndex].classList.add('active');

    // 3. 計算下一個燈號的索引 (跑完最後一個會回到 0)
    currentIndex = (currentIndex + 1) % lights.length;
}


// 設定循環時間 (1000 毫秒 = 1 秒)
setInterval(rotateLights, 1000);

// 網頁載入後先執行一次，避免第一秒沒反應
rotateLights();