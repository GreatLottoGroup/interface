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
            {name: 'Home', href: './', isActive: true},
            {name: 'Features', href: './'},
            {name: 'Pricing', href: './'},
            {name: 'FAQs', href: './'},
            {name: 'About', href: './'},
        ]}>
          <div className="col-md-5 text-end">
            <Link href="./launch" className="btn btn-primary">Launch App</Link>
          </div>  
        </Header>

        <Main></Main>

        <Footer></Footer>

    </>

  )
}

