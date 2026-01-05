import { Outlet } from 'react-router-dom'
import HeaderMain from '../home_components/HeaderMain'
import FooterMain from '../home_components/FooterMain'
import CookieBanner from '../cookie_components/CookieBanner'


const DashLayout = () => {
  return (
    <div className="min-h-screen  flex flex-col">
      <HeaderMain /> 
      <CookieBanner />
        <Outlet />
    <FooterMain />
    </div>
  )
}

export default DashLayout
