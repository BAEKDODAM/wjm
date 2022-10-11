import React, { useEffect, useState } from 'react'
import Plus from '../../images/plus.png';
import { Mapcopy } from './mapcopy';
    
const { kakao } = window

const ClickAdd = ({ searchPlace, InputText }) => {
    let [location, setLocation] = useState([]); //입력된 주소
    let [addLoc, setAddLoc] = useState([]); //추가된 주소
    let [latlng, b] = useState([]); //입력 좌표
    let [addlatlng, c] = useState([]);  // 추가 좌표
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
                new_arr.unshift(searchPlace); //검색한 주소를 새로운 배열에 선언
                setLocation(new_arr); // 검색 될 때 마다 값 바꿈
                // console.log(InputText);

                let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                // let latlng_arr = [...]

                console.log("새로 검색한 위도",result[0].y);
                console.log("새로 검색한 경도",result[0].x);

                let new_latlng = [...latlng];
                new_latlng.unshift([Number(result[0].y), Number(result[0].x)]); //검색한 주소의 좌표
                b(new_latlng);
                // console.log(new_latlng);

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
            aarr.unshift(intext);
            setAddLoc(aarr);
            console.log("추가한 주소이름",aarr)

            let aatlng = [...addlatlng];
            aatlng.unshift(latlng[0]);
            c(aatlng);
            console.log("추가한 좌표값",aatlng);
            // console.log(addlatlng);
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
            <Mapcopy title={addLoc} latlng={addlatlng}/>
            <button className='addbtn' onClick={()=>buttonAdd(InputText)}>+</button>
            <div>{addLoc.map((a) => (<div className='submitAddress'>{a}</div>))}</div>
            {/* <div>{latlng.map((a)=>(<div className='submitAddress'>{a}</div>))}</div> */}
        </div>
    )
}


export default ClickAdd;