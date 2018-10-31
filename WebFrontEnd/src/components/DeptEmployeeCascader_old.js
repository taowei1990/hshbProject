import React from 'react'
import { Cascader, Select } from 'antd'
import { ipcRenderer, remote } from 'electron'
import * as pageconfig from './pageconfig'
import path from 'path'

const { dialog } = require('electron').remote
const Option = Select.Option;

export default class DeptEmployeeCascader_old extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employlist: [],
            deptid: '',
            deptname: '',
            employeeid: '',
            employeename: '',
            seldeptvalue: remote.getGlobal('backgroundparam').lastdeptvalue,
            selemployeevalue: remote.getGlobal('backgroundparam').lastemployeevalue
        };
    }

    componentDidMount() {
        if (this.state.seldeptvalue.length > 0) {
            this.state.deptid = this.state.seldeptvalue[this.state.seldeptvalue.length - 1]
            this.loadEmployeeList(this.state.deptid)
        }
        this.state.employeeid = this.state.selemployeevalue.key
        this.state.employeename = this.state.selemployeevalue.label
    }

    deptOnChange = (selectdept, seloption) => {
        this.state.deptid = seloption[seloption.length - 1].value
        this.state.deptname = seloption[seloption.length - 1].label
        this.state.seldeptvalue = selectdept
        this.loadEmployeeList(seloption[seloption.length - 1].value)
    }

    loadEmployeeList = (deptid) => {
        const _this = this
        var serverURL = remote.getGlobal('backgroundparam').serverurl
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
        this.state.employeeid = option.key
        this.state.employeename = option.label
    }

    loginHandler = (forcelogin) => {
        const _this = this
        var serverURL = remote.getGlobal('backgroundparam').serverurl
        //获取计算机标识
        var computeridenter = remote.getGlobal('backgroundparam').mac
        const url = serverURL + '/safeVerify/checkUserLogin?computerId=' + computeridenter + '&employeeId=' + this.state.employeeid
            + '&passWord=' + this.refs.pwd.value + '&forceLogin=' + forcelogin
        fetch(url, { method: "get" }).then(function (data) {
            data.json().then(function (obj) {
                if (obj.success == true) {
                    let loginstatus = obj.data.loginstatus
                    loginstatus=3
                    if (loginstatus == 1) {  //密码错误
                        dialog.showMessageBox(remote.getCurrentWindow(),
                            {
                                type: 'error', buttons: ['确定'], title: '登录提示', message: '登陆失败，你输入的密码错误！'
                            })
                    }
                    else if (loginstatus == 2) { //强制登陆
                        dialog.showMessageBox(remote.getCurrentWindow(),
                            {
                                type: 'question', buttons: ['是', '否'], title: '登录提示', message: '当前用户已经在其他电脑登录，是否强制登录？'
                            }, (response) => {
                                if (response == 0) {
                                    _this.loginHandler(1)
                                }
                            })
                    }
                    else {   //登陆成功     
                        let globalparam = {
                            employeeid: _this.state.employeeid,
                            employeename: _this.state.employeename,
                            deptid: _this.state.deptid,
                            deptname: _this.state.deptname,
                            token: obj.data.token
                        }
                        ipcRenderer.send('saveGlobalParam', globalparam)
                        ipcRenderer.send('saveDB', { key: 'lastdept', value: _this.state.seldeptvalue }, 'lastdept')
                        ipcRenderer.send('saveDB', { key: 'lastuser', value: { key: _this.state.employeeid, label: _this.state.employeename } }, 'lastuser')
                        _this.getEmployLoginData(_this)
                    }
                }
            })
        }).then(function (data) {
        }).catch(function (error) {
        })
    }

    loginClick = () => {
        this.loginHandler(0)
    }

    cancelClick=()=>{
        ipcRenderer.send('existapp')
    }

    //获取员工登陆信息
    getEmployLoginData = (_this) => {
        var serverURL = remote.getGlobal('backgroundparam').serverurl
        const url = serverURL + '/employee/getEmployeeLoginInfo?employeeId=' + _this.state.employeeid
        fetch(url, { method: "get" }).then(function (data) {
            data.json().then(function (obj) {
                if (obj.success == true) {
                    // if (obj.data.menuPopedom == null || obj.data.menuPopedom == '') {
                    //     dialog.showMessageBox(remote.getCurrentWindow(),
                    //         {
                    //             type: 'error', buttons: ['确定'], title: '登录提示', message: '当前登录用户没用访问系统的任何权限，无法使用系统！'
                    //         })
                    //     return
                    // }                                      
                    let globalparam = {
                        rankId: obj.data.rankId,
                        rankName: obj.data.rankName,
                        postId: obj.data.postId,
                        postName: obj.data.postName,                      
                        operatecity: obj.data.operateCity,
                        defaultBiz: obj.data.defaultBiz
                    }                    
                    ipcRenderer.send('saveGlobalParam', globalparam)
                    pageconfig.openPage('mainpage')
                    pageconfig.closePageBySelf()
                }
            })
        }).then(function (data) {
        }).catch(function (error) {
        })
    }

    render() {
        return (
            <div className="wek-formLogin wek-flex-v">
                <div className="companyName">
                    [<label className="fc-or">授权</label>]杭州华邦房地产代理有限公司
              </div>
                <div className="wek-form_item">
                    <div className="labelName">部门：</div><div><DeptCascader callbackDeptChange={this.deptOnChange} lastDeptValue={this.state.seldeptvalue} /></div>
                </div>
                <div className="wek-form_item">
                    <div className="labelName">姓名：</div><div><EmployeeSelect callbackEmployChange={this.employOnChange} lastEmployeeValue={this.state.selemployeevalue} employlist={this.state.employlist} /></div>
                </div>
                <div className="wek-form_item">
                    <div className="labelName">密码：</div><div><input type='password' ref='pwd' className="ant-input" /></div>
                </div>
                <div className="wek-form_item">
                    <div className="labelSpace"></div>
                    <input type='button' value='登陆' className="ant-btn ant-btn-primary ant-btn-lg margin-ri per-30s" onClick={this.loginClick} />
                    <input type='button' value='取消' className="ant-btn ant-btn-lg per-30s" onClick={this.cancelClick} />
                </div>
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
                defaultValue={this.props.lastEmployeeValue}
            >
                {this.props.employlist.map(item => <Option key={item.value}>{item.text}</Option>)}
            </Select>
        );
    }
}

class DeptCascader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deptlist: []
        };
        //this.getDeptSchema = this.getDeptSchema.bind(this);
    }

    onChange = (value, selectedOptions) => {
        this.props.callbackDeptChange(value, selectedOptions)
    }

    filter = (inputValue, path) => {
        return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    }

    //从服务端获取部门树数据
    getDeptSchema() {
        const _this = this
        var serverURL = remote.getGlobal('backgroundparam').serverurl
        const url = serverURL + '/dept/getDeptTree'
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

    componentDidMount() {
        this.getDeptSchema();
    }

    displayRender = (labels, selectedOptions) => labels.map((label, i) => {
        const option = selectedOptions[i];
        if (i === labels.length - 1) {
            return <span key={option.value}>{label} </span>;
        }
        return '';
    });



    render() {
        return (
            <Cascader
                options={this.state.deptlist}
                onChange={this.onChange}
                placeholder="请选择"
                showSearch={this.filter}
                displayRender={this.displayRender}
                defaultValue={this.props.lastDeptValue}
                popupPlacement="bottomLeft"
                changeOnSelect
                expandTrigger='hover'
            />
        );
    }
}



