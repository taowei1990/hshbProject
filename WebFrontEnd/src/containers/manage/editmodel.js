import { Table, Modal, Button, Divider, Select, Input, Form, message, Cascader, Menu, Row, Col, Upload, Icon, Popconfirm } from 'antd'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import EditImageComponent from './editImage'
import AddImageComponent from './addImage'

const Option = Select.Option;
const FormItem = Form.Item;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


class EditModelComponent extends React.Component {

    constructor(props) {
        super(props);
        this.props.onEditRef(this);
        const _columns = [{
            title: '楼盘照片',
            dataIndex: 'imgPath',
            key: 'imgPath',
            width: 100,
            render: (text, record) => (
                <span>
                    <img alt="example" style={{ width: 40, height: 40 }} src={record.imgPath} />
                </span>
            )
        }, {
            title: '照片名称',
            dataIndex: 'imgName',
            key: 'imgName',
            width: 100,
        }, {
            title: '照片类别',
            dataIndex: 'imageType',
            key: 'imgType',
            width: 100,

        }, {
            title: '照片描述',
            dataIndex: 'imgDes',
            key: 'imgDes',
            width: 100,

        }, {
            title: '编辑',
            key: 'action',
            width: 100,
            render: (text, record) => (
                <span>
                    <a href="javascript:;" onClick={() => this.editEstateImage(record)} >修改</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={() => this.deleteEstateImage(record)} >删除</a>
                </span>
            ),
        }];

        this.state = {
            ModalText: '',
            visible: false,
            confirmLoading: false,
            rowData: {},
            countyAndCbdList: [],
            current: 'outline',
            outlineing: '',
            imageing: 'none',
            detailsing: 'none',
            cbd: {},
            columns: _columns,
            estateImageList: [],
            previewImage: '',
            previewVisible: false,
            imageChild: {},
            addImageChild: {},
            estateImageType: [],
        };
        this.editEstateImage = this.editEstateImage.bind(this);
        this.addEstateImage = this.addEstateImage.bind(this);

    }

    componentDidMount() {
        this.getCountyAndCbdByCityId(1);
        this.getEstateImageType();
    }

