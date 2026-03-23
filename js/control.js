document.addEventListener('DOMContentLoaded', () => {
    // 選取所有的控制列 (每一列包含減號、數值、加號)
    const controlRows = document.querySelectorAll('.control-row');
    
    // 用來儲存每一列控制邏輯的陣列
    const rowControllers = [];

    controlRows.forEach((row) => {
        const minusBtn = row.querySelector('.control-adjust button:first-child');
        const plusBtn = row.querySelector('.control-adjust button:last-child');
        const timeDisplay = row.querySelector('.time-box');

        const defaultValue = parseFloat(timeDisplay.textContent);

        // 初始化當前數值
        let currentValue = defaultValue;

        // 更新顯示函數
        const updateDisplay = () => {
            // 確保數值保留一位小數，並加上 sec
            timeDisplay.textContent = `${currentValue.toFixed(1)} sec`;
        };

        // 減號按鈕事件
        minusBtn.addEventListener('click', () => {
            if (currentValue > 0.5) {
                currentValue -= 0.5;
                currentValue = Math.round(currentValue * 10) / 10;
                updateDisplay();
            }
        });

        // 加號按鈕事件
        plusBtn.addEventListener('click', () => {
            if (currentValue < 10) {
                currentValue += 0.5;
                currentValue = Math.round(currentValue * 10) / 10;
                updateDisplay();
            }
        });

        // 將此列的重置邏輯存入陣列
        rowControllers.push({
            reset: () => {
                currentValue = defaultValue; // 回到最初讀取的 HTML 數值
                updateDisplay();
            }
        });
    });

    // --- Reset 按鈕邏輯 ---
    // 選取左側選單最後一個按鈕 (Reset 圖示)
    const resetBtn = document.querySelector('.machine-menu .menu-item:last-child');

    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            // 防止 <a> 標籤跳轉
            e.preventDefault(); 

            // 執行所有列的重置
            rowControllers.forEach(controller => controller.reset());

        });
    }

    // --- 按鈕縮放動畫回饋 ---
    const allButtons = document.querySelectorAll('.control-adjust button, .menu-item');
    allButtons.forEach(btn => {
        btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.9)');
        btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
    });
});