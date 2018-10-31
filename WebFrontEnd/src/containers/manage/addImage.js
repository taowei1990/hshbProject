import { Upload, Icon, Modal, Button, Select, Input, message, Row, Col } from 'antd'
import React, { Component } from 'react'
const Option = Select.Option;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export default class AddImageComponent extends React.Component {

    constructor(props) {
        super(props);
        this.props.onAddImage(this);
        this.state = {
            ModalText: '',
            addvisible: false,
            confirmLoading: false,
            fileList: [],
            uploading: false,
            previewVisible: false,
            previewImage: '',
            previewUid: '',
            loading: false,
            date: {},
            estateImageType: [],
            estateId: '',
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                date: new Date()
            })
        }, 1000);
    }


    addImage(value, estateImageType) {
        this.setState({
            addvisible: true,
            estateImageType: estateImageType,
            estateId: value,
        });
    }

    handleCancel = () => {
        this.setState({
            addvisible: false,
        });
    }


    handleUpload = () => {
        const { fileList } = this.state;

        for (let index in fileList) {
            let currentFile = fileList[index];
            fileList[index] = {
                ...currentFile, ...{ estateId: this.state.estateId },
            };
            if (fileList[index].imgType == -1) {
                message.error("照片选择类别后才能上传");
                this.setState({
                    uploading: false
                })
                return false;
            }
        }
        var formData = new FormData();
        formData.append("estateImageVOS", JSON.stringify(fileList));


        this.setState({
            uploading: true,
        });
        const _this = this;
        var serverURL = 'http://192.168.1.24:8080/oa/estate/insertEstateImage';
        fetch(serverURL, {
            method: "post", body: formData, mode: 'cors',
        }).then(function (data) {
            data.json().then(function (obj) {
                if (obj > 0) {
                    message.success('成功上传' + obj + '张图片');
                    _this.setState({
                        fileList: [],
                        uploading: false,
                        addvisible: false,

                    });
                    _this.props.pushTable();
                } else {
                    _this.setState({
                        uploading: false,
                    });
                    message.error('上传失败');
                }
            })
        }).then(function (data) {
        }).catch(function (error) {
            _this.setState({
                uploading: false,
            });
            message.error('上传异常');

        })
    }


    //文件列表展示回调
    handleChange = ({ fileList }) => {
        for (let index in fileList) {
            let currentFile = fileList[index];
            if (currentFile.imageFile == undefined) {
                getBase64(currentFile.originFileObj, imageUrl => {
                    fileList[index] = { ...currentFile, ...{ imageFile: imageUrl } };
                });
            }
        }
        this.setState({
            fileList: fileList
        })
    }

    //-----------------------------------------------------------------------下拉框点击后追加类别
    handleSelectChange = (value, options) => {
        const { fileList } = this.state;
        for (let index in fileList) {
            let currentFile = fileList[index];
            if (currentFile.uid == options.key) {
                fileList[index] = {
                    ...currentFile, ...{ imgType: value },
                };
            }
        }
        this.setState({
            fileList: fileList
        })
    }
    //-----------------------------------------------------------------------失去光标后追加名称
    onBlurName = (e) => {
        const { value } = e.target;
        const { id } = e.target;
        const { fileList } = this.state;
        for (let index in fileList) {
            let currentFile = fileList[index];
            if (currentFile.uid == id) {
                fileList[index] = {
                    ...currentFile, ...{ imgName: value },
                };
            }
        }
        this.setState({
            fileList: fileList
        })
    }

    //-----------------------------------------------------------------------失去光标后追加描述
    onBlurDes = (e) => {
        const { value } = e.target;
        const { id } = e.target;
        const { fileList } = this.state;
        for (let index in fileList) {
            let currentFile = fileList[index];
            if (currentFile.uid == id) {
                fileList[index] = {
                    ...currentFile, ...{ imgDes: value },
                };
            }
        }
        this.setState({
            fileList: fileList
        })

    }


    render() {
        const { addvisible, confirmLoading, ModalText, fileList, uploading, estateImageType } = this.state;
        const uploadButton = (
            <div >
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );

        const props = {
            listType: "picture-card",
            accept: "image/*",
            multiple: true,
            fileList: fileList,
            onChange: this.handleChange,
            showUploadList: false,
            beforeUpload: (file) => {
                // const isJPG = file.type === 'image/jpeg';
                // if (!isJPG) {
                //   message.error('You can only upload JPG file!');
                // }    
                // const isLt2M = file.size / 1024 / 1024 < 2;
                // if (!isLt2M) {
                //   message.error('文件超过2M大小');
                // }
                return true;// isJPG && isLt2M
            },
        };

        const imageType = [];
        for (var key in estateImageType) {
            imageType.push({
                key: key,
                value: estateImageType[key],
            })
        }
        return (
            <Modal title="上传楼盘图片" width={500} keyboard={true} visible={addvisible} style={{ top: 20 }} onCancel={this.handleCancel} onOk={this.handleUpload} cancelText='取消' okText='确认' confirmLoading={confirmLoading}>
                <div>
                    {
                        fileList.map((currentFile) => {
                            const uid = currentFile.uid;
                            return (
                                <div style={{ marginTop: 10, marginLeft: 20 }}>
                                    <Row>
                                        <Col span={7}>
                                            <img src={currentFile.imageFile} height="100" width="100" />
                                        </Col>

                                        <Col span={17}>
                                            <span>名称:   </span>
                                            <Input id={uid} onBlur={value => this.onBlurName(value)} placeholder="" style={{ width: 200 }} />
                                        </Col>

                                        <Col span={17}>
                                            <span>类型:   </span>
                                            <Select defaultValue={currentFile.imgType} style={{ width: 200 }} onChange={this.handleSelectChange} >
                                                <Option key={uid} value="-1">选择类型</Option>
                                                {
                                                    imageType.map((obj) => {
                                                        return <Option key={uid} value={obj.key}>{obj.value}</Option>
                                                    })
                                                }
                                            </Select>
                                        </Col>

                                        <Col span={17}>
                                            <span>描述:   </span>
                                            <Input id={uid} onBlur={value => this.onBlurDes(value)} placeholder="" style={{ width: 200 }} />
                                        </Col>

                                    </Row>
                                </div>
                            )
                        })
                    }
                </div>
                <div style={{ marginTop: 10, marginLeft: 20 }}>
                    <Upload  {...props}>
                        {uploadButton}
                    </Upload>
                </div>
            </Modal>
        );
    }
}