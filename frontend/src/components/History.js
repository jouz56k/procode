import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserDataContext } from '../contexts/UserDataContext';
import { Loading } from './Loading';
import { Alert, Card, Icon, Col, Row, Tag, message, Popconfirm, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

// scaling of cards
const scaling = {
    xs: { span: 24 },
    sm: { span: 12},
    md: { span: 8 },
    lg: { span: 6 }
}

const styling = {
    deleteIcon: { color: "#f5222d" },
    codedIn: { marginTop: 15 },
    codedFile: { paddingLeft: 15, marginTop: 5 },
    codedSchemes: { paddingLeft: 15, marginTop: 5 },
    files: {marginTop: 25},
    views: {textAlign: "right", marginBottom: 25},
    viewsBtn: {border: "none", borderRadius: 2}
}



function History(props) {
    const { t } = useTranslation();
    const context = useContext(UserDataContext);
    const [state, setState] = useState({
        view: "coding"
    });

    if (!context.loaded) {
        return(
            <div>
                { Loading }
            </div>
        )
    }

    // handle file delete
    const handleFileDelete = id => {

        let url = `${process.env.REACT_APP_API_URL}/delete-file-coding/${id}/`;
        if (state.view === "transcoding") {
            url = `${process.env.REACT_APP_API_URL}/delete-file-transcoding/${id}/`;
        }
        axios.delete(
            url,
        ).then(
            () => {
                message.warning( t('messages.data-deleted') );
                context.refreshData();
            }
        ).catch(
            () => message.error( t('messages.request-failed') )
        )
    }

    // codings with file !== null
    const codings = context.myCoding.filter(o => o['my_file'] !== null);
    // transcodings with file !== null
    const transcodings = context.myTranscoding.filter(o => o['my_file'] !== null);

    // sort files -> those codings belonging to the same file
    // because we render one card per file
    const files = [];
    const transFiles = [];
    
    for (let i in codings) {
        let fileID = codings[i]['my_file'];
        let isContained = files.filter(o => o.fileID === fileID).length > 0;

        if (isContained) {
            let obj = files.find(o => o.fileID === fileID);
            let inx = files.indexOf(obj);
            
            if (obj.schemes.indexOf(codings[i].scheme) === -1) {
                obj.schemes.push(codings[i].scheme);
            }

            files[inx] = obj;

        } else {
            let obj = {
                fileID: fileID,
                schemes: [codings[i].scheme]
            };
            files.push(obj);
        }
    }

    for (let i in transcodings) {
        let fileID = transcodings[i]['my_file'];
        let isContained = transFiles.filter(o => o.fileID === fileID).length > 0;

        if (isContained) {
            let obj = transFiles.find(o => o.fileID === fileID);
            let inx = transFiles.indexOf(obj);
            
            if (obj.schemes.indexOf(transcodings[i].output[0].scheme) === -1) {
                obj.schemes.push(transcodings[i].output[0].scheme);
            }

            transFiles[inx] = obj;

        } else {
            let obj = {
                fileID: fileID,
                schemes: [transcodings[i].output[0].scheme]
            };
            transFiles.push(obj);
        }
    }

    
    const codingView = (
        files.length === 0 ?
        <Alert
                type="warning"
                message={ t('messages.no-data-alert') }
                showIcon
            />
        : <Row gutter={16} type="flex" justify="start" style={styling.files}>
        {
            files.map(
                item => (
                    <Col key={item.fileID.toString()} {...scaling}>
                        <Card
                            actions={[
                                <Icon 
                                    type="search"
                                    onClick={
                                        () => props.history.push(
                                            `/coding-results/file=${item.fileID}`
                                        )} 
                                />,
                                <Popconfirm 
                                    title={t('messages.are-you-sure')}
                                    onConfirm={ () => handleFileDelete( item.fileID )}
                                    okText={ t('messages.yes') }
                                    cancelText={ t('messages.no') }
                                >
                                    <Icon
                                        type="delete"
                                        style={ styling.deleteIcon } 
                                    />
                                </Popconfirm>
                            ]}
                        >
                            <span>{ t('history.file') }: </span>
                            <div style={styling.codedFile}>
                                <Tag>
                                    { context.files.find(o => o.id === item.fileID).name }
                                </Tag>
                            </div>

                            {/* file coded for following schemes */}
                            <div style={styling.codedIn}>
                                { t('history.coded-in') }:
                            </div>
                            {
                                item.schemes.map(
                                    scheme => 
                                        <div key={scheme.toString()} style={styling.codedSchemes}>
                                            <Tag>
                                                { context.schemes.find(o => o.id === scheme).name }
                                            </Tag>
                                        </div>
                                )
                            }
                        </Card>
                    </Col>
                    )
                )
        }
    </Row>
    );

    const transcodingView = (
        transFiles.length === 0 ?
        <Alert
                type="warning"
                message={ t('messages.no-data-alert') }
                showIcon
            />
        : <Row gutter={16} type="flex" justify="start" style={styling.files}>
        {
            transFiles.map(
                item => (
                    <Col key={item.fileID.toString()} {...scaling}>
                        <Card
                            actions={[
                                <Icon 
                                    type="search"
                                    onClick={
                                        () => props.history.push(
                                            `/transcoding-results/file=${item.fileID}`
                                        )} 
                                />,
                                <Popconfirm 
                                    title={t('messages.are-you-sure')}
                                    onConfirm={ () => handleFileDelete( item.fileID )}
                                    okText={ t('messages.yes') }
                                    cancelText={ t('messages.no') }
                                >
                                    <Icon
                                        type="delete"
                                        style={ styling.deleteIcon } 
                                    />
                                </Popconfirm>
                            ]}
                        >
                            <span>{ t('history.file') }: </span>
                            <div style={styling.codedFile}>
                                <Tag>
                                    { context.files.find(o => o.id === item.fileID).name }
                                </Tag>
                            </div>

                            {/* file coded for following schemes */}
                            <div style={styling.codedIn}>
                                { t('history.transcoded-in') }:
                            </div>
                            {
                                item.schemes.map(
                                    scheme => 
                                        <div key={scheme.toString()} style={styling.codedSchemes}>
                                            <Tag>
                                                { context.schemes.find(o => o.id === scheme).name }
                                            </Tag>
                                        </div>
                                )
                            }
                        </Card>
                    </Col>
                    )
                )
        }
    </Row>
    )

    return (
        <div>
            <h2>{ t('history.page-title') }</h2>
            <div style={styling.views}>
                <Button 
                    style={styling.viewsBtn} 
                    type={state.view === "coding" ? "primary": "default"}
                    onClick={() => setState({view: "coding"})}
                >
                    <Icon type="fire" /> { t('sider.coding') }
                </Button>

                <Button 
                    style={styling.viewsBtn}
                    type={state.view === "transcoding" ? "primary": "default"}
                    onClick={() => setState({view: "transcoding"})}
                >
                    <Icon type="sync" /> { t('sider.transcoding') }
                </Button>
            </div>
            <div>
                {
                    state.view === "coding" ?
                    codingView : transcodingView
                }
            </div>
        </div>
    )
}
export default withRouter( History );