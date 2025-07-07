import {Link }from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
<header className="fixed w-[100vw] top-0 left-0 right-0 z-50 bg-[#fafafa] shadow-md h-fit">
<div className="w-full  py-4 flex items-center justify-between px-10">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/radu-logo-2.png" alt="" className='h-32 ' />
        </Link>
         
          {location.pathname === '/' ? ( <div className='flex w-full justify-between items-center '>
            <nav className="hidden lg:flex space-x-4 w-full justify-center ">
          <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-semibold text-lg">
            HOME
          </a>
          <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-semibold text-lg">
            ABOUT
          </a>
          <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-semibold text-lg">
            FEATURES
          </a>
          <a href="#videos" className="text-gray-600 hover:text-blue-600 transition-colors font-semibold text-lg">
            VIDEOS
          </a>
        </nav>
        <div className="flex items-center space-x-2">
          <Link to='/signin'><Button  className='text-lg py-2' variant="outline">LOGIN</Button></Link>
          <Link to='/signup'>
          <Button className='text-lg py-2' >GET STARTED</Button>
          </Link>
        </div>
        </div>
        ) : (null)}
        
      </div>
    </header>
  )
}
