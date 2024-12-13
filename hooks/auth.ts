import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthParams, User } from "@/types/index";

export const useAuth = ({ middleware, redirectIfAuthenticated }: AuthParams = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: user, error, mutate } = useSWR<User>('/api/user', () => axios.get('/api/user').then(res => res.data))

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, ...props }: any) => {
        await csrf()

        setErrors([])

        await axios.post('/register', props)
        .then(() => mutate())
        .catch((error) => {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        })
    }

    const login = async ({ setErrors, setStatus, ...props }: any) => {
        await csrf()

        setErrors([])
        setStatus(null)

        await axios.post('/login', props)
        .then(() => mutate())
        .catch((error) => {
            if (error.response.status !== 422) throw error

            setErrors(error.response.data.errors)
        })
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        // if (middleware === 'auth' && !user?.email_verified_at)
        //     router.push('/verify-email')
        
        // if (
        //     window.location.pathname === '/verify-email' &&
        //     user?.email_verified_at
        // )
        //     router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()
    }, [user, error])


    return {
        user,
        register,
        login,
        logout,
    }
}