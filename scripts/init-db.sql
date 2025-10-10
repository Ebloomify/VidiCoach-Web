-- 初始化数据库脚本
-- 这个脚本会在数据库首次启动时自动执行

-- 设置时区
SET timezone = 'Asia/Shanghai';

-- 创建扩展（如果需要）
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 输出初始化信息
SELECT 'Database initialized successfully!' AS message;
SELECT version() AS postgres_version;
