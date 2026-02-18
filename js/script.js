// DOM 元素
const loader = document.getElementById('loader');
const playlistContent = document.getElementById('playlist-content');
const countBadge = document.getElementById('count-badge');

// Stage 元素
const welcomeView = document.getElementById('welcome-view');
const cassetteView = document.getElementById('cassette-view');
const videoView = document.getElementById('video-view');
const stageInfo = document.getElementById('stage-info');
const currentMsg = document.getElementById('current-msg');

// 卡帶元件
const tapeName = document.getElementById('tape-name');
const tapeCoverBg = document.getElementById('tape-cover-bg');
const audioControlsContainer = document.getElementById('audio-controls-container');

// 0. 修復 Favicon 404
const link = document.createElement('link');
link.rel = 'icon';
link.href = 'data:,';
document.head.appendChild(link);

// 1. 初始化
window.onload = function() {
    console.log("Script loaded.");
    
    setTimeout(() => {
        if(loader && loader.style.display !== 'none') {
            loader.style.display = 'none';
        }
    }, 2000);

    try {
        if (typeof WISHES_DATA === 'undefined') {
            throw new Error("WISHES_DATA 未定義 (data.js 載入失敗)");
        }
        
        renderPlaylist();
        if(countBadge) countBadge.textContent = WISHES_DATA.length;
        if(loader) loader.style.display = 'none';

    } catch (e) {
        console.error(e);
        alert("資料載入失敗，請檢查 data.js");
    }
};

// 2. 渲染列表
function renderPlaylist() {
    if(!playlistContent) return;
    playlistContent.innerHTML = "";
    
    WISHES_DATA.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'track-item';
        const icon = item.type === 'video' ? '🎬' : '📼'; // 使用卡帶 Emoji
        
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

// 3. 播放核心邏輯
function playIndex(index) {
    const item = WISHES_DATA[index];

    // UI 更新列表高亮
    document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
    if(document.querySelectorAll('.track-item')[index]) {
        document.querySelectorAll('.track-item')[index].classList.add('active');
    }

    // 更新底部文字
    if(currentMsg) {
        currentMsg.textContent = item.message || "";
        currentMsg.style.display = (item.message && item.message.trim() !== "") ? "block" : "none";
    }
    stageInfo.classList.add('show');
    welcomeView.classList.remove('active');

    // 停止所有播放 (清空 iframe)
    stopAll();

    // 確保網址是 Embed 格式 (GAS 生成的通常已是 /preview)
    const src = item.src;

    if (item.type === 'video') {
        // === 影片模式 ===
        cassetteView.style.display = 'none';
        videoView.style.display = 'flex';
        
        // 載入影片 Iframe
        videoView.innerHTML = `<iframe src="${src}" width="100%" height="100%" style="border:none;" allow="autoplay; fullscreen"></iframe>`;

    } else {
        // === 卡帶音訊模式 ===
        videoView.style.display = 'none';
        cassetteView.style.display = 'flex';
        
        // 更新卡帶視覺
        tapeName.textContent = item.name;
        // 使用合照作為卡帶貼紙背景
        tapeCoverBg.style.backgroundImage = `url('${item.cover}')`;

        // 載入音訊 Iframe (放在卡帶下方)
        audioControlsContainer.innerHTML = `<iframe src="${src}" width="100%" height="100%" style="border:none;" allow="autoplay"></iframe>`;
    }
}

function stopAll() {
    videoView.innerHTML = "";
    audioControlsContainer.innerHTML = "";
}
