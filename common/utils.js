/*
 * @Description: 工具方法：这里写项目常用的工具函数，其他能在lodash提供的，都直接使用lodash的
 * 在其他js中通过 import utils, { isMobile } from '@/common/utils'引入。 utils.isNumber() 的形式进行引用
 * 在 .vue 中通过 this.$utils.* 引用
 * lodash文档：https://lodash.com/docs/4.17.15
 */
import MpUploadOssHelper from '@/common/uploadOssHelper.js';
import QQMapWX from '@/utils/crypto-js/lib/qqmap-wx-jssdk.min.js'
import $mHelper from '@/utils/helper';
import $mConfig from '@/config/index.config.js';
const utils = {
  /**
   * @description 判断字符串是否为JSON字符串，在调用JSON.parse()时先调用该方法校验
   * 如果JSON.parse能够转换成功；并且转换后的类型为object 且不等于 null，那么这个字符串就是JSON格式的字符串
   */
  isJSON(str) {
    if (typeof str === 'string') {
      try {
        const obj = JSON.parse(str);
        return typeof obj === 'object' && obj
      } catch (e) {
        return false;
      }
    } else {
      console.log('It is not a string!')
      return false;
    }
  },
  isImage(filename) {
    return /\.(png|webp|jpg|jpeg|gif|bmp)$/.test(filename.toLowerCase());
  },
  isVideo(filename) {
    return /\.(mp4|m4v|mov|qt|avi|flv|wmv|asf|mpeg|mpg|vob|mkv|asf|rm|rmvb|vob)$/.test(filename.toLowerCase());
  },
  isNumber(arg) {
    return Object.prototype.toString.call(arg) === '[object Number]'
  },
  isObject(arg) {
    return Object.prototype.toString.call(arg) === '[object Object]'
  },
  /**
   * @description JavaScript基本类型及其判断
   * @property {any} obj 需要判断类型的数据
   * @return {string} boolean string number null undefined symbol object
   */
  getType(obj) {
    const str = Object.prototype.toString.call(obj);
    const map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    };
    return map[str];
  },
	/**
	* 是否是手机号码
	*/
	isMobile(arg) {
		return /^1[3456789]\d{9}$/.test(arg)
	},
	
	chooseLocation(){
		return new Promise((resolve,reject)=>{
			var _this = this;
			uni.showLoading();
			uni.chooseLocation({
				success: async function (res) {
					let { latitude,longitude } = res;
					let result = await _this.reverseGeocoder({ latitude,longitude });
					let { province,city,district } = result.ad_info;
					// ,street:result.address_component.street
					let address = result.formatted_addresses.recommend;
					address = address.replace(province,'');
					address = address.replace(city,'');
					address = address.replace(district,'');
					let data = {  latitude,longitude,province,city,region:district,address }
					uni.hideLoading();
					resolve(data);
				},
				fail: (err) => {
					uni.hideLoading();
					if(err.errMsg == 'chooseLocation:fail auth deny'){
						_this.authOpenSetting(2);
					}
				}
			});			
		})
	},
  
	//经纬度转详细地址
	reverseGeocoder(location){
		var _this = this;
		return new Promise((reslove,reject)=>{
			var qqmapsdk = new QQMapWX({
				key: $mConfig.qqmapsdkApiKey // 必填
			}); 
			qqmapsdk.reverseGeocoder({
				//位置坐标，默认获取当前位置，非必须参数
				/**
				 * 
				 //Object格式
				  location: {
					latitude: 39.984060,
					longitude: 116.307520
				  },
				*/
				/**
				 *
				 //String格式
				  location: '39.984060,116.307520',
				*/
				location, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
				//get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
				success:(res) => {//成功后的回调
					console.log(res)
					reslove(res.result)
				},
				fail: (error) => {
					reject(error);
				}
			})
		})
	},
  
	//图片上传
	uploadFile(count=1){
		
		return new Promise((resolve,reject)=>{
			var _this = this;
			
			uni.chooseImage({
				count,
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: (res) => {
						
					const mpHelper = new MpUploadOssHelper({
						accessKeyId: `${ $mConfig.accessKeyId }`,
						accessKeySecret: `${ $mConfig.accessKeySecret }`,
						successActionStatus: '200',
						timeout: 1, // 限制参数的生效时间(单位：小时)。
						maxSize: 10, // 限制上传文件大小(单位：MB)。
					});
					
					const params = mpHelper.createUploadParams()
					const url = 'https://haohaojv-bucket.oss-cn-guangzhou.aliyuncs.com/';
					
					var tempFilePaths = res.tempFilePaths;
					let promiseList = tempFilePaths.map(v=>_this.handleUpload(params,url,v));
					
					Promise.all(promiseList).then(data=>{
						let imgs = data.map(v=>v.picUrl);
						if(count === 1){
							resolve(imgs[0])
						}else{
							resolve(imgs)
						}
					});
				},
				fail: (err) => {
					reject(err);
				}
			})
		});
		
	},
	
	handleUpload(params,url,tempFilePath){
		return new Promise((resolve,reject)=>{
			let tempFileName = tempFilePath.replace('http://tmp/','');
			let tempFile = `haohaoju/${ tempFileName }`
			
			uni.uploadFile({
				url,
				filePath: tempFilePath,
				name: 'file',
				formData: { 
					'key': tempFile,
					...params
				},
				success: (res) => {
					if(res.statusCode == '200'){
						res.picUrl = url + tempFile;
						resolve(res);
					}
				}
			});
		});
	},
  
  /**
   * 保存图片至相册
   */
  saveImgToLocal(qrCodeUrl){
  	var _this = this;
  	uni.showLoading({title: "加载中"});
  	uni.downloadFile({
  		url: qrCodeUrl,
  		success: (res) => {
  			if(res.statusCode === 200){
  				uni.saveImageToPhotosAlbum({
  					filePath: res.tempFilePath,
  					success: ()=>{
  						uni.hideLoading();
  						$mHelper.toast("保存成功")
  					},
  					fail: (err) => {
  						uni.hideLoading();
  						if(err.errMsg == 'saveImageToPhotosAlbum:fail auth deny'){
  							_this.authOpenSetting(1,qrCodeUrl);
  						}
  					}
  				})
  			}else{
  				uni.hideLoading();
  			}
  		}
  	})
  },
  /**
   * @param {Object} type 授权类型: 1.相册授权 2.定位授权
   * @param {Object} data
   */
  authOpenSetting(type,data){
  	var _this = this;
	let msg = type === 1 ? '图片保存' : '定位服务';
  	$mHelper.modal("提示",`请先开启${ msg }权限`,true,()=>{
  		uni.openSetting({
  			success(openSetting) {
  				if(type === 1 && openSetting.authSetting["scope.writePhotosAlbum"]){
  					_this.saveImgToLocal(data);
  				}else if(type === 2 && openSetting.authSetting["scope.userLocation"]){
					_this.chooseLocation();
				}else{
  					$mHelper.toast(`未打开${ msg }权限`)
  				}
  			}
  		})
  	});
  },
  
  // 微信登录
  async wxLogin () {
    return new Promise((resolve, reject) => {
      // #ifdef MP-WEIXIN
      uni.getProvider({
        service: 'oauth',
        success: function (res) {
          if (~res.provider.indexOf('weixin')) {
            uni.login({
              provider: 'weixin',
              success: (res) => {
                uni.getUserInfo({
                  provider: 'weixin',
                  success: (info) => {
                    var params = {
                      code: res.code,
                      iv: info.iv,
                      encryptedData: info.encryptedData,
                      ok: true
                    }
                    // console.log(params)
                    resolve(params)
                  },
                  fail: (err) => {
                    reject(err)
                    uni.showToast({ title: "微信登录授权失败", icon: "none" });
                  }
                })
              },
              fail: (err) => {
                reject(err)
                uni.showToast({ title: "微信登录授权失败", icon:"none" });
              }
            })
          } else {
            uni.showToast({
                title: '请先安装微信或升级版本',
                icon:"none"
            })
          }
        }
      })
      //#endif
    })
  },
  /**
   * @description: 创建自定义随机字符串
   * @param {boolean} flag true 随机 false|自定义
   * @param {nmuber} min  最小位数
   * @param {nmuber} max  最大位数
   * @param {string} prefix  自定义前缀
   * @param {string} suffix  自定义后缀
   * @used  this.mathRandom(true, 8, 16, `cos_upload_`, `_S_${filePath.size}`)
   */
  mathRandom (flag, min, max, prefix = "prefix_", suffix='suffix_', ){
    var str = "", range = min
      arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 				   'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '-', '_'];

    function numRan (num=32) {
     var nos = Math.round(Math.random() * num);
     return arr[nos]
    }
    // 随机产生
    if(flag){
      range = Math.round(Math.random() * (max-min)) + min
    }

    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1))
        str += arr[pos];
    }
    return  prefix + numRan(26) + str + suffix + numRan(32)
  },
  /**
   * iPhone X系列机型 X XS, XS Max, XR
   */
  isIphonex() {
    const xSeriesConfig = [{
      devicePixelRatio: 3,
      width: 375,
      height: 812,
    }, {
      devicePixelRatio: 3,
      width: 414,
      height: 896,
    }, {
      devicePixelRatio: 2,
      width: 414,
      height: 896,
    }]; // h5
    if (typeof window !== 'undefined' && window) {
      const isIOS = /iphone/gi.test(window.navigator.userAgent);
      if (!isIOS) return false;
      const {
        devicePixelRatio,
        screen
      } = window;
      const {
        width,
        height
      } = screen;
      return xSeriesConfig.some(item => item.devicePixelRatio === devicePixelRatio && item.width === width && item.height ===
        height);
    }
    return false;
  },
  /**
   * 身份证校验
   */
  isIDCard(arg) {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(arg)
  },
  /**
   * 数据脱敏（手机号/身份证等）
   * @param  {String|Number} data
   * @param  {String|Number} frontlen 前几位
   * @param  {String|Number} backlen 后几位
   */
  dataDesensitization(data, frontlen = 3, backlen = 2) {
    if (!data) return '***';
    let star = '';
    let len = data.length - frontlen - backlen;
    if (len == 0) star = '***';
    for (let i = 0; i < len; i++) {
      star += '*';
    }
    return data.substring(0, frontlen) + star + data.slice(-backlen)
  },
  /**
   * 判断是否为正确的金额格式
   * @param  {String|Number} arg
   * @return {Boolean}
   */
  isMoney(arg) {
    return /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(arg)
  },
  /**
   * 密码校验：数字＋字母6~20位
   */
  passwordReg(arg) {
    return /^[A-Za-z0-9]{6,20}$/.test(arg)
  },
  /**
   * 验证码校验
   */
  verificationCodeReg(code) {
    return /^\d{4}$/.test(code)
  },
  /**
   * 银行卡号格式化
   * @param {Object} BankNo
   */
  formatBankNo(BankNo) {
    if (!BankNo) return;
    let account = String(BankNo);
    account = account.substring(0, 22); /*帐号的总数, 包括空格在内 */
    if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
      /* 对照格式 */
      if (account.match(".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
          ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null) {
        let accountChar = ""
        let accountNumeric = accountChar
        for (let i = 0; i < account.length; i++) {
          accountChar = account.substr(i, 1);
          if (!isNaN(accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
        }
        account = "";
        for (let i = 0; i < accountNumeric.length; i++) { /* 可将以下空格改为-,效果也不错 */
          if (i == 4) account = account + " "; /* 帐号第四位数后加空格 */
          if (i == 8) account = account + " "; /* 帐号第八位数后加空格 */
          if (i == 12) account = account + " "; /* 帐号第十二位后数后加空格 */
          account = account + accountNumeric.substr(i, 1)
        }
      }
    } else {
      account = " " + account.substring(1, 5) + " " + account.substring(6, 10) + " " + account.substring(14, 18) +
        "-" + account.substring(18, 25);
    }
    return account;
  },
  /**
   * 获取字符串的长度,一个汉字=2个字节
   * @param  {String} str
   */
  getStringLength(str) {
    if (!str) return 0;
    return str.replace(/[\u0391-\uFFE5]/g, "aa").length; //先把中文替换成两个字节的英文，在计算长度
  },
  /**
   * 金额格式化，单位：元
   * 规则：非整数最多显示小数点后2位；整数直接返回
   * @param  {Number} money 金额
   * @param  {Number} decimal 最多保留的小数点位数，默认2位
   * @param  {Boolean} separate 是否每个3位用英文逗号分隔，默认true
   * @param  {Boolean} tofix 是否强制返回decimal为小数点数，默认false
   * @return {String}
   */
  moneyFormat(money = 0, decimal = 2, separate = false, tofix = true) {
    const _money = money ? parseFloat(money) : 0;
    const isInt = /^-?\d+$/.test(_money); // 是否为整数
    const str = _money.toString();
    if (isInt) {
      return separate ? str.substring(0, str.length).replace(/\B(?=(?:\d{3})+$)/g, ',') : tofix ? str + '.00' :
        str;
    } else {
      // 整数部分
      let intSum = str.substring(0, str.indexOf('.'))
      let intSumStr = separate ? intSum.replace(/\B(?=(?:\d{3})+$)/g, ',') : intSum;
      // 小数点部分
      let dot = str.substring(str.length, str.indexOf('.') + 1);
      let dotArr = dot.split('').slice(0, decimal);
      let dotStr = decimal == 0 ? '' : '.';
      dotArr.forEach((item, index) => {
        let end = dotArr.slice(-1);
        if (end == 0) dotArr.pop();
        dotStr += item
      })
      return intSumStr + dotStr
    }
  },
  //////////////// Time ////////////////
  /**判断当前"时 : 分"是否在一天中某一区间内
   * @param {Object} beginTime
   * @param {Object} endTime
   */
	checkAuditTime(beginTime,endTime) {
		var nowDate = new Date();
		var beginDate = new Date(nowDate);
		var endDate = new Date(nowDate);
		
		let beginTimeObj = this.timestampToString(beginTime)
		beginTime = beginTimeObj.hours + ':' + beginTimeObj.minutes;
		
		let endTimeObj = this.timestampToString(endTime)
		endTime = endTimeObj.hours + ':' + endTimeObj.minutes;
	  
		var beginIndex = beginTime.lastIndexOf("\:");
		var beginHour = beginTime.substring(0, beginIndex);
		var beginMinue = beginTime.substring(beginIndex + 1, beginTime.length);
		beginDate.setHours(beginHour, beginMinue, 0, 0);
	  
		var endIndex = endTime.lastIndexOf("\:");
		var endHour = endTime.substring(0, endIndex);
		var endMinue = endTime.substring(endIndex + 1, endTime.length);
		endDate.setHours(endHour, endMinue, 0, 0);
		
		if(nowDate.getTime() - beginDate.getTime() < 0){
			//-1:未开始
			return -1;
		}else if(nowDate.getTime() >= endDate.getTime()){
			//0:已结束
			return 0;
		}
		// 活动进行中
		return 1;
	},
  /**
   * 给时间自动补0
   * @param {Number} i 时间
   */
  checkTime(i) {
    i = parseInt(i)
    return i >= 10 ? i : i <= 0 ? '00' : '0' + i;
  },
  /**
   * 获取某个时间格式的时间戳,由于ios不支持2019-10-01格式的时间，所以需要把时间转换成2019/10/01的格式，否则会报 Invalid Date 错误
   * @param  {String} stringTime "2019-10-01 08:08:08"，或者时间戳
   * @return {String} 时间戳，单位为秒，共10位
   */
  stringTimeToTimestamp(stringTime) {
    if (!stringTime) return new Date(); // 当前时间戳，单位：秒
    // 字符串格式
    if (stringTime.toString().indexOf('-') > -1 || stringTime.toString().indexOf('/') > -1) {
      return Date.parse(new Date(stringTime.replace(/\-/g, '/'))) / 1000
    }
    // 时间戳，转为秒
    const num = stringTime.toString().length == 13 ? 1000 : 1;
    return stringTime / num
  },
  /**
   * @description 时间比较
   * @param {Object} t1
   * @param {Object} t2
   * @return {number} 0:相等；>0:t1>t2；<0:t1<t2
   */
  compareTime(t1, t2) {
    t1 = utils.stringTimeToTimestamp(t1) // 转为秒
    t2 = utils.stringTimeToTimestamp(t2)
    return t1 - t2
  },
  /**
   * 判断某个时间戳是不是在今天内（00:00:00 ~ 23:59:59）
   */
  isToday(timestamp) {
    if (!timestamp) return false;
    const num = timestamp.toString().length == 13 ? 1000 : 1;
    const date = new Date() // 当前时间戳，单位：秒
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let days = date.getDate();

    let _beginStr = `${year}-${month}-${days} 00:00:00`;
    let _beginTime = utils.stringTimeToTimestamp(_beginStr); // 当天开始时间戳

    let _endStr = `${year}-${month}-${days} 23:59:59`;
    let _endTime = utils.stringTimeToTimestamp(_endStr); // 当天结束时间戳

    let _timestamp = timestamp / num;
    return _timestamp >= _beginTime && _timestamp <= _endTime;
  },
  /**
   * 时间戳转换成日期格式
   * @param {String | Number} timestamp 开始时间
   */
  timestampToString(timestamp) {
    if (!timestamp) timestamp = Date.now(); // 如果没传值，则获取当前时间戳，单位毫秒
    // 如果timestamp中间包含“-”，则当作字符串格式处理，转换为10位时间戳
    if (timestamp.toString().indexOf('-') > -1) {
      timestamp = utils.stringTimeToTimestamp(timestamp)
    }
    const num = timestamp.toString().length == 13 ? 1 : 1000;
    const date = new Date(timestamp * num); // timestamp所对应的日期
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let days = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    month = utils.checkTime(month);
    days = utils.checkTime(days);
    hours = utils.checkTime(hours);
    minutes = utils.checkTime(minutes);
    seconds = utils.checkTime(seconds);
    return {
      year,
      month,
      days,
      hours,
      minutes,
      seconds,
      value: `${year}-${month}-${days} ${hours}:${minutes}:${seconds}`
    }
  },
  /**
   * @description 格式化${startTime}距现在的已过时间
   * @property {String, Number} timestamp 开始时间(时间戳1601363958，单位毫秒或秒都可以，最终会转换成秒来计算。或字符串格式2020-08-08 08:08:08)
   */
  formatPassTime(timestamp) {
    if (!timestamp) return '';
    // 如果timestamp中间包含“-”，则当作字符串格式处理，转换为10位时间戳
    if (timestamp.toString().indexOf('-') > -1) {
      timestamp = utils.stringTimeToTimestamp(timestamp)
    }
    const num = timestamp.toString().length == 13 ? 1 : 1000;
    const now = Math.round(new Date()) // 当前时间戳，单位：毫秒
    const seconds = Math.floor((now - timestamp * num) / 1000) // 转为秒来计算
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 48) {
      const date = new Date(timestamp * num); // timestamp所对应的日期
      const Year = date.getFullYear();
      const Month = date.getMonth() + 1;
      const Days = date.getDate();
      const Hours = date.getHours();
      const Minutes = date.getMinutes();
      const curYear = new Date().getFullYear(); // 当前年份
      if (curYear == Year) {
        return `${Month}月${Days}日 ${utils.checkTime(Hours)}:${utils.checkTime(Minutes)}`
      }
      return `${Year}.${Month}.${Days} ${utils.checkTime(Hours)}:${utils.checkTime(Minutes)}`
    }
    if (hours > 24) return '昨天'
    if (hours > 0) return hours + '小时前'
    if (minutes >= 1) return minutes + '分钟前'
    if (minutes < 1) return '刚刚'
  },
  /**
   * @description 计算现在距离结束时间剩余时间，可用于倒计时计算
   * @property {String | Number} timestamp 结束时间(时间戳1601363958，单位毫秒或秒都可以，最终会转换成秒来计算。或字符串格式2020-08-08 08:08:08)
   * @property {Boolean} showDay 是否显示天数
   */
  calcLeftTime(timestamp, showDay = false) {
    // 如果timestamp中间包含“-”，则当作字符串格式处理，转换为10位时间戳
    if (timestamp.toString().indexOf('-') > -1) {
      timestamp = utils.stringTimeToTimestamp(timestamp)
    }
    if (!timestamp) timestamp = Math.round(new Date() / 1000) // // 如果没传值，则获取当前时间戳，单位：秒
    const num = timestamp.toString().length == 13 ? 1000 : 1;
    const now = Math.round(new Date() / 1000); // 当前时间戳，单位：秒
    const leftTime = timestamp / num - now; // 转为秒来计算
    const days = parseInt(leftTime / 60 / 60 / 24, 10); // 计算剩余的天数
    const hours = parseInt((leftTime / 60 / 60) % 24, 10); // 计算剩余的小时
    const minutes = parseInt((leftTime / 60) % 60, 10); // 计算剩余的分钟
    const seconds = parseInt(leftTime % 60, 10); // 计算剩余的秒数

    const _totalHours = utils.checkTime(days * 24 + hours);
    const _days = utils.checkTime(days);
    const _hours = utils.checkTime(hours);
    const _minutes = utils.checkTime(minutes);
    const _seconds = utils.checkTime(seconds);

    let str = '';
    if (days > 0) {
      str = showDay ? `${_days}:${_hours}:${_minutes}:${_seconds}` : `${_totalHours}:${_minutes}:${_seconds}`;
    } else if (hours > 0) {
      str = `${_hours}:${_minutes}:${_seconds}`;
    } else {
      str = `${_minutes}:${_seconds}`;
    }

    return {
      leftTime: leftTime <= 0 ? 0 : leftTime,
      days: _days,
      hours: _hours,
      totalHours: _totalHours,
      minutes: _minutes,
      seconds: _seconds,
      value: str
    };
  },
  /**
   * 字符串时间格式化
   * @param {string} timeString 2020-10-06 20:20:18
   */
  formatTime(timeString) {
    if (!timeString) return ''
    let arr = []
    let arr2 = []
    if (timeString && typeof timeString === 'string') {
      arr = timeString.substr(0, 10).split('-')
      arr2 = timeString.substr(11, 19).split(':')
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = arr[1]
    const days = arr[2]
    const hours = arr2[0]
    const minutes = arr2[1]
    if (year == arr[0]) return `${month}月${days}日 ${hours}:${minutes}`
    return `${arr[0]}年${month}月${days}日 ${hours}:${minutes}`
  },
  /**
   * 将数值转化为万、亿、万亿并保留两位小数
   * @return {[string]} 格式化后的结果
   */
  formatNumber(value) {
    if (typeof parseFloat(value) !== 'number') return '0';
    if (!value) return '0';
    let param = {};
    var k = 10000,
      sizes = ['', 'w', '亿', '万亿', '兆', '万兆'],
      i;
    if (value < k) {
      param.value = parseInt(value)
      param.unit = ''
    } else {
      i = Math.floor(Math.log(value) / Math.log(k));
      param.value = ((value / Math.pow(k, i))).toFixed(2);
      param.unit = sizes[i] || '';
    }
    return param.value + param.unit;
  },
  /**
   * @description 版本号比较
   * @param {Object} v1 Major.Minor.Patch（主版本号.次版本号.修订版本号）
   * @param {Object} v2 Major.Minor.Patch（主版本号.次版本号.修订版本号）
   * @return {number} 0:相等；1:v1>v2；-1:v1<v2
   */
  compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
    return 0
  },
  /**
   * 提取数组或object对象字段
   * @param {Object|array} data  数组或OBJECT对象
   * @param {string} field 字段键值(多个逗号分隔)
   * @param {boolean} has  true 表示提取field定义的字段  false 表示取反
   * use  this.arrayFields(data, 'name, id', false)
   */
  arrayFields: (data, field, has) => {
    var obj = !Array.isArray(data) ? [data] : data
    var fd = field.split(',')
    var re = new RegExp('^' + fd.join('|') + '$')
    Object.keys(obj).forEach(function (k) {
      Object.keys(obj[k]).forEach(function (i) {
        !has ? re.test(i) ? delete obj[k][i] : ''
          : !re.test(i) ? delete obj[k][i] : ''
      })
    })
    return !Array.isArray(data) ? obj[0] : obj
  },
  //////////////// Url ////////////////
  /**
   * 往URL上拼接参数
   * 查询字符串中每个参数的名称和值都必须使用 encodeURIComponent() 进行编码，然后才能放到 URL 的末尾；
   * 所有名-值对儿都必须由和号 ( & ) 分隔
   * @param {Object} obj
   */
  addURLParam(url, obj) {
    if (!utils.isObject(obj)) return url
    for (let key in obj) {
      url += url.indexOf('?') == -1 ? '?' : '&'
      url += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    }
    return url
  },
  /**
   * 把url的参数部分转化成json对象
   *
   * @param {string} url
   * @returns
   */
  parseQueryString(url) {
    let reg_url = /^[^\?]+\?([\w\W]+)$/,
      reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
      arr_url = reg_url.exec(url),
      ret = {};
    if (arr_url && arr_url[1]) {
      let str_para = arr_url[1],
        result;
      while ((result = reg_para.exec(str_para)) != null) {
        ret[result[1]] = result[2];
      }
    }
    return ret;
  },
  /**
   * 通过key获取url中的参数值
   *
   * @param {string} url
   * @returns
   */
  getQueryString(url, name) {
    let obj = utils.parseQueryString(url);
    for (let key in obj) {
      return obj[name] || null;
    }
  },
  /**
   * 对象序列化
   *
   * @param {Object} obj
   * @returns
   */
  stringfyQueryString(obj, linkSymbol = '&') {
    if (!obj) return ''
    let pairs = []
    for (let key in obj) {
      let value = obj[key]
      if (value instanceof Array) {
        for (let i = 0; i < value.length; ++i) {
          pairs.push(encodeURIComponent(key + '[' + i + ']') + '=' + encodeURIComponent(value[i]))
        }
        continue
      }
      pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    }
    return pairs.join(linkSymbol)
  },
  /**
   * 合并css样式，最终返回字符串形式
   * @param {Object} obj 对象格式的样式 如：{ fontSize: 16px, color: inherit }
   * @param {String} str 字符串格式的样式 如：font-size:16px;color:inherit;
   * @returns 字符串形式的style，如：font-size:16px;color:inherit;
   */
  mergeStyle(x = '', y = '') {
    if (!x && !y) return '';
    let str = '';
    // 两个都是对象
    if (typeof x === 'object' && typeof y === 'object') {
      let obj = Object.assign(x, y);
      for (let key in obj) {
        str += `${key}:${obj[key]};`;
      }
      return str;
    }
    // 两个都是字符串
    if (typeof x === 'string' && typeof y === 'string') {
      return x + y;
    }
    // 一个对象，一个字符串
    if (typeof x === 'object' && typeof y === 'string') {
      for (let key in x) {
        str += `${key}:${x[key]};`;
      }
      str += y;
      return str;
    }
    if (typeof x === 'string' && typeof y === 'object') {
      str += x;
      for (let key in y) {
        str += `${key}:${y[key]};`;
      }
      return str;
    }
    return str
  },
  /**
   * 确认框二次封装
   *
   * @param {Object} options // 同uni.showModal参数一样
   * @returns
   */
  showModal(options) {
    let platform = uni.getSystemInfoSync().platform
    if (platform === 'android') {
      if (options.showCancel !== false) { // 两个按钮时候正常
        //参数初始化
        options.confirmText = options.confirmText || '确认'
        options.cancelText = options.cancelText || '取消'

        // 参数互换
        let tempText = ''
        let tempColor = ''
        tempText = options.confirmText
        tempColor = options.confirmColor
        options.confirmText = options.cancelText
        options.confirmColor = options.cancelColor
        options.cancelText = tempText
        options.cancelColor = tempColor

        // 成功回调拦截处理
        if (options.success) {
          let tempSuccess = options.success
          options.success = res => {
            let temp = null
            temp = res.confirm
            res.confirm = res.cancel
            res.cancel = temp
            tempSuccess(res)
          }
        }
      }
      // 只有一个按钮的时候， 不做处理
    }
    uni.showModal(options)
  },
  // uni.showToast封装
  toast(title = 'toast', position = 'bottom', cb = () => {}) {
    uni.hideToast();
    uni.showToast({
      title,
      icon: 'none',
      position: position || 'bottom',
      success() {
        if (cb) {
          setTimeout(() => {
            cb();
          }, 300)
        }
      }
    })
  },
  resetResolve (data) {
    var obj = !Array.isArray(data) ? [data] : data
    for (var i in obj) {
      Object.keys(obj[i]).forEach((k) => {
        if(Object.prototype.toString.call(obj[i][k]) === '[object String]' && obj[i][k].match(/{\.*|\[\.*/)){
          try {

            obj[i][k] = JSON.parse(obj[i][k])
            console.log(obj[i][k])
          } catch (err){
            // console.log(err)
          }
        } else {
          console.log()
          if (obj[i][k]) {
            Object.keys(obj[i][k]).forEach((c) => {
                Object.keys(obj[i][k][c]).forEach((d) => {
                  if (Object.prototype.toString.call(obj[i][k][c][d]) === '[object String]' && obj[i][k][c][d].match(/{\.*|\[\.*/)) {
                    obj[i][k][c][d] = JSON.parse(obj[i][k][c][d])
                  }
                })
            })
          }
        }
      })
    }
    return !Array.isArray(data) ? obj[0] : obj
  }
}

module.exports = utils
