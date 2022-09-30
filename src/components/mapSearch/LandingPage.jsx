import React, { useState, useEffect } from 'react'
import ClickAdd from './ClickAdd';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import SearchIcon from '../../images/search.png';
function LandingPage() {
  const [InputText, setInputText] = useState('')
  const [Place, setPlace] = useState('')
  let [alert, setAlert] = useState(true);
  let [location, setLocation] = useState([]);

  useEffect(()=>{
    let timer = setTimeout(()=> {
        setAlert(false);
    }, 2000);
  }, [alert]);

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
        <div>
            {alert==true? (
                <p>주소를 자세히 적어주세요</p>
            ) : null}
        </div>
        <form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail" >
              <Form.Control placeholder="주소를 입력하세요" onChange={onChange} value={InputText} />
          </Form.Group>
          <Button type="submit"><img height="20px" src={SearchIcon}/></Button>
        </form>
        <ClickAdd searchPlace={Place} InputText={InputText}/>
        {location.map((a)=>(<div className='submitAddress'>{a}</div>))}
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