# RevonAs — Vercel 静的プレビュー（ビルド不要）

このリポジトリは **素の静的HTML** です。React/Vite/Next.js は使っていません。
`index.html` 1枚に **CSS・JS・ロゴをすべて内蔵**しているため、ビルド工程なしでそのまま表示されます。

```
revonas-vercel/
├── index.html     # スタイル内蔵の完結ファイル（これだけで表示される）
├── vercel.json    # 「ビルドしない・ルートを配信する」を明示
└── .gitignore
```

---

## 白画面になっていた原因

1. **デプロイが古いコミットのまま**（例: `eec3073` / 2日前）。新しいファイルを push しても、
   コミットが変わっていないと Vercel は再デプロイしません。→ 必ず「新しいコミット」を作って push。
2. 古いコミットの `index.html` が **外部の `css/style.css` と `js/main.js` を参照する分割版**だった。
   その2ファイルがサーバー上に無いため 404 になり、スタイルが当たらず「白背景に文字だけ」に。
3. Vercel 側に不要な **Framework/Build 設定**が残っていると、存在しない出力先を配信して白画面になり得る。

→ このリポジトリでは (1) 完結版 index.html、(2) 外部参照ゼロ、(3) vercel.json でビルド無効化、で全て解消します。

## チェック項目への回答

| # | 項目 | 状態 |
|---|---|---|
| 1 | Vercelで正しく表示される構成か | ✅ ルート直下 `index.html` を静的配信。完結ファイルなので確実に表示 |
| 2 | package.json の scripts | ✅ **package.json は無し**（静的サイトなので不要。これが正しい） |
| 3 | build command | ✅ **不要**（`vercel.json` で `buildCommand: null`） |
| 4 | output directory | ✅ ルート（`.`）。`vercel.json` の `outputDirectory: "."` |
| 5 | CSS / JS の読み込み | ✅ すべて `index.html` に内蔵。外部ローカル参照ゼロ（404が起きない） |
| 6 | index.html / src / public / dist 構成 | ✅ ルートに `index.html` のみ。src/public/dist は不使用（混在なし） |
| 7 | React / Vite / Next.js 設定ミス | ✅ **いずれも未使用**。フレームワーク設定自体が存在しないので競合しない |
| 8 | Console エラー | ✅ ローカル404なし。外部CDN(GSAP等)が万一読めなくても、内容表示のフォールバック実装済み |
| 9 | 再デプロイでTOP正常表示 | ✅ 下記手順で新コミットを push すれば表示されます |

補足：アニメ用ライブラリ（GSAP / ScrollTrigger / Lenis / SplitType）とWebフォントのみ CDN 読み込みです。
これらは表示の必須要件ではなく、読めない場合もレイアウトと内容は表示されます（`prefers-reduced-motion` 対応）。

---

## Vercel 側の設定（Project → Settings → Build & Deployment）

| 設定 | 値 |
|---|---|
| Framework Preset | **Other** |
| Build Command | **（空 / Override オフ）** |
| Output Directory | **（空のまま。ルート配信）** ※`vercel.json` の `outputDirectory: "."` が効きます |
| Install Command | **（空 / Override オフ）** |
| Root Directory | **（空 = リポジトリ直下）** |

> もし以前 Vite/Next などの Preset や Build Command が設定されていたら、必ず上記に戻してください。
> これが残っていると白画面の原因になります。

## 再デプロイ手順

### A. GitHub 連携（推奨）
```bash
# このフォルダの中身で、リポジトリのルートを置き換える
#   - 既存の index.html を、この完結版 index.html に差し替え
#   - css/ js/ assets/ など旧ファイルは削除してOK（残っても無視されます）
git add -A
git commit -m "fix: self-contained static index for Vercel"   # ← 新しいコミットが重要
git push
```
push すると Vercel が自動で新デプロイを作成します（コミットハッシュが変われば反映されます）。

### B. Vercel へ直接アップロード
Vercel のプロジェクトで **Deploy / Upload** から、この `revonas-vercel` フォルダ（または `index.html` 1つ）をアップロード。

### 反映後の確認
- ブラウザを **Ctrl / Cmd + Shift + R** で強制リロード（キャッシュ回避）。
- Vercel の「デプロイメント」で、**最新の日時・新しいコミットハッシュ**になっているか確認。
  `eec3073`(2日前) のままなら、まだ新デプロイが走っていません。

---

## この先（WordPress実装）
最終目的は WordPress オリジナルテーマ化です。現段階は Vercel で見た目確認を最優先にしています。
テーマ化の際は、この1枚を `template-parts` に分割し、ACF でTOPコピー/サービス/強み/会社情報/採用等を編集可能にします。

© 2026 RevonAs Inc.
