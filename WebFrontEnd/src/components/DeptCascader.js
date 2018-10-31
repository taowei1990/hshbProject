import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { Cascader } from 'antd'
import DeptComponent from './DeptComponent'

let ctrl_name = ''
let defaultdept = []



class DeptCascaderWrap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deptid: document.getElementById('container_dept').getAttribute('deptid'),
            range: document.getElementById('container_dept').getAttribute('range'),
            deptType: document.getElementById('container_dept').getAttribute('depttype')
        };
        ctrl_name = document.getElementById('container_dept').getAttribute('ctrl_name');
    }

    componentWillMount() {
        var defaultvalue = document.getElementsByName(ctrl_name)[1].value;
        if (defaultvalue != '') {
            defaultdept = defaultvalue.split(',')
        }
    }

    deptOnChange = (value, selectedOptions) => {
        let deptitem = selectedOptions[selectedOptions.length - 1].target + '_' + selectedOptions[selectedOptions.length - 1].label;
        document.getElementsByName(ctrl_name)[0].value = deptitem;
        document.getElementsByName(ctrl_name)[1].value = value.join();
    }

    render() {
        return (
            <DeptComponent callbackDeptChange={this.deptOnChange} defaultDept={defaultdept}
                deptid={this.state.deptid} range={this.state.range} deptType={this.state.deptType} />
        );
    }

}


ReactDOM.render(
    <DeptCascaderWrap />,
    document.getElementById('container_dept')
);