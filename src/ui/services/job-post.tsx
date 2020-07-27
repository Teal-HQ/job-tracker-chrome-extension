import axios from 'axios';
import { deserialize } from "deserialize-json-api";

import { COMPANY_API_URL } from '../../config/config';

export interface JobPost {
  company?: string;
  role?: string;
  location?: string;
  url?: string;
  logo?: string;
  description?: string;
  description_html: string;
  note?: string;
  id?: string;
}

export const defaultJobPost: JobPost = {
  company: '',
  role: '',
  location: '',
  url: '',
  logo: '',
  description: '',
  description_html: '',
  note: '',
  id: ''
}

export const getRules = async (url, jwt) => {
  const data = await axios.get(COMPANY_API_URL+'xpaths', {'headers': {
    'Authorization': `Bearer ${jwt}`
  }});

  const xPaths = deserialize(data.data);

  const matches = xPaths.data.filter( (item) => {
    return url.indexOf(item.root_url) !== -1;
  });

  return matches.length > 0 ? matches[0] : null;
}

export const saveJobPost = (jobPost: JobPost, jwt) => {
  // TODO catch errors
  return axios.post(
    COMPANY_API_URL + 'user_job_posts',
    {
      "data": {
        "type": "user_job_posts",
        "attributes": {
          "company_name": jobPost.company,
          "role": jobPost.role,
          "location": jobPost.location,
          "note": jobPost.note,
          "url": jobPost.url,
          "job_description": jobPost.description_html
        }
      }
    },
    { headers: {'Content-Type': 'application/vnd.api+json', 'Authorization': `Bearer ${jwt}`} }
  )
};