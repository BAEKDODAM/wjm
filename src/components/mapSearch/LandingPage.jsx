import React, { useState, useEffect } from 'react'
import ClickAdd from './ClickAdd';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SearchIcon from '../../images/search.png';
import { Routes, Route, Link } from 'react-router-dom'

function LandingPage(props) {
  const [InputText, setInputText] = useState('')
  const [Place, setPlace] = useState('')
  let [address, setAddress] = useState([]);


  const onChange = (e) => {
    setInputText(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setPlace(InputText)
    //setInputText('')
  }

  return (
    <div className='start_b'>

        <form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail" >
              <Form.Control placeholder="주소를 입력하세요" onChange={onChange} value={InputText} />
          </Form.Group>
          <Button type="submit"><img height="20px" src={SearchIcon}/></Button>
        </form>
        <ClickAdd searchPlace={Place} InputText={InputText} setAddress={setAddress}/>
        <Link to='/find'><button className='searchBtn'>중간 지점 찾기</button></Link>
        {/*location.map((a)=>(<div className='submitAddress'>{a}</div>))*/}
        { /*address.length>0 ? <Link to='/find'><button className='searchBtn'>중간 지점 찾기</button></Link> : null }
        address.length<=0 ? null : <Link to='/find'><button className='searchBtn'>중간 지점 찾기</button></Link> */}

        
    </div>
  )
}

export default LandingPage