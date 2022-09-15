import React, { Component, useState } from 'react';
import Img from '../images/map_icon.png';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Routes, Route, Link } from 'react-router-dom'
import Plus from '../images/plus.png';

export function Startbody(props) {
    return (
        <div className='login_b'>
            출발지를 입력해주세요
            <Form>
                <br/>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="" />
                </Form.Group>
                <br/>
                {/*<Button className='plus'><img src={Plus}/></Button>*/}
                <Button variant="primary" type="submit">
                    중간장소찾기
                </Button>
            </Form>
        </div>
    )
}
export default Startbody;