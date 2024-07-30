import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { constants } from "../context/API/constants";

const baseQuery = fetchBaseQuery({ baseUrl: constants.BASE_URL });

export const apiSlice = createApi ({
    baseQuery,
    tagTypes: ['User'],
    endpoints: (builder) => ({})
});