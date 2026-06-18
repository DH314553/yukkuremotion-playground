## 🚀 開発環境セットアップ & ビルド手順

プロジェクト全体の初期化、依存パッケージのインストール、および動画のレンダリング手順です。

### 1. ディレクトリの移動と初期パッケージのインストール
まず、プロジェクトのルートディレクトリで最初の `npm install` を行います。

```bash
# プロジェクトのルートに移動
cd yukkuremotion-playground

# ルート直下の依存パッケージをインストール
npm install

# すべてのフォルダ・ファイルを yukkurivideo 配下に丸ごと上書きコピー
rsync -av node_modules/ out/ public/ transcripts/ editframe-demo/ yukkurivideo/

# yukkurivideo ディレクトリに移動
cd yukkurivideo

# ディレクトリ内での依存パッケージをインストール
npm install


# yukkurivideo ディレクトリ内で実行
npm run build




