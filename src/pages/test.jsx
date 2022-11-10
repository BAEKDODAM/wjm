import React, { Component, useState } from 'react';
import axios from 'axios';
export function Test() {
    return (
        <div >
            <button onClick={()=>{
                axios.get("http://3.37.178.135/api/restaurants", {
                    params:{ area: "마포구"}
                })
                .then((i)=>{
                    console.log(i.data)
                })
                .catch(()=>{
                    console.log("실패")
                })
            }}>get</button>
            <button onClick={()=>{
                axios.post("http://3.37.178.135/api/restaurants",{//'https://v4pgx58jg6.execute-api.ap-northeast-2.amazonaws.com/hello/api/intro',{
                    restauratId:3,
                    name: "test",
                    area: "마포구",
                    address:"test",
                    keyword:"카페"
                })
                .then((j)=>{
                    console.log(j)
                })
                .catch(()=>{
                    console.log("실패")
                })
            }}>post</button>
        </div>
    )
}
export default Test;