/**
  處理頁面跳轉
  @param {string} url - 頁面的路徑
 */
function goToPage(url) {
    // 判斷是不是現在的頁面（避免重複跳轉）
    if (window.location.pathname.endsWith(url)) {
        return;
    }

    // index.html 跳轉
    if (url === 'index.html') {
        window.location.href = url;
    } else {
        // 等建立好 預留.html 檔案，將 console 移除改為 window.location.href = url;      
        console.log("導航至預留位置: " + url);
        alert("此頁面 (" + url + ") 的檔案尚未建立。");
    }
}