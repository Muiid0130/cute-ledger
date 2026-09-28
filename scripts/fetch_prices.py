"""抓證交所（上市）與櫃買中心（上櫃）全部股票、ETF 的當日收盤價，寫到 docs/prices.json。
由 GitHub Actions 每個交易日收盤後執行，也可以手動跑：python3 scripts/fetch_prices.py
"""
import datetime, json, os, re, time, urllib.request

SOURCES = [
    ("https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_ALL", "Code", "Name", "ClosingPrice", "Change"),
    ("https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes", "SecuritiesCompanyCode", "CompanyName", "Close", "Change"),
]
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "docs", "prices.json")

def num(v):
    try:
        return round(float(str(v).replace(",", "").strip()), 4)
    except ValueError:
        return None

def roc_to_iso(d):
    d = str(d).strip()
    return f"{int(d[:-4]) + 1911}-{d[-4:-2]}-{d[-2:]}" if len(d) >= 7 else None

def download(url, tries=5):
    """國外主機連台灣網站偶爾會斷線，多試幾次。"""
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "cute-ledger-price-bot", "Accept-Encoding": "identity"})
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read())
        except Exception as e:
            print(f"第 {i + 1} 次下載失敗：{e}")
            time.sleep(10 * (i + 1))
    return None

old = json.load(open(OUT, encoding="utf-8")) if os.path.exists(OUT) else {}
quotes, dates, ok = dict(old.get("quotes", {})), [], 0   # 抓不到的來源沿用上次的價格
for url, k_code, k_name, k_close, k_chg in SOURCES:
    rows = download(url)
    if rows is None:
        print(f"{url}: 放棄，沿用上次的價格")
        continue
    ok += 1
    for r in rows:
        code, close = str(r.get(k_code, "")).strip().upper(), num(r.get(k_close))
        # 只留一般股票（4 碼數字）和 ETF（00 開頭），略過權證等
        if not close or not re.fullmatch(r"\d{4}|00\d{2,4}[A-Z]?", code):
            continue
        chg = num(r.get(k_chg))
        prev = round(close - chg, 4) if chg is not None else None
        quotes[code] = [close, prev, str(r.get(k_name, "")).strip()]
        if r.get("Date"):
            dates.append(roc_to_iso(r["Date"]))
    print(f"{url}: {len(rows)} 筆")

if not ok:
    raise SystemExit("兩個來源都抓不到，這次不更新")
if len(quotes) < 500:
    raise SystemExit(f"只抓到 {len(quotes)} 檔，資料可能有問題，這次不更新")

data = {"date": max([d for d in dates if d] or [old.get("date")]), "updated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        "quotes": dict(sorted(quotes.items()))}
if old.get("date") == data["date"] and old.get("quotes") == data["quotes"]:
    print("價格沒有變，不用更新")
else:
    json.dump(data, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(f"已更新 {len(quotes)} 檔，資料日期 {data['date']}")
