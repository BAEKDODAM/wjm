import React, { Component, useState } from 'react';
import FindC from '../components/find/findC'
import Nav_bar from '../components/Nav_bar';
export function Find(props) {
    return (
        <div>
            <Nav_bar/>
            <FindC/>
        </div>
    )
}
export default Find;