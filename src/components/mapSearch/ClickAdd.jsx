// import { NULL } from 'node-sass';
import React, { useEffect, useState } from 'react'
import Plus from '../../images/plus.png';
import { Mapcopy } from './mapcopy';
const { kakao } = window

export function ClickAdd({ searchPlace, InputText }) {
    let [location, setLocation] = useState([]); //입력된 주소
    let [addLoc, setAddLoc] = useState([]); //추가된 주소
    let [latlng, setLatlng] = useState([]); //입력 좌표
    let [addLatlng, setAddLatlng] = useState([]);  // 추가 좌표

    useEffect(() => {

        let container = document.getElementById('myMap'),
            mapOption = {
                center: new kakao.maps.LatLng(37.566826004661, 126.978652258309), // 지도의 중심좌표
                level: 9 // 지도의 확대 레벨
            };

        // 지도를 생성합니다    
        let map = new kakao.maps.Map(container, mapOption);

        // 주소-좌표 변환 객체를 생성합니다
        let geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        if (searchPlace != 0) {
            geocoder.addressSearch(searchPlace, function (result, status) {

                // 정상적으로 검색이 완료됐으면 
                if (status === kakao.maps.services.Status.OK) {
                    let new_arr = [...location];
                    new_arr.unshift(searchPlace); //검색한 주소를 새로운 배열에 선언
                    setLocation(new_arr); // 검색 될 때 마다 값 바꿈

                    let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                    console.log("새로 검색한 위도", result[0].y);
                    console.log("새로 검색한 경도", result[0].x);

                    let new_latlng = [...latlng];
                    new_latlng.unshift([Number(result[0].y), Number(result[0].x)]); //검색한 주소의 좌표
                    setLatlng(new_latlng);

                    // 결과값으로 받은 위치를 마커로 표시합니다
                    let searchMarker = new kakao.maps.Marker({
                        map: map,
                        position: coords
                    });

                    // 인포윈도우로 장소에 대한 설명을 표시합니다
                    let infowindow = new kakao.maps.InfoWindow({
                        content: `<div style="width:150px;text-align:center;padding:6px 0;">` + searchPlace + `</div>`,
                        clickable: true
                    });
                    infowindow.open(map, searchMarker);

                    map.setCenter(coords);
                    // 마커에 클릭이벤트를 등록합니다
                }
                else {
                    alert('도로명 주소로 입력해주세요');
                    return;
                }
            })
        }
    }, [searchPlace])
    const buttonAdd = (intext) => {
        if (location.includes(intext) & !addLoc.includes(intext)) {
            let aarr = [...addLoc];
            aarr.unshift(intext);
            setAddLoc(aarr);
            console.log("추가한 주소이름", aarr);

            let aatlng = [...addLatlng];
            aatlng.unshift(latlng[0]);
            setAddLatlng(aatlng);
            console.log("추가한 좌표값", aatlng);
        }
    }

    const start = (addLatlng, addLoc) => {
        const WGS_points = [],   // 위경도 좌표계 리스트
            Title = [],        // 해당좌표 주소 리스트
            WTM_points = [];   // 직교 좌표계 리스트

        for (let m = 0; m < addLatlng.length; m++) {
            Title[m] = addLoc[m];
            WGS_points[m] = addLatlng[m];
        }
        console.log("추가된 주소 리스트", Title);
        console.log("추가된 좌표 리스트", WGS_points);

        if (WGS_points.length > 1) {
            gtot(WGS_points, WTM_points);   // WGS좌표계 리스트를 WTM좌표계 리스트로 변환

            console.log("직교 좌표계로 변환된 리스트", WTM_points);

            let split_l = splitList(WTM_points).ll,     // 중심선 기준 왼쪽, 오른쪽으로 리스트 나누고 할당
                split_r = splitList(WTM_points).lr;

            let new_l = sort(split_l).asc,    // 리스트 정렬 후 할당
                new_r = sort(split_r).des;

            console.log("기준선 왼쪽 리스트", new_l);
            console.log("기준선 오른쪽 리스트", new_r);

            let poly_points = new_l.concat(new_r);  // 정렬된 두개 리스트 합친 후 할당

            console.log("정렬된 리스트", poly_points);

            if (WTM_points.length === 2) {      // 사용자 두명일 떄 무게중심 좌표 할당
                var center_x = getCentroid(poly_points).x2,
                    center_y = getCentroid(poly_points).y2;
            }
            else {                              // 두명 이상일 떄 무게중심 좌표 할당
                var center_x = getCentroid(poly_points).x,
                    center_y = getCentroid(poly_points).y;
            }
        }
        else {
            alert('출발지를 최소 두개 이상 입력한 다음 눌러주새요.');
            return;
        }

        console.log("무게중심 좌표(WTM)", center_x, center_y);

        let c_Lat = ttog(center_x, center_y).lat,   // 현재 WTM좌표계인 무게중심 좌표를 다시 WGS좌표계로 변환 후 할당
            c_Lng = ttog(center_x, center_y).lng;

        console.log("무게중심 좌표(WGS)", c_Lat, c_Lng);

        // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ가중치 추가하기ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

        var key = 0;
        let unitVec = getUnitvec(WTM_points, center_x, center_y, key).unitVec,
            errVec_x = getUnitvec(WTM_points, center_x, center_y, key).errVec_x,
            errVec_y = getUnitvec(WTM_points, center_x, center_y, key).errVec_y;

        console.log("각 출발지까지 단위벡터", unitVec);
        console.log("n빵해서 각 단위벡터에 더하는 값", errVec_x, errVec_y);

        var key = 1;
        let addWeight = getUnitvec(unitVec, errVec_x, errVec_y, key).addWeight,
            weigtVec_x = getUnitvec(unitVec, errVec_x, errVec_y, key).weigtVec_x,
            weigtVec_y = getUnitvec(unitVec, errVec_x, errVec_y, key).weigtVec_y;

        console.log("단위벡터 합(가중치 없으면 0에 수렴)", addWeight[0], addWeight[1]);
        console.log("가중치 포함된 무게중심 단위벡터(가중치 없으면 0에 수렴)", weigtVec_x, weigtVec_y);

        let center_x2 = getNewcenter(weigtVec_x, center_x, weigtVec_y, center_y).center_x2,
            center_y2 = getNewcenter(weigtVec_x, center_x, weigtVec_y, center_y).center_y2;

        console.log("새로운 중간지점(WTM)", center_x2, center_y2);

        var c_Lat2 = ttog(center_x2, center_y2).lat,   // 현재 WTM좌표계인 무게중심 좌표를 다시 WGS좌표계로 변환 후 할당
            c_Lng2 = ttog(center_x2, center_y2).lng;

        console.log("새로운 중간지점(WGS)", c_Lat2, c_Lng2);

        // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

        let container = document.getElementById('myMap'),
            mapOption = {
                center: new kakao.maps.LatLng(c_Lat2, c_Lng2), // 지도의 중심좌표
                level: 10 // 지도의 확대 레벨
            };
        let map = new kakao.maps.Map(container, mapOption);

        let imageSrc1 = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
            imageSrc2 = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';

        for (let i = 0; i < Title.length; i++) {
            // 마커 이미지의 이미지 크기 
            let imageSize = new kakao.maps.Size(24, 35);

            // 마커 이미지를 생성 
            let markerImage = new kakao.maps.MarkerImage(imageSrc1, imageSize);

            // 마커를 생성
            var marker = new kakao.maps.Marker({
                map: map,   // 마커를 표시할 지도
                position: new kakao.maps.LatLng(WGS_points[i][0], WGS_points[i][1]),  // 마커를 표시할 위치
                title: Title[i],   // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됨
                image: markerImage  // 마커 이미지 
            });

            // let infowindow = new kakao.maps.InfoWindow({
            //     content: `<div style="width:150px;text-align:center;padding:6px 0;">`+(Title.length-i)+`<br><p>`+Title[i]+`</p></div>`,
            //     clickable: true
            // });
            // infowindow.open(map, marker);

        }
        let imageSize = new kakao.maps.Size(35, 40);
        let markerImage = new kakao.maps.MarkerImage(imageSrc2, imageSize);

        var marker = new kakao.maps.Marker({    // 무게중심 좌표에 마커 생성
            position: new kakao.maps.LatLng(c_Lat, c_Lng),
            // image: markerImage
        });

        var marker2 = new kakao.maps.Marker({    // 무게중심 좌표에 마커 생성
            position: new kakao.maps.LatLng(c_Lat2, c_Lng2),
            image: markerImage
        });

        marker.setMap(map);
        marker2.setMap(map);

        for (let i = 0; i < WGS_points.length; i++) {
            searchPubTransPathAJAX(WGS_points, c_Lat, c_Lng, i);
        }

    }

    function searchPubTransPathAJAX(WGS_points, c_Lat, c_Lng, i) {
        var xhr = new XMLHttpRequest();
        var url = "https://api.odsay.com/v1/api/searchPubTransPathT?SX=" + WGS_points[i][1] + "&SY=" + WGS_points[i][0] + "&EX=" + c_Lng + "&EY=" + c_Lat + "&apiKey=6g%2BFZMSoP6lKIQicoZdy5Q";
        xhr.open("GET", url, true);
        xhr.send();
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText); // <- xhr.responseText 로 결과를 가져올 수 있음
            }
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

            {/* <Mapcopy title={addLoc} latlng={addLatlng} /> */}

            <button className='addbtn' onClick={() => buttonAdd(InputText)}>+</button>
            <button onClick={() => start(addLatlng, addLoc)}>중간 장소 보기</button>
            <div>{addLoc.map((a) => (<div key={a} className='submitAddress'>{a}</div>))}</div>
        </div>
    )
}


