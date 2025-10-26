// --- 404S detection core ---
(async function detect404S(){
    const allowedPaths = ['/index.html', '/404.html', '/', ''];
    let isBlocked = false;

    async function parseTopCode(text) {
        if (!text) return '';
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const codeLine = lines.find(l => /^CODE:/i.test(l));
        return codeLine ? (codeLine.split(':')[1] || '').trim() : '';
    }

    async function checkNow() {
        if (!navigator.onLine) return;
        try {
            const res = await fetch('https://https://nice.code-faction.gleeze.com/info.txt?ts=' + Date.now(), { cache: 'no-store', headers: { 'Accept': 'text/plain' } });
            if (!res.ok) return;
            const text = await res.text();
            const code = await parseTopCode(text);
            if (code === '404S') {
                if (!isBlocked) {
                    isBlocked = true;
                    console.warn('[404S] Site restriction activated.');
                }
                if (!allowedPaths.includes(location.pathname)) {
                    try { location.replace('/index.html'); } catch(e){}
                }
            } else {
                if (isBlocked) {
                    isBlocked = false;
                    console.log('[404S] Restriction cleared.');
                }
            }
        } catch(e) {
            console.error('[404S check error]', e);
        }
    }

    (function pollLoop(){
        checkNow().finally(()=>{
            const next = 5000 + Math.random() * 5000;
            setTimeout(pollLoop, next);
        });
    })();
})();
