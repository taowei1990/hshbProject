import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { Cascader, Select } from 'antd'
import DeptComponent from './DeptComponent'

const Option = Select.Option;
let ctrl_name = ''
let defaultdept = []
let defaultuser = { key: '', title: '' }



class DeptUserCascaderWrap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employlist: [],
            deptid: document.getElementById('container_deptuser').getAttribute('deptid'),
            range: document.getElementById('container_deptuser').getAttribute('range'),
            deptType: document.getElementById('container_deptuser').getAttribute('depttype')
        };
        ctrl_name = document.getElementById('container_deptuser').getAttribute('ctrl_name');
    }

    componentWillMount() {
        var defaultdeptstr = document.getElementsByName(ctrl_name)[1].value;
        if (defaultdeptstr != '') {
            defaultdept = defaultdeptstr.split(',')
        }
        var defaultuserstr = document.getElementsByName(ctrl_name)[2].value;
        if (defaultuserstr != '') {
            var userItem = defaultuserstr.split('_')
            defaultuser.key = userItem[0]
            defaultuser.title = userItem[1]
        }
    }

    componentDidMount() {
        if (defaultdept.length > 0) {
            this.loadEmployeeList(defaultdept[defaultdept.length - 1])
        }
    }

    deptOnChange = (value, selectedOptions) => {
        let deptitem = selectedOptions[selectedOptions.length - 1].target + '_' + selectedOptions[selectedOptions.length - 1].label;
        document.getElementsByName(ctrl_name)[0].value = deptitem;
        document.getElementsByName(ctrl_name)[1].value = value.join();
        this.loadEmployeeList(selectedOptions[selectedOptions.length - 1].value)
    }

    loadEmployeeList = (deptid) => {
        const _this = this
        var serverURL = 'http://192.168.1.14:8088';
        const url = serverURL + '/employee/getByDeptId?deptId=' + deptid
        fetch(url, { method: "get" }).then(function (data) {
            data.json().then(function (obj) {
                if (obj.success == true) {
                    if (obj.data == null) {
                        _this.setState({
                            employlist: []
                        })
                    } else {
                        _this.setState({
                            employlist: obj.data
                        })
                    }
                }
            })
        }).then(function (data) {
        }).catch(function (error) {
        })
    }

    employOnChange = (option) => {
        document.getElementsByName(ctrl_name)[2].value = option.key + '_' + option.label;
    }

    render() {
        return (
            <div>
                部门：<DeptComponent callbackDeptChange={this.deptOnChange} defaultDept={defaultdept}
                    deptid={this.state.deptid} range={this.state.range} deptType={this.state.deptType} />
                员工：<EmployeeSelect callbackEmployChange={this.employOnChange} defaultUser={defaultuser} employlist={this.state.employlist} />
            </div>
        );
    }

}

class EmployeeSelect extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Select showSearch
                labelInValue
                style={{ width: 165 }}
                placeholder="请选择"
                optionFilterProp="children"
                onChange={this.props.callbackEmployChange}
                defaultValue={this.props.defaultUser}
            >
                {this.props.employlist.map(item => <Option key={item.value}>{item.title}</Option>)}
            </Select>
        );
    }
}


ReactDOM.render(
    <DeptUserCascaderWrap />,
    document.getElementById('container_deptuser')
);