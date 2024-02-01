'use client';


export function Periods({periods, setPeriods}) {

    return (

    <div>Periods: 
        <div className="input-group mb-3">
            <button className="btn btn-outline-secondary" type="button" onClick={()=>{if(periods>1)setPeriods(periods-1)}}>-</button>
            <input type="number" className="form-control" step="1" min="1" max="100" value={periods} onChange={(e)=>{
                let p = Math.trunc(e.target.value * 1);
                if(p>=1 && p <=100){
                    setPeriods(p)
                }
            }}/>
            <button className="btn btn-outline-secondary" type="button" onClick={()=>{if(periods<100)setPeriods(periods+1)}}>+</button>
        </div>
    </div>

    )
}

export function Multiple({multiple, setMultiple}) {

    return (
        <div>Multiple: 
        <div className="input-group mb-3">
            <button className="btn btn-outline-secondary" type="button" onClick={()=>{if(multiple>1)setMultiple(multiple-1)}}>-</button>
            <input type="number" className="form-control" step="1" min="1" max="100" value={multiple} onChange={(e)=>{
                let p = Math.trunc(e.target.value * 1);
                if(p>=1 && p <=100){
                    setMultiple(p)
                }
            }}/>
            <button className="btn btn-outline-secondary" type="button" onClick={()=>{if(multiple<100)setMultiple(multiple+1)}}>+</button>
        </div>
        </div>
    )

}