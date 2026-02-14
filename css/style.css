/* === 全域設定 === */
:root {
    --bg-color: #121212;
    --panel-bg: #1e1e1e;
    --accent: #d4a5a5; /* 藕粉金 */
    --text-main: #fff;
    --text-sub: #aaa;
    --border: #333;
}

body {
    margin: 0;
    padding: 0;
    background-color: var(--bg-color);
    color: var(--text-main);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    height: 100vh;
    overflow: hidden;
}

.app-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

/* === Loading 遮罩 === */
#loader {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: #000; z-index: 9999;
    display: flex; justify-content: center; align-items: center;
    transition: opacity 0.5s;
}
.loader-content { text-align: center; }
.spinner {
    width: 40px; height: 40px; border: 4px solid #333;
    border-top: 4px solid var(--accent); border-radius: 50%;
    animation: spin 1s linear infinite; margin: 0 auto 10px;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

/* === 左/上：播放舞台 (Stage) === */
#stage-area {
    flex: 4.5; /* 手機版高度佔比 */
    background: radial-gradient(circle at center, #2a2a2a 0%, #000 100%);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-bottom: 1px solid var(--border);
}

/* 歡迎畫面 */
#welcome-view { display: none; text-align: center; color: #555; }
#welcome-view.active { display: block; }
#welcome-view h1 { font-weight: 300; letter-spacing: 2px; color: var(--accent); margin: 0; }

/* 黑膠唱片元件 */
.vinyl-wrapper {
    display: none; /* JS 控制顯示 */
    width: 260px; height: 260px;
    justify-content: center; align-items: center;
    position: relative;
    z-index: 10;
}

.vinyl-record {
    width: 100%; height: 100%; border-radius: 50%;
    background: repeating-radial-gradient(#111 0, #111 2px, #222 3px, #222 4px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
    display: flex; justify-content: center; align-items: center;
    animation: spin 6s linear infinite;
    animation-play-state: paused;
}
.vinyl-record.playing { animation-play-state: running; }

.album-cover-mask {
    width: 45%; height: 45%; border-radius: 50%; overflow: hidden;
    border: 3px solid #fff; position: relative;
}
.album-cover { width: 100%; height: 100%; object-fit: cover; }

/* 影片元件 */
.video-wrapper {
    display: none; width: 100%; height: 100%; background: #000;
    justify-content: center; align-items: center;
}
video { width: 100%; height: 100%; max-height: 100%; }

/* 底部字幕資訊 */
.stage-caption {
    position: absolute; bottom: 20px; left: 0; width: 100%;
    text-align: center; pointer-events: none; z-index: 20;
    text-shadow: 0 2px 5px rgba(0,0,0,0.8);
    opacity: 0; transition: opacity 0.5s;
}
.stage-caption.show { opacity: 1; }
.stage-caption h2 { margin: 0; font-size: 1.4rem; color: var(--accent); }
#current-msg { margin: 5px 20px 0; font-size: 0.95rem; color: #eee; }

/* === 右/下：播放列表 (Playlist) === */
#playlist-area {
    flex: 5.5;
    background: var(--panel-bg);
    display: flex; flex-direction: column;
}

.playlist-header {
    padding: 15px 20px;
    border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(30,30,30,0.95);
    backdrop-filter: blur(5px);
}
.playlist-header h3 { margin: 0; font-size: 1rem; color: #fff; }
#count-badge { background: #333; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem; }

#playlist-content {
    flex: 1; overflow-y: auto; padding: 10px;
}

/* 列表項目 */
.track-item {
    display: flex; align-items: center;
    padding: 12px; margin-bottom: 8px;
    background: rgba(255,255,255,0.03);
    border-radius: 10px;
    cursor: pointer; transition: 0.2s;
    border: 1px solid transparent;
}
.track-item:hover { background: rgba(255,255,255,0.08); }
.track-item.active {
    background: rgba(212, 165, 165, 0.15);
    border-color: var(--accent);
}

.track-thumb {
    width: 50px; height: 50px; border-radius: 8px;
    position: relative; margin-right: 15px; flex-shrink: 0;
}
.track-thumb img { width: 100%; height: 100%; border-radius: 8px; object-fit: cover; }
.type-icon {
    position: absolute; bottom: -5px; right: -5px;
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--accent); color: #000;
    font-size: 12px; display: flex; justify-content: center; align-items: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.5);
}

.track-info { flex: 1; overflow: hidden; }
.track-name { font-weight: bold; font-size: 1rem; color: #fff; margin-bottom: 3px; }
.track-msg { font-size: 0.85rem; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* === RWD: 電腦/iPad 版 (橫向佈局) === */
@media (min-width: 768px) {
    .app-container { flex-direction: row; }
    #stage-area { flex: 6; border-bottom: none; border-right: 1px solid var(--border); }
    #playlist-area { flex: 4; max-width: 400px; }
    .vinyl-wrapper { width: 380px; height: 380px; }
    .stage-caption { bottom: 40px; }
    .stage-caption h2 { font-size: 2rem; }
}


