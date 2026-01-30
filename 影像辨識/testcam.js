const API_URL = 'http://192.168.3.253:9090/ComData';
const canvas = document.getElementById('visionCanvas');
const ctx = canvas.getContext('2d');

//原始解析度
const RAW_W = 1280;
const RAW_H = 720;

async function updateVision() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        //更新文字資訊
        document.getElementById('devId').innerText = data.deviceId;
        document.getElementById('pCount').innerText = data.personCount;
        const alarm = document.getElementById('alarmStatus');
        if (data.danger) {
            alarm.innerText = "偵測到入侵";
            alarm.className = "status-danger";
        } else {
            alarm.innerText = "安全範圍內";
            alarm.className = "status-safe";
        }

        // 調整 Canvas 繪圖解析度（保持 16:9）
        // 畫布內部的繪圖緩衝區大小
        canvas.width = RAW_W;
        canvas.height = RAW_H;

        // 開始繪製
        drawScene(data);

    } catch (err) {
        console.error("Fetch error:", err);
        document.getElementById('alarmStatus').innerText = "連線中斷";
    }
    
    // 循環執行
    requestAnimationFrame(() => {
        setTimeout(updateVision, 100); // 控製在約 10 FPS
    });
}

function drawScene(data) {
    ctx.clearRect(0, 0, RAW_W, RAW_H);

    // --- 繪製危險區域 (Danger Zone 多邊形) ---
    if (data.dangerZone && data.dangerZone.length > 0) {
        ctx.beginPath();
        ctx.moveTo(data.dangerZone[0][0], data.dangerZone[0][1]);
        data.dangerZone.forEach(pt => ctx.lineTo(pt[0], pt[1]));
        ctx.closePath();
        
        // 樣式：危險時變紅，安全時變黃
        ctx.strokeStyle = data.danger ? 'rgba(255, 0, 0, 1)' : 'rgba(255, 255, 0, 0.8)';
        ctx.fillStyle = data.danger ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 0, 0.1)';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.fill();
    }

    // --- 繪製物件 (Objects) ---
    data.objects.forEach(obj => {
        const rectW = obj.x2 - obj.x1;
        const rectH = obj.y2 - obj.y1;

        // 畫辨識框
        ctx.strokeStyle = "#00ff00";
        ctx.lineWidth = 3;
        ctx.strokeRect(obj.x1, obj.y1, rectW, rectH);

        // 畫腳部中心點 (footX, footY)
        ctx.fillStyle = "#ff00ff";
        ctx.beginPath();
        ctx.arc(obj.footX, obj.footY, 8, 0, Math.PI * 2);
        ctx.fill();

        // 寫標籤
        ctx.fillStyle = "#00ff00";
        ctx.font = "bold 24px Arial";
        ctx.fillText(obj.className.toUpperCase(), obj.x1, obj.y1 - 10);
    });
}

// 啟動
updateVision();