    editModal(rowData) {
        this.props.form.resetFields();
        this.getCdbByCbdId(rowData.cbdId);
        this.setState({
            visible: true,
            rowData: rowData,
        });
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            current: 'outline',
            imageing: 'none',
            detailsing: 'none',
            outlineing: '',
        });
    }

    submitForm = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.submitFormData(values)
            }
        });

    }


    submitFormData(values) {
        var formData = "";
        for (let key in values) {
            if (values[key] != '' && values[key] != null) {
                if (key == 'countyIdAndCbdId') {
                    formData = formData + 'cbdId=' + values[key][1] + '&'
                }
                formData = formData + key + "=" + values[key] + '&'
            }
        }

        const _this = this;
        var serverURL = 'http://192.168.1.24:8080';
        const url = serverURL + '/oa/estate/updateEstate?' + formData;
        fetch(url, { method: "get", }).then(function (data) {
            data.json().then(function (obj) {
                if (obj > 0) {
                    setTimeout(() => {
                        _this.setState({
                            visible: false,
                            confirmLoading: false,
                            ModalText: '',
                        });
                    }, 1000);
                    message.success("修改成功");
                    _this.props.pushTable();
                } else {
                    message.error("修改失败");
                    _this.setState({
                        confirmLoading: true,
                    });
                }
            })
        }).then(function (data) {
        }).catch(function (error) {
        })
    }


    getCdbByCbdId(cbdId) {
        const _this = this;
        var serverURL = 'http://192.168.1.180:3333';
        const url = serverURL + '/service/cbd/selCbdById?id=' + cbdId;
        fetch(url, { method: "get" }).then(function (data) {
            data.json().then(function (obj) {
                _this.setState({
                    cbd: obj.data,
                });
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

    menuClick = (e) => {
        if (e.key == 'outline') {
            this.setState({
                current: e.key,
                imageing: 'none',
                detailsing: 'none',
                outlineing: '',
            });
        }
        if (e.key == 'details') {
            this.setState({
                current: e.key,
                outlineing: 'none',
                imageing: 'none',
                detailsing: '',
            });
        }
        if (e.key == 'image') {
            this.setState({
                current: e.key,
                outlineing: 'none',
                detailsing: 'none',
                imageing: '',
            });
            this.findEstateImageByEstateId(this.state.rowData.id);
        }

    }

    //---------------------------------------------------------------------------------------------图片模块
    findEstateImageByEstateId(value) {
        const _this = this;
        var serverURL = 'http://192.168.1.24:8080';
        let url = serverURL + `/oa/estate/findEstateImageByEstateId?estateId=${value}`;
        fetch(url, { method: "get" }).then(function (data) {
            data.json().then(function (obj) {
                _this.setState({
                    estateImageList: obj,
                });
            })
        }).then(function (data) {
        }).catch(function (error) {
        })
    }

    onEditImage = (ref) => {
        this.setState({ imageChild: ref });
    }

    editEstateImage(record) {
        this.state.imageChild.editImage(record, this.state.estateImageType);
    }

    onAddImage = (ref) => {
        this.setState({ addImageChild: ref });
    }

    addEstateImage() {
        this.state.addImageChild.addImage(this.state.rowData.id, this.state.estateImageType);
    }



    deleteEstateImage(record) {
        const _this = this;
        var serverURL = 'http://192.168.1.24:8080';
        const url = serverURL + '/oa/estate/deleteEstateImage?id=' + record.id;
        fetch(url, { method: "get" }).then(function (data) {
            data.json().then(function (obj) {
                if (obj > 0) {
                    message.success("删除成功");

                    _this.findEstateImageByEstateId(_this.state.rowData.id);
                } else {
                    message.error("删除失败");
                }
            })
        }).then(function (data) {
        }).catch(function (error) {
        })
    }
    //---------------------------------------------------------------------------------------------图片类别
    getEstateImageType() {
        const _this = this;
        var serverURL = 'http://192.168.1.24:8080';
        let url = serverURL + `/oa/estate/getEstateImageType`;
        fetch(url, { method: "get" }).then(function (data) {
            data.json().then(function (obj) {
                _this.setState({
                    estateImageType: obj,
                });
            })
        }).then(function (data) {
        }).catch(function (error) {
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { previewVisible, previewImage, outlineing, visible, cbd, confirmLoading, ModalText, rowData, countyAndCbdList } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <Modal title="楼盘字典" keyboard={true} visible={visible} style={{ top: 20 }} onCancel={this.handleCancel} onOk={this.submitForm} cancelText='取消' okText='确认' confirmLoading={confirmLoading} width={750} >
                <Menu onClick={this.menuClick} selectedKeys={[this.state.current]} mode="horizontal"  >
                    <Menu.Item key="outline">
                        楼盘概要
                        </Menu.Item>
                    <Menu.Item key="details">
                        详细信息
                        </Menu.Item>
                    <Menu.Item key="image">
                        图片文档
                        </Menu.Item>
                </Menu>
                <div style={{ height: 320 }}  >
                    <div style={{ display: this.state.outlineing }} >
                        <Form onSubmit={this.submitForm} className="outline-form">
                            <FormItem>
                                {getFieldDecorator('id', {
                                    initialValue: rowData.id,
                                })(
                                    <Input placeholder="" type='hidden' />
                                )}
                            </FormItem>

                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="名称" >
                                        {getFieldDecorator('name', {
                                            rules: [{ required: true, message: '请输入楼盘名称:' }],
                                            initialValue: rowData.name,
                                        })(
                                            <Input placeholder="" />
                                        )}

                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="城市商圈">
                                        {getFieldDecorator('countyIdAndCbdId', {
                                            rules: [{ required: true, message: '请选择归属城市和商圈' }],
                                            initialValue: [cbd.countyId, rowData.cbdId],
                                        })(
                                            <Cascader options={countyAndCbdList} allowClear={false} placeholder="Please select" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="地址">
                                        {getFieldDecorator('address', {
                                            rules: [{ required: true, message: '请输入地址' }],
                                            initialValue: rowData.address,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="用途">
                                        {getFieldDecorator('category', {
                                            rules: [{ required: true, message: '请输入用途' }],
                                            initialValue: rowData.category,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="建房年代">
                                        {getFieldDecorator('buildYear', {
                                            rules: [{ required: true, message: '请输入建房年代' }],
                                            initialValue: rowData.buildYear,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="产权年份">
                                        {getFieldDecorator('propertyRightAge', {
                                            rules: [{ required: true, message: '请输入产权年份' }],
                                            initialValue: rowData.propertyRightAge,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="交付日期">
                                        {getFieldDecorator('deliverDate', {
                                            rules: [{ required: true, message: '请输入交付日期' }],
                                            initialValue: rowData.deliverDate,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="占地面积">
                                        {getFieldDecorator('floorArea', {
                                            rules: [{ required: true, message: '请输入占地面积' }],
                                            initialValue: rowData.floorArea,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="车位信息">
                                        {getFieldDecorator('garageInfo', {
                                            rules: [{ required: true, message: '请输入车位信息' }],
                                            initialValue: rowData.garageInfo,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="楼盘坐标">
                                        {getFieldDecorator('location', {
                                            rules: [{ required: true, message: '请输入楼盘坐标' }],
                                            initialValue: rowData.location,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                        </Form>
                    </div>


                    <div style={{ display: this.state.detailsing }}>
                        <Form onSubmit={this.submitForm} className="details-form">
                            <FormItem>
                                {getFieldDecorator('id', {
                                    initialValue: rowData.id,
                                })(
                                    <Input placeholder="" type='hidden' />
                                )}
                            </FormItem>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="总户数">
                                        {getFieldDecorator('totalHouseNum', {
                                            rules: [{ required: true, message: '请输入总户数' }],
                                            initialValue: rowData.totalHouseNum,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="容积率">
                                        {getFieldDecorator('plotRatio', {
                                            rules: [{ required: true, message: '请输入容积率' }],
                                            initialValue: rowData.plotRatio,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="绿化率">
                                        {getFieldDecorator('greenRatio', {
                                            rules: [{ required: true, message: '请输入绿化率' }],
                                            initialValue: rowData.greenRatio,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="物管费用">
                                        {getFieldDecorator('propertyCost', {
                                            rules: [{ required: true, message: '请输入物管费用' }],
                                            initialValue: rowData.propertyCost,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>


                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="物业公司" >
                                        {getFieldDecorator('propertyCompanyName', {
                                            rules: [{ required: false, message: '请输入物业公司:' }],
                                            initialValue: rowData.propertyCompanyName,
                                        })(
                                            <Input placeholder="" />
                                        )}

                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="物业介绍">
                                        {getFieldDecorator('propertyCompanyInfo', {
                                            rules: [{ required: false, message: '请输入物业介绍' }],
                                            initialValue: rowData.propertyCompanyInfo,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="开发商">
                                        {getFieldDecorator('buildCompanyName', {
                                            rules: [{ required: false, message: '请输入开发商' }],
                                            initialValue: rowData.buildCompanyName,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="开发商介绍">
                                        {getFieldDecorator('buildCompanyInfo', {
                                            rules: [{ required: false, message: '请输入开发商介绍' }],
                                            initialValue: rowData.buildCompanyInfo,
                                        })(
                                            <Input placeholder="" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>

                    <div style={{ display: this.state.imageing }}>
                        <Row >
                            <Col style={{ textAlign: 'right', marginTop: 10 }}>
                                <Button onClick={this.addEstateImage} type="primary" >
                                    添加
                                </Button>
                            </Col>

                        </Row>
                        <div style={{ marginTop: 10 }}>
                            <Table
                                scroll={{ y: 240 }}
                                columns={this.state.columns}
                                rowKey={record => record.id}
                                dataSource={this.state.estateImageList}
                                pagination={false}
                            ></Table>
                        </div>
                        <EditImageComponent onEditImage={this.onEditImage} pushTable={() => this.findEstateImageByEstateId(rowData.id)} />
                        <AddImageComponent onAddImage={this.onAddImage} pushTable={() => this.findEstateImageByEstateId(rowData.id)} />
                    </div>
                </div>
                <p>{ModalText}</p>
            </Modal >
        );
    }
}
const EditForm = Form.create()(EditModelComponent);
export default EditForm;