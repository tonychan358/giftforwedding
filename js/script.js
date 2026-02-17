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

// 1. 初始化
window.onload = function() {
    console.log("Script loaded. Checking data...");
    
    // 強制在 3 秒後關閉 loading，避免永遠卡死
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

    } catch (e) {
        console.error(e);
        // 錯誤會被 index.html 的 onerror 捕獲並顯示
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
        
        // === 修正點：更換備用圖片服務 ===
        // 使用 placehold.co 代替不穩定的 via.placeholder.com
        const cover = item.cover || "https://placehold.co/150x150/333/fff?text=No+Img";
        
        // 文字選填處理
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

    // === 修正點：播放時的封面若無效也使用新服務 ===
    const displayCover = item.cover || "https://placehold.co/400x400/222/fff?text=Wedding";

    if (item.type === 'video') {
        // === 影片模式 ===
        vinylView.style.display = 'none';
        videoView.style.display = 'flex';
        videoPlayer.src = item.src;
        videoPlayer.poster = displayCover;
        videoPlayer.play().catch(e => console.log("瀏覽器阻擋自動播放，需點擊"));
    } else {
        // === 黑膠模式 ===
        videoView.style.display = 'none';
        vinylView.style.display = 'flex';
        albumCover.src = displayCover;
        // 處理大圖載入失敗的情況
        albumCover.onerror = function() { this.src = 'https://placehold.co/400x400/555/fff?text=No+Image'; };

        audioPlayer.src = item.src;
        audioPlayer.play().then(() => {
            vinylDisk.classList.add('playing');
        }).catch(e => console.log("瀏覽器阻擋自動播放，需點擊"));

        audioPlayer.onended = () => vinylDisk.classList.remove('playing');
    }
}

function stopAll() {
    if(audioPlayer) { audioPlayer.pause(); audioPlayer.currentTime = 0; }
    if(videoPlayer) { videoPlayer.pause(); videoPlayer.currentTime = 0; }
    if(vinylDisk) vinylDisk.classList.remove('playing');
}
