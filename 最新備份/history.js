let mainChart = null;
let currentMode = 'temp'; // 預設顯示溫度

const configs = {
    temp: { label: 'temperature', color: '#b24b4b', key: 'temp', min: 0, max: 50, unit: '溫度 (°C)' },
    humi: { label: 'humidity', color: '#e08e45', key: 'humi', min: 0, max: 100, unit: '濕度 (%)' },
    co2: { label: 'CO2', color: '#d4af37', key: 'co2', min: 400, max: 1000, unit: 'CO2 (ppm)' },
    pm: { label: 'PM2.5', color: '#b099d1', key: 'pm', min: 0, max: 30, unit: '污染 (μg/m³)' }
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
            // ✨ 新增座標軸設定
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '時間', // 橫軸固定為時間
                        color: '#444',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '數值', // 預設文字，稍後動態更新
                        color: '#444',
                        font: { size: 14, weight: 'bold' }
                    },
                    // 如果你希望設定固定的上下限，可以取消下面註解
                    // min: 0,
                    // max: 100 
                }
            }
        }
    });
    updateChartDisplay(); 
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
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // 切換按鈕 Active 狀態
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // 切換模式並重繪
        currentMode = e.target.getAttribute('data-target');
        updateChartDisplay();
    });
});

// 每 10 秒自動同步一次 localStorage
setInterval(updateChartDisplay, 10000);

window.addEventListener('load', initChart);