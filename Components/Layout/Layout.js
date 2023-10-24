import Footer from "./Footer";
import Navbar from "./NavBar";
import { useRouter } from 'next/router';
const Layout = ({children}) => {
    const router = useRouter();
    const isLoginPage = router.pathname === '/auth/Login' || router.pathname === '/auth/recovery/RequestRecovery';
    return (
        <div>
            {!isLoginPage && <Navbar/>}
            {children}
            <Footer/>
        </div>
    );
}

export default Layout;