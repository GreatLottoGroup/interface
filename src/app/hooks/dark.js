// dark.js
import { useState, useEffect } from 'react';

export function useDark() {

    const [isDark, setIsDark] = useState(false);

    const toggleDarkMode = (val) => {
        val = Boolean(val);
        setIsDark(val);
        localStorage.setItem('global-isDark', val);
    }    

    useEffect(() => {
        setIsDark(localStorage.getItem('global-isDark') == 'true' ? true : false)
    }, []);


    return {
        isDark,
        toggleDarkMode,
    }

}