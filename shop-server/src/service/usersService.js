const db = require('../utils/db')

class UsersService {
  // 添加用户
  async createUser({ username, password, phone }) {
    let sql = 'insert into users (username, phone, password) values(?,?,?)'
    return await db.query(sql, [username, phone, password])
  }
  // 修改密码
  async updatePassword(user_id, password) {
    let sql = 'update users set password = ? where user_id = ?'
    return await db.query(sql, [password, user_id])
  }
  // 查找用户信息
  async findUserInfo(username) {
    let sql = 'select * from users where username = ?'
    return await db.query(sql, [username])
  }
  // 查询用户是否存在
  async queryUser({ username, phone }) {
    let sql = 'select * from users where username = ? or phone = ?'
    return await db.query(sql, [username, phone])
  }
  // 查找用户某项数据
  async getUserItem(item, key, value) {
    let sql = `select ${item} from users where ${key} = ?`
    return await db.query(sql, [value])
  }
  // 后台查找用户信息
  async fineSearchUser(search, start = 0, end = 0) {
    let sql = 'select * from users where 1 = 1'
    // console.log(start, typeof end)
    if (search.username) {
      sql += ` and username = '${search.username}'`
    }
    if (search.phone) {
      sql += ` and phone = '${search.phone}'`
    }
    if (end !== 0) {
      sql += ' limit ?, ?'
    }
    // console.log(sql)
    return await db.query(sql, [start, end])
  }
  // 重置密码
  async resetPassword(user_id, password) {
    let sql = 'update users set password = ? where user_id = ?'
    // console.log(user_id, password)
    return await db.query(sql, [password, user_id])
  }
  // 注销用户
  async deleteUser(user_id, password) {
    let sql = 'delete from users where user_id = ?'
    // console.log(user_id, password)
    return await db.query(sql, [user_id])
  }
}

module.exports = new UsersService()
