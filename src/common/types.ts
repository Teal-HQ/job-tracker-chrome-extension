/*
    If a type is needed in more than one place and it does not seem
    like it belongs to a specific component, it can live here.
*/

import { PAGES } from '../config/config';

export interface INavigateTo {
    (page: PAGES, data?: any): void;
}