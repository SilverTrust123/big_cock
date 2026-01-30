document.addEventListener('DOMContentLoaded', () => {
    // 1. 模擬數據
    const mockData = {
        temperature: [23.1, 23.5, 24.2, 23.8, 23.6, 24.5, 25.1, 24.8, 23.9, 23.6],
        humidity: [42.1, 43.2, 44.0, 43.5, 43.2, 42.8, 43.1, 43.5, 43.2, 43.0],
        pollution: [5.2, 5.4, 6.1, 5.8, 5.4, 5.2, 5.9, 6.5, 5.4, 5.3],
        labels: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30']
    };

    const ctx = document.getElementById('historyChart').getContext('2d');
    
    // 2. 初始化 Chart.js 實例
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
                fill: true
            }]
        }
    });

    // 3. 切換數據邏輯
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.getAttribute('data-type');
            
            // 切換 Active 樣式
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // 更新數據與配色
            const configs = {
                temperature: { label: '溫度 (°C)', color: '#d9534f' },
                humidity: { label: '濕度 (%)', color: '#f0ad4e' },
                pollution: { label: '污染 (µg/m³)', color: '#9b59b6' }
            };

            historyChart.data.datasets[0].label = configs[type].label;
            historyChart.data.datasets[0].data = mockData[type];
            historyChart.data.datasets[0].borderColor = configs[type].color;
            historyChart.data.datasets[0].backgroundColor = configs[type].color + '1A';
            historyChart.update();
        });
    });

    // 4. 生成模擬表格
    const tbody = document.getElementById('logTableBody');
    const items = ['溫度', '濕度', '污染'];
    for(let i=0; i<8; i++) {
        const row = `<tr>
            <td>2024-05-22 14:${10 + i}:25</td>
            <td>${items[Math.floor(Math.random()*3)]}</td>
            <td>${(Math.random()*30).toFixed(1)}</td>
            <td style="color: ${Math.random() > 0.8 ? 'red' : 'green'}">
                ${Math.random() > 0.8 ? '● 異常' : '● 正常'}
            </td>
        </tr>`;
        tbody.innerHTML += row;
    }
});