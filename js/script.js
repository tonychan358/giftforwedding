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
        
        if(loader) loader.style.display = 'none';

        // 綁定手動播放/暫停功能
        vinylDisk.addEventListener('click', () => {
            // 防呆：如果還沒選歌
            if (!audioPlayer.src) {
                alert("請先從列表選擇一首祝福！");
                return;
            }

            if(audioPlayer.paused) {
                const playPromise = audioPlayer.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        vinylDisk.classList.add('playing');
                    }).catch(err => {
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

// === 新增：修正 Google Drive 網址的函式 ===
function fixDriveUrl(url, type) {
    if (!url) return "";
    
    // 如果不是 Google Drive 連結，直接回傳
    if (!url.includes("drive.google.com") && !url.includes("docs.google.com")) {
        return url;
    }

    // 1. 嘗試將 drive.google.com 替換為 docs.google.com (有時支援度較好)
    // let fixedUrl = url.replace("drive.google.com", "docs.google.com");
    // 保持 drive.google.com 也可以，重點是下面的後綴
    
    let fixedUrl = url;

    // 2. 關鍵修正：在網址最後面偷加一個參數 "&hash=.mp3"
    // 這會強制瀏覽器認為這是一個媒體檔案，而不是下載檔
    if (type === 'video') {
        return fixedUrl + "&type=.mp4"; 
    } else {
        return fixedUrl + "&type=.mp3";
    }
}

// 3. 播放核心邏輯
function playIndex(index) {
    const item = WISHES_DATA[index];
    currentIndex = index;

    console.log(`準備播放: ${item.name}`);

    // 檢查網址
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
    const safeSrc = fixDriveUrl(item.src, item.type);
    console.log("修正後的播放網址:", safeSrc);

    if (item.type === 'video') {
        // === 影片模式 ===
        vinylView.style.display = 'none';
        videoView.style.display = 'flex';
        
        videoPlayer.poster = displayCover;
        videoPlayer.src = safeSrc;
        
        // 加入 crossOrigin 屬性可能有助於某些跨域問題
        videoPlayer.setAttribute('crossorigin', 'anonymous');
        
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
        audioPlayer.setAttribute('crossorigin', 'anonymous');

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
    if(!audioPlayer.paused) {
        audioPlayer.pause();
    }
    if(!videoPlayer.paused) {
        videoPlayer.pause();
    }
    vinylDisk.classList.remove('playing');
}

// 錯誤處理輔助函式
function handlePlayError(error, item) {
    console.error("播放錯誤詳細資訊:", error);
    
    if (error.name === "NotSupportedError") {
        const isIphone = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        let msg = `無法播放音訊：${item.name}\n\n`;
        msg += `瀏覽器回報：格式不支援 (NotSupportedError)\n`;
        
        if (isIphone) {
             msg += `提示：您的瀏覽器似乎拒絕了 Google Drive 的音訊串流。\n建議：請嘗試將網址複製到 Chrome (桌面版) 測試，或檢查該檔案是否為標準 mp3。`;
        } else {
             msg += `原因：瀏覽器無法辨識 Google Drive 的檔案類型。\n\n我們已嘗試自動修正網址，但仍失敗。請確認 Drive 檔案權限已設為「公開 (知道連結的任何人)」。`;
        }
        alert(msg);
    } else {
        console.warn("自動播放被阻擋或網路問題");
    }
}
