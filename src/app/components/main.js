'use client';

import Image from 'next/image'

export default function Main() {
  return (

    <>
    <div className="container col-xxl-8 px-4 py-5">
    <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
      <div className="col-10 col-sm-8 col-lg-6">
        <Image src="/bootstrap-themes.png" width="700" height="500" alt="Bootstrap Themes" className='d-block mx-lg-auto img-fluid'/>
      </div>
      <div className="col-lg-6">
        <h1 className="display-5 fw-bold lh-1 mb-3">Responsive left-aligned hero with image</h1>
        <p className="lead">Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins.</p>
        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
          <button type="button" className="btn btn-primary btn-lg px-4 me-md-2">Primary</button>
          <button type="button" className="btn btn-outline-secondary btn-lg px-4">Default</button>
        </div>
      </div>
    </div>
  </div>
    
  <div className="container px-4 py-5" id="hanging-icons">
    <h2 className="pb-2 border-bottom">Hanging icons</h2>
    <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
      <div className="col d-flex align-items-start">
        <div className="icon-square text-bg-light d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
            <i className="bi-toggles2"></i>
        </div>
        <div>
          <h3 className="fs-2">Featured title</h3>
          <p>Paragraph of text beneath the heading to explain the heading. We &apos;ll add onto it with another sentence and probably just keep going until we run out of words.</p>
          <a href="#" className="btn btn-primary">
            Primary button
          </a>
        </div>
      </div>
      <div className="col d-flex align-items-start">
        <div className="icon-square text-bg-light d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
            <i className="bi-cpu-fill"></i>
        </div>
        <div>
          <h3 className="fs-2">Featured title</h3>
          <p>Paragraph of text beneath the heading to explain the heading. We &apos;ll add onto it with another sentence and probably just keep going until we run out of words.</p>
          <a href="#" className="btn btn-primary">
            Primary button
          </a>
        </div>
      </div>
      <div className="col d-flex align-items-start">
        <div className="icon-square text-bg-light d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
            <i className="bi-tools"></i>
        </div>
        <div>
          <h3 className="fs-2">Featured title</h3>
          <p>Paragraph of text beneath the heading to explain the heading. We &apos;ll add onto it with another sentence and probably just keep going until we run out of words.</p>
          <a href="#" className="btn btn-primary">
            Primary button
          </a>
        </div>
      </div>
    </div>
  </div>

    </>

  )
}
