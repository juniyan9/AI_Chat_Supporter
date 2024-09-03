import '../../CSS/InfoBar.css';
import { useState } from 'react';

export default function InfoBar({roomName,onsearchtext}) {

    const [search, setsearch] = useState('');

    const inputtext = (e)=>{
        setsearch(e.target.value);
    }

    const press = (e) => {
        if (e.key === 'Enter') {
            searchtext();
        }
    };

    const searchtext = () =>{        
        onsearchtext(search);
        // console.log("infobar",onsearchtext(search));
        setsearch('');
    }




    return (
        <div className="InfoBar">
            <h3> {roomName} </h3>
            <input
                className='searchtext'
                type="text"
                placeholder="검색"
                value={search}
                onChange={inputtext}
                onKeyDown={press}
            />
            <button className='barsearch' onClick={searchtext}></button>
            <div className='line'></div>
        </div>
    )
}