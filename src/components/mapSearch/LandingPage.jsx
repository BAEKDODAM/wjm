import React, { useState, useEffect } from 'react'
import ClickAdd from './ClickAdd';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SearchIcon from '../../images/search.png';
import { Routes, Route, Link } from 'react-router-dom'
import searchBtn from '../../images/search.png'
import Pointer from '../../images/pointer.png'
import Target from '../../images/target.png'
const { kakao } = window;

export function LandingPage(props) {
  const [InputText, setInputText] = useState('')
  const [Place, setPlace] = useState('') //지도에 반영
  let [location, setLocation] = useState([]);
  let [clickPlace, setClickPlace] = useState([]);
  let [name, setName] = useState([]);
  let [lat, setLat] = useState([]);
  let [lng, setLng] = useState([]);
  let [address, setAddress] = useState([]);

  useEffect(() => {

    let container = document.getElementById('myMap'),
      mapOption = {
        center: new kakao.maps.LatLng(37.566826004661, 126.978652258309), // 지도의 중심좌표
        level: 9 // 지도의 확대 레벨
      };

    // 지도를 생성합니다    
    let map = new kakao.maps.Map(container, mapOption);

    const ps = new kakao.maps.services.Places();

    searchPlaces()

    function searchPlaces() {

      // if (!Place.replace(/^\s+|\s+$/g, '')) {
      //   alert('키워드를 입력해주세요!');
      //   return false;
      // }

      // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
      ps.keywordSearch(Place, placesSearchCB);
    }

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면
        // 검색 목록을 표출합니다
        displayPlaces(data);

        displayPagination(pagination);

      }
      else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;
      }
      else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
      }

    }

    // 검색 결과 목록과 마커를 표출하는 함수입니다
    function displayPlaces(places) {
      var listEl = document.getElementById('placesList'),
        menuEl = document.getElementById('menu_wrap'),
        fragment = document.createDocumentFragment(),
        listStr = '';

      // 검색 결과 목록에 추가된 항목들을 제거합니다
      removeAllChildNods(listEl);

      for (var i = 0; i < places.length; i++) {

        // 마커를 생성하고 지도에 표시합니다
        // var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
        var itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

        // let form_2 = document.querySelector('#form_2');

        (function (address_name, lat, lng, place_name) {
          itemEl.onclick = function () {
            // setPlace(address_name);
            // setInputText(address_name);

            // e.preventDefault();
            // setPlace(address_name);
            setClickPlace(address_name)
            setLat(lat);
            setLng(lng);
            setName(place_name)

          }
        })(places[i].address_name, places[i].y, places[i].x, places[i].place_name);


        fragment.appendChild(itemEl);
      }

      // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
      listEl.appendChild(fragment);
      menuEl.scrollTop = 0;
    }

    // 검색결과 항목을 Element로 반환하는 함수입니다
    function getListItem(index, places) {

      var el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
          '<div class="info">' +
          '   <h5>' + places.place_name + '</h5>';

      itemStr += '    <span>' + places.address_name + '</span>';

      el.innerHTML = itemStr;
      el.className = 'item';

      return el;
    }


    // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
    function displayPagination(pagination) {
      var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i;

      // 기존에 추가된 페이지번호를 삭제합니다
      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }

      for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
          el.className = 'on';
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i);
            }
          })(i);
        }

        fragment.appendChild(el);
      }
      paginationEl.appendChild(fragment);
    }

    // 검색결과 목록의 자식 Element를 제거하는 함수입니다
    function removeAllChildNods(el) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    }
  }, [Place]);

  const onChange = (e) => {
    setInputText(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(InputText);
  }

  function getAddr(lat, lng) {
    let geocoder = new kakao.maps.services.Geocoder();

    let coord = new kakao.maps.LatLng(lat, lng);
    let callback = function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        console.log(result[0].address.address_name);       //콘솔창에 현재위치

        let addr = result[0].address.address_name;
        setInputText(addr);
        // setLocation(addr);
      }
    }
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  }

  function set_loc() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let current_lat = position.coords.latitude,
          current_lon = position.coords.longitude;
        getAddr(current_lat, current_lon);
      })
    }
  }

  // {/* {() => {{searchPlaces();return false;}}} */ }
  // {/* {() => { searchPlaces() }} */ }

  return (
    <div className='start_b'>
{/* dd
        <form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail" >
              <Form.Control placeholder="주소를 입력하세요" onChange={onChange} value={InputText} />
          </Form.Group>
          <Button type="submit"><img height="20px" src={SearchIcon}/></Button>
        </form>
        <ClickAdd searchPlace={Place} InputText={InputText} setAddress={setAddress}/>
        <Link to='/find'><button className='searchBtn'>중간 지점 찾기</button></Link>
  */}

      <hr style={{
        margin: '20px'
      }}></hr>

      {/* <form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail" >
          <Form.Control placeholder='주소를 입력하세요' onChange={onChange} value={InputText} />
        </Form.Group>
        <Button type="submit"><img height="20px" src={SearchIcon} /></Button>
      </form> */}

      <div className="map_wrap">
        <ClickAdd searchPlace={clickPlace} InputText={InputText} lat={lat} lng={lng} name={name} />
        <div id="menu_wrap2" className="bg_white">
          <div className="option">
            <div>
              {/* <form id="form_2" onSubmit={() => { searchPlaces() }}> */}
              <form id="form_2" onSubmit={handleSubmit}>
                <button className='sBtn' onClick={() => { set_loc() }}
                  style={{
                    margin: '5px'
                  }}><img src={Target}  width='25px'></img></button>
                <input type="text" onChange={onChange} value={InputText} id="keyword" size="32" ></input>
                <button type="submit" className='sBtn'><img src={searchBtn} width="18px"></img></button>
              </form>
            </div>
          </div>
          <hr></hr>
          <ul id="placesList"></ul>
          <div id="pagination"></div>
        </div>
      </div>
    </div >
  )
}

export default LandingPage
