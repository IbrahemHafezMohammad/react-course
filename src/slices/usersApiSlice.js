import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        seekerLogin: builder.mutation({
            query: (data) => ({
                url: '/seeker/login',
                method: 'POST',
                body: data
            })
        }),
        seekerRegister: builder.mutation({
            query: (data) => ({
                url: '/seeker/register',
                method: 'POST',
                body: data
            })
        })
    })
})

export const { useSeekerLoginMutation,  useSeekerRegisterMutation} = usersApiSlice;