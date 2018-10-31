import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import EstateTableComponent from '../../containers/manage/estatetable'



ReactDOM.render(
    <EstateTableComponent placeholder="input search text" style={{ width: 200 }} />,
    document.getElementById('container_estatelist')
);
