// 登录参数
export interface LoginParams {
  userName: string
  password: string
  ifRemember?: boolean
}

// 登录响应
export interface LoginResponse {
  token: string
  userInfo: {
    id: number
    userName: string
    role: string
  }
}
