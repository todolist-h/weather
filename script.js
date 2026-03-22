const AREA_CODE = "440000"; // 大分県
const WEATHER_URL = `https://www.jma.go.jp/bosai/forecast/data/forecast/${AREA_CODE}.json`;

// 天気コードをアイコン（絵文字）に変換する関数
function getWeatherIcon(code) {
    if (code <= 101) return "☀️"; // 晴れ
    if (code <= 110) return "🌤️"; // 時々曇り
    if (code <= 214) return "☁️"; // 曇り
    if (code <= 315) return "☔"; // 雨
    if (code <= 414) return "❄️"; // 雪
    return "☁️";
}

async function fetchWeather() {
    try {
        const response = await fetch(WEATHER_URL);
        const data = await response.json();

        // --- 現在の天気セクション ---
        const area = data[0].timeSeries[0].areas.find(a => a.area.name === "中部");
        const temps = data[0].timeSeries[2].areas.find(a => a.area.name === "大分");
        const pops = data[0].timeSeries[1].areas.find(a => a.area.name === "中部");

        document.getElementById('weather-desc').innerText = area.weathers[0].split('　')[0];
        document.getElementById('current-temp').innerText = temps.temps[0];
        document.getElementById('max-temp').innerText = (temps.temps[1] || "--") + "°";
        document.getElementById('min-temp').innerText = temps.temps[0] + "°";
        document.getElementById('pop').innerText = pops.pops[0] + "%";

        // --- 3時間ごとの予報セクション ---
        // data[1] には時系列の詳細予報が入っています
        const hourlyTimeSeries = data[1].timeSeries[0]; // 時間の配列
        const hourlyCodes = data[1].timeSeries[0].areas.find(a => a.area.name === "中部").weatherCodes;
        const hourlyTemps = data[1].timeSeries[1].areas.find(a => a.area.name === "大分").temps;

        let hourlyHtml = "";
        // 直近5つ分を表示
        for (let i = 0; i < 5; i++) {
            const date = new Date(hourlyTimeSeries.timeDefines[i]);
            const hour = date.getHours();
            const icon = getWeatherIcon(hourlyCodes[i]);
            const temp = hourlyTemps[i];

            hourlyHtml += `
                <div class="hour-box">
                    <div class="h-time">${hour}:00</div>
                    <div class="h-icon">${icon}</div>
                    <div class="h-temp">${temp}°</div>
                </div>
            `;
        }
        document.getElementById('hourly-container').innerHTML = hourlyHtml;

    } catch (error) {
        console.error("Weather Update Error:", error);
    }
}

// 時計と初期実行
function updateClock() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    document.getElementById('date').innerText = now.toLocaleDateString('en-US', options).toUpperCase();
    document.getElementById('clock').innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

setInterval(updateClock, 1000);
setInterval(fetchWeather, 600000); 
updateClock();
fetchWeather();
