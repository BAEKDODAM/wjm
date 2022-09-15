import React, { Component, useState } from 'react';
import {Stack, Button} from 'react-bootstrap';
import Main from '../images/main1.png';
import { Routes, Route, Link } from 'react-router-dom'

export function Homebody(props) {
    return (
        <div className='home_container'>
            <div className='intro'>
                <div className='intro2'>
                    <div className='title'>우리 지금 만나</div>
                    <p>어디서 만날지 고민될 때,</p>
                    <p>좋은 모임 장소를 추천받고 싶을 때</p>
                </div>
                <img src={Main} max-width="500px"/>
            </div>
            <div className='home-btn'>
                <Link to="/login" className='home_d1'>
                    <div>로그인하면 모임을 저장할 수 있어요
                        <br/><span>로그인하기</span>
                    </div>
                    {/*<button>시작하기</button>*/}
                </Link>

                <Link to="/start" className='home_d2'>
                    키워드를 선택하고 원하는 모임장소를 찾을 수 있어요
                    <span>중간 장소 찾기</span>
                </Link>
            </div>
            <a href="http://www.freepik.com">Designed by stories / Freepik</a>
            
        </div>
    )
}
export default Homebody;