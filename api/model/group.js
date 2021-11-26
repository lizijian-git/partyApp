/*
 * @Description: 团购相关API
 * @Author: By AC
 * @Date: 2021-01-29 21:16:52
 * @Email: 289065365@qq.com
 * @LastEditTime: 2021-02-05 00:12:37
 * @LastEditors: // code
 */

import request from '@/common/request'
export default {
  /**
   * @description 新-获取课程开团界面信息，用于发起拼团
   * @property {string} phone 手机号
   * @property {integer} type 类型, 1=注册 2=重置密码 3=修改手机号-原手机号 4=修改手机号-新手机号 5=验证码登陆
   */
  getInfoForOpen: params => request({
    url: 'mall/group/info/getInfoForOpen',
    params,
    method: 'GET',
    loading: true
  }),
  /**
   * @description: 获取课程开团界面信息，用于发起拼团
   * @param {string} id
   * @return string courseId
   */
  getInfoForOpen: params => request({
    url: 'mall/group/info/getInfoForOpen',
    params,
    method: 'POST',
    loading: true
  }),
  /**
   * @description: 获取课程参团界面信息，用于参与拼团
   * @param {string} launchId
   * @return string courseId
   */
  getInfoForAttend: params => request({
    url: 'mall/group/info/getInfoForAttend',
    params,
    method: 'POST',
    loading: true
  }),
}

