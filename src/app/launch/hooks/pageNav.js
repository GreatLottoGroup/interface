'use client';

import './pageNav.css'

import { useState, useRef } from 'react'

const pageSize = 10;
const pageMaxShow = 3;

export function usePageNav() {

    const [pageCount, setPageCount] = useState(0)
    const [pageCurrent, setPageCurrent] = useState(1)

    const getPageNavInfo = (count) => {
        let pageCount = Math.ceil(count/pageSize);
        let startIndex = (pageCurrent - 1) * pageSize;
        let endIndex = pageCurrent * pageSize; 
        if(endIndex > count){
            endIndex = count;
        }
        setPageCount(pageCount);
        return [pageCount, startIndex, endIndex]
    }


    return {
        getPageNavInfo,

        pageCount,
        pageCurrent,
        setPageCount,
        setPageCurrent,
        pageSize,
        
    }
}


export function PageNav({pageCurrent, pageCount, setPageCurrent}) {

    const pageGoNumberEl = useRef(null)

    const pageNavItem = () => {
        let items = [];
        let skip = false;
        for(let i = 1; i <= pageCount; i++){
            if(i <= pageMaxShow || i > pageCount - pageMaxShow || (i >= pageCurrent - pageMaxShow && i <= pageCurrent + pageMaxShow)){
                skip = false;
                items.push(<li key={i} className={"page-item " + (i == pageCurrent ? 'active' : '')}><a className="page-link" onClick={()=>{
                    if(i != pageCurrent){
                        setPageCurrent(i);
                    }
                }} href="#">{i}</a></li>)
            }else{
                if(!skip){
                    items.push(<li key={i} className="page-item disabled"><a className="page-link">...</a></li>)
                }
                skip = true;
            }
        }
        return items;
    }

    return (
        <>
        {pageCount && pageCount > 1 && (
            <nav>
                <ul className="pagination pagination-sm justify-content-end">
                    <li className={"page-item " + (pageCurrent == 1 ? 'disabled' : '')}>
                        <a className="page-link" onClick={()=>{
                            if(pageCurrent > 1){
                                setPageCurrent(pageCurrent - 1)
                            }
                        }} href="#">
                            <span aria-hidden="true">&laquo;</span>
                        </a>
                    </li>
                    {pageNavItem()}
                    <li className={"page-item " + (pageCurrent == pageCount ? 'disabled' : '')}>
                        <a className="page-link" onClick={()=>{
                            if(pageCurrent < pageCount){
                                setPageCurrent(pageCurrent + 1)
                            }
                        }} href="#">
                        <span aria-hidden="true">&raquo;</span>
                        </a>
                    </li>
                    <li className='page-item'>
                        <div className="input-group input-group-sm ms-2 pageGoNumber">
                            <input type="number" className="form-control" placeholder='To' ref={pageGoNumberEl}/>
                            <button className="btn btn-outline-secondary" onClick={()=>{
                                let goPage = parseInt(pageGoNumberEl.current.value)
                                if(goPage >= 1 && goPage <= pageCount && goPage != pageCurrent){
                                    setPageCurrent(goPage)
                                    pageGoNumberEl.current.value = ''
                                }
                            }}>Go</button>
                        </div>

                    </li>
                </ul>

            </nav>
        )}
        </>
    )
}