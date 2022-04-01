#!/usr/bin/env node
const program = require("commander");
const inquirer = require("inquirer");
const Metalsmith = require("Metalsmith");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const replace = require("replace")
let { render } = require('consolidate').ejs
const { promisify } = require('util')
render = promisify(render) // 包装渲染方法
// const gmodule = require('../packages/commands/module');
console.log("version", require("../package").version);


const handleCreate = (params = {}, options) => {
  // console.log(params, options);
  inquirer
    //用户交互
    .prompt([
      {
        type: "input",
        name: "fileName",
        message: "文件夹名称?",
      },
      {
        type: "input",
        name: "className",
        message: "最外层样式名称?",
      },
      // {
      //   type: "input",
      //   name: "routerKey",
      //   message: "路由(模块内)唯一值?",
      // },
      {
        type: "list",
        name: "template",
        message: "选择模板?",
        choices: params.files || [],
      },
    ])
    .then((answers) => {
      //根据回答以及选项，参数来生成项目文件
      const fileSrc = path.resolve(params.templateSrc, answers.template);
      const destinationSrc =  path.resolve(params.destinationSrc, answers.fileName);

      console.log(`使用${fileSrc}模板, 生成到${destinationSrc}`);
      Metalsmith(__dirname)
      .metadata(answers)
      .source(fileSrc)
      .destination(destinationSrc)
      .clean(false)
      .use((files, metalsmith, done) => { // 自定义插件
        const meta = metalsmith.metadata()
        Object.keys(files).forEach(async (fileName) => {
          let content = files[fileName].contents.toString();
          if (content.includes('<%')) { // 文件中用<% 我才需要编译
            content = await render(content, meta); // 用数据渲染模板
            files[fileName].contents = Buffer.from(content); // 渲染好的结果替换即可
          }
        })
        // writeRouter({
        //   destinationSrc,
        //   fileName: answers.fileName,
        //   routerKey: answers.routerKey,
        // })
        done()
      })
      .build((err) => {
        if (err) {
          console.error(err);
        }
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

const writeRouter = (params) => {
  console.log(params);
  console.log(params.destinationSrc.split("pages"))
  return
  const routerPath = `
import ClearDetailList from 'bundle-loader?lazy&name=RetailPriceList!pages/SettlementCenter/ClearingMgmt/DetailList/IndexView'

//---ROUTER_IMPORT---
  `


  replace({
    regex: "//---ROUTER_IMPORT---",
    replacement: routerPath,
    paths: [path.resolve(__dirname, "../src/router/index.js")],
    recursive: false,
    silent: true,
  })

  const routerPath1 = `
  {
    path: "/settlementCenter/accountMgmt/setting/accountCheck",
    component: () => { return createBundle(router) }
  },

  //---ROUTER_APPEND---
  `

  replace({
    regex: "//---ROUTER_APPEND---",
    replacement: routerPath1,
    paths: [path.resolve(__dirname, "../src/router/index.js")],
    recursive: false,
    silent: true,
  })
}

program
  .command("add [module] [name]")
  .description("add a new module")
  .action(function (module, name) {
    // console.log(`指定添加功能包${module}-${name}`);
    const getCwd = () => process.cwd();
    const templateSrc = path.resolve(getCwd(), config.templateSrc);
    const destinationSrc = path.resolve(getCwd(), config.destinationSrc);

    // 判断本地项目是否存在模板文件，不存在使用本地的
    const e = fs.existsSync(templateSrc)
    let tsrc = e ? templateSrc : path.resolve(__dirname + "/../", config.templateSrc)
      console.log("使用模板文件地址为：", tsrc);
      fs.readdir(tsrc, function(err, files) {
        handleCreate({
          files,
          destinationSrc,
          templateSrc: tsrc,
        });
      })
    
  });


program
  .command("delete [module] [name]")
  .description("delete a new module")
  .action(function (module, name) {
    // todo
    console.log(`指定删除功能包${module}-${name}`);
    // delete(config,module,name)
  });


program.parse(process.argv);
