document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll(".nav-btn");

    navButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const targetUrl = button.getAttribute("href");

            // 如果 href 不是 "#" 且不是目前的頁面
            if (targetUrl && targetUrl !== "#" && !button.classList.contains("active-tab")) {
                e.preventDefault(); // 暫時攔截跳轉

                // 觸發離開動畫
                document.body.classList.add("fade-out");

                // 等待動畫結束後 (0.4s) 再跳轉
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            }
        });
    });
});
// --- 1. 半圓儀錶板核心邏輯 ---

/** 取得 SVG 路徑總長度並初始化設定 */
function setupGauge(id) {
    const ring = document.getElementById(id);
    if (!ring) return null;

    const length = ring.getTotalLength();
    ring.style.strokeDasharray = length;
    ring.style.strokeDashoffset = length; 
    ring.style.transition = "stroke-dashoffset 1s ease";
    return length;
}

/** 依照數值百分比更新填充長度 */
function updateGauge(id, value, max, length) {
    const ring = document.getElementById(id);
    if (!ring || !length) return;

    const ratio = Math.max(0, Math.min(value / max, 1));
    const offset = length * (1 - ratio);
    ring.style.strokeDashoffset = offset;
}

// --- 2. 初始化與數據更新 ---

function initUI() {
    const tempLen = setupGauge("temp-fill");
    const humiLen = setupGauge("humi-fill");
    const co2Len  = setupGauge("co2-fill");
    const pmLen   = setupGauge("pm-fill");

    let temp = 23.8;
    let humi = 46.9;
    let co2  = 530;
    let pm   = 0;

    const refreshData = () => {
        // 更新文字
        document.getElementById("temp-display").innerText = temp.toFixed(1) + "°C";
        document.getElementById("humi-display").innerText = humi.toFixed(1) + "%";
        document.getElementById("co2-display").innerText  = co2.toFixed(1) + " ppm";
        document.getElementById("pm-display").innerText   = pm.toFixed(1) + " μg/m³";

        // 更新圓環動畫
        updateGauge("temp-fill", temp, 50, tempLen);
        updateGauge("humi-fill", humi, 100, humiLen);
        updateGauge("co2-fill",  co2, 1000, co2Len);
        updateGauge("pm-fill",   pm, 100, pmLen);

        // 儲存數據到 localStorage
        const now = new Date();
        const timeLabel = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        let historyData = JSON.parse(localStorage.getItem('sensorHistory')) || [];
        historyData.push({
            time: timeLabel,
            temp: temp.toFixed(1),
            humi: humi.toFixed(1),
            co2: co2.toFixed(1),
            pm: pm.toFixed(1)
        });

        if (historyData.length > 20) historyData.shift();
        localStorage.setItem('sensorHistory', JSON.stringify(historyData));
    };

    refreshData();

    setInterval(() => {
        temp = 22 + Math.random() * 4;
        humi = 40 + Math.random() * 20;
        co2  = 450 + Math.random() * 300;
        pm   = Math.random() * 15;
        refreshData();
    }, 5000);
}

// --- 3. 設備燈號邏輯 ---

/** 設備狀態燈更新 */
function updateActiveDevice(activeIndex) {
    const totalDevices = 5; 
    let anyRunning = false; // 👈 是否有任一台在跑

    for (let i = 0; i < totalDevices; i++) {
        const lamp = document.getElementById(`lamp-${i}`);
        if (!lamp) continue;
        
        if (i === activeIndex) {
            lamp.innerText = "○";
            lamp.className = "status-lamp lamp-ok";
            anyRunning = true; // 👈 有一台在跑
        } else {
            lamp.innerText = "×";
            lamp.className = "status-lamp lamp-fail";
        }
    }

    // 👇 同步更新「運轉狀態」
    updateRunStatus(anyRunning);
}



function updateRunStatus(isRunning) {
    const statusEl = document.getElementById("run-status");
    if (!statusEl) return;

    if (isRunning) {
        statusEl.innerText = "yes";
        statusEl.className = "v-green";
    } else {
        statusEl.innerText = "no";
        statusEl.className = "v-red";
    }
}

// 模擬生產線運轉計時器（僅保留一個）
let currentStep = 0;
setInterval(() => {
    updateActiveDevice(currentStep);
    currentStep = (currentStep + 1) % 5;
}, 2000);

// --- 4. 監聽載入 ---
window.addEventListener("load", initUI);