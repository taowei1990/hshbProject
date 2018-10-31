import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { Table, Divider, Button, message, Select, Icon, Cascader, Row, Col, } from 'antd'
const Option = Select.Option;
import EditModelComponent from './editmodel'
import AddModelComponent from './addmodel'

//Cascader级连 
export default class EstateTableComponent extends React.Component {

    constructor(props) {
        super(props);
        const _columns = [{
            title: '楼盘名称',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
        }, {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: '建房年代',
            dataIndex: 'buildYear',
            key: 'buildYear',
        }, {
            title: '总户数',
            dataIndex: 'totalHouseNum',
            key: 'totalHouseNum',
        }, {
            title: '编辑',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={() => this.editEstate(record)} >修改</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={() => this.deleteEstate(record)} >删除</a>

                </span>
            ),
        }];

        this.state = {
            findEstateList: [],
            columns: _columns,
            total: 0,
            count: 10,
            page: parseInt(window.location.hash.slice(1), 0) || 1,
            countyAndCbdList: [],
            estatelist: [],
            cbdId: undefined,
            estateId: undefined,
            editChild: {},
            addChild: {},
        }
        this.getEstateList = this.getEstateList.bind(this);
        this.findEstate = this.findEstate.bind(this);
        this.editEstate = this.editEstate.bind(this);
        this.addEstate = this.addEstate.bind(this);
    }


    componentDidMount() {
        this.getEstateList(this.state.page, this.state.count, this.state.cbdId, this.state.estateId);
        this.getCountyAndCbdByCityId(1);
    }


    onEditRef = (ref) => {
        this.setState({ editChild: ref });
    }

    editEstate = (record) => {
        this.state.editChild.editModal(record);
    }
    onAddRef = (ref) => {
        this.setState({ addChild: ref });
    }
    addEstate = (record) => {
        this.state.addChild.addModal(record);
    }


    cascaderOnChange = (value, callback) => {
        this.setState({
            cbdId: value[1],
        })

    }


    deleteEstate = (record) => {
        const _this = this;
        var serverURL = 'http://192.168.1.24:8080';
        const url = serverURL + '/oa/estate/deleteEstateById?id=' + record.id;
        fetch(url, { method: "get" }).then(function (data) {
            data.json().then(function (obj) {
                if (obj > 0) {
                    message.success("删除成功");
                    _this.getEstateList(_this.state.page, _this.state.count, _this.state.cbdId, _this.state.estateId);
                } else {
                    message.error("删除失败");
                }
            })
        }).then(function (data) {
        }).catch(function (error) {
        })
    }
    getCountyAndCbdByCityId(cityId) {
        const _this = this;
        var serverURL = 'http://192.168.1.180:3333';
        const url = serverURL + '/service/county/findCountyAndCbdByCityId?cityId=' + cityId;
        fetch(url, { method: "get" }).then(function (data) {
            data.json().then(function (obj) {
                _this.setState({
                    countyAndCbdList: obj,
                });
            })
        }).then(function (data) {
        }).catch(function (error) {
        })
    }


    getEstateList(page, pageSize, cbdId, estateId) {
        const _this = this;
        var serverURL = 'http://192.168.1.24:8080';
        let url = serverURL + `/oa/estate/getEstate?pageNum=${page}&pageSize=${pageSize}`;
        if (cbdId != undefined) {
            url = url + `&cbdId=${cbdId}`;
        }
        if (estateId != undefined) {
            url = url + `&id=${estateId}`;
        }

        fetch(url, { method: "get" }).then(function (data) {
            data.json().then(function (obj) {
                _this.setState({
                    estatelist: obj.pageList,
                    total: obj.pageListCount,
                });
            })
        }).then(function (data) {
        }).catch(function (error) {
        })
    }


    onShowSizeChange = (current, size) => {
        this.setState({
            page: current,
            count: size,
            table_loading: true
        })
        this.getEstateList(current, size, this.state.cbdId, this.state.estateId);
        this.setState({
            table_loading: false
        })
    }


    onPageChange = (page, pageSize) => {
        this.setState({
            table_loading: true
        })
        this.getEstateList(page, pageSize, this.state.cbdId, this.state.estateId);
        this.setState({
            page: page
        }, () => {
            window.location.hash = `#${page}`;
        })
        this.setState({
            count: pageSize,
            table_loading: false
        })
    }



    findEstate = (cbdId, value, callback) => {
        var serverURL = 'http://192.168.1.24:8080';
        let url = serverURL + `/oa/estate/findEstateByCbdId?likeName=${value}`;

        if (cbdId != undefined) {
            url = url + `&cbdId=${cbdId}`;
        }

        fetch(url, { method: "get" }).then(function (data) {
            data.json().then(function (obj) {
                const result = obj.pageList;
                const findEstateList = [];
                result.forEach((estate) => {
                    findEstateList.push({
                        id: estate.id,
                        name: estate.name,
                    });
                });
                callback(findEstateList);
            })
        }).then(function (data) {
        }).catch(function (error) {
        })
    }

    fetch(cbdId, value, callback) {
        this.findEstate(this.state.cbdId, value, callback);
    }

    selectOnSearch = (value) => {
        this.fetch(this.state.cbdId, value, findEstateList => this.setState({ findEstateList }));
    }

    selectOnChange = (value) => {
        this.setState({ estateId: value });
    }


    render() {
        const { page, count, countyAndCbdList, findEstateList, cbdId, estateId } = this.state;
        const estates = findEstateList.map(e => <Option key={e.id}>{e.name}</Option>);
        return (
            <div style={{ marginLeft: 50, marginRight: 50, marginTop: 10 }}>
                <Row>
                    <Col span={21} style={{ textAlign: 'center', marginLeft: 15 }}>
                        <h1 >楼盘管理</h1>
                    </Col>
                    <Col span={2} style={{ marginTop: 15, marginLeft: 15 }}>
                        <Button onClick={this.addEstate} > 添加 </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={7} style={{ marginLeft: 15 }}>
                        选择城市和商圈：<Cascader options={this.state.countyAndCbdList} allowClear={true} onChange={this.cascaderOnChange} placeholder="Please select" />
                    </Col>
                    <Col span={14} style={{ marginLeft: 15 }}>
                        选择楼盘：<Select
                            allowClear={true}
                            showSearch
                            placeholder={this.props.placeholder}
                            style={this.props.style}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            onSearch={this.selectOnSearch}
                            onChange={this.selectOnChange}
                            notFoundContent={null}

                        >
                            {estates}
                        </Select>

                    </Col>
                    <Col span={2}>
                        <Button onClick={() => this.getEstateList(page, count, cbdId, estateId)} > 查询 </Button>
                    </Col>
                </Row>
                <div style={{ marginTop: 10 }}>
                    <Table
                        columns={this.state.columns}
                        rowKey={record => record.id}
                        dataSource={this.state.estatelist}
                        bordered
                        pagination={{
                            showQuickJumper: true,
                            showSizeChanger: true,
                            onChange: this.onPageChange,
                            onShowSizeChange: this.onShowSizeChange,
                            defaultCurrent: this.state.page,
                            current: this.state.page,
                            total: this.state.total,
                        }}
                    ></Table>
                </div>
                <EditModelComponent onEditRef={this.onEditRef} pushTable={() => this.getEstateList(page, count, cbdId, estateId)} />
                <AddModelComponent onAddRef={this.onAddRef} pushTable={() => this.getEstateList(page, count, cbdId, estateId)} />
            </div >

        );
    }
}
