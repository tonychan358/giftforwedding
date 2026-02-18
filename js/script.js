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
const currentMsg = document.getElementById('current-msg');

// 音訊模式元件
const audioCoverImg = document.getElementById('audio-cover-img');
const audioEmbedContainer = document.getElementById('audio-embed-container');

// 0. 修復 Favicon 404
const link = document.createElement('link');
link.rel = 'icon';
link.href = 'data:,';
document.head.appendChild(link);

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

// === 新增：列表展開/收起切換 ===
function togglePlaylist() {
    const body = document.body;
    body.classList.toggle('list-expanded');
    
    // 更新按鈕文字
    if (body.classList.contains('list-expanded')) {
        toggleBtn.textContent = "🔽 收起";
    } else {
        toggleBtn.textContent = "🔼 展開";
    }
}

// 2. 渲染列表
function renderPlaylist() {
    if(!playlistContent) return;
    playlistContent.innerHTML = "";
    
    WISHES_DATA.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'track-item';
        const icon = item.type === 'video' ? '🎬' : '🎤'; 
        const cover = (item.cover && item.cover.startsWith('http')) ? item.cover : "https://placehold.co/150x150/333/fff?text=No+Img";
        const msgHtml = (item.message && item.message.trim() !== "") ? `<div class="track-msg">${item.message}</div>` : '';

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
    const item = WISHES_DATA[index];

    // UI 更新高亮
    document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
    if(document.querySelectorAll('.track-item')[index]) {
        document.querySelectorAll('.track-item')[index].classList.add('active');
    }

    if(currentMsg) {
        currentMsg.textContent = item.message || "";
        currentMsg.style.display = (item.message && item.message.trim() !== "") ? "block" : "none";
    }
    stageInfo.classList.add('show');
    welcomeView.classList.remove('active');

    // === 關鍵體驗優化：點歌後自動收起列表，讓使用者看照片 ===
    if (window.innerWidth < 768) { // 只在手機版生效
        document.body.classList.remove('list-expanded');
        toggleBtn.textContent = "🔼 展開";
    }

    stopAll();

    const src = item.src;

    if (item.type === 'video') {
        audioView.style.display = 'none';
        videoView.style.display = 'flex';
        videoView.innerHTML = `<iframe src="${src}" width="100%" height="100%" style="border:none;" allow="autoplay; fullscreen"></iframe>`;
    } else {
        videoView.style.display = 'none';
        audioView.style.display = 'flex';
        const displayCover = (item.cover && item.cover.startsWith('http')) ? item.cover : "https://placehold.co/400x400/222/fff?text=Wedding";
        audioCoverImg.src = displayCover;
        audioEmbedContainer.innerHTML = `<iframe src="${src}" width="100%" height="100%" style="border:none;" allow="autoplay"></iframe>`;
    }
}

function stopAll() {
    videoView.innerHTML = "";
    audioEmbedContainer.innerHTML = "";
}
