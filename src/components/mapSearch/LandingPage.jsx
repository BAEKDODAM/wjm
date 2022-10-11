import React, { useState, useEffect } from 'react'
import ClickAdd from './ClickAdd';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SearchIcon from '../../images/search.png';
import { Routes, Route, Link } from 'react-router-dom'
const { kakao } = window;

function LandingPage() {
  const [InputText, setInputText] = useState('') 
  const [Place, setPlace] = useState('') //지도에 반영
  let [alert, setAlert] = useState(true);
  let [location, setLocation] = useState([]);
  useEffect(()=>{
    let timer = setTimeout(()=> {
        setAlert(false);
    }, 2000);
  }, [alert]);

  const onChange = (e) => {
    setInputText(e.target.value)
    setInputText(e.target.result[0].address.address_name)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setPlace(InputText)
    //setInputText('')
  }

  function getAddr(lat, lng) {
    let geocoder = new kakao.maps.services.Geocoder();

    let coord = new kakao.maps.LatLng(lat, lng);
    let callback = function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            console.log(result[0].address.address_name);       //콘솔창에 현재위치

            let addr = result[0].address.address_name;
            setInputText(addr);
        }
    }
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  }
  
  function set_loc() {
    if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let current_lat = position.coords.latitude,
                    current_lon = position.coords.longitude;
                getAddr(current_lat,current_lon);
            })
    }
}

  return (
    <div className='start_b'>
        <div>
            {alert==true? (
                <p>주소를 자세히 적어주세요</p>
            ) : null}
        </div>
      <button onClick={() => { set_loc() }}>현재 위치 불러오기</button>

        <form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail" >
            <Form.Control placeholder= '주소를 입력하세요' onChange={onChange} value={InputText}/>
          </Form.Group>
          <Button type="submit"><img height="20px" src={SearchIcon}/></Button>
      </form>
        <ClickAdd searchPlace={Place} InputText={InputText} />
        {/* 지도 + 위치 저장 배열 */}
        {location.map((a) => (<div className='submitAddress'>{a}</div>))}
        <Link to="/mapcopy">go</Link>
    </div>
  )
}

function Message(){
    let [alert, setAlert] = useState(true);
    useEffect(()=>{
        let timer = setTimeout(()=> {
            setAlert(!alert);
        }, 2000);
    });
}

export default LandingPage