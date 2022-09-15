import React, { Component, useState } from 'react';
import { Nav_bar } from '../components/Nav_bar';
import {Startbody} from '../components/startbody.jsx';
import { Routes, Route, Link } from 'react-router-dom'

export function Start(props) {
    return (
        <div className='home'>
            <Nav_bar/>
            <Startbody/>
        </div>
    )
}
export default Start;