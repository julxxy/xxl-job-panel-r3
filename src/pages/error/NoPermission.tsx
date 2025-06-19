import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

function NoPermission() {
  const navigate = useNavigate()
  const navigateToHome = () => navigate('/')
  return (
    <Result
      status="403"
      title="403"
      subTitle="抱歉，您没有访问此页面的权限。"
      extra={
        <Button type="primary" onClick={navigateToHome}>
          返回首页
        </Button>
      }
    />
  )
}

export default NoPermission
