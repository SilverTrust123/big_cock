let pollingTimer = null;
const BASE_URL = 'http://192.168.3.253:9090';

/**
 * 1. 控制指令發送
 */
async function sendTestSignal(isOn) {
    const API_URL = `${BASE_URL}/plc/writeMPoint`; 
    const payload = { device: "TEST", value: isOn };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const resultText = response.ok ? `✅ 指令 [${isOn ? 'ON' : 'OFF'}] 發送成功` : `❌ 伺服器報錯: ${response.status}`;
        document.getElementById('status').innerText = resultText;
    } catch (error) {
        document.getElementById('status').innerText = "🔴 無法連線至後端";
    }
}

/**
 * 2. 核心輪詢邏輯：接收並顯示所有資料型態
 */
async function fetchMachineState() {
    const STATE_URL = `${BASE_URL}/plc/state`;
    const dataDisplay = document.getElementById('machine-data');

    try {
        const response = await fetch(STATE_URL);
        const contentType = response.headers.get("content-type");
        
        let finalData;

        // 判斷回傳格式並解析
        if (contentType && contentType.includes("application/json")) {
            const jsonData = await response.json();
            finalData = JSON.stringify(jsonData, null, 2); // 漂亮的 JSON 格式
        } else {
            finalData = await response.text(); // 純文字、HTML 或數字
        }
        
        dataDisplay.innerText = finalData;
        console.log("[Polling Log]:", finalData);

    } catch (error) {
        dataDisplay.innerText = "⚠️ 讀取失敗，請確認後端狀態";
        console.error("輪詢請求失敗:", error);
    }
}

/**
 * 3. 輪詢開關控制
 */
function startPolling() {
    if (pollingTimer) return; 

    const dot = document.getElementById('dot');
    const msg = document.getElementById('poll-msg');

    if (dot) dot.classList.add('active'); // 確保元素存在才執行
    if (msg) msg.innerText = "輪詢狀態：運作中";

    fetchMachineState(); // 立即跑第一次
    pollingTimer = setInterval(fetchMachineState, 1000);
    console.log("輪詢已啟動");
}

function stopPolling() {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
        
        const dot = document.getElementById('dot');
        const msg = document.getElementById('poll-msg');

        if (dot) dot.classList.remove('active'); // 確保元素存在才執行
        if (msg) msg.innerText = "輪詢狀態：已停止";
        
        console.log("輪詢已停止");
    }
}