export default ClickAdd;

function gtot(WGS_points, WTM_points) {     // WGS좌표계 리스트를 WTM좌표계 리스트로 변환
    for (let i = 0; i < WGS_points.length; i++) {
        let latlng = new kakao.maps.LatLng(WGS_points[i][0], WGS_points[i][1]),
            coords = latlng.toCoords();
        WTM_points[i] = [coords.getX() * 0.4, coords.getY() * 0.4];
    }
}

function ttog(center_x, center_y) {     // WTM좌표계인 무게중심 좌표를 WGS좌표계로 변환
    let coords = new kakao.maps.Coords(center_x * 2.5, center_y * 2.5),
        latlng = coords.toLatLng();
    return {
        lat: latlng.getLat(),
        lng: latlng.getLng()
    };
}

function splitList(WTM_points) {    // 리스트 나누기
    let px = [],  // x좌표들 중심 찾기위해서 x좌표만 뽑은 리스트
        listl = [],   // 중심 선 기준 왼쪽 리스트
        listr = [];   // 중심 선 기준 오른쪽 리스트

    for (let i = 0; i < WTM_points.length; i++) {    // x좌표만 px에 담음
        let p = WTM_points[i];
        px[i] = p[0];
    }

    const result = px.sort(function (a, b) {   // px 오름차순 정렬
        return a - b;
    });

    let mid = (result[0] + result[WTM_points.length - 1]) / 2   // x 중심좌표

    let l = 0,
        r = 0;
    for (let i = 0; i < WTM_points.length; i++) {   // 중심 선 기준 리스트 나누기
        let a = WTM_points[i];
        if (a[0] < mid) {
            listl[l] = a;
            l++;
        }
        else if (a[0] >= mid) {
            listr[r] = a;
            r++;
        }
    }
    return {
        ll: listl,
        lr: listr
    };
}

