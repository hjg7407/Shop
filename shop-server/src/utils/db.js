const mysql = require('mysql')
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DB,
  MYSQL_USER,
  MYSQL_PWD
} = require('../config/default')

//创建连接池
const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DB,
  user: MYSQL_USER,
  password: MYSQL_PWD
})

//对数据库进行操作
function query(sql, params) {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      //未连接成功，报错
      if (error) return reject(error)
      //连接成功得到一个连接对象，调用query方法执行SQL语句
      //params为运行SQL语句需要的参数，没有可不写
      connection.query(sql, params, (errors, results) => {
        //释放连接
        connection.release()
        //SQL语句有错 抛出错误
        if (errors) return reject(errors)
        resolve(results)
      })
    })
  })
}
/**
 * mysql 事务处理
 * @param {Array} sqls 需要执行的sql语句
 * @param {Array} params 对应上面sql语句的参数
 * @returns {Promise} 返回一个Promise
 */
function transaction(sqls, params) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      // 连接失败 promise直接返回失败
      if (err) {
        return reject(err)
      }
      // 如果 语句和参数数量不匹配 promise直接返回失败
      if (sqls.length !== params.length) {
        connection.release() // 释放掉
        console.log('语句与传值不匹配')
        return reject(new Error('语句与传值不匹配'))
      }
      // 开始执行事务
      connection.beginTransaction((beginErr) => {
        // 创建事务失败
        if (beginErr) {
          connection.release()
          console.log('创建事务失败')
          return reject(beginErr)
        }
        console.log('开始执行事务，共执行' + sqls.length + '条语句')
        // 返回一个promise 数组
        let funcAry = sqls.map((sql, index) => {
          return new Promise((sqlResolve, sqlReject) => {
            const data = params[index]
            connection.query(sql, data, (sqlErr, result) => {
              if (sqlErr) {
                return sqlReject(sqlErr)
              }
              sqlResolve(result)
            })
          })
        })
        // 使用all 方法 对里面的每个promise执行的状态 检查
        Promise.all(funcAry)
          .then((arrResult) => {
            // 若每个sql语句都执行成功了 才会走到这里 在这里需要提交事务，前面的sql执行才会生效
            // 提交事务
            connection.commit(function (commitErr, info) {
              if (commitErr) {
                // 提交事务失败了
                console.log('提交事务失败:' + commitErr)
                // 事务回滚，之前运行的sql语句不生效
                connection.rollback(function (err) {
                  if (err) console.log('回滚失败：' + err)
                  connection.release()
                })
                // 返回promise失败状态
                return reject(commitErr)
              }

              connection.release()
              // 事务成功 返回 每个sql运行的结果 是个数组结构
              resolve(arrResult)
              console.log('事务成功')
            })
          })
          .catch((error) => {
            // 多条sql语句执行中 其中有一条报错 直接回滚
            connection.rollback(function () {
              console.log('sql运行失败： ' + error)
              connection.release()
              reject(error)
            })
          })
      })
    })
  })
}
exports.query = query
exports.transaction = transaction
