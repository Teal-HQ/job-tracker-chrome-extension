import axios from 'axios';
import { deserialize } from 'deserialize-json-api';
import { COMPANY_API_URL, SUPPORTED_SITES } from '../../config/config';

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
    source?: string;
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
    id: '',
    source: 'ChromeExtension',
};

export const getRules = async url => {
    const data = await axios.get(COMPANY_API_URL + 'xpaths');

    const xPaths = deserialize(data.data);

    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    let siteMatch = false;

    Object.keys(SUPPORTED_SITES).forEach(siteKey => {
        if (hostname.includes(SUPPORTED_SITES[siteKey])) siteMatch = true;
    });

    const matches = xPaths.data.filter(item => {
        const expr = new RegExp(item.root_url, 'i');
        return url.match(expr) !== null;
    });

    return matches.length > 0 ? { data: matches[0], siteMatch } : { data: null, siteMatch };
};

export const saveJobPost = (jobPost: JobPost, jwt) => {
    return axios.post(
        COMPANY_API_URL + 'user_job_posts',
        {
            data: {
                type: 'user_job_posts',
                attributes: {
                    company_name: jobPost.company,
                    role: jobPost.role,
                    location: jobPost.location,
                    note: jobPost.note,
                    url: jobPost.url,
                    job_description: jobPost.description_html,
                    source: 'ChromeExtension',
                },
            },
        },
        { headers: { 'Content-Type': 'application/vnd.api+json', Authorization: `Bearer ${jwt}` } }
    );
};
