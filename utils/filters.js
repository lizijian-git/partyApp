// 全局过滤器
export default {
	// 字符串转换小写
	lowercase (str) {
		if (!str) return
		return str.toLocaleLowerCase()
	},
	// 字符串过滤
	filterStr (str, number, repstr) {
		if (repstr) {
		  if (str.length >= number) {
		    return str.substring(0, number) + repstr
		  } else {
		    return str.substring(0, number)
		  }
		} else {
		  return str.substring(0, number)
		}
	},
	// 截取html标签文本转换
	filterHtmlStr (str, number, repstr) {
		if (str) {
		  str = str.replace(/<\/?[^>]*>/g, '')
		  str = str.replace(/[ | ]*\n/g, '\n')
		  str = str.replace(/&nbsp;/ig, '')
		  if (repstr) {
		    return str.substring(0, number) + repstr
		  } else {
		    return str.substring(0, number)
		  }
		}
	},
	// 时间戳秒转时分秒
	transformat (time, t) {
		if (typeof time !== 'number') return ''
		let H = parseInt(time / 3600)
		let o = {
		  'h+': Math.floor(time / 3600),
		  'm+': Math.ceil((time - H * 3600) / 60)
		}
		for (let k in o) {
		  let time = o[k] + ''
		  if (new RegExp(`(${k})`).test(t)) {
		    t = t.replace(RegExp.$1, (RegExp.$1.length === 1) ? time : '')
		    // console.log(t)
		  }
		}
		return t
	},
	// 数字转换成汉字中的数字
	conversion (section) {
		var chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
		var chnUnitChar = ['', '十', '百', '千']
		let strIns = ''; let chnStr = ''
		var unitPos = 0
		var zero = true
		// var regx = `/${chnNumChar[1]}${chnUnitChar[1]}/g`
		while (section > 0) {
		  var v = section % 10
		  if (v === 0) {
		    if (!zero) {
		      zero = true
		      chnStr = chnNumChar[v] + chnStr
		    }
		  } else {
		    zero = false
		    strIns = chnNumChar[v]
		    strIns += chnUnitChar[unitPos]
		    chnStr = strIns + chnStr
		  }
		  unitPos++
		  section = Math.floor(section / 10)
		}
		return chnStr
	},
	// 时间格式转换
	formatDate (value, n) {
		let date
		var padLeftZero = (str) => {
		  return ('00' + str).substr(str.length)
		}
		// console.log(value)
		if (!value) return
		if (typeof value === 'number') {
		  var str = value.toString()
		  date = str.length === 10 ? new Date(value * 1000) : new Date(value)
		} else if (typeof value === 'object') {
		  date = value
		} else {
		  date = value.length === 10 ? new Date(parseInt(value) * 1000) : new Date(parseInt(value))
		}
		
		if (/(y+)/.test(n)) {
		  n = n.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
		}
		let o = {
		  'M+': date.getMonth() + 1,
		  'd+': date.getDate(),
		  'h+': date.getHours(),
		  'm+': date.getMinutes(),
		  's+': date.getSeconds()
		}
		for (let k in o) {
		  let str = o[k] + ''
		  if (new RegExp(`(${k})`).test(n)) {
		    n = n.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
		  }
		}
		return n
	},
	// 通用图片裁剪
	setSize (value, width, height) {
		if (!width && !height) {
			width = 75
			height = 100
		}
		return value + '?x-oss-process=image/resize,m_fill,w_' + width + ',h_' + height + '/sharpen,100'
	},
	// 文件大小单位转换
	fileSize (fileSize) {
		var temp
		if (fileSize < 1024) {
		  return fileSize + 'B'
		} else if (fileSize < (1024 * 1024)) {
		  temp = fileSize / 1024
		  temp = temp.toFixed(2)
		  return temp + 'KB'
		} else if (fileSize < (1024 * 1024 * 1024)) {
		  temp = fileSize / (1024 * 1024)
		  temp = temp.toFixed(2)
		  return temp + 'MB'
		} else {
		  temp = fileSize / (1024 * 1024 * 1024)
		  temp = temp.toFixed(2)
		  return temp + 'GB'
		}
	},
	// 截取字符串第一个字
	words () {
		const str = val ? val.slice(0, 1) : ''
		return str
	}
}