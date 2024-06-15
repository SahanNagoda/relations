import { Messages, Labels, Actions } from './constants/index.js';
export declare const featureTranslations: {
    translations: {
        en: {
            messages: Record<Messages, string>;
            labels: Record<Labels, string>;
            actions: Record<Actions, string>;
        };
    };
};
export declare const emptyLocale: {
    language: string;
    translations: {};
};
