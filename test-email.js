// 测试SMTP邮件发送配置
import nodemailer from 'nodemailer';

async function testEmail() {
  console.log('🧪 开始测试SMTP配置...\n');

  // 创建传输器
  const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'vidicoach888@gmail.com',
      pass: 'ydoh rueo pftu qcxk'
    }
  });

  console.log('📧 尝试发送测试邮件...');

  try {
    // 发送测试邮件
    const info = await transporter.sendMail({
      from: '"Vidi Coach Platform" <vidicoach888@gmail.com>',
      to: 'vidicoach888@gmail.com', // 发送给自己测试
      subject: '测试邮件 - SMTP配置验证',
      text: '这是一封测试邮件，用于验证SMTP配置是否正确。',
      html: '<b>这是一封测试邮件</b><p>用于验证SMTP配置是否正确。</p>'
    });

    console.log('✅ 邮件发送成功!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('\n🎉 SMTP配置正确！您可以正常发送邮件。');
  } catch (error) {
    console.error('❌ 邮件发送失败!');
    console.error('   错误类型:', error.name);
    console.error('   错误信息:', error.message);
    console.error('   错误代码:', error.code);
    console.error('\n💡 可能的原因:');
    console.error('   1. 应用专用密码不正确');
    console.error('   2. Gmail账号未开启两步验证');
    console.error('   3. 网络连接问题');
    console.error('   4. Gmail SMTP服务被防火墙阻止');
  }
}

testEmail();
