// import { NULL } from 'node-sass';
import React, { useEffect, useState } from 'react'
import Plus from '../../images/plus.png';
import { Mapcopy } from './mapcopy';
import STA from './sta.json';

const { kakao } = window

export function ClickAdd({ searchPlace, InputText, lat, lng, name }) {
    let [location, setLocation] = useState([]); //입력된 주소
    let [addLoc, setAddLoc] = useState([]); //추가된 주소
    let [latlng, setLatlng] = useState([]); //입력 좌표
    let [addLatlng, setAddLatlng] = useState([]);  // 추가 좌표
    // let [n, setN] = useState([]);
    let mmm = [];

    useEffect(() => {

        let container = document.getElementById('myMap'),
            mapOption = {
                center: new kakao.maps.LatLng(37.566826004661, 126.978652258309), // 지도의 중심좌표
                level: 6 // 지도의 확대 레벨
            };

        // 지도를 생성합니다    
        let map = new kakao.maps.Map(container, mapOption);

        let new_location = [...location];
        new_location.unshift(searchPlace); //검색한 주소를 새로운 배열에 선언
        setLocation(new_location); // 검색 될 때 마다 값 바꿈

        console.log("검색 주소", location);

        let coords = new kakao.maps.LatLng(lat, lng);

        console.log("새로 검색한 위도", lat);
        console.log("새로 검색한 경도", lng);

        let new_latlng = [...latlng];
        new_latlng.unshift([Number(lat), Number(lng)]); //검색한 주소의 좌표
        setLatlng(new_latlng);

        // console.log("검색 좌표", latlng);

        let searchMarker = new kakao.maps.Marker({
            map: map,
            position: coords
        });

        let infowindow = new kakao.maps.InfoWindow({
            content: `<div style="width:150px;text-align:center;padding:6px 0;">` + name + `</div>`,
            clickable: true
        });

        infowindow.open(map, searchMarker);

        map.setCenter(coords);

    }, [searchPlace, lat, lng, name])

    // useEffect(() => {
    //     let container = document.getElementById('myMap'),
    //         mapOption = {
    //             center: new kakao.maps.LatLng(37.566826004661, 126.978652258309), // 지도의 중심좌표
    //             level: 9 // 지도의 확대 레벨
    //         };

    //     // 지도를 생성합니다    
    //     let map = new kakao.maps.Map(container, mapOption);

    //     // 주소-좌표 변환 객체를 생성합니다
    //     let geocoder = new kakao.maps.services.Geocoder();

    //     // 주소로 좌표를 검색합니다
    //     if (searchPlace != 0) {
    //         geocoder.addressSearch(searchPlace, function (result, status) {

    //             // 정상적으로 검색이 완료됐으면 
    //             if (status === kakao.maps.services.Status.OK) {
    //                 let new_location = [...location];
    //                 new_location.unshift(searchPlace); //검색한 주소를 새로운 배열에 선언
    //                 setLocation(new_location); // 검색 될 때 마다 값 바꿈

    //                 let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

    //                 console.log("새로 검색한 위도", result[0].y);
    //                 console.log("새로 검색한 경도", result[0].x);

    //                 console.log("검색 주소", location);
    //                 console.log("검색 좌표", latlng);

    //                 let new_latlng = [...latlng];
    //                 new_latlng.unshift([Number(result[0].y), Number(result[0].x)]); //검색한 주소의 좌표
    //                 setLatlng(new_latlng);

    //                 // 결과값으로 받은 위치를 마커로 표시합니다
    //                 let searchMarker = new kakao.maps.Marker({
    //                     map: map,
    //                     position: coords
    //                 });

    //                 // 인포윈도우로 장소에 대한 설명을 표시합니다
    //                 let infowindow = new kakao.maps.InfoWindow({
    //                     content: `<div style="width:150px;text-align:center;padding:6px 0;">` + searchPlace + `</div>`,
    //                     clickable: true
    //                 });
    //                 infowindow.open(map, searchMarker);

    //                 map.setCenter(coords);
    //                 // 마커에 클릭이벤트를 등록합니다
    //             }
    //             else {
    //                 alert('도로명 주소로 입력해주세요');
    //                 return;
    //             }
    //         })
    //     }
    // }, [searchPlace])

    const buttonAdd = (intext) => {
        if (location.includes(intext) & !addLoc.includes(intext)) {
            let new_addLoc = [...addLoc];
            new_addLoc.unshift(intext);
            setAddLoc(new_addLoc);
            console.log("추가한 주소이름", new_addLoc);

            let new_addLatlng = [...addLatlng];
            new_addLatlng.unshift(latlng[0]);
            setAddLatlng(new_addLatlng);
            console.log("추가한 좌표값", new_addLatlng);
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

            var new_l = sort(split_l).asc,    // 리스트 정렬 후 할당
                new_r = sort(split_r).des;

            console.log("기준선 왼쪽 리스트", new_l);
            console.log("기준선 오른쪽 리스트", new_r);

            var poly_points = new_l.concat(new_r);  // 정렬된 두개 리스트 합친 후 할당

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
        let unitVec = getUnitvec(poly_points, center_x, center_y, key, new_l, new_r).unitVec,
            errVec_x = getUnitvec(poly_points, center_x, center_y, key, new_l, new_r).errVec_x,
            errVec_y = getUnitvec(poly_points, center_x, center_y, key, new_l, new_r).errVec_y;

        console.log("각 출발지까지 단위벡터", unitVec);
        console.log("n빵해서 각 단위벡터에 더하는 값", errVec_x, errVec_y);

        var key = 1;
        let addWeight = getUnitvec(unitVec, errVec_x, errVec_y, key, new_l, new_r).addWeight,
            weigtVec_x = getUnitvec(unitVec, errVec_x, errVec_y, key, new_l, new_r).weigtVec_x,
            weigtVec_y = getUnitvec(unitVec, errVec_x, errVec_y, key, new_l, new_r).weigtVec_y;

        console.log("단위벡터 합(가중치 없으면 0에 수렴)", addWeight[0], addWeight[1]);
        console.log("가중치 포함된 무게중심 단위벡터(가중치 없으면 0에 수렴)", weigtVec_x, weigtVec_y);

        let center_x2 = getNewcenter(weigtVec_x, center_x, weigtVec_y, center_y).center_x2,
            center_y2 = getNewcenter(weigtVec_x, center_x, weigtVec_y, center_y).center_y2;

        console.log("새로운 중간지점(WTM)", center_x2, center_y2);

        var c_Lat2 = ttog(center_x2, center_y2).lat,   // 현재 WTM좌표계인 무게중심 좌표를 다시 WGS좌표계로 변환 후 할당
            c_Lng2 = ttog(center_x2, center_y2).lng;

        console.log("새로운 중간지점(WGS)", c_Lat2, c_Lng2);

        // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

        getAddr(WGS_points, Title, c_Lat2, c_Lng2);

        let overlay = document.querySelector('#overlay'),
            sta_wrap = document.querySelector('#sta_wrap');
        if (sta_wrap) {
            overlay.removeChild(sta_wrap);
        }

        let key2 = getUnitvec(unitVec, errVec_x, errVec_y, key, new_l, new_r).goC_2
        console.log(key2);    // key2 == 0 이면 가중치 중간지점 key == 2 이면 처음 중간지점
    }

    // function searchPubPOIRadius(c_Lat, c_Lng, WGS_points) {                                //반경 n미터 지하철역 찾기
    //     var xhr = new XMLHttpRequest();
    //     var url = "https://api.odsay.com/v1/api/pointSearch?x=" + c_Lng + "&y=" + c_Lat + "&radius=1500&stationClass=2&apiKey=6g%2BFZMSoP6lKIQicoZdy5Q";
    //     xhr.open("GET", url, true);
    //     xhr.send();
    //     xhr.onreadystatechange = function () {

    //         if (xhr.readyState == 4 && xhr.status == 200) {
    //             // console.log(JSON.parse(xhr.responseText));
    //             // console.log(xhr.responseText);

    //             var poiCount = (JSON.parse(xhr.responseText))["result"].count;
    //             console.log(JSON.parse(xhr.responseText)["result"].count);

    //             for (let c = 0; c < poiCount; c++) {
    //                 for (let i = 0; i < WGS_points.length; i++) {
    //                     let latt = (JSON.parse(xhr.responseText))["result"]["station"][c].y,
    //                         lngg = (JSON.parse(xhr.responseText))["result"]["station"][c].x;

    //                     searchPubTransPathAJAX(WGS_points, latt, lngg, i);

    //                 }
    //             }
    //         }
    //     }
    // }

    function searchPubTransPathAJAX(WGS_points, latt, lngg, i) {
        var xhr = new XMLHttpRequest();
        var url = "https://api.odsay.com/v1/api/searchPubTransPathT?SX=" + WGS_points[i][1] + "&SY=" + WGS_points[i][0] + "&EX=" + lngg + "&EY=" + latt + "&apiKey=6g%2BFZMSoP6lKIQicoZdy5Q";
        xhr.open("GET", url, false);
        // xhr.send();
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(WGS_points[i][1]);

                console.log((JSON.parse(xhr.responseText))["result"]["path"][0].info.firstStartStation, (JSON.parse(xhr.responseText))["result"]["path"][0].info.lastEndStation); // <- xhr.responseText 로 결과를 가져올 수 있음

                let bus = (JSON.parse(xhr.responseText))["result"].busCount,
                    subway = (JSON.parse(xhr.responseText))["result"].subwayCount,
                    subwayBus = (JSON.parse(xhr.responseText))["result"].subwayBusCount;

                let totalwayCount = bus + subway + subwayBus;

                // console.log("bus", bus);
                // console.log("subway", subway);
                // console.log("subwayBus", subwayBus);
                // console.log("총 가는 방법 수 >>", totalwayCount);

                let timeArr = [],
                    minTime = 0,
                    index;

                for (let t = 0; t < totalwayCount; t++) {
                    timeArr[t] = (JSON.parse(xhr.responseText))["result"]["path"][t].info.totalTime;
                    // console.log("timeArr", (JSON.parse(xhr.responseText))["result"]["path"][t].info.totalTime);
                }

                console.log("timeArr >> ", timeArr);

                for (let t = 0; t < totalwayCount; t++) {
                    if (!minTime) {
                        minTime = timeArr[t];
                    }

                    if (timeArr[t] <= minTime) {
                        minTime = timeArr[t];
                        index = t;
                    }
                }
                console.log(minTime);
                console.log(index);
                mmm.unshift([i, index]);
                console.log("[출발지, 소요시간]", mmm);
            }
        };
        xhr.send(); //동기호출
    }

    function getAddr(WGS_points, Title, c_Lat, c_Lng) {
        let geocoder = new kakao.maps.services.Geocoder();
        let coord = new kakao.maps.LatLng(c_Lat, c_Lng);

        var p_latlng = [];
        var nth_gu = 0;

        let callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                console.log("무게중심 지역구 >>", result[0].address.region_2depth_name);       //콘솔창에 현재위치

                var select = result[0].address.region_2depth_name;
                // var p_latlng = [];
            }

            for (let i = 0; i < (STA)["station"].length; i++) {
                if (select == (STA)["station"][i].region_name) {

                    var info_len = (STA)["station"][i]["info"].length;

                    for (let p = 0; p < info_len; p++) {
                        console.log((STA)["station"][i]["info"][p].PstationName);
                        let p_lat = (STA)["station"][i]["info"][p].y,
                            p_lng = (STA)["station"][i]["info"][p].x;

                        p_latlng[p] = [p_lat, p_lng];
                        nth_gu = i;
                    }
                }
            }
            console.log(p_latlng);

            let container = document.getElementById('myMap'),
                mapOption = {
                    center: new kakao.maps.LatLng(c_Lat, c_Lng),
                    level: 9
                };
            const map = new kakao.maps.Map(container, mapOption);

            let imageSrc_star = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                imageSrc_red = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';

            for (let i = 0; i < WGS_points.length; i++) {    //출발지 마커
                let imageSize_star = new kakao.maps.Size(24, 35);
                let markerImage_star = new kakao.maps.MarkerImage(imageSrc_star, imageSize_star);
                var marker_star = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(WGS_points[i][0], WGS_points[i][1]),
                    title: Title[i],
                    image: markerImage_star,
                    clickable: true
                });

                var infowindow_star = new kakao.maps.InfoWindow({
                    content: '<div style="padding:5px;">' + Title[i] + '</div>',
                    removable: true
                });
                (function (marker_star, infowindow_star) {
                    kakao.maps.event.addListener(marker_star, 'click', function () {
                        infowindow_star.open(map, marker_star);
                    });
                })(marker_star, infowindow_star);
            }

            var marker_blue = new kakao.maps.Marker({    //1차 중간지점 마커
                position: new kakao.maps.LatLng(c_Lat, c_Lng),
                map: map,
                clickable: true
            });

            var infowindow_blue = new kakao.maps.InfoWindow({
                content: '<div style="padding:5px;">중심 지역구 : ' + select + '</div>',
                removable: true
            });

            kakao.maps.event.addListener(marker_blue, 'click', function () {
                infowindow_blue.open(map, marker_blue);
            });

            for (let i = 0; i < p_latlng.length; i++) {    //중간지점 지역구 지하철역 마커
                let imageSize_red = new kakao.maps.Size(35, 40);
                let markerImage_red = new kakao.maps.MarkerImage(imageSrc_red, imageSize_red);
                var marker_red = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(p_latlng[i][0], p_latlng[i][1]),
                    title: (STA)["station"][nth_gu]["info"][i].PstationName,
                    image: markerImage_red,
                    clickable: true
                });

                var infowindow_red = new kakao.maps.InfoWindow({
                    content: '<div style="padding:5px;">' + (STA)["station"][nth_gu]["info"][i].PstationName + '</div>',
                    removable: true
                });
                (function (marker_red, infowindow_red) {
                    kakao.maps.event.addListener(marker_red, 'click', function () {
                        // infowindow_star.open(map, marker_star);
                        infowindow_red.open(map, marker_red);
                    });
                })(marker_red, infowindow_red);
            }
            marker_star.setMap(map);
            marker_blue.setMap(map);
            marker_red.setMap(map);

            let overlay = document.querySelector('#overlay'),
                sta_wrap = document.createElement('div'),
                info = document.createElement('div'),
                hr = document.createElement('hr');

            sta_wrap.id = "sta_wrap";
            sta_wrap.className = "bg_white";
            overlay.appendChild(sta_wrap);

            info.innerHTML = '<div style="padding:5px;">' + select + '에 추천역 ' + info_len + '개</div>';
            sta_wrap.appendChild(info);

            sta_wrap.appendChild(hr);

            for (let i = 0; i < p_latlng.length; i++) {
                let new_sta = document.createElement('a');
                new_sta.innerHTML = '<div>' + (STA)["station"][nth_gu]["info"][i].PstationName + ' 길찾기</div>';
                // '<div style="padding:5px;">' + (STA)["station"][nth_gu]["info"][i].PstationName + '</div>';
                new_sta.href = "https://map.kakao.com/link/to/" + (STA)["station"][nth_gu]["info"][i].PstationName + "," + p_latlng[i][0] + "," + p_latlng[i][1];
                sta_wrap.appendChild(new_sta);
            }

            // for (let p = 0; p < p_latlng.length; p++) {  //나중에 시간있으면 추가
            //     for (let i = 0; i < WGS_points.length; i++) {
            //         searchPubTransPathAJAX(WGS_points, p_latlng[p][0], p_latlng[p][1], i);
            //     }
            // }

            // }
        }
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }

    return (
        <>
            <div id="myMap"
                // style={{
                //     width: '350px',
                //     height: '400px',
                // }}
                style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', }}>
            </div>


            <div id="overlay">
                <div id="menu_wrap" className="bg_white">
                    <div className='start_b'>
                        <button onClick={() => start(addLatlng, addLoc)}>중간 장소 보기</button>
                        <button className='addbtn' onClick={() => buttonAdd(searchPlace)}>출발지 추가하기</button>
                        <div>{addLoc.map((a) => (<div key={a} className='submitAddress'>{a}</div>))}</div>
                    </div>
                    <hr></hr>
                </div>
            </div>

            {/* <Mapcopy title={addLoc} latlng={addLatlng} /> */}

            {/* <button className='addbtn' onClick={() => buttonAdd(InputText)}>+</button>
            <button onClick={() => start(addLatlng, addLoc)}>중간 장소 보기</button>
            <div>{addLoc.map((a) => (<div key={a} className='submitAddress'>{a}</div>))}</div> */}

        </>
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

function getUnitvec(poly_points, center_x, center_y, key, new_l, new_r) {
    let unitVec = [];
    for (let i = 0; i < poly_points.length; i++) {
        unitVec[i] = [poly_points[i][0] - center_x, poly_points[i][1] - center_y];
    }
    // console.log("각 출발지까지 단위벡터", unitVec);

    let addWeight = [],
        weigtVec = [];

    addWeight[0] = 0;
    addWeight[1] = 0;

    let key2 = 0;

    for (let i = 0; i < unitVec.length; i++) {
        if (key == 1) {
            if (new_l.length >= 3 * new_r.length) {
                for (let temp = 0; temp < new_l.length; temp++) {
                    addWeight[0] += (unitVec[temp][0]); // 가중치 * 1.2
                    addWeight[1] += (unitVec[temp][1]);
                }
                for (let temp = new_l.length; temp < new_l.length + new_r.length; temp++) {
                    addWeight[0] += (unitVec[temp][0] * 1.4);
                    addWeight[1] += (unitVec[temp][1] * 1.4);
                }
            }
            else if (new_r.length >= 3 * new_l.length) {
                for (let temp = 0; temp < new_l.length; temp++) {
                    addWeight[0] += (unitVec[temp][0] * 1.4);
                    addWeight[1] += (unitVec[temp][1] * 1.4);
                }
                for (let temp = new_l.length; temp < new_l.length + new_r.length; temp++) {
                    addWeight[0] += (unitVec[temp][0]); // 가중치 * 1.2
                    addWeight[1] += (unitVec[temp][1]);
                }
            }
            else {
                key2 = 2;
                addWeight[0] += unitVec[i][0];
                addWeight[1] += unitVec[i][1];
            }
        }
        else if (key == 0) {
            addWeight[0] += unitVec[i][0];
            addWeight[1] += unitVec[i][1];
        }
    }
    weigtVec[0] = [addWeight[0] / unitVec.length, addWeight[1] / unitVec.length];

    return {
        unitVec: unitVec,
        addWeight: addWeight,
        errVec_x: weigtVec[0][0],
        errVec_y: weigtVec[0][1],
        weigtVec_x: weigtVec[0][0],
        weigtVec_y: weigtVec[0][1],
        goC_2: key2
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