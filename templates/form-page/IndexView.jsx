/**
 * 新需求存档
 */

 import React, { Component } from 'react';
 import { YxAction, YxDynamicForm } from 'yx-widget';
 import { Form, message} from 'antd';
 import { observer, inject } from 'mobx-react';
 import { withRouter } from 'react-router-dom';
 import Request from 'utils/request';
 import cx from "classnames"
 import tb from 'pubTob/utils/index'
 import { cloneDeep, isEmpty, forIn, get } from 'lodash';
 import "./IndexLess"
 // 站点配置
 // import config from 'config/Config';
 // import Cookie from 'js-cookie';
 
 
 const titleObj = {
   add: "交易资金监管账户信息",
   edit: "交易资金监管账户信息"
 }
 
 
 @withRouter
 @observer
 class addView extends Component {
   constructor(props, context) {
     super(props, context);
   }
 
   state = {
     version: 0,
     accountData: {},
     ruleData: {},
     type: "add",
     bankList: [], // 银行
     subbranchList: [], // 网点
     businessTypeObj: {}
   }
 
 
   componentWillMount () {
     // const {type} = this.state
     // tb.setTab(titleObj[type])
     tb.setTab("交易资金监管账户配置")
   }
 
   componentDidMount () {
     this.getAccount()
     this.getBankList()
     this.getSubbranchList()
   }

   getAccount = async () => {

    let res = await Request({
      url: `v1/tradeAccount`,
      app: "api/settlement",
      method: "get"
    })
    
    if (res.resultCode == 0) {
      this.setState({
        accountData: res.data || {}
      })
    }
  }

  getBankList= async () => {
    let res = await Request({
      url: `/v1/tradeAccount/bankList`,
      app: "api/settlement",
    })
    let data = res.data || {}
    if (res.resultCode == 0) {
      let bankList = []
      forIn(data, (label, value) => {
      
        bankList.push({
          label,
          value: label //提交中文
        })
      })
      this.setState({
        bankList
      })
    }
  }

  getSubbranchList= async () => {
    let res = await Request({
      url: `/v1/tradeAccount/subbranchList`,
      app: "api/settlement",
    })
    let data = res.data || {}
    if (res.resultCode == 0) {
      let subbranchList = []
      forIn(data, (label, value) => {
        subbranchList.push({
          label,
          value: label //提交中文
        })
      })
      this.setState({
        subbranchList
      })
    }
  }



  reqParam() {
    // 使用商品的值
    // console.log(this.state.selectTypeData, 'selectTypeData');
    const { accountData, type } = this.state
    return {
      requestParam: {
        url: !accountData.id ? '/v1/tradeAccount/add' : '/v1/tradeAccount/modify',
        app: "api/settlement",
        method: "post",
        data: this.props.form.getFieldsValue(),
        beforeRequest: (data) => {
          return {
            ...data,
            id: accountData.id,
          };
        },
        requestModel: {},
        headers: {
          'Content-type': 'application/json'
        },
        callback: (data, v) => {
          const { resultCode } = data;
          if ('' + resultCode === '0') {
            message.success("提交成功")
          }
        }
      }
    };
  }


  formParam = () => {
    const { accountData, type} = this.state
    
    const formItem = [
      {
        type: "String",
        controlItemParam: {
          id: "code",
          label: "品牌方商户编号",
          placeholder: '请输入',
          rules: { required: true, max: 50 },
          afterNode: <div className='tips'>品牌方在第三方清结算平台的唯一用户编号，资金清结算时必须提供的识别信息，请务必保证正确！</div>
        }
      },
      {
        type: 'Select',
        controlItemParam: {
          id: 'bank',
          label: '开户行',
          placeholder: '请选择',
          rules: { required: true },
          data: this.state.bankList,
        }
      },
      {
        type: 'Select',
        controlItemParam: {
          id: 'subbranch',
          label: '网点支行',
          placeholder: '请选择',
          rules: { required: true },
          data: this.state.subbranchList,
        }
      },
      {
        type: "String",
        controlItemParam: {
          id: "accountName",
          label: "账户名",
          rules: { required: true },
        },
      },
      {
        type: "String",
        controlItemParam: {
          id: "account",
          label: "账号",
          rules: { required: true },
        },
      },


    ].filter(Boolean)
    let rowArr = []

    formItem.map(row => {
      row.controlItemParam.disabled = this.state.type == "detail" || row.controlItemParam.disabled
      rowArr.push({
        rowParam: {
          ...row.rowParam
        },
        col: [
          {
            // 作用在列上的参数
            colParam: row.colParam,
            // 表单控件
            controlList: [
              row
            ]
          }
        ]
      })
    })
    const formParam = {
      // formItemList: formItem,
      deSerializationData: accountData,
      form: [
        {
          // inputDisabled: true,
          disabled: true,
          pageTitle: { text: titleObj[type]},
          row: rowArr
        }
      ]
    }

    return formParam
  }

  render() {
    const {form} = this.props
    const { type} = this.state
    return (
      <div className={cx({
        "<%= className || fileName %>": true,
        "readMode": type == "detail"
      })}>
        <YxDynamicForm form={form} formParam={this.formParam()} />

        <div className="footer">
          <YxAction {...{
            text: type != "detail" ? "取消" : "返回",
            actionType: 'back'
          }} className="action"></YxAction>
          {type != "detail" &&
          <YxAction {...{
            form: form,
            actionType: 'submit',
            submitRange: 'whole',
            text: '保存',
            timeOut: 5,
            ...this.reqParam()
          }} className="cacelAction"></YxAction>}
        </div>
      </div>
    );
  }
}

export default Form.create()(addView);
