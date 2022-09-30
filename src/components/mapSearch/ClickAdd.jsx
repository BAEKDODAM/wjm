import React, { useEffect, useState } from 'react'
import Plus from '../../images/plus.png';

const { kakao } = window

const ClickAdd = ({ searchPlace, InputText }) => {
    let [location, setLocation] = useState([]);
    let [addLoc, setAddLoc] = useState([]);
    useEffect(()=>{
        
        const container = document.getElementById('myMap')
        const mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };  

        // 지도를 생성합니다    
        const map = new kakao.maps.Map(container, mapOption); 

        // 주소-좌표 변환 객체를 생성합니다
        const geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(searchPlace, function(result, status) {

            // 정상적으로 검색이 완료됐으면 
            if (status === kakao.maps.services.Status.OK) {
                let new_arr = [...location];
                new_arr.unshift(searchPlace);
                setLocation(new_arr);

                let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 결과값으로 받은 위치를 마커로 표시합니다
                let marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                let infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="width:150px;text-align:center;padding:6px 0;">`+searchPlace+`</div>`,
                    clickable: true
                });
                infowindow.open(map, marker);

                // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
                map.setCenter(coords);
                        // 마커에 클릭이벤트를 등록합니다
            } else {
            }
        })

    }, [searchPlace])
    const buttonAdd = (intext) =>{
        if(location.includes(intext) & !addLoc.includes(intext)) {
            let aarr = [...addLoc];
            aarr.push(intext);
            setAddLoc(aarr);
            console.log(addLoc)
        }
    }
    return (
        <div>
            <div
                id="myMap"
                style={{
                width: '350px',
                height: '400px',
                }}>
            </div>
            <button className='addbtn' onClick={()=>buttonAdd(InputText)}>+</button>
            <div>{addLoc.map((a)=>(<div className='submitAddress'>{a}</div>))}</div>
        </div>
    )
}


export default ClickAdd;