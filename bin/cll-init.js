// common.cjs
// NODE moudle
//  node.js 命令行解决方案
const program = require("commander");

// node.js path模块
const path = require("path");

// node.js fs模块
const fs = require("fs");

// 常见的交互式命令行用户接口的集合
const inquirer = require("inquirer");

// 使用shell模式匹配文件
const glob = require("glob");

// 活动最新的npm包
// const latestVersion = require("latest-version");

// node.js 子进程
const spawn = require("child_process").spawn;

// node.js 命令行环境的 loading效果， 和显示各种状态的图标
// const ora = require("ora");

// The UNIX command rm -rf for node.
const rm = require("rimraf").sync;

async function main() {
  let projectRoot, templateName
  try {
    // 检测版本
    let isUpate = await checkVersion();
    // 更新版本
    if (isUpate) await updateCli();
    // 检测路径
    projectRoot = await checkDir();
    // 创建路径
    makeDir(projectRoot)
    // 选择模板
    let { git } = await selectTemplate();
    // 下载模板
    templateName = await dowload(rootName, git);
    // 本地配置
    let customizePrompt = await getCustomizePrompt(templateName, CONST.CUSTOMIZE_PROMPT)
    // 渲染本地配置
    await render(projectRoot, templateName, customizePrompt);
    // 删除无用文件
    deleteCusomizePrompt(projectRoot)
    // 构建结束
    afterBuild();
  } catch (err) {
    log.error(`创建失败：${err.message}`)
    afterError(projectRoot, templateName)
  }
}