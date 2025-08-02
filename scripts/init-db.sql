-- 初期データ投入スクリプト
-- SupabaseのSQL Editorで実行してください

-- 1. 現在の年月の合言葉を作成
INSERT INTO "PassPhrase" (id, phrase, month, year, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'スキトレ2025',
  EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
  EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (phrase, month, year) DO NOTHING;

-- 2. 管理者アカウントを作成（パスワード: admin123）
INSERT INTO "Admin" (id, email, password, name, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  '$2a$10$rBiVs3WLYJvKxKyF6NOsJuMb1UdvRZmWH.TR5NwKAg1llP4ka2ANY',
  '管理者',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- 3. 初期カテゴリを作成
INSERT INTO "Category" (id, name, slug, "order", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'プログラミング', 'programming', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'デザイン', 'design', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'マーケティング', 'marketing', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO NOTHING;

-- 4. データが正しく挿入されたか確認
SELECT * FROM "PassPhrase" WHERE month = EXTRACT(MONTH FROM CURRENT_DATE) AND year = EXTRACT(YEAR FROM CURRENT_DATE);
SELECT * FROM "Admin";
SELECT * FROM "Category" ORDER BY "order";