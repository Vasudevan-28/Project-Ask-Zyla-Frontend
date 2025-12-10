import { Outlet } from 'react-router-dom'
import HeaderMain from '../home_components/HeaderMain'
import FooterMain from '../home_components/FooterMain'


const DashLayout = () => {
  return (
    <div className="min-h-screen  flex flex-col">
      <HeaderMain /> 
        <Outlet />
    <FooterMain />
    </div>
  )
}

export default DashLayout
