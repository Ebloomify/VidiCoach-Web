@echo off
echo ========================================
echo   Vidi Coach - Docker 数据库启动脚本
echo ========================================
echo.

echo [1/4] 检查Docker是否运行...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker未安装或未运行
    echo 请先安装并启动Docker Desktop
    pause
    exit /b 1
)
echo ✅ Docker已就绪

echo.
echo [2/4] 启动PostgreSQL数据库...
docker-compose up -d postgres
if errorlevel 1 (
    echo ❌ 数据库启动失败
    pause
    exit /b 1
)

echo.
echo [3/4] 等待数据库就绪...
timeout /t 5 /nobreak >nul
docker-compose exec -T postgres pg_isready -U postgres
if errorlevel 1 (
    echo ⏳ 数据库正在初始化，请稍候...
    timeout /t 5 /nobreak >nul
)

echo.
echo [4/4] 检查数据库状态...
docker-compose ps postgres

echo.
echo ========================================
echo   数据库启动完成！
echo ========================================
echo.
echo 📊 数据库信息:
echo   - 地址: localhost:5432
echo   - 用户名: postgres
echo   - 密码: postgres
echo   - 数据库: db
echo.
echo 🔧 下一步操作:
echo   1. 运行: npx prisma generate
echo   2. 运行: npx prisma db push
echo   3. 运行: npm run dev
echo.
echo 💡 提示:
echo   - 查看日志: docker-compose logs -f postgres
echo   - 停止数据库: docker-compose stop
echo   - 管理界面: http://localhost:5050
echo.
pause
