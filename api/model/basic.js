/*
 * @Description: basic model
 * @Author: By AC
 * @Date: 2021-02-02 23:34:43
 * @Email: 289065365@qq.com
 * @LastEditTime: 2021-02-02 23:35:24
 * @LastEditors: // code
 */

import request from '@/common/request'
export default {
  /**
   * @description 新-获取课程开团界面信息，用于发起拼团
   * @property {string} phone 手机号
   * @property {integer} type 类型, 1=注册 2=重置密码 3=修改手机号-原手机号 4=修改手机号-新手机号 5=验证码登陆
   */
  getIdxConfig: params => request({
    url: 'mall/idx/getIdxConfig',
    params, // 请求的参数，全部统一使用params，不需要修改为data。因为request方法已经做好了封装
    method: 'GET', // 如果是GET，不需要写这个
    loading: true // 为true时会loading提示“请求中...”，也可通过loadingMsg参数自定义提示语
  })
}
