RevonAs — 1ファイル完結版（Vercel用）

これは index.html 単体で完結しています（CSS・JS・ロゴをすべて内蔵）。
どんなアップロード方法でも、この1ファイルがあれば正しく表示されます。

■ Vercel（ドラッグ&ドロップ / アップロード）
  この revonas-deploy フォルダごと、または index.html を1つアップロードするだけ。

■ Vercel（GitHub連携）
  index.html をリポジトリ直下に置いて push。Framework Preset は Other。

※ アニメ用ライブラリ（GSAP / Lenis / SplitType）とフォントはCDN読込です。
  読み込めない環境でも、内容とレイアウトは表示されるフォールバック実装済み。
