import React, { Component, useState } from 'react';

export function Homebody(props) {
    return (
        <div className='home_container'>
            <div className='home_d1'>
                <div>로그인하면
                    <br/><span>모임을 저장할 수 있어요</span>
                </div>
                <button>시작하기</button>
            </div>
            <div className='home_d2'>
                키워드 선택하고
                <span>중간 장소 찾기</span>
            </div>
            <div></div>
        </div>
    )
}
export default Homebody;