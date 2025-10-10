@echo off
chcp 65001 >nul
echo.
echo =============================================
echo 📧 邮件发送配置向导
echo =============================================
echo.
echo 请选择您要使用的邮箱服务:
echo.
echo [1] Gmail (Google邮箱)
echo [2] QQ邮箱
echo [3] 163邮箱
echo [4] 跳过配置 (开发模式)
echo.
set /p choice="请输入选项 [1-4]: "

if "%choice%"=="1" goto gmail
if "%choice%"=="2" goto qq
if "%choice%"=="3" goto 163
if "%choice%"=="4" goto skip
goto invalid

:gmail
echo.
echo =============================================
echo 配置 Gmail
echo =============================================
echo.
echo 步骤 1: 开启两步验证
echo   访问: https://myaccount.google.com/security
echo.
echo 步骤 2: 生成应用专用密码
echo   访问: https://myaccount.google.com/apppasswords
echo   生成一个16位的应用专用密码
echo.
echo 步骤 3: 填写信息
echo.
set /p email="请输入您的Gmail地址: "
set /p password="请输入应用专用密码: "
set /p fromname="发件人名称 [默认: 无人机培训平台]: "

if "%fromname%"=="" set fromname=无人机培训平台

echo.
echo 正在添加配置...
(
echo.
echo # SMTP邮件配置 - Gmail
echo SMTP_HOST="smtp.gmail.com"
echo SMTP_PORT=587
echo SMTP_SECURE="false"
echo SMTP_USER="%email%"
echo SMTP_PASS="%password%"
echo SMTP_FROM_NAME="%fromname%"
) >> .env.local

echo.
echo ✅ Gmail配置已添加到 .env.local
goto done

:qq
echo.
echo =============================================
echo 配置 QQ邮箱
echo =============================================
echo.
echo 步骤 1: 开启SMTP服务
echo   1. 登录 https://mail.qq.com
echo   2. 设置 → 账户 → POP3/IMAP/SMTP服务
echo   3. 开启服务并获取授权码
echo.
echo 步骤 2: 填写信息
echo.
set /p email="请输入您的QQ邮箱: "
set /p password="请输入QQ邮箱授权码: "
set /p fromname="发件人名称 [默认: 无人机培训平台]: "

if "%fromname%"=="" set fromname=无人机培训平台

echo.
echo 正在添加配置...
(
echo.
echo # SMTP邮件配置 - QQ邮箱
echo SMTP_HOST="smtp.qq.com"
echo SMTP_PORT=587
echo SMTP_SECURE="false"
echo SMTP_USER="%email%"
echo SMTP_PASS="%password%"
echo SMTP_FROM_NAME="%fromname%"
) >> .env.local

echo.
echo ✅ QQ邮箱配置已添加到 .env.local
goto done

:163
echo.
echo =============================================
echo 配置 163邮箱
echo =============================================
echo.
echo 步骤 1: 开启SMTP服务
echo   1. 登录 https://mail.163.com
echo   2. 设置 → POP3/SMTP/IMAP
echo   3. 开启服务并获取授权码
echo.
echo 步骤 2: 填写信息
echo.
set /p email="请输入您的163邮箱: "
set /p password="请输入163邮箱授权码: "
set /p fromname="发件人名称 [默认: 无人机培训平台]: "

if "%fromname%"=="" set fromname=无人机培训平台

echo.
echo 正在添加配置...
(
echo.
echo # SMTP邮件配置 - 163邮箱
echo SMTP_HOST="smtp.163.com"
echo SMTP_PORT=465
echo SMTP_SECURE="true"
echo SMTP_USER="%email%"
echo SMTP_PASS="%password%"
echo SMTP_FROM_NAME="%fromname%"
) >> .env.local

echo.
echo ✅ 163邮箱配置已添加到 .env.local
goto done

:skip
echo.
echo ℹ️  已跳过邮件配置
echo 邮件将在控制台显示（开发模式）
goto end

:invalid
echo.
echo ❌ 无效的选项，请重新运行脚本
goto end

:done
echo.
echo =============================================
echo 🎉 配置完成！
echo =============================================
echo.
echo 下一步:
echo 1. 重启开发服务器: npm run dev
echo 2. 测试邮件发送: 访问 http://localhost:3000/forgot-password
echo.
echo 详细说明请查看: EMAIL_SETUP_GUIDE.md
echo.

:end
pause

