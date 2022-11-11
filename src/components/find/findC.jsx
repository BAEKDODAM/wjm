import React, { Component, useState } from 'react';
import MidPlace from './midPlace';
import axios from 'axios';
//import { useDispatch, useSelector } from 'react-redux';

export function FindC(props) {
    //let state=useSelector((state)=>{return state}) // redux store 가져와줌
    //let dispatch=useDispatch() // store.js에 요청 보냄

    let [area, setArea] = useState(['강남','마포'])
    let [place, setPlace] = useState([]);
    /*
    axios.get('https://codingapple1.github.io/shop/data2.json')
    .then((결과)=>{ 
        let copy = [...place, ...결과.data];
        setPlace(copy);
        console.log(place)
    }) // 요청 결과는 axios.get('url').then()
    .catch(()=>{console.log('실패')})
*/
    let n=0;
    return (
        <div className='findC'>
            <MidPlace/>
            <div className='findTitle'>원하는 지역을 선택해주세요</div>
            <div className='area'>
                {
                    area.map((a,i)=>{
                        n+=1;
                        if(n<4){
                        return(
                            <button className='areaBtn' key={i} onClick={()=>{
                                axios.get('https://codingapple1.github.io/shop/data2.json')
                                .then((i)=>{
                                    let copy=[...place, ...i.data]
                                    setPlace(copy);
                                    //console.log(copy);
                                    console.log(place)
                                })
                            }
                            }>{a}</button>
                        )}
                    })
                }
            </div>
            <div className='placeList'>
            {
                place.map((a,i)=>{
                    return (
                        <div className='placeL'>{a.title}</div>
                    )
                })
            }
            </div>
            
        </div>
    )
}
export default FindC;