'use client';

import { useContext, useState } from 'react';

import './setting.css'
import Image from 'next/image'
import { Menu, MenuItem, Stack, SwipeableDrawer } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IsMobileContext, IsDesktopContext } from '@/hooks/mediaQueryContext';
import { LightBtn } from '@/launch/components/lightBtn';

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

    const isMobile = useContext(IsMobileContext);
    const isDesktop = useContext(IsDesktopContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [langAnchorEl, setLangAnchorEl] = useState(null);
    const langMenuOpen = Boolean(langAnchorEl);
    
    const handleLangClick = (event) => {
        event.stopPropagation();
        setLangAnchorEl(event.currentTarget);
    };
    
    const handleLangClose = () => {
        setLangAnchorEl(null);
    };

    const localeItems = Object.keys(locales).map(k => 
        <MenuItem 
            key={k} 
            onClick={() => {
                switchLocale(k);
                handleLangClose();
                handleClose();
            }}
            selected={locale === k}
        >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                <Image src={"/flag/" + k + ".svg"} alt={locales[k]} width="20" height="20"/>
                <span>{locales[k]}</span>
                {locale === k && <i className="bi bi-check-lg ms-auto"></i>}
            </Stack>
        </MenuItem>
    );

    const languageContent = () => (
        <div>
            <MenuItem sx={{ borderBottom: '1px solid #ddd' }}>
                <div className='setting-header'>{t('select-language')}</div>
            </MenuItem>
            {localeItems}
        </div>
    );

    const settingContent = () => (
        <div>
            <MenuItem sx={{ borderBottom: '1px solid #ddd' }}>
                <div className='setting-header'>{t('global-settings')}</div>
            </MenuItem>

            <MenuItem>
                <div className="container">
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
                </div>
            </MenuItem>

            <MenuItem onClick={isMobile ? handleLangClick : null}>
                <div className="container" onClick={(e) => !isMobile && handleLangClick(e)}>
                    <div className="row align-items-center">
                        <div className="col">{t('language')}</div>
                        <div className="col text-end text-body-tertiary">
                            {locales[locale]}
                            <KeyboardArrowRightIcon sx={{ ml: 1 }} />
                        </div>
                    </div>
                </div>
            </MenuItem>
        </div>
    );

    return (
        <>
            <LightBtn
                className="ms-3"
                onClick={handleClick}
                variant='outlined'
                sx={{ minWidth: 'auto', textTransform: 'none' }}
                aria-controls={open ? 'setting-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                disableElevation
                disableFocusRipple
                disableRipple
            >
                <i className="bi bi-gear-fill fs-5"></i>
            </LightBtn>

            {isMobile ? (
                <>
                    <SwipeableDrawer
                        anchor="bottom"
                        open={open}
                        onClose={handleClose}
                        sx={{ zIndex: 99999 }}
                    >
                        {settingContent()}
                    </SwipeableDrawer>
                    <SwipeableDrawer
                        anchor="bottom"
                        open={langMenuOpen}
                        onClose={handleLangClose}
                        sx={{ zIndex: 99999 }}
                    >
                        {languageContent()}
                    </SwipeableDrawer>
                </>
            ) : (
                <>
                    <Menu
                        id="setting-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        slotProps={{
                            paper: {
                                sx: {
                                    width: '25rem',
                                },
                            },
                        }}
                    >
                        {settingContent()}
                    </Menu>
                    <Menu
                        id="language-menu"
                        anchorEl={langAnchorEl}
                        open={langMenuOpen}
                        onClose={handleLangClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        slotProps={{
                            paper: {
                                sx: {
                                    width: '15rem',
                                },
                            },
                        }}
                    >
                        {languageContent()}
                    </Menu>
                </>
            )}
        </>
    );
}
