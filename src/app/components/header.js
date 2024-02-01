'use client';

import { useContext } from 'react';
import Link from 'next/link'

import BrandLogo from './brandLogo'
import Setting from './setting'


import { DarkContext } from '@/hooks/darkContext';

export default function Header({children, navList, pageNav, setPageNav}) {

    const isDark = useContext(DarkContext)

    const navListItems = navList.map((item, index) => 
        <li key={index}><Link href={item.href} className={"nav-link px-2 " + (item.name == pageNav ? "active" : "")} >{item.title}</Link></li>  
    );

    return (
  
    <div className="container">
        <header className="p-3 mb-3 border-bottom">
            <div className="navbar navbar-expand d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <Link href="/" className={"d-flex align-items-center col-md-2 mb-2 mb-md-0 text-decoration-none navbar-brand " + (isDark ? 'text-light' : 'text-dark')}>
                    <BrandLogo />
                    <span className="fs-4 ms-2">Great Lotto</span>
                </Link>

                <ul className="navbar-nav col-12 col-lg-auto me-lg-auto ms-3 mb-2 justify-content-center mb-md-0">
                {navListItems}
                </ul>

                {children}

                <Setting />
                
            </div>
        </header>
    </div>
  
  
    )
  }
  