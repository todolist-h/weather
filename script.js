const AREA_CODE = "440000"; // 大分県
const WEATHER_URL = `https://www.jma.go.jp/bosai/forecast/data/forecast/${AREA_CODE}.json`;

function updateClock() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    document.getElementById('date').innerText = now.toLocaleDateString('en-US', options);
    
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').innerText = `${h}:${m}`;
}

async function fetchWeather() {
    try {
        const response = await fetch(WEATHER_URL);
        const data = await response.json();

        // 大分地方（中部）の予報を抽出
        const areaInfo = data[0].timeSeries[0].areas.find(a => a.area.name === "中部");
        const popInfo = data[0].timeSeries[1].areas.find(a => a.area.name === "中部");
        const tempInfo = data[0].timeSeries[2].areas.find(a => a.area.name === "大分");

        // 表示の書き換え
        document.getElementById('weather-desc').innerText = areaInfo.weathers[0].split('　')[0]; // 最初の単語のみ
        document.getElementById('pop').innerText = popInfo.pops[0] + "%";
        
        // 気温の取得（データ構造により取得位置が変わるため調整）
        const currentTemp = tempInfo.temps[0];
        document.getElementById('current-temp').innerText = currentTemp;
        document.getElementById('max-temp').innerText = (tempInfo.temps[1] || "--") + "°";
        document.getElementById('min-temp').innerText = (tempInfo.temps[0] || "--") + "°";

        // 簡易的な時間別予報の生成（デモ用）
        updateHourly();

    } catch (error) {
        console.error("Weather Update Error:", error);
    }
}

function updateHourly() {
    const container = document.getElementById('hourly-container');
    const hours = ["12", "15", "18", "21", "00"];
    container.innerHTML = hours.map(h => `
        <div class="hour-box">
            <div>${h}</div>
            <div class="h-temp">14°</div>
            <div class="h-pop">10%</div>
        </div>
    `).join('');
}

// 初期実行
setInterval(updateClock, 1000);
setInterval(fetchWeather, 600000); // 10分おきに更新
updateClock();
fetchWeather();
