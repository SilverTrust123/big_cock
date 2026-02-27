let mainChart = null;
let currentMode = 'temp'; // 預設顯示溫度

const configs = {
    temp: { label: 'temperature', color: '#b24b4b', key: 'temp', min: 0, max: 50, unit: '溫度 (°C)' },
    humi: { label: 'humidity', color: '#e08e45', key: 'humi', min: 0, max: 100, unit: '濕度 (%)' },
    co2: { label: 'CO2', color: '#d4af37', key: 'co2', min: 400, max: 1000, unit: 'CO2 (ppm)' },
    pm: { label: 'PM2.5', color: '#763dc6', key: 'pm', min: 0, max: 30, unit: '污染 (μg/m³)' }
};

function initChart() {
    const ctx = document.getElementById('historyChart').getContext('2d');
    mainChart = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{ data: [], borderWidth: 3, tension: 0.3 }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '時間',
                        color: '#444',
                        // ✨ 放大橫軸標題文字
                        font: { size: 15, weight: 'bold' } 
                    },
                    ticks: {
                        // ✨ 放大橫軸時間刻度文字
                        font: { size: 14 } 
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '數值',
                        color: '#444',
                        // ✨ 放大縱軸單位文字
                        font: { size: 15, weight: 'bold' } 
                    },
                    ticks: {
                        // ✨ 放大縱軸數據刻度文字
                        font: { size: 14 } 
                    }
                }
            }
        }
    });
    updateChartDisplay(); 
    // 在 initChart() 的最後面加入，確保初始化時按鈕就有顏色
document.querySelector('[data-target="temp"]').classList.add('active-temp');
}

/** 更新圖表內容、顏色與外框 */
// ... (維持上次提供的 configs 與 mainChart 初始化邏輯) ...

// 確保 updateChartDisplay 會根據目前寬高重新計算圖表大小
function updateChartDisplay() {
    const rawData = localStorage.getItem('sensorHistory');
    if (!rawData || !mainChart) return;

    const history = JSON.parse(rawData);
    const config = configs[currentMode];

    mainChart.data.labels = history.map(d => d.time);
    mainChart.data.datasets[0].data = history.map(d => d[config.key]);
    mainChart.data.datasets[0].borderColor = config.color;
    
    // ✨ 動態更新 y 軸標題
    mainChart.options.scales.y.title.text = config.unit;

    // UI 配色連動
    document.getElementById('current-chart-label').innerText = config.label;
    document.getElementById('current-chart-label').style.color = config.color;
    document.getElementById('main-card').style.borderColor = config.color;

    mainChart.update();
}

// 綁定按鈕點擊事件
// 綁定按鈕點擊事件
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = e.target.getAttribute('data-target');

        // 1. 移除所有按鈕的 active 相關 class
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active', 'active-temp', 'active-humi', 'active-co2', 'active-pm');
        });

        // 2. 根據當前 target 加入對應的顏色 class
        e.target.classList.add(`active-${target}`);
        
        // 為了相容性，也可以保留基本的 active class
        e.target.classList.add('active');

        // 3. 切換模式並重繪圖表
        currentMode = target;
        updateChartDisplay();
    });
});

// 每 10 秒自動同步一次 localStorage
setInterval(updateChartDisplay, 10000);

window.addEventListener('load', initChart);