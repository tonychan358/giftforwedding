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

        // 綁定手動播放/暫停 (僅限音訊模式)
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
                        alert("播放失敗，請檢查檔案權限");
                    });
                }
            } else {
                audioPlayer.pause();
                vinylDisk.classList.remove('playing');
            }
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

// === 核心工具：轉換為 Embed 連結 ===
function getDriveEmbedLink(url) {
    if (!url) return "";
    let id = "";
    try {
        if (url.includes("id=")) id = url.match(/id=([a-zA-Z0-9_-]+)/)[1];
        else if (url.includes("/d/")) id = url.match(/\/d\/([a-zA-Z0-9_-]+)/)[1];
    } catch(e) { return null; }

    if (id) {
        // 這就是你發現的那個神氣連結！
        return `https://drive.google.com/file/d/${id}/preview`;
    }
    return null;
}

function getDirectLink(url) {
    // 這是給音訊用的舊連結 (為了保留旋轉特效)
    if (!url) return "";
    let id = "";
    try {
        if (url.includes("id=")) id = url.match(/id=([a-zA-Z0-9_-]+)/)[1];
        else if (url.includes("/d/")) id = url.match(/\/d\/([a-zA-Z0-9_-]+)/)[1];
    } catch(e) { return null; }

    if (id) return `https://lh3.googleusercontent.com/d/${id}`;
    return url;
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

    const displayCover = (item.cover && item.cover.startsWith('http')) 
        ? item.cover 
        : "https://placehold.co/400x400/222/fff?text=Wedding";

    if (item.type === 'video') {
        // === 影片模式 (使用 Embed Iframe) ===
        vinylView.style.display = 'none';
        videoView.style.display = 'flex';
        
        // 嘗試取得 Embed 連結
        const embedSrc = getDriveEmbedLink(item.src);

        if (embedSrc) {
            // 如果是 Drive 影片，使用 iframe 播放器 (解決所有格式問題)
            // 我們動態產生一個 iframe 塞進去
            videoView.innerHTML = `<iframe src="${embedSrc}" width="100%" height="100%" style="border:none;" allow="autoplay"></iframe>`;
        } else {
            // 如果不是 Drive 影片 (例如其他 mp4 直連)，使用原本的 video 標籤
            videoView.innerHTML = `<video id="video-player" controls playsinline width="100%" height="100%"></video>`;
            const vPlayer = videoView.querySelector('video');
            vPlayer.poster = displayCover;
            vPlayer.src = item.src;
            vPlayer.play().catch(e => console.log("需互動播放"));
        }

    } else {
        // === 黑膠模式 (保持不變) ===
        // 我們不對音訊使用 Embed，因為那樣會出現一個很醜的播放器，而且黑膠不會轉
        videoView.style.display = 'none';
        vinylView.style.display = 'flex';
        albumCover.src = displayCover;
        albumCover.onerror = function() { this.src = 'https://placehold.co/400x400/555/fff?text=No+Image'; };

        const directSrc = getDirectLink(item.src);
        audioPlayer.src = directSrc;

        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise
            .then(() => vinylDisk.classList.add('playing'))
            .catch(error => {
                console.error("音訊播放錯誤:", error);
                vinylDisk.classList.remove('playing');
                alert(`無法播放音訊：${item.name}\n\n這可能是檔案格式問題。建議將音訊檔下載後，改為使用本地檔案播放。`);
            });
        }
        audioPlayer.onended = () => vinylDisk.classList.remove('playing');
    }
}

function stopAll() {
    if(!audioPlayer.paused) audioPlayer.pause();
    
    // 影片停止邏輯修改：
    // 因為 iframe 無法從外部暫停，我們直接清空 videoView 的內容來強制停止
    videoView.innerHTML = ""; 
    
    vinylDisk.classList.remove('playing');
}
