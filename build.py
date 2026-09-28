"""產生兩種版本：
  python3 build.py            → cat-ledger.html / dog-ledger.html（Claude artifact 版）
                                 docs/（獨立 App 版，放 GitHub Pages）
"""
import base64, json, os, shutil, subprocess, tempfile, time

THEMES = {
    'dog': dict(name='小狗記帳本', short='小狗記帳', bg='#FFFDF6', url='https://claude.ai/artifact/7N8jkUKZbH6YRV6vfGD5tg', tokens='''  color-scheme: light;
  --paper:#FFFDF6; --grid:#DCEAF5; --ink:#3A3550; --ink-soft:#7B7592;
  --a1:#8FD6BC; --a1-soft:#DDF5EC; --a2:#FFD66E; --a2-soft:#FFF2C9; --a3:#8EC3F0; --tape:#FF9FB8;'''),
    'cat': dict(name='小貓記帳本', short='小貓記帳', bg='#FFF8FA', url='https://claude.ai/artifact/A8WVGeL7VL1qnSsVK4hf6W', tokens='''  color-scheme: light;
  --paper:#FFF8FA; --grid:#FBE1EA; --ink:#4A3346; --ink-soft:#94758C;
  --a1:#FF9DBB; --a1-soft:#FFE4EE; --a2:#FFC9A8; --a2-soft:#FFF0E6; --a3:#D6B8F2; --tape:#C9B3F2;'''),
}
HERE = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(HERE, 'template.html'), encoding='utf-8').read()
stamp = time.strftime('%Y%m%d%H%M%S')

def mascot_uri(k):
    tmp = os.path.join(tempfile.gettempdir(), f'mascot-{k}.jpg')
    subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '-z', '160', '160',
                    os.path.join(HERE, f'icon-{k}.png'), '--out', tmp], check=True, capture_output=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(open(tmp, 'rb').read()).decode()

MASCOTS = {k: mascot_uri(k) for k in THEMES}

def fill(k, mode):
    t = THEMES[k]
    return (src.replace('__MASCOT__', MASCOTS[k]).replace('__NAME__', t['name']).replace('__TOKENS__', t['tokens'])
               .replace('__THEME__', k).replace('__URL__', t['url']).replace('__MODE__', mode))

SW = '''const CACHE = "ledger-%(k)s-%(stamp)s";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("ledger-%(k)s-") && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.pathname.endsWith("/prices.json")) {
    // 股價：先拿最新的，離線時用上次的
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
      .catch(() => caches.match(e.request)));
    return;
  }
  if (e.request.mode === "navigate" || (url.origin === location.origin && url.pathname.endsWith(".html"))) {
    // 頁面：先試網路拿新版，離線時用快取
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("./index.html", c)); return r; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  // 圖示、字體：先用快取，順便更新
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(r => { if (r.ok || r.type === "opaque") { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); } return r; }).catch(() => hit);
    return hit || net;
  }));
});
'''

def build_app(k):
    t = THEMES[k]
    html = fill(k, 'app')
    cut = html.index('<svg width="0" height="0"')
    head, body = html[:cut], html[cut:]
    page = f'''<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="{t['short']}">
<meta name="theme-color" content="{t['bg']}">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="icon" type="image/png" href="icon-192.png">
<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
{head}
</head>
<body>
{body}
<script>if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");</script>
</body>
</html>
'''
    out = os.path.join(HERE, 'docs', k)
    os.makedirs(out, exist_ok=True)
    open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(page)
    manifest = dict(name=t['name'], short_name=t['short'], start_url='./', scope='./', display='standalone',
                    background_color=t['bg'], theme_color=t['bg'], lang='zh-Hant',
                    icons=[dict(src='icon-192.png', sizes='192x192', type='image/png'),
                           dict(src='icon-512.png', sizes='512x512', type='image/png'),
                           dict(src='icon-512.png', sizes='512x512', type='image/png', purpose='maskable')])
    open(os.path.join(out, 'manifest.webmanifest'), 'w', encoding='utf-8').write(json.dumps(manifest, ensure_ascii=False, indent=2))
    open(os.path.join(out, 'sw.js'), 'w', encoding='utf-8').write(SW % dict(k=k, stamp=stamp))
    icon = os.path.join(HERE, f'icon-{k}.png')
    for size, name in [(180, 'apple-touch-icon.png'), (192, 'icon-192.png'), (512, 'icon-512.png')]:
        dst = os.path.join(out, name)
        shutil.copy(icon, dst)
        subprocess.run(['sips', '-z', str(size), str(size), dst], check=True, capture_output=True)

INDEX = '''<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>可愛記帳本</title>
<style>body{margin:0;font-family:"PingFang TC",sans-serif;background:#FFFDF6;color:#3A3550;display:grid;place-items:center;min-height:100vh;padding:24px;box-sizing:border-box}
main{display:grid;gap:18px;max-width:420px;width:100%}h1{margin:0;text-align:center;font-size:24px}
a{display:flex;align-items:center;gap:14px;text-decoration:none;color:inherit;border:2.5px solid #3A3550;border-radius:18px;padding:12px;box-shadow:3px 4px 0 #3A3550;background:#fff;font-size:20px;font-weight:700}
a img{width:64px;height:64px;border-radius:14px}p{margin:0;font-size:14px;color:#7B7592;text-align:center;line-height:1.6}</style></head>
<body><main><h1>選一本記帳本</h1>
<a href="cat/"><img src="cat/icon-192.png" alt="">小貓記帳本</a>
<a href="dog/"><img src="dog/icon-192.png" alt="">小狗記帳本</a>
<p>打開後，在 Safari 按「分享」→「加入主畫面」，就會變成 App。</p></main></body></html>
'''

for k in THEMES:
    open(os.path.join(HERE, f'{k}-ledger.html'), 'w', encoding='utf-8').write(fill(k, 'artifact'))
    build_app(k)
open(os.path.join(HERE, 'docs', 'index.html'), 'w', encoding='utf-8').write(INDEX)
open(os.path.join(HERE, 'docs', '.nojekyll'), 'w').write('')
print('built', stamp)
