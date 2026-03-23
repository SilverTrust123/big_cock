document.addEventListener('DOMContentLoaded', () => {
    const machineImg = document.getElementById('machineImg');
    const machineDesc = document.getElementById('machineDesc');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const navIcons = document.querySelectorAll('.nav-icon');

    const machineData = [
        { img: '../picture/realmachine1.png', desc: '輸送帶 1：負責將工件由起始端運送至滑台缸處。' },
        { img: '../picture/realmachine2.png', desc: '龍門機械臂：' },
        { img: '../picture/realmachine4.png', desc: '輸送帶 2：' },
        { img: '../picture/realmachine3.png', desc: '旋轉缸機械臂：' },
        { img: '../picture/realmachine5.png', desc: '滑台缸機械臂：' }
    ];

    let currentIndex = 0;

    const updateDisplay = (index) => {
        currentIndex = index;
        // 更新主圖與文字
        machineImg.src = machineData[index].img;
        machineDesc.innerText = machineData[index].desc;

        // 更新小圖示透明度 (選中的變亮)
        navIcons.forEach((icon, i) => {
            icon.style.opacity = (i === index) ? "1" : "0.5";
            icon.style.borderBottom = (i === index) ? "2px solid #555" : "none";
        });
    };

    // 綁定箭頭事件
    nextBtn.addEventListener('click', () => {
        let index = (currentIndex + 1) % machineData.length;
        updateDisplay(index);
    });

    prevBtn.addEventListener('click', () => {
        let index = (currentIndex - 1 + machineData.length) % machineData.length;
        updateDisplay(index);
    });

    // 綁定小圖示點擊事件
    navIcons.forEach((icon) => {
        icon.addEventListener('click', () => {
            const index = parseInt(icon.getAttribute('data-index'));
            updateDisplay(index);
        });
    });

    // 初始化顯示第一筆
    updateDisplay(0);
});