'use client';

import BrandLogo from '@/components/brandLogo'


export default function Footer() {
  return (

<div className="container">
  <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <div className="col-md-4 d-flex align-items-center">
      <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
        <BrandLogo />
      </a>
      <span className="mb-3 mb-md-0 text-muted">&copy; 2022 Company, Inc</span>
    </div>

    <ul className="nav justify-content-center">
      <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">Home</a></li>
      <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">Features</a></li>
      <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">Pricing</a></li>
      <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">FAQs</a></li>
      <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">About</a></li>
    </ul>

    <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
      <li className="ms-3"><a className="text-muted" href="#"><i className="bi-twitter"></i></a></li>
      <li className="ms-3"><a className="text-muted" href="#"><i className="bi-instagram"></i></a></li>
      <li className="ms-3"><a className="text-muted" href="#"><i className="bi-facebook"></i></a></li>
    </ul>
  </footer>
</div>

  )
}
