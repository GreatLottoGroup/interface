'use client';

import { useContext } from 'react';

import './setting.css'
import Image from 'next/image'
import Dropdown from 'react-bootstrap/Dropdown'

import { DarkContext, ToggleDarkContext } from '../hooks/darkContext';
import { LocaleContext, SwitchLocaleContext } from '../hooks/localeContext'

import { locales } from '../hooks/i18nLocale';

import {useTranslations} from 'next-intl';

export default function Setting() {

    const isDark = useContext(DarkContext)
    const toggleDarkMode = useContext(ToggleDarkContext)

    const locale = useContext(LocaleContext)
    const switchLocale = useContext(SwitchLocaleContext)

    const t = useTranslations('Setting')

    const localeItems = Object.keys(locales).map(k => 
        <li key={k}>
            <a className={"dropdown-item " + (locale == k ? 'active' : '')}  onClick={() => {switchLocale(k)}}>
                <Image src={"/flag/" + k + ".svg"} alt={locales[k]} width="20" height="20"/>
                {locales[k]} 
                <i className="bi bi-check-lg"></i>
            </a>
        </li>  
    );


  return (

    <Dropdown className="ms-3" align="end" autoClose="outside">
        <Dropdown.Toggle variant={isDark ? 'dark' : 'light'} bsPrefix=' '>
            <i className="bi bi-gear-fill"></i>
        </Dropdown.Toggle>

        <Dropdown.Menu className="global-setting" as="ul">
            <li className="dropdown-header">{t('global-settings')}</li>

            <li className="dropdown-item-text container">
                <div className="row">
                    <label className="col" htmlFor="darkModeSwitchCheck">{t('dark-mode')}</label>
                    <div className="col text-end">
                        <span className="form-check form-check-reverse form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="darkModeSwitchCheck" onChange={(e) => {toggleDarkMode(e.target.checked)}} checked={isDark}/>
                            <label className="form-check-label text-body-tertiary" htmlFor="darkModeSwitchCheck">
                                <i className={"bi me-1 " + ( isDark ? 'bi-moon' : 'bi-brightness-high')}></i>
                            </label>
                        </span>
                    </div>
                </div>
            </li>

            <li className="dropdown-item-text container">

                <Dropdown drop="end" align="start" >
                    <Dropdown.Toggle as="div" className='language-setting-toggle'>
                        <div className="row">
                            <div className="col-6">{t('language')}</div>
                            <div className="col-5 text-end text-body-tertiary">{locales[locale]}</div>
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="language-setting-menu" as="ul" >
                        <li className="dropdown-header" >{t('select-language')}</li>
                        {localeItems}
                    </Dropdown.Menu>

                </Dropdown>


            </li>



        </Dropdown.Menu>
    </Dropdown>



  )
}
