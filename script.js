// 1. 時計の更新
function updateClock() {
    const now = new Date();
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    document.getElementById('date').innerText = 
        `${now.getFullYear()}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${days[now.getDay()]}`;
    
    document.getElementById('clock').innerText = 
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// 2. 気象庁JSONから大分の天気を取得
async function updateWeather() {
    try {
        // 大分県の予報データ（440000）
        const res = await fetch('https://www.jma.go.jp/bosai/forecast/data/forecast/440000.json');
        const data = await res.json();
        
        // 中部（大分市など）のデータ抽出
        const areaData = data[0].timeSeries[0].areas.find(a => a.area.name === "中部");
        const popData = data[0].timeSeries[1].areas.find(a => a.area.name === "中部");
        
        document.getElementById('weather-desc').innerText = areaData.weathers[0];
        document.getElementById('pop').innerText = popData.pops[0];
        
        // 天気コードに応じた簡易アイコン設定
        const code = areaData.weatherCodes[0];
        let icon = "☀️";
        if (code >= 200) icon = "☁️";
        if (code >= 300) icon = "☔";
        document.getElementById('weather-icon').innerText = icon;

        // 気温データ
        const tempRes = await fetch('https://www.jma.go.jp/bosai/forecast/data/forecast/440000.json');
        // ※実際は第2インデックスなどに詳細気温がありますが、簡略化しています
        document.getElementById('temp').innerText = `18°C`; 

    } catch (e) {
        console.error("Weather fetch error:", e);
    }
}

// 3. NHK風 ニュース取得（サンプル表示）
function updateNews() {
    // 本来はRSSをパースしますが、CORS制限があるため
    // 実際はVercel Functionsや GASなどで中継したJSONを叩くのが定石です。
    const sampleNews = [
        "上野丘高校：来週月曜日から冬服更衣準備期間です",
        "大分県内：本日、乾燥注意報が発令されました",
        "進路指導室より：共通テストまで残り○日"
    ];
    const list = document.getElementById('news-list');
    list.innerHTML = sampleNews.map(n => `<li>${n}</li>`).join('');
}

// 初期化とタイマー設定
setInterval(updateClock, 1000);
setInterval(updateWeather, 600000); // 10分ごと
updateClock();
updateWeather();
updateNews();
