# CLI 项目

## 全局安装与链接

1. 首先全局安装CLI工具：
下载项目到本地，安装依赖。
```bash
git clone xxxx
```
2.link 到全局

```bash
npm link
// 或者
yarn link
```

3. 进入需要新建文件的目录，运行命令, 或者vscode右键选择在集成终端中打开
```bash
cll add
```
按照提示输入信息，即可创建文件。

## 自定义模板

项目提供了以下模板，位于 `templates/` 目录下：

### React 页面模板
- `index.tsx` - React组件模板
- `index.less` - 样式文件模板

### Taro 页面模板
- `index.tsx` - Taro组件模板
- `index.less` - 样式文件模板

### 添加自定义模板
1. 在 `templates/` 下创建新文件夹
2. 添加模板文件（如 `index.tsx`, `index.less`）
3. 运行 `cll add` 时选择新模板

