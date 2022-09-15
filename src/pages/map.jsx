import React, { Component, useState } from 'react';
import { Nav_bar } from '../components/Nav_bar';
import {Mapbody} from '../components/mapbody.jsx';
import { Routes, Route, Link } from 'react-router-dom'

export function Map(props) {
    return (
        <div className='home'>
            <Nav_bar/>
            <Mapbody/>
        </div>
    )
}
export default Map;