import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

export default Layout 