# カードカウンティングツール

React + TypeScript + Vite で構築した、48 枚デッキ用のシンプルなカウンティング & 期待値計算ツールです。UI は CSS Modules とシンプルなカスタムデザインで構成しており、完全静的なフロントエンドとしてホスティング可能です。

## 機能ハイライト

- 仕様に沿った 32 種類のカード定義を 1 箇所で管理
- 各シリーズをセクション分けし、1 枚ずつ色付きボタンを ON/OFF 切り替えして残り枚数を表現
- 「みんなの大好物」「救済系」など条件付きカードをチェックボックス & ラジオボタンで制御
- 「季節の変わり目」ボタンでワンクリックリセット（条件は維持）
- 次の 1 枚で得られる資源期待値、アイテム確率、再行動確率、資源が 1/2/3 枚以上得られる確率をまとめて表示
- アイテム確率・再行動確率・期待値計算は `calculateStats` に切り出し、Vitest で単体テスト済み

## 主要技術

- React 19 + TypeScript
- Vite 7
- CSS Modules（モダン UI のためにカスタムスタイリング）
- Vitest

## セットアップ

```bash
npm install
npm run dev   # ローカル開発サーバー
npm run test  # 期待値計算ロジックのユニットテスト
npm run lint  # ESLint
npm run build # 本番ビルド
```

## プロジェクト構成

- `src/data/cardDefinitions.ts` … カードデータと初期デッキ生成
- `src/utils/calculateStats.ts` … 期待値 / 確率の共通計算ロジック
- `src/components/*` … CardGrid・ConditionPanel・StatsPanel など UI コンポーネント
- `src/utils/calculateStats.test.ts` … go-again 系や初期デッキの挙動を確認するテスト

## 備考

- 画像は `/cards/xxx.png` のパスのみ定義し、存在しない場合はプレースホルダーを表示します。
- 「季節の変わり目」ボタンはカウンティング状態のみリセットし、条件チェックはリセットしません。
- 「いってきまーす！」系カードは 1 回だけ追加ドローを期待値に組み込む簡易モデルを採用しています。
