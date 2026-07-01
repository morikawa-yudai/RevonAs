# RevonAs — Corporate Site

「中小企業の、営業部になる。」
RevonAs株式会社のコーポレートサイト。デザインコンセプトは **A案 / Luxury × Brand**（明るいギャラリー基調 × 黒のチャプター、上質でテクノロジー感のある演出）。

現段階は **静的プロトタイプ**（HTML / CSS / JS）です。GitHub → Vercelプレビュー → WordPressオリジナルテーマ実装、という順で進めます。

---

## 構成

```
revonas-site/
├── index.html            # 1ページ構成（TOP/ABOUT/BUSINESS/STRENGTH/FLOW/RECRUIT/COMPANY/CONTACT）
├── css/
│   └── style.css         # デザイントークン・全レイアウト・ギミック
├── js/
│   └── main.js           # Lenis / GSAP / SplitType 制御、ギミック、フォールバック
├── assets/
│   ├── logo-lockup.png       # ロゴ（黒／ヘッダー・ローディング用）
│   ├── logo-lockup-white.png # ロゴ（白／フッター用）
│   ├── logo-mark.png         # Rマーク（黒／TOPヒーロー用）
│   └── logo-mark-white.png   # Rマーク（白／将来用）
├── vercel.json
├── .gitignore
└── README.md
```

外部ライブラリは CDN 読み込み（GSAP / ScrollTrigger / Lenis / SplitType）。ネット不通時やライブラリ未読込でも内容は表示されるフォールバックを実装済み。`prefers-reduced-motion` にも対応。

## ローカル確認

`index.html` を直接ブラウザで開くだけでも動きます。相対パス・フォント読込を確実にするなら簡易サーバー推奨：

```bash
# どちらでも
python3 -m http.server 5173
npx serve .
```

## GitHub へ push

```bash
# リポジトリ直下（このフォルダ）で
git add -A
git commit -m "feat: RevonAs site (concept A)"   # 初回コミットは作成済み

# A) GitHub CLI がある場合
gh repo create revonas-site --private --source=. --remote=origin --push

# B) 手動でリモート作成後
git remote add origin git@github.com:<YOUR_ACCOUNT>/revonas-site.git
git branch -M main
git push -u origin main
```

## Vercel プレビュー

1. Vercel で **Add New → Project → Import** から本リポジトリを選択
2. Framework Preset は **Other**（ビルド不要の静的サイト）／Root は直下のまま
3. Deploy。以降 push ごとにプレビューURLが自動生成されます

## 次のステップ：WordPress オリジナルテーマ化

現在の1ページを、編集可能なテーマへ分解する想定です。

| 現セクション | テンプレート | 主なACFフィールド |
|---|---|---|
| TOP hero | `template-parts/hero.php` | キャッチ2行 / サブコピー / CTA |
| ABOUT | `template-parts/about.php` | 見出し / 本文 / 由来テキスト |
| BUSINESS | `template-parts/business.php` | サービス（繰り返し：EN/和名/説明/タグ） |
| STRENGTH | `template-parts/strength.php` | 強み（繰り返し：番号/見出し/説明） |
| FLOW | `template-parts/flow.php` | ステップ（繰り返し） |
| RECRUIT | `template-parts/recruit.php` | 見出し / 本文 / エントリーリンク |
| COMPANY | `template-parts/company.php` | 会社情報（キー・バリュー） |
| CONTACT | `template-parts/contact.php` | 送信先 / 項目 |

カスタム投稿タイプ（予定）：`news`（お知らせ）/ `works`（実績）/ `recruit`（採用）/ `case`（導入事例）。
SEO：`<head>` に メタ / OGP / 構造化データ(Organization) 実装済み。テーマ化時に各ページ動的化。

## メモ

- 実績数字（商談化率 等）は現状オミット。必要になればACFで追加可能な設計。
- 写真素材は未挿入（タイポグラフィ中心）。挿入時は「都市・オフィス・データ・AI」等、人物は最小限の方針。
- ロゴマーク（Rマーク）はブランド方針によりTOPヒーローのみで使用。

© 2026 RevonAs Inc. All rights reserved.
