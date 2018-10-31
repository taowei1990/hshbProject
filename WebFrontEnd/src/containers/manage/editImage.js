import { Modal, Button, Select, Input, Form, message, Row, Col } from 'antd'
import React, { Component } from 'react'
const Option = Select.Option;
const FormItem = Form.Item;
class EditImageComponent extends React.Component {

    constructor(props) {
        super(props);
        this.props.onEditImage(this);
        this.state = {
            ModalText: '',
            visible: false,
            confirmLoading: false,
            rowData: {},
            estateImageType: [],
        };
    }

    editImage(rowData, estateImageType) {
        this.props.form.resetFields();
        this.setState({
            visible: true,
            rowData: rowData,
            estateImageType: estateImageType,
        });


    }
    componentDidMount() {

    }


    handleCancel = () => {
        this.setState({
            visible: false,
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
                formData = formData + key + "=" + values[key] + '&'
            }
        }

        const _this = this;
        var serverURL = 'http://192.168.1.24:8080';
        const url = serverURL + '/oa/estate/updateEstateImage?' + formData;
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

    render() {
        const { getFieldDecorator } = this.props.form;
        const { visible, confirmLoading, ModalText, rowData ,estateImageType} = this.state;

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
        
        const imageType = [];
        for (var key in estateImageType) {
            imageType.push(<Option value={key}>{estateImageType[key]}</Option>)
        }

        //const imageType = estateImageType.map(e => <Option key={e.key}>{e.value}</Option>);

        return (
            <Modal title="楼盘图片信息编辑" width={400} keyboard={true} visible={visible} style={{ top: 20 }} onCancel={this.handleCancel} onOk={this.submitForm} cancelText='取消' okText='确认' confirmLoading={confirmLoading}>
                <img alt="example" style={{ marginLeft: 50, width: 250, height: 200 }} src={rowData.imgPath} />
                <Form onSubmit={this.submitForm} className="outline-form">
                    <FormItem>
                        {getFieldDecorator('id', {
                            initialValue: rowData.id,
                        })(
                            <Input placeholder="" type='hidden' />
                        )}
                    </FormItem>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="图片名称" >
                                {getFieldDecorator('imgName', {
                                    rules: [{ required: true, message: '请输入图片名称:' }],
                                    initialValue: rowData.imgName,
                                })(
                                    <Input placeholder="" />
                                )}

                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="图片种类" >
                                {getFieldDecorator('imgType', {
                                    rules: [{ required: true, message: '请图片种类:' }],
                                    initialValue: "" + rowData.imgType
                                })(
                                    <Select>
                                        {
                                            imageType
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formItemLayout} label="图片描述" >
                                {getFieldDecorator('imgDes', {
                                    rules: [{ required: true, message: '请输入图片描述' }],
                                    initialValue: rowData.imgDes,
                                })(
                                    <Input placeholder="" />
                                )}

                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
}
const EditImageForm = Form.create()(EditImageComponent);
export default EditImageForm;