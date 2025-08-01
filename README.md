# スキトレ会員サイト

会員制動画配信サイトです。合言葉による認証で、会員限定のコンテンツ（動画・記事）を提供します。

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

## 🚀 クイックスタート

### 初期設定
```bash
# リポジトリのクローン
git clone https://github.com/your-username/skill-training-site.git
cd skill-training-site

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
cp .env.local.example .env.local

# データベースのセットアップ
npx prisma migrate dev
npx prisma db seed

# 開発サーバーの起動
npm run dev
```

### デフォルトのアクセス情報
- **会員ログイン**: http://localhost:3000/login
  - 合言葉: `スキトレ2025`
- **管理者ログイン**: http://localhost:3000/admin/login
  - メール: `admin@example.com`
  - パスワード: `admin123`

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Prisma + SQLite（開発用）/ PostgreSQL（本番用）
- **認証**: JWT（JSON Web Token）
- **デプロイ**: Vercel

## プロジェクト進捗

### フェーズ1: プロジェクトセットアップと基本構造 ✅

- [x] Next.jsプロジェクトを作成（TypeScript、Tailwind CSS、App Router使用）
- [x] 必要なパッケージをインストール
  - prisma, @prisma/client
  - bcrypt, @types/bcrypt
  - jsonwebtoken, @types/jsonwebtoken
- [x] 基本的なフォルダ構造を作成
  ```
  app/
    (auth)/
      login/
    (protected)/
      dashboard/
      admin/
  components/
  lib/
  prisma/
  ```
- [x] .env.localファイルを作成（DATABASE_URL, JWT_SECRET）
- [x] README.mdを作成

### フェーズ2: データベース設計とPrismaセットアップ ✅

- [x] Prismaスキーマの定義
- [x] マイグレーションの実行
- [x] Prismaクライアントのセットアップ
- [x] 初期データの投入

### フェーズ3: 認証システム（合言葉）✅

- [x] 合言葉入力ページの作成
- [x] 認証APIの実装
- [x] ミドルウェアによる保護
- [x] 認証フックの作成

### フェーズ4: メインUI実装（コンテンツ一覧）✅

- [x] ダッシュボードページ
- [x] コンテンツカードコンポーネント
- [x] タブナビゲーション
- [x] カテゴリーフィルター
- [x] 検索機能

### フェーズ5: コンテンツ詳細ページ ✅

- [x] 動画再生ページ
- [x] 記事表示ページ
- [x] 閲覧数カウント
- [x] 関連コンテンツ表示

### フェーズ6: 管理画面 ✅

- [x] 管理者ログイン
- [x] 管理者管理
- [x] 合言葉管理
- [x] コンテンツ管理
- [x] カテゴリー管理

## 開発環境のセットアップ

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/your-username/skill-training-site.git
   cd skill-training-site
   ```

2. **依存関係のインストール**
   ```bash
   npm install
   ```

3. **環境変数の設定**
   
   `.env`ファイルを作成（Prisma用）:
   ```
   DATABASE_URL="file:./dev.db"
   ```
   
   `.env.local`ファイルを作成（Next.js用）:
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="development-secret-key-change-in-production"
   ```

4. **データベースのセットアップ**
   ```bash
   # マイグレーションの実行
   npx prisma migrate dev
   
   # 初期データの投入
   npx prisma db seed
   ```

5. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   
   ブラウザで `http://localhost:3000` にアクセス

### 開発用コマンド

```bash
# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# 本番モードでの起動
npm start

# コードフォーマット
npm run lint

# 型チェック
npm run type-check

# Prisma Studio（データベースGUI）
npx prisma studio

# データベースのリセットと再シード
npx prisma migrate reset
```

## 🛠 トラブルシューティング

### よくある問題と解決法

#### 1. データベースエラー
```bash
# Prismaクライアントの再生成
npx prisma generate

# マイグレーションの再実行
npx prisma migrate deploy
```

#### 2. 環境変数が読み込まれない
- `.env`と`.env.local`の両方に`DATABASE_URL`が設定されているか確認
- サーバーを再起動

#### 3. ログインできない
- 合言葉が正しいか確認（大文字・小文字を区別）
- 現在の年月の合言葉が設定されているか確認

#### 4. 画像が表示されない
- `next.config.ts`に画像のドメインが許可されているか確認
- YouTubeサムネイルURLが正しいか確認

## 📝 ライセンス

MIT License

## 🤝 貢献

プルリクエストを歓迎します！以下の手順で貢献してください：

1. フォークする
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

