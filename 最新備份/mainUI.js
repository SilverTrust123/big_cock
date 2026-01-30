//半圓儀錶板
/**
 * 初始化單一儀表（計算路徑長度）
 */
function setupGauge(id) {
    const ring = document.getElementById(id);
    if (!ring) return null;

    const length = ring.getTotalLength();

    ring.style.strokeDasharray = length;
    ring.style.strokeDashoffset = length;
    ring.style.transition = "stroke-dashoffset 1s ease";

    return length;
}

/**
 * 更新半圓儀表進度
 * @param {string} id - SVG Path ID
 * @param {number} value - 當前數值
 * @param {number} max - 最大值
 * @param {number} length - path 總長度
 */
function updateGauge(id, value, max, length) {
    const ring = document.getElementById(id);
    if (!ring) return;

    const ratio = Math.max(0, Math.min(value / max, 1));
    const offset = length * (1 - ratio);

    ring.style.strokeDashoffset = offset;
}

/**
 * 初始化整個儀表板
 */
function initUI() {
    // 初始化所有 gauge（取得各自 path 長度）
    const tempLen = setupGauge("temp-fill");
    const humiLen = setupGauge("humi-fill");
    const co2Len  = setupGauge("co2-fill");
    const pmLen   = setupGauge("pm-fill");

    // 初始數值
    let temp = 23.8;
    let humi = 46.9;
    let co2  = 530;
    let pm   = 0;

    // 初始顯示
    document.getElementById("temp-display").innerText = temp.toFixed(1) + "°C";
    document.getElementById("humi-display").innerText = humi.toFixed(1) + "%";
    document.getElementById("co2-display").innerText  = co2.toFixed(1) + " ppm";
    document.getElementById("pm-display").innerText   = pm.toFixed(1) + " μg/m³";

    updateGauge("temp-fill", temp, 50, tempLen);
    updateGauge("humi-fill", humi, 100, humiLen);
    updateGauge("co2-fill",  co2, 1000, co2Len);
    updateGauge("pm-fill",   pm, 100, pmLen);

    // 模擬資料更新（每 5 秒）
    setInterval(() => {
        temp = 22 + Math.random() * 4;
        humi = 40 + Math.random() * 20;
        co2  = 450 + Math.random() * 300;
        pm   = Math.random() * 15;

        document.getElementById("temp-display").innerText = temp.toFixed(1) + "°C";
        document.getElementById("humi-display").innerText = humi.toFixed(1) + "%";
        document.getElementById("co2-display").innerText  = co2.toFixed(1) + " ppm";
        document.getElementById("pm-display").innerText   = pm.toFixed(1) + " μg/m³";

        updateGauge("temp-fill", temp, 50, tempLen);
        updateGauge("humi-fill", humi, 100, humiLen);
        updateGauge("co2-fill",  co2, 1000, co2Len);
        updateGauge("pm-fill",   pm, 100, pmLen);
    }, 5000);
}

window.addEventListener("load", initUI);


//機械亮燈圈圈叉叉
/**
 * 更新設備狀態燈
 * @param {number} activeIndex - 目前正在運作的設備索引 (0-4)
 */
function updateActiveDevice(activeIndex) {
    const totalDevices = 5; // 總共有 5 個設備

    for (let i = 0; i < totalDevices; i++) {
        const lamp = document.getElementById(`lamp-${i}`);
        
        if (i === activeIndex) {
            // 設定為運作中狀態 (綠色 圈)
            lamp.innerText = "○";
            lamp.classList.remove("lamp-fail");
            lamp.classList.add("lamp-ok");
        } else {
            // 設定為停止狀態 (紅色 叉)
            lamp.innerText = "×";
            lamp.classList.remove("lamp-ok");
            lamp.classList.add("lamp-fail");
        }
    }
}

// --- 測試用：模擬生產線運轉 (實際串接時請刪除下方程式碼) ---
let currentStep = 0;
setInterval(() => {
    console.log(`目前運作設備：${currentStep}`);
    updateActiveDevice(currentStep);
    
    currentStep = (currentStep + 1) % 5; // 循環 0 -> 1 -> 2 -> 3 -> 4 -> 0
}, 2000); // 每 2 秒切換下一個設備