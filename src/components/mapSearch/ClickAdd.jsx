// import { NULL } from 'node-sass';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import STA from './sta.json';
import SEOUL from './seoul.json';

const { kakao } = window

export function ClickAdd({ searchPlace, lat, lng, name }) {
    let [location, setLocation] = useState([]); //입력된 주소
    let [addLoc, setAddLoc] = useState([]); //추가된 주소
    let [latlng, setLatlng] = useState([]); //입력 좌표
    let [addLatlng, setAddLatlng] = useState([]);  // 추가 좌표
    let [index, setIndex] = useState([]);
    let [hotPlace, setHotPlace] = useState([]);
    let mmm = [];
    let www = [];
    let kkk = [];
    let ggg = [];

    useEffect(() => {
        if (lat != null) {
            let container = document.getElementById('myMap'),
                mapOption = {
                    center: new kakao.maps.LatLng(37.566826004661, 126.978652258309),
                    level: 6
                };

            // 지도를 생성합니다    
            let map = new kakao.maps.Map(container, mapOption);

            let new_location = [...location];
            new_location.unshift(searchPlace); //검색한 주소를 새로운 배열에 선언
            setLocation(new_location); // 검색 될 때 마다 값 바꿈

            let coords = new kakao.maps.LatLng(lat, lng);

            console.log("새로 검색한 좌표", lat, lng);

            let new_latlng = [...latlng];
            new_latlng.unshift([Number(lat), Number(lng)]); //검색한 주소의 좌표
            setLatlng(new_latlng);

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
        }

    }, [searchPlace, lat, lng, name])

    const reload = () => {
        window.location.replace("/start");
    }

    const buttonAdd = (intext) => {
        if ((location.includes(intext) & !addLoc.includes(intext)) && intext != "") {
            let new_addLoc = [...addLoc];
            new_addLoc.unshift(intext);
            setAddLoc(new_addLoc);
            console.log("추가한 주소이름", new_addLoc);

            let new_addLatlng = [...addLatlng];
            new_addLatlng.unshift(latlng[0]);
            setAddLatlng(new_addLatlng);
            console.log("추가한 좌표값", new_addLatlng);

            let new_index = [...index];
            new_index.unshift(new_addLoc.length - new_addLoc.indexOf(intext));
            setIndex(new_index);
            console.log("추가한 인덱스값", new_index);
        }
        else {
            alert('장소 클릭 후 눌러주세요.');
            return;
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

            // let map_wrap = document.querySelector('.map_wrap'),    // 검색창 사라지기
            //     menu_wrap2 = document.querySelector('#menu_wrap2');
            // map_wrap.removeChild(menu_wrap2);

            gtot(WGS_points, WTM_points);   // WGS좌표계 리스트를 WTM좌표계 리스트로 변환

            console.log("직교 좌표계로 변환된 리스트", WTM_points);

            let split_l = splitList(WTM_points).ll,     // 중심선 기준 왼쪽, 오른쪽으로 리스트 나누기
                split_r = splitList(WTM_points).lr;

            var new_l = sort(split_l).asc,    // 리스트 정렬 
                new_r = sort(split_r).des;

            console.log("기준선 왼쪽 리스트", new_l);
            console.log("기준선 오른쪽 리스트", new_r);

            var poly_points = new_l.concat(new_r);  // 정렬된 두개 리스트 합침

            console.log("정렬된 리스트", poly_points);

            if (WTM_points.length === 2) {      // 사용자 두명일 떄 무게중심 좌표 
                var center_x = getCentroid(poly_points).x2,
                    center_y = getCentroid(poly_points).y2;
            }
            else {                              // 두명 이상일 떄 무게중심 좌표 
                var center_x = getCentroid(poly_points).x,
                    center_y = getCentroid(poly_points).y;
            }
        }
        else {
            alert('출발지를 최소 두개 이상 입력한 다음 눌러주새요.');
            return;
        }

        console.log("무게중심 좌표(WTM)", center_x, center_y);

        let c_Lat = ttog(center_x, center_y).lat,   // 현재 WTM좌표계인 무게중심 좌표를 다시 WGS좌표계로 변환
            c_Lng = ttog(center_x, center_y).lng;

        console.log("무게중심 좌표(WGS)", c_Lat, c_Lng);


        for (let i = 0; i < WGS_points.length; i++) {
            searchPubTransPathAJAX(WGS_points, c_Lat, c_Lng, i);
        }

        // console.log("소요시간 리스트", mmm);
        console.log("가중치 추가 리스트", www);
        console.log("가중치 없는 리스트", kkk);
        console.log("가중치 값 리스트", ggg);

        // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ가중치 추가하기ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

        let unitVec = getUnitvec(WGS_points, center_x, center_y, www, kkk, ggg).unitVec,
            errVec_x = getUnitvec(WGS_points, center_x, center_y, www, kkk, ggg).errVec_x,
            errVec_y = getUnitvec(WGS_points, center_x, center_y, www, kkk, ggg).errVec_y;

        console.log("각 출발지까지 단위벡터", unitVec);
        console.log("n빵해서 각 단위벡터에 더하는 값", errVec_x, errVec_y);

        let addWeight = getUnitvec(unitVec, errVec_x, errVec_y, www, kkk, ggg).addWeight,
            weigtVec_x = getUnitvec(unitVec, errVec_x, errVec_y, www, kkk, ggg).weigtVec_x,
            weigtVec_y = getUnitvec(unitVec, errVec_x, errVec_y, www, kkk, ggg).weigtVec_y;

        console.log("단위벡터 합(가중치 없으면 0에 수렴)", addWeight[0], addWeight[1]);
        console.log("가중치 포함된 무게중심 단위벡터(가중치 없으면 0에 수렴)", weigtVec_x, weigtVec_y);

        let center_x2 = getNewcenter(weigtVec_x, center_x, weigtVec_y, center_y).center_x2,
            center_y2 = getNewcenter(weigtVec_x, center_x, weigtVec_y, center_y).center_y2;

        console.log("새로운 중간지점(WTM)", center_x2, center_y2);

        var c_Lat2 = ttog(center_x2, center_y2).lat,   // 현재 WTM좌표계인 무게중심 좌표를 다시 WGS좌표계로 변환
            c_Lng2 = ttog(center_x2, center_y2).lng;

        console.log("새로운 중간지점(WGS)", c_Lat2, c_Lng2);

        console.log("< 새로운 중간지점은 처음 무게중심좌표와 같을 수 있음 >");

        // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

        selectArea(WGS_points, Title, c_Lat, c_Lng, c_Lat2, c_Lng2);    //지역구 선택

    }

    function selectArea(WGS_points, Title, c_Lat, c_Lng, c_Lat2, c_Lng2) {

        let sta_wrap = document.querySelector('#sta_wrap'),
            info = document.querySelector('#info');

        sta_wrap.style.display = "none";

        if (info) {
            while (sta_wrap.hasChildNodes()) {
                sta_wrap.removeChild(sta_wrap.lastChild);
            }
        }

        let data = (SEOUL)["features"];
        let coordinates = [];    //좌표 저장 배열
        let name = '';           //행정구 이름
        let polygons = [];

        var mapContainer = document.getElementById('myMap'),
            mapOption = {
                center: new kakao.maps.LatLng(c_Lat, c_Lng),
                level: 8
            };

        var map = new kakao.maps.Map(mapContainer, mapOption),
            customOverlay = new kakao.maps.CustomOverlay({});

        // 다각형을 생상하고 이벤트를 등록하는 함수입니다
        const displayGu = (coordinates, name, WGS_points, Title, c_Lat, c_Lng, c_Lat2, c_Lng2) => {
            let path = [];
            let points = [];

            coordinates[0].forEach((coordinate) => {
                let point = {};
                point.x = coordinate[1];
                point.y = coordinate[0];
                points.push(point);
                path.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));
            });

            // 다각형을 생성
            var polygon = new kakao.maps.Polygon({
                map: map,
                path: path,
                strokeWeight: 2,
                strokeColor: '#004c80',
                strokeOpacity: 0.0,
                fillColor: '#fff',
                fillOpacity: 0.0
            });

            polygons.push(polygon);

            let geocoder = new kakao.maps.services.Geocoder();
            let coord1 = new kakao.maps.LatLng(c_Lat, c_Lng),
                coord2 = new kakao.maps.LatLng(c_Lat2, c_Lng2);
            let center1,
                center2;

            let callback1 = function (result, status) {                     //무게중심 지역구 다각형
                if (status === kakao.maps.services.Status.OK) {
                    center1 = result[0].address.region_2depth_name;
                }

                if (name == center1) {
                    polygon.setOptions({
                        fillOpacity: 0.7,
                        strokeOpacity: 0.8
                    });
                    // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다 
                    kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
                        polygon.setOptions({ fillColor: '#09f' });

                        customOverlay.setContent('<div class="area">중심 지역구 : ' + center1 + '</div>');
                        customOverlay.setPosition(mouseEvent.latLng);
                        customOverlay.setMap(map);
                    });

                    // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다 
                    kakao.maps.event.addListener(polygon, 'mousemove', function (mouseEvent) {
                        customOverlay.setPosition(mouseEvent.latLng);
                    });

                    // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
                    // 커스텀 오버레이를 지도에서 제거합니다 
                    kakao.maps.event.addListener(polygon, 'mouseout', function () {
                        polygon.setOptions({ fillColor: '#fff' });
                        customOverlay.setMap(null);
                    });

                    // 클릭하면 추천 역 표시
                    kakao.maps.event.addListener(polygon, 'click', function () {
                        displayLocation(WGS_points, Title, c_Lat, c_Lng, c_Lat, c_Lng, c_Lat2, c_Lng2);
                    });
                }

                // var marker_blue = new kakao.maps.Marker({    //1차 중간지점 마커
                //     position: new kakao.maps.LatLng(c_Lat, c_Lng),
                //     map: map,
                //     clickable: true
                // });

                // var infowindow_blue = new kakao.maps.InfoWindow({
                //     content: '<div style="padding:5px;">중심 지역구 : ' + center1 + '</div>',
                //     removable: true
                // });
                // infowindow_blue.open(map, marker_blue);

                // marker_blue.setMap(map);
            }
            geocoder.coord2Address(coord1.getLng(), coord1.getLat(), callback1);

            let callback2 = function (result, status) {                     //가중치 추가된 좌표 지역구 다각형
                if (status === kakao.maps.services.Status.OK) {
                    center2 = result[0].address.region_2depth_name;
                }

                if ((center1 != center2) && (name == center2)) {
                    polygon.setOptions({
                        fillOpacity: 0.7,
                        strokeOpacity: 0.8
                    });
                    // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다 
                    kakao.maps.event.addListener(polygon, 'mouseover', function (mouseEvent) {
                        polygon.setOptions({ fillColor: '#DD1A0B' });
                        customOverlay.setContent('<div class="area">가중치 추가된 지역구 : ' + center2 + '</div>');

                        customOverlay.setPosition(mouseEvent.latLng);
                        customOverlay.setMap(map);
                    });

                    // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다 
                    kakao.maps.event.addListener(polygon, 'mousemove', function (mouseEvent) {
                        customOverlay.setPosition(mouseEvent.latLng);
                    });

                    // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
                    // 커스텀 오버레이를 지도에서 제거합니다 
                    kakao.maps.event.addListener(polygon, 'mouseout', function () {
                        polygon.setOptions({ fillColor: '#fff' });
                        customOverlay.setMap(null);
                    });

                    // 클릭하면 추천 역 표시
                    kakao.maps.event.addListener(polygon, 'click', function () {
                        displayLocation(WGS_points, Title, c_Lat2, c_Lng2, c_Lat, c_Lng, c_Lat2, c_Lng2);
                    });

                }
                // var marker_blue = new kakao.maps.Marker({    //2차 중간지점 마커
                //     position: new kakao.maps.LatLng(c_Lat2, c_Lng2),
                //     map: map,
                //     clickable: true
                // });

                // var infowindow_blue = new kakao.maps.InfoWindow({
                //     content: '<div style="padding:5px;">가중치 추가된 지역구 : ' + center2 + '</div>',
                //     removable: true
                // });
                // infowindow_blue.open(map, marker_blue);

                // marker_blue.setMap(map);

            }
            geocoder.coord2Address(coord2.getLng(), coord2.getLat(), callback2);

        }
        data.forEach((val) => {
            coordinates = val.geometry.coordinates;
            name = val.properties.SIG_KOR_NM;

            displayGu(coordinates, name, WGS_points, Title, c_Lat, c_Lng, c_Lat2, c_Lng2);
        });
    }

    // function searchPubPOIRadius(c_Lat, c_Lng, WGS_points) {                                //반경 n미터 지하철역 찾기 시간나면 추가하기
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

    function searchPubTransPathAJAX(WGS_points, c_Lat, c_Lng, i) {
        var xhr = new XMLHttpRequest();
        var url = "https://api.odsay.com/v1/api/searchPubTransPathT?SX=" + WGS_points[i][1] + "&SY=" + WGS_points[i][0] + "&EX=" + c_Lng + "&EY=" + c_Lat + "&apiKey=6g%2BFZMSoP6lKIQicoZdy5Q";
        xhr.open("GET", url, false);
        // xhr.send();
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4 && xhr.status == 200) {

                console.log("  < ", (JSON.parse(xhr.responseText))["result"]["path"][0].info.firstStartStation, "-->", (JSON.parse(xhr.responseText))["result"]["path"][0].info.lastEndStation, " >");

                let bus = (JSON.parse(xhr.responseText))["result"].busCount,
                    subway = (JSON.parse(xhr.responseText))["result"].subwayCount,
                    subwayBus = (JSON.parse(xhr.responseText))["result"].subwayBusCount;

                let totalwayCount = bus + subway + subwayBus;

                let transArr = [],
                    min_trans = 0;

                for (let t = 0; t < totalwayCount; t++) {
                    transArr[t] = (JSON.parse(xhr.responseText))["result"]["path"][t].info.busTransitCount + (JSON.parse(xhr.responseText))["result"]["path"][t].info.subwayTransitCount;
                }

                console.log("환승 횟수 리스트 >> ", transArr);

                for (let t = 0; t < totalwayCount; t++) {
                    if (!min_trans) {
                        min_trans = transArr[t];
                    }

                    if (transArr[t] <= min_trans) {
                        min_trans = transArr[t];
                    }
                }

                let transIndex = [];
                for (let i = 0; i < totalwayCount; i++) {
                    if (transArr[i] == min_trans) {
                        transIndex.push(i)
                    }
                }
                console.log("최소환승 횟수 인덱스 리스트 >> ", transIndex);

                let totalTimeArr = [],
                    timeArr = [],
                    min_time = 0;

                for (let t = 0; t < totalwayCount; t++) {
                    totalTimeArr[t] = (JSON.parse(xhr.responseText))["result"]["path"][t].info.totalTime;
                }

                console.log("소요시간 리스트 >> ", totalTimeArr);

                for (let t = 0; t < transIndex.length; t++) {
                    timeArr[t] = totalTimeArr[transIndex[t]]
                }

                console.log("최소 환승의 소요시간 리스트 >> ", timeArr);

                for (let t = 0; t < timeArr.length; t++) {
                    if (!min_time) {
                        min_time = timeArr[t];
                    }

                    if (timeArr[t] <= min_time) {
                        min_time = timeArr[t];
                    }
                }
                console.log("최소 소요시간>> ", min_time);

                mmm.push([i, min_time]);
                console.log("[출발지 인덱스, 최소 소요시간]", mmm);

                let sum = 0,
                    avg = 0;
                for (let i = 0; i < mmm.length; i++) {
                    sum += mmm[i][1]
                }

                avg = sum / mmm.length

                let needW = [],
                    noW = []

                for (let i = 0; i < mmm.length; i++) {
                    if (mmm[i][1] > avg * 1.2) {
                        needW.unshift(mmm[i][0])
                    }
                    else
                        noW.unshift(mmm[i][0])
                }

                let getW = [];
                for (let i = 0; i < needW.length; i++) {
                    getW.unshift(mmm[needW[i]][1] / (avg * 1.2))
                }

                if (mmm.length == WGS_points.length) {
                    www.unshift(needW)
                    kkk.unshift(noW)
                    ggg.unshift(getW)
                    console.log("평균 소요시간 >> ", avg);
                }
            }
        };
        xhr.send(); //동기호출하기
    }

    function displayLocation(WGS_points, Title, c_Lat0, c_Lng0, c_Lat, c_Lng, c_Lat2, c_Lng2) {
        let geocoder = new kakao.maps.services.Geocoder();
        let coord = new kakao.maps.LatLng(c_Lat0, c_Lng0);

        var p_latlng = [];
        var nth_gu = 0;

        let callback = function (result, status) {

            midAreaHot(result[0].address.region_2depth_name) // *********

            if (status === kakao.maps.services.Status.OK) {
                console.log("무게중심 지역구 >>", result[0].address.region_2depth_name);       //콘솔창에 현재 지역구 위치

                var select = result[0].address.region_2depth_name;
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
                    center: new kakao.maps.LatLng(c_Lat0, c_Lng0),
                    level: 8
                };
            let map = new kakao.maps.Map(container, mapOption);

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
                    content: '<div style="padding:5px; width:200px">' + Title[i] + '</div>',
                    removable: true
                });
                infowindow_star.open(map, marker_star);
            }

            // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ매장정보 표시 추가하기ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

            for (let i = 0; i < p_latlng.length; i++) {       //중간지점 지역구 지하철역 마커    << 포문 범위 매장 정보 길이로 바꾸기
                let imageSize_red = new kakao.maps.Size(35, 40);
                let markerImage_red = new kakao.maps.MarkerImage(imageSrc_red, imageSize_red);
                var marker_red = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(p_latlng[i][0], p_latlng[i][1]),    // << 매장 좌표로 바꾸기
                    title: (STA)["station"][nth_gu]["info"][i].PstationName,            // << 매장 이름으로 바꾸기
                    image: markerImage_red,
                    clickable: true
                });

                var infowindow_red = new kakao.maps.InfoWindow({
                    content: '<div style="padding:5px;">' + (STA)["station"][nth_gu]["info"][i].PstationName + '</div>',    // << 매장 이름으로 바꾸기, 길찾기 링크 추가
                    removable: true
                });
                (function (marker_red, infowindow_red) {
                    kakao.maps.event.addListener(marker_red, 'click', function () {
                        infowindow_red.open(map, marker_red);
                    });
                })(marker_red, infowindow_red);
            }
            marker_star.setMap(map);
            marker_red.setMap(map);

            // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ매장정보 표시 추가하기ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ            


            let sta_wrap = document.querySelector('#sta_wrap'),
                back = document.createElement('button'),
                info = document.createElement('div'),
                hr = document.createElement('hr');

            sta_wrap.style.display = "flex";

            back.innerHTML = '지역구 다시 선택하기';
            back.id = "back_btn";
            back.addEventListener("click", function () {
                selectArea(WGS_points, Title, c_Lat, c_Lng, c_Lat2, c_Lng2);
            })
            info.innerHTML = select + '인근 추천역 ' + info_len + '개';
            info.id = "info";
            hr.id = "hr";

            sta_wrap.appendChild(back);
            sta_wrap.appendChild(info);
            sta_wrap.appendChild(hr);

            for (let i = 0; i < p_latlng.length; i++) {
                let new_sta = document.createElement('a');
                new_sta.id = "new_sta";
                new_sta.innerHTML = '<div>' + (STA)["station"][nth_gu]["info"][i].PstationName + ' 길찾기 ></div>';
                new_sta.href = "https://map.kakao.com/link/to/" + (STA)["station"][nth_gu]["info"][i].PstationName + "," + p_latlng[i][0] + "," + p_latlng[i][1];
                sta_wrap.appendChild(new_sta);
            }

            // for (let p = 0; p < p_latlng.length; p++) {                         //나중에 시간있으면 추가
            //     for (let i = 0; i < WGS_points.length; i++) {
            //         searchPubTransPathAJAX(WGS_points, p_latlng[p][0], p_latlng[p][1], i);
            //     }
            // }

            // }
        }
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }

    function midAreaHot(midArea) {
        let seoulGu = ['도봉구', '강북구', '노원구', '성북구', '중랑구', '은평구', '서대문구', '종로구', '동대문구', '중구', '성동구', '광진구', '마포구', '용산구', '강서구', '양천구', '영등포구', '구로구', '금천구', '관악구', '동작구', '서초구', '강남구', '송파구', '강동구']
        if (seoulGu.includes(midArea)) {
            axios.get("http://3.37.178.135/api/restaurants", {
                params: { area: midArea } //
            })
                .then((i) => {
                    let copy = []
                    for (let j in i.data) {
                        copy.push(i.data[j])
                    }
                    setHotPlace(copy)
                    // hotPlace 리스트에 담기(setHotPlace(copy)-> 뒤에 리턴문 앞에 리스트 map해서 <div> 출력하도록 코드작성
                })
                .catch(() => {
                    console.log("실패")
                })
        }
    }

    // let geocoder = new kakao.maps.services.Geocoder();
    // let hpx = 0
    // let hpy = 0
    // let callback = function (result, status) {
    //     if (status === kakao.maps.services.Status.OK) {
    //         console.log("geocoder", result);
    //         hpx = result[0].x
    //         hpy = result[0].y
    //         console.log('좌표', hpx, hpy)
    //     }
    // };
    // geocoder.addressSearch("서울 마포구 토정로 318 영우빌딩 1층 모연 마포본점", callback)

    return (
        <>
            <div id="myMap"
                style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', }}>
            </div>

            <div id="overlay">
                <div id="menu_wrap" className="bg_white">
                    <div className='start_bd'>
                        <button type="button" onClick={() => reload()}>다시하기</button>
                        <button className='addbtn' onClick={() => start(addLatlng, addLoc)}>중간 장소 찾기</button>
                        <button className='addbtn' onClick={() => buttonAdd(searchPlace)}>출발지 추가</button>
                        {/* <div>{addLoc.map((a) => (<div key={a} className='submitAddress'>{a}</div>))}</div> */}
                        <div>{addLoc.map((a, i) => (

                            <div key={i} className='submitAddress'>
                                <div>{a}</div>
                                <button className="deleteBtn" onClick={() => {
                                    let copy = [...addLoc];
                                    let copy2 = [...addLatlng];
                                    copy.splice(i, 1)
                                    copy2.splice(i, 1)
                                    setAddLoc(copy);
                                    setAddLatlng(copy2)
                                }}>X</button>
                            </div>))}
                        </div>
                    </div>
                    <hr></hr>
                </div>
                <div id="sta_wrap" className="bg_white">
                </div>
            </div>

            <div className='hotPlace'>
                {hotPlace.length > 0 ? <div className='hotPlaceTitle'>hot place list</div> : null}
                {
                    hotPlace.map((a, i) => (
                        //geocoder.addressSearch(a.address)
                        <div className='hotPlace1' key={i} onClick={() => {
                            window.location.href = `https://map.kakao.com/link/search/${a.address}`
                        }}>
                            <a className='hpName'>{a.name}</a>
                            <br />{a.address}
                            <br />{a.keyword}
                        </div>
                    ))
                }
            </div>
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

function getUnitvec(WGS_points, center_x, center_y, www, kkk, ggg) {
    let unitVec = [];
    for (let i = 0; i < WGS_points.length; i++) {
        unitVec[i] = [WGS_points[i][0] - center_x, WGS_points[i][1] - center_y];
    }
    // console.log("각 출발지까지 단위벡터", unitVec);

    let addWeight = [],
        weigtVec = [];

    addWeight[0] = 0;
    addWeight[1] = 0;

    if (www != null) {
        for (let i = 0; i < www[0].length; i++) {
            addWeight[0] += (unitVec[www[0][i]][0] * ggg[0][i]);  // ggg는 가중치 값
            addWeight[1] += (unitVec[www[0][i]][1] * ggg[0][i]);
        }
    }
    for (let i = 0; i < kkk[0].length; i++) {
        addWeight[0] += unitVec[kkk[0][i]][0];
        addWeight[1] += unitVec[kkk[0][i]][1];
    }

    weigtVec[0] = [addWeight[0] / unitVec.length, addWeight[1] / unitVec.length];

    return {
        unitVec: unitVec,
        addWeight: addWeight,
        errVec_x: weigtVec[0][0],
        errVec_y: weigtVec[0][1],
        weigtVec_x: weigtVec[0][0],
        weigtVec_y: weigtVec[0][1]
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