function sort(y) {  // y 좌표 정렬
    if (y.length === 0) {
        return [];
    }
    let middle = y[0][1],
        middle_t = [y[0]],
        len = y.length,
        left = [],
        right = [];

    for (let i = 1; i < len; ++i) {
        if (y[i][1] < middle)
            left.push(y[i]);

        else
            right.push(y[i]);
    }
    let lmr = left.concat(middle_t, right),
        rml = right.concat(middle_t, left);
    return {
        asc: lmr,
        des: rml
    };
}

function getCentroid(poly_points) {  // 사용자 둘 or 둘 이상일 때 무게중심 찾기
    let area = 0,
        cx = 0,
        cy = 0,
        cx2 = 0,
        cy2 = 0;

    for (let i = 0; i < poly_points.length; i++) {
        let j = (i + 1) % poly_points.length;

        let pt1 = poly_points[i],
            pt2 = poly_points[j];

        let x1 = pt1[0],
            x2 = pt2[0],
            y1 = pt1[1],
            y2 = pt2[1];

        area += x1 * y2;
        area -= y1 * x2;

        cx += ((x1 + x2) * ((x1 * y2) - (x2 * y1)));
        cy += ((y1 + y2) * ((x1 * y2) - (x2 * y1)));

        cx2 = (x1 + x2) / 2;
        cy2 = (y1 + y2) / 2;
    }

    area /= 2;
    area = Math.abs(area);

    cx = cx / (6.0 * area);
    cy = cy / (6.0 * area);

    return {
        x: Math.abs(cx),
        y: Math.abs(cy),
        x2: Math.abs(cx2),
        y2: Math.abs(cy2)
    };
}

