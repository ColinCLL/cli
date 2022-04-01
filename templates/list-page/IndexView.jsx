
import React, { Component } from 'react';
import {
  YxListPage,
  // YxAction,
  // YxModal,
  // YxDynamicForm
} from 'yx-widget';
import { Form, message } from 'antd';
// import moment from 'moment'
import { labelKeyMapping } from 'utils/handleData';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import request from 'utils/request';
import style from "./IndexLess"
import tb from "pubTob/utils/index"
import { get } from 'lodash';

@withRouter
@observer
class IndexList extends Component {

  constructor(props, context) {
    super(props, context);
  }
  state = {
    version: 0,
    type: null,
  }

  componentWillMount () {
    tb.setTab("<%= fileName %>")
  }


  panelParam = () => {
    return {
      defaultFold: true,
      maxCount: -1,
      containerParam: {
        header: '搜索条件',
      },
      items: [
        {
          type: 'String',
          controlItemParam: {
            id: 'name',
            label: '规则名称',
            placeholder: '请输入'
          },
        },
        {
          type: 'Select',
          controlItemParam: {
            id: 'businessTypeId',
            label: '业务类型',
            placeholder: '请选择',
            requestParam: {
              url: `/v1/businessType/drop-down-list`,
              app: "api/settlement",
              data: {
                useType: 2
              },
              afterRequest: (data) => {
                return {
                  list: labelKeyMapping(data, {
                    value: "id",
                    label: "name"
                  })
                };
              },
            }
          },
        },
        {
          type: 'Select',
          controlItemParam: {
            id: 'status',
            label: '状态',
            placeholder: '请输入',
            data: [
              { label: '禁用', value: '0' },
              { label: '启用', value: '1' },
            ]
          },
        },

      ],
    }
  }

  tableParam = () => {

    const columns = [
      {
        title: '业务类型',
        dataIndex: 'businessTypeId',
        render: (val, row) => {
          return get(row, "extBusinessTypeDto.name", "-")
        }
      },
      {
        title: '规则名称',
        dataIndex: 'name',
        width: 300
      },
      {
        title: '规则描述',
        dataIndex: 'remark',
        width: 300
      },
      {
        title: '状态',
        dataIndex: 'status',
        emum: {
          0: "禁用",
          1: "启用"
        }
      },
      {
        title: '操作',
        type: 'action',
        width: 150,
        fixed: 'right',
        actionBtns: [
          {
            actionType: 'action',
            text: '禁用',
            isConfirm: true,
            filter: {
              dataIndex: 'status',
              contains: ['1']
            },
            onClick: (data) => {
              request({
                url: `/v1/clearingRule/modify`,
                app: "api/settlement",
                data: { status: 0, id: data.id},
                method: "post"
              }).then(res => {
                if (res.resultCode == 0) {
                  this.setState({
                    version: this.state.version + 1
                  })
                  message.success("禁用成功")
                }
              })
            }
          },
          {
            actionType: 'action',
            text: '启用',
            isConfirm: true,
            filter: {
              dataIndex: 'status',
              contains: ['0']
            },
            onClick: (data) => {
              request({
                url: `/v1/clearingRule/modify`,
                app: "api/settlement",
                data: { status: 1, id: data.id},
                method: "post"
              }).then(res => {
                if (res.resultCode == 0) {
                  this.setState({
                    version: this.state.version + 1
                  })
                  message.success("启用成功")
                }
              })
            }
          },
          {
            actionType: 'action',
            text: '修改',
            onClick: (data) => {
              const id = data.id;
              tb.jumpTo(`/settlementCenter/rule/edit?type=edit&id=${id}`);
            },
          },
          {
            actionType: 'action',
            text: '查看',
            onClick: (data) => {
              const id = data.id;
              tb.jumpTo(`/settlementCenter/rule/edit?id=${id}&type=detail`);
            },
          },
          
        ]
      },
    ]

    return {
        panelParam: {
          header: '清分规则列表',
        },
      isCheckbox: true,
      isColumnNumber: false,
      isRowSelection: false,
      isScrollX: 1000,
      batchBtns: [
        {
          text: '新增规则',
          actionType: 'action',
          type: 'primary',
          check: false,
          onClick: () => {
            tb.jumpTo('/settlementCenter/rule/edit?type=add')
          }
        },

      ],
      //   wrapMode: 'warp',
      columns
    }
  }

  listPageParam = () => {
    const { version } = this.state
    return {
      version,
      tableParam: this.tableParam(),
      panelParam: this.panelParam(),
      requestParam: {
        url: '/v1/clearingRule/page',
        app: "api/settlement",
        method: 'post',
      },
    }
  }
 
  render() {
    return (
      <div className='<%= className || fileName %>'>
        <YxListPage {...this.listPageParam()}></YxListPage>
      </div>
    );
  }
}

export default Form.create()(IndexList);

