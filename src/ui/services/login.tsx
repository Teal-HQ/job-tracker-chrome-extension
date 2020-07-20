import axios from 'axios';

const AUTH_API_URL = 'https://teal-auth-service-staging.herokuapp.com/';

export const login = ( email: string, password: string ) => {
  // TODO catch errors
  return axios.post(
    AUTH_API_URL + 'login',
    {
      "data": {
        "type": "users",
        "attributes": {
          "email": email,
          "password": password,
        }
      }
    },
    { headers: {'Content-Type': 'application/vnd.api+json'} }
  )
};