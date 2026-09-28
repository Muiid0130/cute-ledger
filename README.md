# 可愛記帳本

小貓記帳本（粉色）與小狗記帳本（薄荷色），手繪風格的個人記帳 App。

- `template.html`：兩本共用的原始碼
- `build.py`：產生 Claude artifact 版（`cat-ledger.html`、`dog-ledger.html`）與獨立 App 版（`docs/`，由 GitHub Pages 發布）
- 資料只存在各自手機裡，請用 App 內「資產 → 資料備份」定期備份。

修改後執行 `python3 build.py`，再 commit、push。
