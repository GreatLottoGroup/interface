// i18nLocale.js
import { useState, useEffect } from 'react';

import messagesDefault from '/messages/en.json'

const locales = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    pt: 'Português',
    ja: '日本语',
    'zh-CN': '简体中文',
    'zh-HK': '繁體中文',
};

const defaultLocale = 'en';

const messagesList = {};

messagesList[defaultLocale] = messagesDefault;

export function useI18nLocale() {

    const [locale, setLocale] = useState(defaultLocale);

    const [messages, setMessages] = useState(messagesDefault);
    
    const switchLocale = (value) => {
        console.log(value)
        setLocale(value);
        switchMessages(value)
        localStorage.setItem('global-locale', value);
    }

    const switchMessages = (_locale) => {
        if(!locales[_locale]){
            return;
        }
        if(messagesList[_locale]){
            setMessages(messagesList[_locale]) 
        }else{
            import(`/messages/${_locale}.json`).then((msg) => {
                setMessages(msg);
                messagesList[_locale] = msg
            })
        }
    }

    useEffect(() => {
        const _locale = localStorage.getItem('global-locale') || defaultLocale;
        setLocale(_locale)
        switchMessages(_locale)
    }, []);
    
    return {
        locale,
        switchLocale,
        messages
    }


}

export {
    locales,
}