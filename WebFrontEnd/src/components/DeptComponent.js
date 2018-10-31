import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { Cascader } from 'antd'

export default class DeptComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deptlist: []
        }       
    }

    componentDidMount() {
        this.getDeptSchema();        
    }      

    getDeptSchema() {
        const _this = this;
        var serverURL = 'http://192.168.1.14:8088';
        const url = serverURL + '/dept/searchDeptTree?deptId=' + this.props.deptid + '&deptType=' + this.props.deptType + '&range=' + this.props.range;
        fetch(url, { method: "get" }).then(function (data) {
            data.json().then(function (obj) {
                if (obj.success == true) {    
                    _this.setState({
                        deptlist: obj.data
                    });
                    
                }
            })
        }).then(function (data) {
        }).catch(function (error) {
        })
    }

    filter = (inputValue, path) => {
        return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    }    

    displayRender = (labels, selectedOptions) => labels.map((label, i) => {
        const option = selectedOptions[i];
        if (i === labels.length - 1) {
            return <span key={option.value}>{label} </span>;
        }
        return '';
    })
    

    render() {        
        return (
            <Cascader
                options={this.state.deptlist}
                onChange={this.props.callbackDeptChange}
                placeholder="请选择"
                showSearch={this.filter}
                displayRender={this.displayRender}
                popupPlacement="bottomLeft"
                changeOnSelect
                expandTrigger='hover'
                defaultValue={this.props.defaultDept}
            />
        );
    }
}