function getUnitvec(WTM_points, center_x, center_y, key) {
    let unitVec = [];
    for (let i = 0; i < WTM_points.length; i++) {
        unitVec[i] = [WTM_points[i][0] - center_x, WTM_points[i][1] - center_y];
    }

    // console.log("각 출발지까지 단위벡터", unitVec);

    let addWeight = [],
        weigtVec = [];

    addWeight[0] = 0;
    addWeight[1] = 0;

    for (let i = 0; i < unitVec.length; i++) {
        if (i == 1 && key == 1) {   // 조건문 : key == 1 이면 실행 
            // 내용 : 가중치를 주가해주어야 할 좌표리스트 인덱스 값들을 모아 또 다른 리스트로 저장해두고 
            // ex) 길이 0번째, 3번째 좌표에 가중치 추가해야한다면[0, 3]
            //해당 리스트 길이(2)만큼 for문을 돌려서 그 값을 매개변수로 전달
            //++추가++ : getUnitvec()매개변수에 해당 리스트 추가하기

            // for (let temp = 0; list.length < temp++){
            //     addWeight[0] += (unitVec[list[temp]][0] * 2); // 가중치 + 2
            //     addWeight[1] += (unitVec[list[temp]][1] * 2);
            // }

            addWeight[0] += (unitVec[i][0] * 2); // 가중치 + 2
            addWeight[1] += (unitVec[i][1] * 2);
        }
        else {
            addWeight[0] += unitVec[i][0];
            addWeight[1] += unitVec[i][1];
        }
    }
    weigtVec[0] = [addWeight[0] / unitVec.length, addWeight[1] / unitVec.length];

    return {
        unitVec: unitVec, // pp
        addWeight: addWeight, // g
        errVec_x: weigtVec[0][0],
        errVec_y: weigtVec[0][1],
        weigtVec_x: weigtVec[0][0],
        weigtVec_y: weigtVec[0][1] // gg
    }
}

function getNewcenter(weigtVec_x, center_x, weigtVec_y, center_y) {
    let new_center = [];
    new_center[0] = [weigtVec_x + center_x, weigtVec_y + center_y];

    return {
        center_x2: new_center[0][0],
        center_y2: new_center[0][1]
    }
}