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

// 0. 修復 Favicon 404
const link = document.createElement('link');
link.rel = 'icon';
link.href = 'data:,';
document.head.appendChild(link);

// 1. 初始化
window.onload = function() {
    console.log("Script loaded. Checking data...");
    
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
        if(loader) loader.style.display = 'none';

        // 綁定手動播放/暫停
        vinylDisk.addEventListener('click', () => {
            if (!audioPlayer.src) {
                alert("請先從列表選擇一首祝福！");
                return;
            }
            if(audioPlayer.paused) {
                const playPromise = audioPlayer.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => vinylDisk.classList.add('playing'))
                    .catch(err => {
                        console.error("手動播放失敗:", err);
                        handlePlayError(err, WISHES_DATA[currentIndex]);
                    });
                }
            } else {
                audioPlayer.pause();
                vinylDisk.classList.remove('playing');
            }
        });

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
        
        const cover = (item.cover && item.cover.startsWith('http')) 
            ? item.cover 
            : "https://placehold.co/150x150/333/fff?text=No+Img";
        
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

// === 關鍵修正：使用 Google CDN 網域 ===
function fixDriveUrl(url) {
    if (!url) return "";
    
    // 提取 ID
    let id = "";
    try {
        if (url.includes("id=")) id = url.match(/id=([a-zA-Z0-9_-]+)/)[1];
        else if (url.includes("/d/")) id = url.match(/\/d\/([a-zA-Z0-9_-]+)/)[1];
    } catch(e) { return url; }

    if (id) {
        // 使用 lh3.googleusercontent.com/d/{id}
        // 這個網域通常被視為 "內容傳遞" (CDN)，比較不會強制瀏覽器下載檔案
        // 這能解決大部分 NotSupportedError 的問題
        return `https://lh3.googleusercontent.com/d/${id}`;
    }
    return url;
}

// 3. 播放核心邏輯
function playIndex(index) {
    const item = WISHES_DATA[index];
    currentIndex = index;

    console.log(`準備播放: ${item.name}`);

    if (!item.src || !item.src.startsWith('http')) {
        alert(`無法播放 "${item.name}"\n連結無效`);
        return;
    }

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

    const displayCover = (item.cover && item.cover.startsWith('http')) 
        ? item.cover 
        : "https://placehold.co/400x400/222/fff?text=Wedding";

    // === 應用網址修正 ===
    const safeSrc = fixDriveUrl(item.src);
    console.log("修正後的播放網址 (CDN):", safeSrc);

    if (item.type === 'video') {
        // === 影片模式 ===
        vinylView.style.display = 'none';
        videoView.style.display = 'flex';
        
        videoPlayer.poster = displayCover;
        videoPlayer.src = safeSrc;
        videoPlayer.load();

        const playPromise = videoPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.error("影片播放失敗:", error);
            });
        }
    } else {
        // === 黑膠模式 ===
        videoView.style.display = 'none';
        vinylView.style.display = 'flex';
        albumCover.src = displayCover;
        albumCover.onerror = function() { this.src = 'https://placehold.co/400x400/555/fff?text=No+Image'; };

        audioPlayer.src = safeSrc;

        // 嘗試播放
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise
            .then(() => {
                vinylDisk.classList.add('playing');
            })
            .catch(error => {
                handlePlayError(error, item);
                vinylDisk.classList.remove('playing');
            });
        }

        audioPlayer.onended = () => vinylDisk.classList.remove('playing');
    }
}

function stopAll() {
    if(!audioPlayer.paused) audioPlayer.pause();
    if(!videoPlayer.paused) videoPlayer.pause();
    vinylDisk.classList.remove('playing');
}

function handlePlayError(error, item) {
    console.error("播放錯誤詳細資訊:", error);
    
    if (error.name === "NotSupportedError") {
        const msg = `無法播放：${item.name}\n\n原因：瀏覽器拒絕播放 Google Drive 的檔案格式。\n\n建議解決方案：\n1. 請確認檔案權限已設為「公開」。\n2. (強烈建議) 將音訊/影片檔下載，直接上傳到 GitHub，並更新 data.js 連結。`;
        alert(msg);
    } else {
        console.warn("自動播放被阻擋或網路問題");
    }
}
