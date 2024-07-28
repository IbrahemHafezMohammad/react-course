import axios from 'axios';

const login = async (username, password, otp) => {
    const url = "/api/seeker/login";
    return (
        axios.post(url, {
            user_name: username,
            password: password,
        })
            .then((response) => {

                return response;
            }).catch((e) => Promise.reject(e.response.data))
    )
};

const register = async (username, password, email, phone, name, gender, birthday) => {
    const url = "/api/seeker/register";
    return (
        axios.post(url, {
            user_name: username,
            password: password,
            email: email,
            phone: phone,
            name: name,
            gender: gender,
            birthday: birthday,
        })
            .then((response) => {

                return response;
            }).catch((e) => Promise.reject(e.response.data))
    )
};

export { login , register};