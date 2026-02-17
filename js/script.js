// DOM 元素
const loader = document.getElementById('loader');
const playlistContent = document.getElementById('playlist-content');
const countBadge = document.getElementById('count-badge');
const audioPlayer = document.getElementById('audio-player');
const videoPlayer = document.getElementById('video-player');

// Stage 元素
const welcomeView = document.getElementById('welcome-view');
const vinylView = document.getElementById('vinyl-view');
const videoView = document.getElementById('video-view');
const vinylDisk = document.getElementById('vinyl-disk');
const albumCover = document.getElementById('album-cover');
const stageInfo = document.getElementById('stage-info');
const currentName = document.getElementById('current-name');
const currentMsg = document.getElementById('current-msg');

// 狀態變數
let currentIndex = -1;

// 0. 修復 Favicon 404 (自動加入一個透明圖標)
const link = document.createElement('link');
link.rel = 'icon';
link.href = 'data:,'; // 空白圖標
document.head.appendChild(link);

// 1. 初始化
window.onload = function() {
    console.log("Script loaded. Checking data...");
    
    // 強制在 3 秒後關閉 loading
    setTimeout(() => {
        if(loader && loader.style.display !== 'none') {
            console.warn("Loading timeout forced.");
            loader.style.display = 'none';
        }
    }, 3000);

    try {
        if (typeof WISHES_DATA === 'undefined') {
            throw new Error("WISHES_DATA 未定義 (data.js 載入失敗)");
        }
        
        console.log("Data found:", WISHES_DATA);
        renderPlaylist();
        
        if(countBadge) countBadge.textContent = WISHES_DATA.length;
        
        // 正常關閉
        if(loader) loader.style.display = 'none';

        // === 新增：綁定手動播放/暫停功能 ===
        // 點擊黑膠唱片可以暫停/播放
        vinylDisk.addEventListener('click', () => {
            if(audioPlayer.paused) {
                audioPlayer.play();
                vinylDisk.classList.add('playing');
            } else {
                audioPlayer.pause();
                vinylDisk.classList.remove('playing');
            }
        });

        // 點擊影片可以暫停/播放
        videoPlayer.addEventListener('click', () => {
            if(videoPlayer.paused) videoPlayer.play();
            else videoPlayer.pause();
        });

    } catch (e) {
        console.error(e);
        throw e; 
    }
};

// 2. 渲染列表
function renderPlaylist() {
    if(!playlistContent) return;
    playlistContent.innerHTML = "";
    
    WISHES_DATA.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'track-item';
        const icon = item.type === 'video' ? '🎬' : '🎵';
        
        // 使用 placehold.co 代替不穩定的 via.placeholder.com
        const cover = item.cover || "https://placehold.co/150x150/333/fff?text=No+Img";
        
        const msgHtml = (item.message && item.message.trim() !== "") 
            ? `<div class="track-msg">${item.message}</div>` 
            : '';

        div.innerHTML = `
            <div class="track-thumb">
                <img src="${cover}" loading="lazy" onerror="this.src='https://placehold.co/150x150/555/fff?text=Error'">
                <div class="type-icon">${icon}</div>
            </div>
            <div class="track-info">
                <div class="track-name">${item.name || '未命名'}</div>
                ${msgHtml}
            </div>
        `;
        div.onclick = () => playIndex(index);
        playlistContent.appendChild(div);
    });
}

// 3. 播放核心邏輯
function playIndex(index) {
    const item = WISHES_DATA[index];
    currentIndex = index;

    // UI 更新
    document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
    if(document.querySelectorAll('.track-item')[index]) {
        document.querySelectorAll('.track-item')[index].classList.add('active');
    }

    currentName.textContent = item.name;
    if(currentMsg) {
        currentMsg.textContent = item.message || "";
        currentMsg.style.display = (item.message && item.message.trim() !== "") ? "block" : "none";
    }
    stageInfo.classList.add('show');

    stopAll();
    welcomeView.classList.remove('active');

    const displayCover = item.cover || "https://placehold.co/400x400/222/fff?text=Wedding";

    if (item.type === 'video') {
        // === 影片模式 ===
        vinylView.style.display = 'none';
        videoView.style.display = 'flex';
        videoPlayer.src = item.src;
        videoPlayer.poster = displayCover;
        
        // 嘗試播放
        const playPromise = videoPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("影片播放失敗:", error);
                // 可以在這裡顯示一個「播放按鈕」提示使用者點擊
            });
        }
    } else {
        // === 黑膠模式 ===
        videoView.style.display = 'none';
        vinylView.style.display = 'flex';
        albumCover.src = displayCover;
        albumCover.onerror = function() { this.src = 'https://placehold.co/400x400/555/fff?text=No+Image'; };

        audioPlayer.src = item.src;
        
        // 嘗試播放
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise
            .then(() => {
                vinylDisk.classList.add('playing');
            })
            .catch(error => {
                console.error("音訊播放失敗 (請檢查 Drive 權限或連結):", error);
                vinylDisk.classList.remove('playing');
                // 提示使用者
                alert(`無法自動播放 "${item.name}"\n\n可能原因：\n1. Google Drive 檔案權限未公開\n2. 網路連線逾時\n\n請嘗試點擊黑膠唱片手動播放。`);
            });
        }

        audioPlayer.onended = () => vinylDisk.classList.remove('playing');
    }
}

function stopAll() {
    if(audioPlayer) { audioPlayer.pause(); audioPlayer.currentTime = 0; }
    if(videoPlayer) { videoPlayer.pause(); videoPlayer.currentTime = 0; }
    if(vinylDisk) vinylDisk.classList.remove('playing');
}
