document.addEventListener('DOMContentLoaded', () => {
    //模擬數據源
    const mockData = {
        temperature: [23.1, 23.5, 24.2, 23.8, 23.6, 24.5, 25.1, 24.8, 23.9, 23.6],
        humidity: [42.1, 43.2, 44.0, 43.5, 43.2, 42.8, 43.1, 43.5, 43.2, 43.0],
        pollution: [5.2, 5.4, 6.1, 5.8, 5.4, 5.2, 5.9, 6.5, 5.4, 5.3],
        labels: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30']
    };

    //初始化
    const ctx = document.getElementById('historyChart').getContext('2d');
    let historyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.labels,
            datasets: [{
                label: '溫度歷史紀錄',
                data: mockData.temperature,
                borderColor: '#d9534f',
                backgroundColor: 'rgba(217, 83, 79, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#d9534f'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: { 
                    beginAtZero: false,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: { grid: { display: false } }
            }
        }
    });

    //切換數據按鈕邏輯
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.getAttribute('data-type');
            
            // 切換按鈕的 Active 樣式
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // 根據類型定義顏色與標籤
            const configs = {
                temperature: { label: '溫度 (°C)', color: '#d9534f' },
                humidity: { label: '濕度 (%)', color: '#f0ad4e' },
                pollution: { label: '污染 (µg/m³)', color: '#9b59b6' }
            };

            const selected = configs[type];

            // 更新圖表
            historyChart.data.datasets[0].label = selected.label;
            historyChart.data.datasets[0].data = mockData[type];
            historyChart.data.datasets[0].borderColor = selected.color;
            historyChart.data.datasets[0].pointBackgroundColor = selected.color;
            historyChart.data.datasets[0].backgroundColor = selected.color + '1A'; // 透明度 10%
            historyChart.update();
        });
    });

    //異常紀錄器
    function generateLogs() {
        const tbody = document.getElementById('logTableBody');
        const items = ['溫度', '濕度', '污染'];
        const now = new Date();
        
        tbody.innerHTML = ""; //清空表格

        for(let i = 0; i < 10; i++) {
            // 決定狀態：80% 正常, 20% 異常
            const isError = Math.random() > 0.8;
            
            // 根據狀態設定文字與顏色
            const statusText = isError ? '● 異常' : '● 正常';
            const statusColor = isError ? '#d9534f' : '#28a745'; // 紅色 vs 綠色

            // 隨機數值 (模擬)
            const randomVal = (Math.random() * 25 + 5).toFixed(1);
            
            // 時間格式化 (模擬過去的時間)
            const timeStr = `2024-05-22 14:${10 + i}:25`;

            const row = `
                <tr>
                    <td>${timeStr}</td>
                    <td>${items[Math.floor(Math.random() * items.length)]}</td>
                    <td>${randomVal}</td>
                    <td style="color: ${statusColor}; font-weight: bold;">${statusText}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        }
    }

    //生成表格
    generateLogs();
});