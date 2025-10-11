// 验证码生成和验证工具

/**
 * 生成随机6位数字验证码
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * 验证码存储接口
 * 注意：在生产环境中，应该使用Redis或数据库存储验证码
 */
interface VerificationCodeData {
  code: string
  email: string
  expiresAt: number
  createdAt: number
}

// 临时存储（仅用于开发）
// 生产环境应使用Redis或数据库
const verificationCodes = new Map<string, VerificationCodeData>()

/**
 * 保存验证码
 * @param email 邮箱地址
 * @param code 验证码
 * @param expiresInMinutes 过期时间（分钟），默认15分钟
 */
export function saveVerificationCode(
  email: string,
  code: string,
  expiresInMinutes: number = 15
): void {
  const now = Date.now()
  const expiresAt = now + expiresInMinutes * 60 * 1000

  verificationCodes.set(email.toLowerCase(), {
    code,
    email: email.toLowerCase(),
    expiresAt,
    createdAt: now
  })

  // 清理过期的验证码
  cleanExpiredCodes()
}

/**
 * 验证验证码
 * @param email 邮箱地址
 * @param code 验证码
 * @returns 验证结果
 */
export function verifyCode(email: string, code: string): {
  valid: boolean
  message: string
} {
  const normalizedEmail = email.toLowerCase()
  const data = verificationCodes.get(normalizedEmail)

  if (!data) {
    return {
      valid: false,
      message: '验证码不存在或已过期'
    }
  }

  if (Date.now() > data.expiresAt) {
    verificationCodes.delete(normalizedEmail)
    return {
      valid: false,
      message: '验证码已过期'
    }
  }

  if (data.code !== code) {
    return {
      valid: false,
      message: '验证码错误'
    }
  }

  // 验证成功后删除验证码（一次性使用）
  verificationCodes.delete(normalizedEmail)

  return {
    valid: true,
    message: '验证成功'
  }
}

/**
 * 清理过期的验证码
 */
function cleanExpiredCodes(): void {
  const now = Date.now()
  verificationCodes.forEach((data, email) => {
    if (now > data.expiresAt) {
      verificationCodes.delete(email)
    }
  })
}

/**
 * 检查是否可以发送验证码（防止频繁请求）
 * @param email 邮箱地址
 * @param cooldownMinutes 冷却时间（分钟），默认1分钟
 * @returns 是否可以发送
 */
export function canSendVerificationCode(
  email: string,
  cooldownMinutes: number = 1
): { canSend: boolean; message: string } {
  const data = verificationCodes.get(email.toLowerCase())

  if (!data) {
    return { canSend: true, message: '可以发送' }
  }

  const cooldownMs = cooldownMinutes * 60 * 1000
  const timeSinceCreated = Date.now() - data.createdAt

  if (timeSinceCreated < cooldownMs) {
    const remainingSeconds = Math.ceil((cooldownMs - timeSinceCreated) / 1000)
    return {
      canSend: false,
      message: `请等待 ${remainingSeconds} 秒后再试`
    }
  }

  return { canSend: true, message: '可以发送' }
}

