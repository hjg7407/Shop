

##### 1 npm初始化

```js
npm init -y
```

生成`package.json`文件，记录项目的依赖

##### 2 安装Koa框架

```js
npm i koa
```

##### 3 安装nodemon工具

当代码被修改时重新启动服务器，-D安装到开发环境中

``` js
npm i nodemon -D
```

编写node运行脚本`package.json`

```js
"main": "app.js", //更改程序的入口文件为app.js
"scripts": {
  "start": "node app.js",
  "nodemon": "node app.js"
}
```

编写app入口文件，`nodemon`启动服务器

##### 4 读取配置文件

安装dotenv，读取根目录中的`.env`文件，将配置写到process.env中（程序运行的环境变量）

```js
npm i dotenv
```

##### 5 添加路由

安装koa-router,根据不同的URL请求，调用相应的处理函数

```js
npm i koa-router
```

##### 6 解析body

安装koa-body获取请求体信息

```js
npm i koa-body
```

##### 7 加密

安装`bcryptjs`

```js
npm i bcryptjs
```

##### 8 连接数据库

安装`mysql`

```js
npm i mysql
```

##### 9 用户验证

安装`jsonwebtoken`

```js
npm i jsonwebtoken
```

