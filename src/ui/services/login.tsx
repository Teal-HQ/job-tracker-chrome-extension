import axios from 'axios';
import { AUTH_API_URL } from '../../config/config';
import { deserialize } from 'deserialize-json-api';
import { jwtVerify, jwtDecode } from 'jwt-js-decode';

export const login = (email: string, password: string) => {
    // TODO catch errors
    return axios
        .post(
            AUTH_API_URL + 'login',
            {
                data: {
                    type: 'users',
                    attributes: {
                        email: email,
                        password: password,
                    },
                },
            },
            { headers: { 'Content-Type': 'application/vnd.api+json' } }
        )
        .then(response => {
            return deserialize(response.data);
        });
};

export const decodeToken = async (jwt: string) => {
    const publicKeyResponse = await axios.get(AUTH_API_URL + 'jwt_public_key');
    const isVerified = await jwtVerify(jwt, publicKeyResponse.data.jwt_public_key);

    if (isVerified) {
        const jwtData = jwtDecode(jwt);
        // uncomment the line below to test the free plan type
        // jwtData.payload['plan_type'] = USER_PLANS.FREE;
        return jwtData.payload;
    }

    return Promise.reject('jwt verification failed');
};

export const logout = () => {
    chrome.storage.local.remove(['jwt', 'email', 'plan_type', 'plan_expires_at']);
};