問題がある場合は、[Issues](https://github.com/your-username/skill-training-site/issues)に詳細を記載してください。

## データベース構造

### PassPhrase（合言葉）
- `id`: 一意識別子
- `phrase`: 合言葉（ユニーク）
- `month`: 対象月
- `year`: 対象年
- `createdAt`: 作成日時

### Admin（管理者）
- `id`: 一意識別子
- `email`: メールアドレス（ユニーク）
- `password`: パスワード（ハッシュ化）
- `name`: 名前
- `createdAt`: 作成日時

### Category（カテゴリー）
- `id`: 一意識別子
- `name`: カテゴリー名
- `slug`: URLスラッグ（ユニーク）
- `order`: 表示順
- `createdAt`: 作成日時
- `contents`: 関連コンテンツ

### Content（コンテンツ）
- `id`: 一意識別子
- `title`: タイトル
- `type`: タイプ（VIDEO/ARTICLE）
- `youtubeUrl`: YouTube URL（動画の場合）
- `articleContent`: 記事内容（記事の場合）
- `thumbnail`: サムネイル画像パス
- `categoryId`: カテゴリーID
- `viewCount`: 閲覧数
- `isPinned`: ピン留めフラグ
- `publishedAt`: 公開日時
- `createdAt`: 作成日時

### Session（セッション）
- `id`: 一意識別子
- `token`: セッショントークン（ユニーク）
- `validUntil`: 有効期限
- `createdAt`: 作成日時

## Prismaコマンド

```bash
# データベースの確認（GUI）
npx prisma studio

# マイグレーションの作成
npx prisma migrate dev --name <migration-name>

# Prismaクライアントの再生成
npx prisma generate

# データベースのリセット
npx prisma migrate reset
```

## 初期データ

seedスクリプトにより以下のデータが投入されます：
- 管理者アカウント: `admin@example.com` / `admin123`
- 今月の合言葉: `スキトレ2025`
- カテゴリー: プログラミング基礎、Web開発、データベース
- サンプルコンテンツ: 動画2件、記事2件

## 認証システム

### 合言葉認証フロー

1. ユーザーが `/login` ページで合言葉を入力
2. APIで現在の年月の合言葉と照合
3. 正しければJWTトークンを発行し、Cookieに保存（月末まで有効）
4. 保護されたルートへのアクセス時にミドルウェアでトークンを検証

### 保護されたルート

以下のルートは認証が必要です：
- `/dashboard` - メインダッシュボード
- `/admin` - 管理画面
- `/content` - コンテンツ詳細

### APIエンドポイント

- `POST /api/auth/passphrase` - 合言葉認証
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/check` - 認証状態確認

### エラーメッセージ

合言葉が間違っている場合：
「合言葉が違います！メールに送られた合言葉を確認してね！」

## メインUI（ダッシュボード）

### コンポーネント構成

- **DashboardPage** (`app/(protected)/dashboard/page.tsx`)
  - メインのダッシュボードページ
  - タブ切り替え、カテゴリーフィルター、検索機能を統合
  
- **ContentCard** (`components/ContentCard.tsx`)
  - サムネイル表示カード
  - 動画/記事タイプアイコン、カテゴリータグ、閲覧数表示
  - ピックアップバッジ表示
  
- **TabNavigation** (`components/TabNavigation.tsx`)
  - 新着/人気/ピックアップのタブ切り替え
  
- **CategoryFilter** (`components/CategoryFilter.tsx`)
  - カテゴリーによるフィルタリング
  - 動的にカテゴリーを取得して表示
  
- **SearchBar** (`components/SearchBar.tsx`)
  - リアルタイム検索（デバウンス機能付き）

### APIエンドポイント

- `GET /api/contents` - コンテンツ一覧取得
  - クエリパラメータ: `tab`, `category`, `search`
  - フィルタリングとソート機能
  
- `GET /api/categories` - カテゴリー一覧取得
  
- `POST /api/contents/[id]/view` - 閲覧数カウント

### UI特徴

- モバイルファースト設計（スマホ2列レイアウト）
- ダークテーマ（背景: gray-900、カード: gray-800）
- レスポンシブ対応（sm: 3列、md: 4列）
- ホバーエフェクト付きカード

## コンテンツ詳細ページ

### ページ構成

- **ContentDetailPage** (`app/(protected)/content/[id]/page.tsx`)
  - 動画再生・記事閲覧ページ
  - レスポンシブレイアウト（モバイル: 1列、デスクトップ: 2/3 + 1/3）
  - 自動閲覧数カウント

### 機能

#### YouTube動画埋め込み
- YouTube URLから自動で埋め込みコードを生成
- 対応URL形式:
  - youtube.com/watch?v=VIDEO_ID
  - youtu.be/VIDEO_ID
  - m.youtube.com/watch?v=VIDEO_ID
- レスポンシブな動画プレイヤー（16:9アスペクト比）

#### 記事表示
- HTMLコンテンツの表示
- Tailwind Prose スタイリング
- ダークモード対応

#### 関連コンテンツ
- 同じカテゴリーの他のコンテンツを最大4件表示
- 現在のコンテンツは除外
- サイドバーに縮小表示

### APIエンドポイント

- `GET /api/contents/[id]` - 個別コンテンツ取得
- `POST /api/contents/[id]/view` - 閲覧数インクリメント

### ユーティリティ

**youtube.ts** (`lib/youtube.ts`)
- `extractYouTubeId()` - URLから動画IDを抽出
- `getYouTubeEmbedUrl()` - 埋め込みURLを生成
- `isValidYouTubeUrl()` - URLバリデーション
- `getYouTubeThumbnail()` - サムネイルURL取得

## 管理画面

### 管理者認証

- **管理者ログインページ** (`app/(auth)/admin/login/page.tsx`)
  - メールアドレスとパスワードでログイン
  - JWT認証（24時間有効）
  - 専用のadmin-tokenをCookieに保存

### 管理画面レイアウト

- **AdminLayout** (`app/(protected)/admin/layout.tsx`)
  - サイドナビゲーション付きレイアウト
  - ダッシュボード、コンテンツ管理、合言葉管理、管理者管理へのリンク
  - ログアウト機能

### 管理機能

#### 管理者管理
- **AdminsManagementPage** (`app/(protected)/admin/admins/page.tsx`)
  - 管理者一覧表示
  - 新規管理者追加（名前、メールアドレス、パスワード）
  - 管理者削除（最後の1人は削除不可）

#### 合言葉管理
- **PassphraseManagementPage** (`app/(protected)/admin/passphrase/page.tsx`)
  - 合言葉一覧表示（年月順）
  - 新規合言葉追加（合言葉、年、月）
  - 現在の合言葉をハイライト表示
  - 合言葉削除

### 管理者用APIエンドポイント

- `POST /api/auth/admin` - 管理者ログイン
- `DELETE /api/auth/admin` - 管理者ログアウト
- `GET /api/admin/admins` - 管理者一覧取得
- `POST /api/admin/admins` - 管理者追加
- `DELETE /api/admin/admins/[id]` - 管理者削除
- `GET /api/admin/passphrase` - 合言葉一覧取得
- `POST /api/admin/passphrase` - 合言葉追加
- `DELETE /api/admin/passphrase/[id]` - 合言葉削除

### ミドルウェア更新

管理者ルート（`/admin`）へのアクセスには管理者トークンが必要：
- 管理者トークンがない場合は `/admin/login` へリダイレクト
- 一般ユーザーのトークンでは管理画面にアクセス不可

#### コンテンツ管理
- **ContentsManagementPage** (`app/(protected)/admin/contents/page.tsx`)
  - コンテンツ一覧表示（サムネイル、タイトル、タイプ、カテゴリー、閲覧数、ステータス）
  - 検索機能
  - ピックアップ設定の切り替え
  - 編集・削除機能
  
- **NewContentPage** (`app/(protected)/admin/contents/new/page.tsx`)
  - 新規コンテンツ投稿フォーム
  - 動画/記事タイプ選択
  - YouTube URL入力で自動サムネイル取得
  - 記事コンテンツエディタ（HTML/Markdown対応）
  - カテゴリー選択
  - ピックアップ設定
  - 公開日時設定（空欄で即時公開）

- **EditContentPage** (`app/(protected)/admin/contents/[id]/edit/page.tsx`)
  - 既存コンテンツの編集
  - タイプは変更不可
  - その他は新規投稿と同様の機能

#### カテゴリー管理
- **CategoriesManagementPage** (`app/(protected)/admin/categories/page.tsx`)
  - カテゴリー一覧表示
  - 新規カテゴリー追加（名前、スラッグ）
  - カテゴリー編集
  - カテゴリー削除（コンテンツが存在しない場合のみ）
  - 表示順の並び替え（上下矢印）

### コンテンツ管理用APIエンドポイント

- `GET /api/admin/contents` - コンテンツ一覧取得（管理画面用）
- `POST /api/admin/contents` - コンテンツ作成
- `GET /api/admin/contents/[id]` - 個別コンテンツ取得
- `PUT /api/admin/contents/[id]` - コンテンツ更新
- `PATCH /api/admin/contents/[id]` - コンテンツ部分更新（ピン留め等）
- `DELETE /api/admin/contents/[id]` - コンテンツ削除
- `GET /api/admin/categories` - カテゴリー一覧取得（管理画面用）
- `POST /api/admin/categories` - カテゴリー作成
- `PUT /api/admin/categories/[id]` - カテゴリー更新
- `PATCH /api/admin/categories/[id]` - カテゴリー部分更新（順序変更）
- `DELETE /api/admin/categories/[id]` - カテゴリー削除

## 本番環境へのデプロイ

### PostgreSQLへの移行

本番環境ではPostgreSQLの使用を推奨します。以下の手順で移行してください：

1. **PostgreSQLデータベースの準備**
   - Supabase、Neon、Railway、Render等のマネージドPostgreSQLサービスを利用
   - または独自のPostgreSQLサーバーをセットアップ

2. **接続文字列の取得**
   ```
   postgresql://username:password@host:port/database?schema=public
   ```

3. **Prismaスキーマの更新**
   `prisma/schema.prisma`のproviderを更新：
   ```prisma
   datasource db {
     provider = "postgresql"  // sqliteからpostgresqlに変更
     url      = env("DATABASE_URL")
   }
   ```

4. **環境変数の設定**
   本番環境の環境変数に以下を設定：
   ```
   DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
   JWT_SECRET="本番用の強力な秘密鍵（32文字以上推奨）"
   NEXT_PUBLIC_APP_URL="https://your-domain.com"
   ```

5. **マイグレーションの実行**
   ```bash
   # 開発環境でマイグレーションファイルを生成
   npx prisma migrate dev --name init_postgres
   
   # 本番環境でマイグレーションを適用
   npx prisma migrate deploy
   ```

6. **初期データの投入**
   本番環境で初期管理者と合言葉を作成：
   ```bash
   npx prisma db seed
   ```

### Vercelへのデプロイ

1. **GitHubリポジトリの作成**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/skill-training-site.git
   git push -u origin main
   ```

2. **Vercelプロジェクトの作成**
   - [Vercel](https://vercel.com)にログイン
   - "New Project"をクリック
   - GitHubリポジトリをインポート

3. **環境変数の設定**
   Vercelのプロジェクト設定で以下の環境変数を追加：
   - `DATABASE_URL`: PostgreSQL接続文字列
   - `JWT_SECRET`: 強力な秘密鍵
   - `NEXT_PUBLIC_APP_URL`: デプロイされるURL

4. **デプロイ**
   - "Deploy"ボタンをクリック
   - 自動的にビルドとデプロイが実行されます

### セキュリティ設定

本番環境では以下のセキュリティ対策が適用されます：

- **環境変数の検証**: 必須の環境変数が設定されているか自動チェック
- **CORS設定**: 指定されたオリジンからのアクセスのみ許可
- **レート制限**: APIエンドポイントへの過剰なアクセスを制限
- **HTTPSヘッダー**: セキュリティ関連のHTTPヘッダーを自動設定
- **JWTトークン**: 本番環境では32文字以上の強力な秘密鍵を使用

### パフォーマンス最適化

以下の最適化が実装されています：

- **画像最適化**: Next.js Imageコンポーネントによる自動最適化
- **APIキャッシュ**: 頻繁にアクセスされるデータの自動キャッシュ
- **エッジ関数**: Vercelのエッジネットワークを活用した高速レスポンス

### エラー監視

本番環境でのエラー監視には以下のサービスの利用を推奨：

- Sentry
- LogRocket
- Datadog

`lib/logger.ts`のログ出力は構造化されているため、これらのサービスと簡単に統合できます。

### カスタムドメインの設定

1. Vercelプロジェクトの「Settings」→「Domains」
2. カスタムドメインを追加
3. DNSレコードを設定（CNAME or Aレコード）
4. SSL証明書は自動的に発行されます

### 運用上の注意点

- **バックアップ**: PostgreSQLデータベースの定期バックアップを設定
- **モニタリング**: Vercelのダッシュボードでアクセス状況を監視
- **スケーリング**: トラフィックに応じて自動的にスケール
- **アップデート**: 依存関係の定期的な更新（`npm audit`の実行）

### 推奨される運用フロー

1. **毎月の合言葉更新**
   - 毎月末に翌月の合言葉を設定
   - メールで会員に通知

2. **コンテンツ更新スケジュール**
   - 定期的に新しいコンテンツを追加
   - ピックアップコンテンツを定期的に入れ替え

3. **アクセス解析**
   - 人気コンテンツの分析
   - カテゴリー別の閲覧傾向の把握