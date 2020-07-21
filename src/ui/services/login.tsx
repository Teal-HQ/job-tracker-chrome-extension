import axios from 'axios';
import { AUTH_API_URL } from '../../config/config';

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