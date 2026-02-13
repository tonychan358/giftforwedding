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
    async function init() {
        try {
            // 模擬載入時間 (可選，只是為了視覺流暢)
            // await new Promise(r => setTimeout(r, 500)); 

            if (typeof WISHES_DATA === 'undefined' || WISHES_DATA.length === 0) {
                alert("目前沒有祝福資料，請檢查 js/data.js");
                return;
            }

            playlistData = WISHES_DATA; // 直接使用 data.js 裡的變數
            renderPlaylist(playlistData);
            
            // 隱藏 Loading
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);

        } catch (error) {
            console.error(error);
            loader.textContent = "載入失敗";
        }
    }

// 2. 渲染列表
function renderPlaylist() {
    playlistContent.innerHTML = "";
    
    WISHES_DATA.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'track-item';
        
        // 判斷類型圖示
        const icon = item.type === 'video' ? '🎬' : '🎵';
        
        div.innerHTML = `
            <div class="track-thumb">
                <img src="${item.cover}" loading="lazy">
                <div class="type-icon">${icon}</div>
            </div>
            <div class="track-info">
                <div class="track-name">${item.name}</div>
                <div class="track-msg">${item.message}</div>
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

    // UI: 列表高亮
    document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.track-item')[index].classList.add('active');

    // UI: 顯示底部文字
    currentName.textContent = item.name;
    currentMsg.textContent = item.message;
    stageInfo.classList.add('show');

    // 停止所有正在播的
    stopAll();
    welcomeView.classList.remove('active');

    if (item.type === 'video') {
        // === 影片模式 ===
        vinylView.style.display = 'none';
        videoView.style.display = 'flex';
        
        videoPlayer.src = item.src;
        videoPlayer.poster = item.cover; // 縮圖
        videoPlayer.play().catch(e => console.log("瀏覽器阻擋自動播放，需點擊"));

    } else {
        // === 黑膠模式 ===
        videoView.style.display = 'none';
        vinylView.style.display = 'flex';
        
        // 更換唱片封面
        albumCover.src = item.cover;
        
        audioPlayer.src = item.src;
        audioPlayer.play().then(() => {
            vinylDisk.classList.add('playing'); // 開始旋轉
        }).catch(e => console.log("瀏覽器阻擋自動播放，需點擊"));

        // 播完後停止旋轉
        audioPlayer.onended = () => {
            vinylDisk.classList.remove('playing');
        };
    }
}

// 停止所有播放器
function stopAll() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    
    vinylDisk.classList.remove('playing');
}
