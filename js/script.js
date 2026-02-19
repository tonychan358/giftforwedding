// DOM 元素
const loader = document.getElementById('loader');
const playlistContent = document.getElementById('playlist-content');
const countBadge = document.getElementById('count-badge');
const toggleBtn = document.getElementById('toggle-list-btn');

// Stage 元素
const welcomeView = document.getElementById('welcome-view');
const audioView = document.getElementById('audio-view');
const videoView = document.getElementById('video-view');
const stageInfo = document.getElementById('stage-info');
const currentName = document.getElementById('current-name');
const currentMsg = document.getElementById('current-msg');

// 音訊模式元件
const audioCoverImg = document.getElementById('audio-cover-img');
const vinylLabelImg = document.getElementById('vinyl-label-img');
const audioPlayer = document.getElementById('audio-player');
const progressBar = document.getElementById('progress-bar');

// 控制按鈕
const btnPlay = document.getElementById('btn-play');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const playIcon = btnPlay.querySelector('i');

// 狀態變數
let currentIndex = -1;

// 0. 修復 Favicon
const link = document.createElement('link');
link.rel = 'icon'; link.href = 'data:,'; document.head.appendChild(link);

// 1. 初始化
window.onload = function() {
    setTimeout(() => { if(loader) loader.style.display = 'none'; }, 2000);

    try {
        if (typeof WISHES_DATA === 'undefined') throw new Error("Data Error");
        renderPlaylist();
        if(countBadge) countBadge.textContent = WISHES_DATA.length;
        if(loader) loader.style.display = 'none';
    } catch (e) {
        console.error(e);
        alert("資料載入失敗");
    }
};

// === 列表開關 ===
function togglePlaylist() {
    const body = document.body;
    body.classList.toggle('list-expanded');
    toggleBtn.textContent = body.classList.contains('list-expanded') ? "🔽 收起" : "🔼 展開列表";
}

// 2. 渲染列表
function renderPlaylist() {
    if(!playlistContent) return;
    playlistContent.innerHTML = "";
    
    WISHES_DATA.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'track-item';
        const icon = item.type === 'video' ? '🎬' : '🎵'; 
        const cover = (item.cover && item.cover.startsWith('http')) ? item.cover : "https://placehold.co/150x150/333/fff?text=No+Img";
        const msgHtml = (item.message) ? `<div class="track-msg">${item.message}</div>` : '';

        div.innerHTML = `
            <div class="track-thumb">
                <img src="${cover}" loading="lazy">
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
    if (index < 0 || index >= WISHES_DATA.length) return;
    const item = WISHES_DATA[index];
    currentIndex = index;

    // UI 更新
    document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
    if(document.querySelectorAll('.track-item')[index]) {
        document.querySelectorAll('.track-item')[index].classList.add('active');
    }

    // 顯示資訊
    currentName.textContent = item.name;
    if(currentMsg) {
        currentMsg.textContent = item.message || "";
        currentMsg.style.display = (item.message) ? "block" : "none";
    }
    stageInfo.classList.add('show');
    welcomeView.classList.remove('active');

    // 手機版自動收起列表
    if (window.innerWidth < 768) {
        document.body.classList.remove('list-expanded');
        toggleBtn.textContent = "🔼 展開列表";
    }

    stopAll(); // 停止先前的播放

    const src = item.src;
    const displayCover = (item.cover && item.cover.startsWith('http')) ? item.cover : "https://placehold.co/400x400/222/fff?text=Wedding";

    // 判斷類型
    if (item.type === 'video') {
        // === 影片模式 (使用 Embed Iframe) ===
        // 注意：如果你影片也想改本地，這裡要改用 video 標籤
        // 目前假設影片還是用 Google Drive Embed
        audioView.style.display = 'none';
        videoView.style.display = 'flex';
        
        // 偵測是否為 Drive 連結
        if (src.includes('drive.google.com') || src.includes('preview')) {
             videoView.innerHTML = `<iframe src="${src}" width="100%" height="100%" style="border:none;" allow="autoplay; fullscreen"></iframe>`;
        } else {
             // 本地影片
             videoView.innerHTML = `<video src="${src}" controls autoplay playsinline width="100%" height="100%"></video>`;
        }

    } else {
        // === 音訊模式 (使用原生 Audio + 黑膠特效) ===
        videoView.style.display = 'none';
        audioView.style.display = 'flex';
        
        // 更新封面與黑膠貼紙
        audioCoverImg.src = displayCover;
        vinylLabelImg.style.backgroundImage = `url('${displayCover}')`;

        // 載入音訊
        audioPlayer.src = src;
        audioPlayer.play().then(() => {
            updatePlayButton(true);
        }).catch(e => {
            console.error("播放失敗", e);
            updatePlayButton(false);
        });
    }
}

function stopAll() {
    videoView.innerHTML = "";
    audioPlayer.pause();
    updatePlayButton(false);
}

// === 自訂播放控制器邏輯 ===

// 播放/暫停按鈕
btnPlay.onclick = () => {
    if (audioPlayer.paused) {
        if (audioPlayer.src) {
            audioPlayer.play();
            updatePlayButton(true);
        } else {
            // 如果還沒選歌，預設播第一首
            playIndex(0);
        }
    } else {
        audioPlayer.pause();
        updatePlayButton(false);
    }
};

// 上一首
btnPrev.onclick = () => {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = WISHES_DATA.length - 1; // 循環
    playIndex(newIndex);
};

// 下一首
btnNext.onclick = () => {
    let newIndex = currentIndex + 1;
    if (newIndex >= WISHES_DATA.length) newIndex = 0; // 循環
    playIndex(newIndex);
};

// 更新按鈕狀態與動畫
function updatePlayButton(isPlaying) {
    if (isPlaying) {
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        audioView.classList.add('playing'); // 觸發黑膠旋轉
    } else {
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        audioView.classList.remove('playing'); // 停止旋轉
    }
}

// 監聽 Audio 事件：更新進度條
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${percent}%`;
    }
});

// 監聽 Audio 事件：播完自動下一首
audioPlayer.addEventListener('ended', () => {
    updatePlayButton(false);
    // 自動播下一首 (可選)
    btnNext.click();
});
