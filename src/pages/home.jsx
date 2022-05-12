import React, { Component, useState } from 'react';
import { Nav } from '../components/Nav';
import { Homebody } from '../components/homebody';

export function Home(props) {
    return (
        <div className='home'>
            <Nav/>
            <Homebody/>
        </div>
    )
}
export default Home;