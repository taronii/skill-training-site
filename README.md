# スキトレ会員サイト

会員制動画配信サイトです。合言葉による認証で、会員限定のコンテンツ（動画・記事）を提供します。

## 📍 デプロイ済みURL

- **本番サイト**: https://skill-training-site.vercel.app
- **会員ログイン**: https://skill-training-site.vercel.app/login
- **管理者ログイン**: https://skill-training-site.vercel.app/admin/login

## 🔑 アクセス情報

### 会員アクセス
- **合言葉**: `スキトレ2025`

### 管理者アクセス
- **メール**: `admin@example.com`
- **パスワード**: `admin123`

## 🌟 主な機能

### 会員向け機能
- **合言葉認証**: メールで送られる月単位の合言葉でログイン
- **コンテンツ閲覧**: YouTube動画や記事の閲覧
- **カテゴリーフィルタ**: カテゴリー別にコンテンツを絞り込み
- **検索機能**: タイトルでコンテンツを検索
- **レスポンシブデザイン**: スマートフォン・タブレット・PCすべてに対応

### 管理者向け機能
- **コンテンツ管理**: 動画・記事の投稿、編集、削除
- **カテゴリー管理**: カテゴリーの作成、並び替え
- **合言葉管理**: 月単位で合言葉を設定
- **管理者管理**: 複数の管理者アカウントを作成・管理
- **ピックアップ機能**: 重要なコンテンツをトップに表示

## 🚀 技術スタック

- **フレームワーク**: Next.js 15 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Prisma + PostgreSQL (Supabase)
- **認証**: JWT（JSON Web Token）+ jose (Edge Runtime対応)
- **デプロイ**: Vercel
- **画像最適化**: Next.js Image Component

## 🛠 セットアップ

### 前提条件
- Node.js 18以上
- npm または yarn
- PostgreSQLデータベース（Supabase推奨）

### 開発環境の構築

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/taronii/skill-training-site.git
   cd skill-training-site
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **環境変数の設定**
   
   `.env`ファイルを作成:
   ```
   DATABASE_URL="postgresql://..."  # Supabaseの接続文字列
   ```
   
   `.env.local`ファイルを作成:
   ```
   DATABASE_URL="postgresql://..."  # Supabaseの接続文字列
   JWT_SECRET="your-secret-key-min-32-chars"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **データベースのセットアップ**
   ```bash
   # マイグレーションの実行
   npx prisma migrate deploy
   
   # 初期データの投入
   npm run seed:production
   ```

5. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

### 本番環境へのデプロイ

#### Supabaseでのデータベース準備

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. Project Settings → Database → Connection stringから接続情報を取得
3. **重要**: Session pooler用の接続文字列を使用すること

#### Vercelへのデプロイ

1. GitHubリポジトリを作成してコードをプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数を設定:
   - `DATABASE_URL`: Supabase Session pooler接続文字列
   - `JWT_SECRET`: 32文字以上の強力な秘密鍵
   - `NEXT_PUBLIC_APP_URL`: https://your-domain.vercel.app

4. デプロイを実行

#### 初期データの投入

SupabaseのSQL Editorで以下を実行:

```sql
-- 現在の年月の合言葉を作成
INSERT INTO "PassPhrase" (id, phrase, month, year, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'スキトレ2025',
  EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- 管理者を作成（パスワード: admin123）
INSERT INTO "Admin" (id, email, password, name, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2a$10$rBiVs3WLYJvKxKyF6NOsJuMb1UdvRZmWH.TR5NwKAg1llP4ka2ANY',
  '管理者',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- カテゴリを作成
INSERT INTO "Category" (id, name, slug, "order", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'プログラミング', 'programming', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'デザイン', 'design', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'マーケティング', 'marketing', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
```

## 📝 開発コマンド

```bash
# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番モードでの起動
npm start

# 型チェック
npm run type-check

# Lintチェック
npm run lint

# Prisma Studio（データベースGUI）
npm run db:studio

# データベースのマイグレーション
npm run db:migrate

# 本番用シードの実行
npm run seed:production
```

## 🔧 トラブルシューティング

### よくある問題と解決法

#### データベース接続エラー
- Supabaseで必ずSession pooler接続文字列を使用する
- パスワードに特殊文字が含まれる場合はURLエンコードする
- プロジェクトリージョンが正しいか確認（例: ap-northeast-1）

#### ログイン後のリダイレクトループ
- Edge RuntimeでJWT検証にjoseライブラリを使用していることを確認
- 環境変数JWT_SECRETが正しく設定されているか確認

#### 画像が表示されない
- public/thumbnailsディレクトリが存在するか確認
- Next.js Imageコンポーネントのエラーハンドリングが動作しているか確認

#### ビルドエラー
- ESLintエラーは`next.config.ts`で`ignoreDuringBuilds: true`設定済み
- Next.js 15の動的ルートはPromiseベースのparamsを使用

## 📦 プロジェクト構造

```
skill-training-site/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 認証関連ページ
│   │   ├── login/           # 会員ログイン
│   │   └── admin/login/     # 管理者ログイン
│   ├── (protected)/         # 認証必須ページ
│   │   ├── dashboard/       # メインダッシュボード
│   │   ├── content/[id]/    # コンテンツ詳細
│   │   └── admin/           # 管理画面
│   └── api/                 # APIルート
├── components/              # 共通コンポーネント
├── lib/                     # ユーティリティ
├── prisma/                  # データベーススキーマ
├── public/                  # 静的ファイル
└── scripts/                 # ユーティリティスクリプト
```

## 🔐 セキュリティ

- JWT認証によるセッション管理
- bcryptによるパスワードハッシュ化
- レート制限によるAPI保護
- CORS設定による不正アクセス防止
- 環境変数による機密情報の保護

## 🚀 今後の拡張予定

- [ ] メール通知機能
- [ ] 動画のダウンロード制限
- [ ] コメント機能
- [ ] お気に入り機能
- [ ] 視聴履歴
- [ ] アナリティクス機能

## 📞 サポート

問題がある場合は、[Issues](https://github.com/taronii/skill-training-site/issues)に詳細を記載してください。

## 📝 ライセンス

MIT License

---

開発者: taronii
最終更新: 2025年8月2日