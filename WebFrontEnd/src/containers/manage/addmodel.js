import { Modal, Button, Select, Input, Form, message, Cascader, Row, Col, } from 'antd'
import React, { Component } from 'react'
const Option = Select.Option;
const FormItem = Form.Item;

class AddModelComponent extends React.Component {

  constructor(props) {
    super(props);
    this.props.onAddRef(this);
    this.state = {
      ModalText: '',
      visible: false,
      confirmLoading: false,
      countyAndCbdList: [],
    };
  }

  componentDidMount() {
    this.getCountyAndCbdByCityId(1);
  }

  addModal(rowData) {
    this.props.form.resetFields();
    this.setState({
      visible: true,
    });
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

  submitFormData(values) {
    var formData = "";
    for (let key in values) {
      if (key == 'countyIdAndCbdId') {
        formData = formData + 'cbdId=' + values[key][1] + '&'
      }
      formData = formData + key + "=" + values[key] + "&"
    }
    const _this = this;
    var serverURL = 'http://192.168.1.24:8080';
    const url = serverURL + '/oa/estate/insertEstate?' + formData;
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
          message.success("添加成功");
          _this.props.pushTable();
        } else {
          message.error("添加失败");
          _this.setState({
            confirmLoading: false,
          });
        }
      })
    }).then(function (data) {
    }).catch(function (error) {
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { outlineing, visible, cbd, confirmLoading, ModalText, rowData, countyAndCbdList } = this.state;
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
      <Modal title="新增楼盘" keyboard={true} visible={visible} style={{ top: 20 }} onCancel={this.handleCancel} onOk={this.submitForm} cancelText='取消' okText='确认' confirmLoading={confirmLoading} width={700} >
        <Form onSubmit={this.submitForm} className="outline-form">
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="名称" >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入楼盘名称:' }],
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="城市商圈">
                {getFieldDecorator('countyIdAndCbdId', {
                  rules: [{ required: true, message: '请选择归属城市和商圈' }],
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
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="用途">
                {getFieldDecorator('category', {
                  rules: [{ required: true, message: '请输入用途' }],
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
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="产权年份">
                {getFieldDecorator('propertyRightAge', {
                  rules: [{ required: true, message: '请输入产权年份' }],
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
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="占地面积">
                {getFieldDecorator('floorArea', {
                  rules: [{ required: true, message: '请输入占地面积' }],
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
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="楼盘坐标">
                {getFieldDecorator('location', {
                  rules: [{ required: true, message: '请输入楼盘坐标' }],
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="总户数">
                {getFieldDecorator('totalHouseNum', {
                  rules: [{ required: true, message: '请输入总户数' }],
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="容积率">
                {getFieldDecorator('plotRatio', {
                  rules: [{ required: true, message: '请输入容积率' }],
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
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="物管费用">
                {getFieldDecorator('propertyCost', {
                  rules: [{ required: true, message: '请输入物管费用' }],
                })(
                  <Input placeholder="" />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <p>{ModalText}</p>
      </Modal >
    );
  }
}
const EditForm = Form.create()(AddModelComponent);
export default EditForm;