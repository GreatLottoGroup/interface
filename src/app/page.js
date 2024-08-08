'use client';

import Link from 'next/link'
import Header from "./components/header"    
import Footer from "./components/footer"
import Main from "./components/main"
import './page.css'

export default function Home() {


  return (
    <>

        <Header navList={[
            {title: 'Home', name: 'home', href: './'},
            {title: 'Features', name: 'features', href: './'},
            {title: 'About', name: 'about', href: './'},
        ]}>
          <div className="col-md-5 text-end">
            <Link href="/launch/issue" className="btn btn-primary fs-5">Launch App</Link>
          </div>  
        </Header>

        <Main></Main>

        <Footer></Footer>

    </>

  )
}

