#!/usr/bin/env node
const program = require("commander");
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

// const gmodule = require('../packages/commands/module');
console.log("version", require("../package").version);

const handleCreate = (params = {}, options) => {
  // console.log(params, options);
  inquirer
    //用户交互
    .prompt([
      {
        type: "input",
        name: "author",
        message: "author name?",
      },
      {
        type: "list",
        name: "template",
        message: "choose a template",
        choices: params.files || [],
      },
    ])
    .then((answers) => {
      //根据回答以及选项，参数来生成项目文件
      console.log(123, answers);
      // genFiles({ ...answers, ...params, ...options });
    })
    .catch((error) => {
      console.error(error);
    });
};
// program
//   .version(require('../package').version)
//     .usage('<command> [项目名称]')
//     .command('init', '创建新项目');

program
  .command("add [module] [name]")
  .description("add a new module")
  .action(function (module, name) {
    console.log(`指定添加功能包${module}-${name}`);
    let pathName = "../templates"
    fs.readdir(path.join(__dirname, pathName), function(err, files) {
      // dirs = files;
      console.log(files.join(","));
      handleCreate({
        files,
      });
    })
    // add(config,module,name)
  });

program
  .command("dirs")
  .description("read dirs")
  .action(function (module, name) {
    console.log(`读取模板文件夹`);
    let pathName = "../templates"
    // var dirs = [];
    fs.readdir(path.join(__dirname, pathName), function(err, files) {
      // dirs = files;
      console.log(files.join(","));
    })
    // handleCreate();
    // add(config,module,name)
  });

program
  .command("delete [module] [name]")
  .description("delete a new module")
  .action(function (module, name) {
    console.log(`指定删除功能包${module}-${name}`);
    // delete(config,module,name)
  });

program.parse(process.argv);
