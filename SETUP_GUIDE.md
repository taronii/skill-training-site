# Supabaseデータベース接続設定ガイド

## データベース接続エラーの解決方法

### 1. Supabaseダッシュボードでの確認

1. [Supabase Dashboard](https://supabase.com/dashboard)にログイン
2. プロジェクトを選択
3. 左メニューから「Settings」→「Database」を選択

### 2. 接続文字列の種類

Vercelでは**Session Pooler**を使用する必要があります：

- **Direct connection**: ローカル開発用
- **Session Pooler**: Vercelなどのサーバーレス環境用（必須）
- **Transaction Pooler**: 特定のユースケース用

### 3. パスワードのリセット手順

1. Database設定ページで「Reset database password」ボタンをクリック
2. 新しいパスワードを設定（英数字と記号を含む強力なもの）
3. パスワードを安全な場所に保存

### 4. 環境変数の形式

```
DATABASE_URL=postgresql://postgres.[プロジェクトID]:[新しいパスワード]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

注意事項：
- `[プロジェクトID]`は実際のプロジェクトIDに置き換え
- `[新しいパスワード]`は設定したパスワードに置き換え
- URLに特殊文字が含まれる場合はURLエンコードが必要

### 5. Vercelでの環境変数更新

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」
4. `DATABASE_URL`の値を更新
5. 「Save」をクリック
6. 再デプロイが自動的に開始される

### 6. 接続テスト

デプロイ後、以下を確認：
1. ログインページにアクセス
2. 正しい合言葉「スキトレ2025」を入力
3. ログインが成功することを確認

### トラブルシューティング

#### 「Authentication failed」エラーの場合
- パスワードが正しいか確認
- 接続文字列のフォーマットを確認
- Session Poolerを使用しているか確認

#### 「Can't reach database server」エラーの場合
- プロジェクトIDが正しいか確認
- リージョン（aws-0-us-west-1）が正しいか確認
- ポート番号（6543）が正しいか確認

#### ローカルでのテスト
```bash
# Direct connectionでテスト
export DATABASE_URL="postgresql://postgres.[プロジェクトID]:[パスワード]@db.[プロジェクトID].supabase.co:5432/postgres"
npm run dev
```