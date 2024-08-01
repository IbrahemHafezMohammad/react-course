import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute() {
    const { userInfo, userType, emailVerified } = useSelector((state) => state.auth);

    return userInfo ? <Outlet /> : <Navigate to='/sign-up' replace />
}

function PrivateSeekerRoute() {
    const { userInfo, userType, emailVerified } = useSelector((state) => state.auth);

    if (userInfo && userType === 'seeker' && emailVerified === 'yes') {
        return <Outlet />
    } else {
        return <Navigate to='/' replace />
    }
}

function PrivateEmployerRoute() {
    const { userInfo, userType, emailVerified } = useSelector((state) => state.auth);

    console.log('result', userInfo && userType === 'employer' && emailVerified === 'yes')
    if (userInfo && userType === 'employer' && emailVerified === 'yes') {
        return <Outlet />
    } else {
        return <Navigate to='/' replace />
    }
}

export { PrivateRoute, PrivateSeekerRoute, PrivateEmployerRoute }