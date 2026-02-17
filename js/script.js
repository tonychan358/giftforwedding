// DOM 元素
const loader = document.getElementById('loader');
const playlistContent = document.getElementById('playlist-content');
const countBadge = document.getElementById('count-badge');
const audioPlayer = document.getElementById('audio-player');
const videoPlayer = document.getElementById('video-player');

const welcomeView = document.getElementById('welcome-view');
const vinylView = document.getElementById('vinyl-view');
const videoView = document.getElementById('video-view');
const vinylDisk = document.getElementById('vinyl-disk');
const albumCover = document.getElementById('album-cover');
const stageInfo = document.getElementById('stage-info');
const currentName = document.getElementById('current-name');
const currentMsg = document.getElementById('current-msg');

let currentIndex = -1;

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

function renderPlaylist() {
    if(!playlistContent) return;
    playlistContent.innerHTML = "";
    
    WISHES_DATA.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'track-item';
        const icon = item.type === 'video' ? '🎬' : '🎵';
        // 防呆預設圖
        const cover = item.cover || "https://via.placeholder.com/150";
        
        // 文字選填處理
        const msgHtml = (item.message) ? `<div class="track-msg">${item.message}</div>` : '';

        div.innerHTML = `
            <div class="track-thumb">
                <img src="${cover}" onerror="this.src='https://via.placeholder.com/150'">
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

function playIndex(index) {
    const item = WISHES_DATA[index];
    currentIndex = index;

    document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
    if(document.querySelectorAll('.track-item')[index]) {
        document.querySelectorAll('.track-item')[index].classList.add('active');
    }

    currentName.textContent = item.name;
    if(currentMsg) {
        currentMsg.textContent = item.message || "";
        currentMsg.style.display = item.message ? "block" : "none";
    }
    stageInfo.classList.add('show');

    stopAll();
    welcomeView.classList.remove('active');

    if (item.type === 'video') {
        vinylView.style.display = 'none';
        videoView.style.display = 'flex';
        videoPlayer.src = item.src;
        videoPlayer.poster = item.cover;
        videoPlayer.play().catch(e => console.log("需點擊播放"));
    } else {
        videoView.style.display = 'none';
        vinylView.style.display = 'flex';
        albumCover.src = item.cover || "https://via.placeholder.com/150";
        audioPlayer.src = item.src;
        audioPlayer.play().then(() => {
            vinylDisk.classList.add('playing');
        }).catch(e => console.log("需點擊播放"));
        audioPlayer.onended = () => vinylDisk.classList.remove('playing');
    }
}

function stopAll() {
    audioPlayer.pause();
    videoPlayer.pause();
    vinylDisk.classList.remove('playing');
}
