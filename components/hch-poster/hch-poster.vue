<!--
 * @Description: 生成海报组件
 * @Version: 1.0.0
 * @Autor: hch
 * @Date: 2020-08-07 14:48:41
 * @LastEditors: hch
 * @LastEditTime: 2020-08-10 11:02:27
 * 保存海报按钮和关闭按钮 在html代码中写出来 绑定点击方法然后透明 再用canvas 覆盖
-->

<template>
  <view class="canvas-content" v-show="canvasShow">
    <!-- 遮罩层 -->
    <view class="canvas-mask"></view>
    <canvas ref="canvasrefs" class="canvas" canvas-id="myCanvas"></canvas><!-- 海报 -->
    <!-- 关闭按钮 -->
    <!-- <cover-image class="canvas-close-btn" @tap="handleCanvasCancel" src="https://huangchunhongzz.gitee.io/imgs/poster/close_btn.png" alt="" srcset=""></cover-image> -->
    <view class="button-wrapper">
      <!-- 保存海报按钮 -->
      <!-- <cover-view class="save-btn" @tap="handleSaveCanvasImage">保存海报</cover-view> -->
      <!-- <cover-view class="save-btn cancel-btn" @tap="handleCanvasCancel">取消</cover-view> -->
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      canvasShow:false,
      attrs:{//主板版海报
        marginLR: 40,
        marginTB: 70,
        price: 0,
        radius: 0.03,
        fillColor: '#ffffff',
        innerLR: 20,
        innerTB: 20,
        posterRatio: 1.3,
        posterImgUrl: "https://huangchunhongzz.gitee.io/imgs/poster/product.png",
        title: "200g",
        titleFontSize: 16,
        titleLineHeight: 25,
        posterCodeUrl: "https://huangchunhongzz.gitee.io/imgs/poster/code.png",
        codeWidth: 0.3,
        codeRatio: 1,
        codeRadius: 0.5,
        codeMT: 20,
        codeName: "营地教育",
        codeNameMT: 20,
        tips: "长按/扫描识别查看商品",
        posterBgUrl:'https://huangchunhongzz.gitee.io/imgs/poster/poster_bg_3.png',
        codeML:140,
        desTextMT:70,
        desTextML:240,
      }
    }
  },
  props: {
    canvasAttr:{
      type:Object,
      default:{
        marginLR: 40,
        marginTB: 40,
        radius: 0.03,
        fillColor: '#ffffff',
        innerLR: 20,
        innerTB: 20,
        posterRatio: 1.3,
        posterImgUrl: "https://huangchunhongzz.gitee.io/imgs/poster/product.png",
        title: "标题",
        titleFontSize: 16,
        titleLineHeight: 25,
        posterCodeUrl: "https://huangchunhongzz.gitee.io/imgs/poster/code.png",
        codeWidth: 0.3,
        codeRatio: 1,
        codeRadius: 0.5,
        codeMT: 20,
        codeName: "",
        codeNameMT: 20,
        tips: "长按/扫描识别查看商品",
        posterBgUrl:'https://huangchunhongzz.gitee.io/imgs/poster/poster_bg_3.png',
        codeML:140,
        desTextMT:70,
        desTextML:240,
      }
    },
    posterBgFlag:{//是否展示海报背景图
      type:Boolean,
      default:false
    },
    simpleFlag:{//是否展示简单版海报
      type:Boolean,
      default:false
    },
  },
  watch:{
	  canvasAttr:{
  　　　　handler(newValue, oldValue) {},
  　　　　deep: true
	  }
  },
  mounted() {
    this.system = this.getSystem()
  },
  methods: {
    /**
     * @description: 展示海报
     * @param {type}
     * @return {type}
     * @author: hch
     */
    posterShow (posterCodeUrl) {
      this.canvasShow = true
      Object.assign(this.attrs,this.canvasAttr)
      this.attrs={
        marginLR: this.attrs.marginLR*this.systemScale,
        marginTB: this.attrs.marginTB*this.systemScale,
        innerLR: this.attrs.innerLR*this.systemScale,
        innerTB: this.attrs.innerTB*this.systemScale,
        radius: this.attrs.radius,
        fillColor: this.attrs.fillColor,
        posterRatio: this.attrs.posterRatio,
        posterImgUrl:this.attrs.posterImgUrl,
        title: this.attrs.title,
        price: this.attrs.price,
        titleFontSize: this.attrs.titleFontSize*this.systemScale,
        titleLineHeight: this.attrs.titleLineHeight*this.systemScale,
        posterCodeUrl: posterCodeUrl || this.attrs.posterCodeUrl,
        codeWidth: this.attrs.codeWidth*this.systemScale,
        codeRatio: this.attrs.codeRatio,
        codeRadius: this.attrs.codeRadius,
        codeMT: this.attrs.codeMT*this.systemScale,
        codeName: this.attrs.codeName,
        codeNameMT: this.attrs.codeNameMT*this.systemScale,
        tips: this.attrs.tips,
        posterBgUrl: this.attrs.posterBgUrl,
        codeML: this.attrs.codeML*this.systemScale,
        desTextMT:this.attrs.desTextMT*this.systemScale,
        desTextML:this.attrs.desTextML*this.systemScale,
        faceUrl: this.attrs.faceUrl,
        timeUrl: this.attrs.timeUrl,
        positionUrl: this.attrs.positionUrl,
        ageText: this.attrs.ageText,
        location: this.attrs.location,
        timeText: this.attrs.timeText,
        activityDay: this.attrs.activityDay,
        periodcellfirst: this.attrs.periodcellfirst,
        periodcellsecond: this.attrs.periodcellsecond,
      }
      this.creatPoster(this.attrs)

    },
    /**
     * @description: 生成海报
     * @param {number} marginTB 上下距离
     * @param {number} marginLR 左右距离
     * @param {number} innerLR 上下内边距
     * @param {number} innerTB 左右内边距
     * @param {number} radius 圆角
     * @param {number} fillColor 海报填充背景色
     * @param {number} posterRatio 海报主图片宽高比例
     * @param {number} posterImgUrl 海报主图片url
     * @param {number} title 海报的title
     * @param {number} titleFontSize 字体大小
     * @param {number} titleLineHeight 标题文本的行高大小
     * @param {number} posterCodeUrl 小程序码图片
     * @param {number} codeWidth 小程序码的占屏幕的百分比
     * @param {number} codeRatio 小程序码的宽度比例
     * @param {number} codeRadius 小程序码的圆角
     * @param {number} codeMT 小程序码的margin-top值
     * @param {number} codeName 小程序码名字
     * @param {number} codeNameMT 小程序码名字的margin-top值
     * @param {number} tips 提示语
     * @author: hch
     */
    async creatPoster(canvasAttr){
      wx.showLoading({
        title: "生成海报中..."
      })
      const ctx = wx.createCanvasContext("myCanvas",this)
      ctx.draw()//清空之前的海报
      // 根据设备屏幕大小和距离屏幕上下左右距离，及圆角绘制背景
      let x = canvasAttr.marginLR
      let y = canvasAttr.marginTB
      let w = this.system.w-2*canvasAttr.marginLR
      let scalpad = this.system.w <= 320 ? 100 : 130
      let h = (this.scale*this.system.w)-2 * canvasAttr.marginTB - scalpad
      let r = (this.system.w-2*canvasAttr.marginLR)*canvasAttr.radius
	
      this.roundRect(ctx, x, y, w, h + 20, r,canvasAttr.fillColor);
      if(this.posterBgFlag){
         await this.creatBgImg(ctx,canvasAttr)
      }
      // 产品主图
      let imgAttr = await this.creatImg(ctx,canvasAttr)

      // 绘制标题 textY 绘制文本的y位置
      let textY = this.creatTitle(ctx,canvasAttr)

      // 绘制头像
      let src = canvasAttr.faceUrl
      let sx = canvasAttr.marginLR// 开始剪切的 x 坐标位置
      let sy = canvasAttr.marginTB - 30 // 开始剪切的 y 坐标位置
      let sw = this.system.w - (canvasAttr.marginLR*2) // 被剪切图像的宽度
      let sh = (this.system.w-2 * canvasAttr.marginLR-2 * canvasAttr.innerLR) / canvasAttr.posterRatio // 被剪切图像的高度
      let x1 = canvasAttr.marginLR + 15
      let y1 = textY + 67
      let w1 = 20
      let h1 = 16
      console.log(sw, sh)
      let faceY = this.setImage(ctx, src, sx, sy, sw, sh + 5, x1, y1, w1, h1)

      // 绘制年龄区间
      let dasX = canvasAttr.marginLR+canvasAttr.innerLR
      let dashY = (this.system.w-2*canvasAttr.marginLR-2*canvasAttr.innerLR)/canvasAttr.posterRatio+2*canvasAttr.innerLR+canvasAttr.marginTB
      let maxWidth = this.system.w-2*canvasAttr.marginLR-2*canvasAttr.innerLR
      let lineHeight = canvasAttr.titleLineHeight
      let fillstyle = '#666'
      let size = '12'
      this.createText(ctx, canvasAttr.ageText, x1 + 15, textY + 77, maxWidth, lineHeight, '#999', size)

      // 绘制定位图标
      let positionsrc = canvasAttr.positionUrl
      let pw = 18
      let ph = 13
      this.setImage(ctx, positionsrc, sx, sy - 3, sw, sh - 3, x1 + 70, y1, pw, ph)

      // 绘制定位地点
	  let locationFirstRow = canvasAttr.location.substring(0,10);
      this.createText(ctx, locationFirstRow, x1 + 85, textY + 77, maxWidth, lineHeight, '#999', size);
	  let locationSecondRow = canvasAttr.location.substring(10,20);
	  if(canvasAttr.location.length > 20){
		  locationSecondRow += "...";
	  }
	  this.createText(ctx, locationSecondRow, x1 + 85, textY + 92, maxWidth, lineHeight, '#999', size);

      // 绘制时间图标
      let timersrc = canvasAttr.timeUrl
      let tw = 35
      let th = 25
      this.setImage(ctx,timersrc, sx, sy + 20, sw, sh, x1 + 220, y1 - 3, tw, th)

      // 绘制时间
	  let tInfoFirst = canvasAttr.timeText.substring(0,4);
       this.createText(ctx, tInfoFirst, x1 + 240, textY + 77, maxWidth, lineHeight, '#999', size)
	   let tInfoSecond = canvasAttr.timeText.substring(4,8);
	  if(canvasAttr.timeText.length > 8){
	  		  tInfoSecond += "...";
	  }
		this.createText(ctx, tInfoSecond,  x1 + 240, textY + 92, maxWidth, lineHeight, '#999', size);

      //绘制分割线
      let txtw = this.system.w - (canvasAttr.marginLR*2)
      let Lxt = canvasAttr.marginLR
      let rxt = this.system.w - (canvasAttr.marginLR)
      this.createUnderline(ctx, txtw, 18, textY + 102, size, '#999', 1, 10)
      // 会制左右半圆
      // console.log(Lxt, rxt)
      this.roundRectLeft(ctx, ~~Lxt, textY + 91, 10, 10, r, '#666666')
      setTimeout(() => { this.roundRectRight(ctx, rxt, textY + 91, 12, 12, r, '#666666') })

      // 绘制价格
      // let pricty = this.creatcampPrice(ctx, canvasAttr)

      // 绘制营期
      let poteridY =  this.createText(ctx, canvasAttr.activityDay, x1, textY + 130, maxWidth, lineHeight, '#000', 14)
      if (~~canvasAttr.periodcellfirst.length > 0) {
        this.createText(ctx, canvasAttr.periodcellfirst, x1, poteridY + 30, maxWidth, lineHeight, this.themeColor, 12)
      }
      if (~~canvasAttr.periodcellsecond.length > 0) {
        this.createText(ctx, canvasAttr.periodcellsecond, x1, poteridY + 55, maxWidth, lineHeight, this.themeColor, 12)
      }

      // 绘制引导语
      this.createText(ctx, '长按查看更多', x1, poteridY + 105, maxWidth, lineHeight, '#666', 12)

      // 绘制小程序码
      this.creatCode(ctx,canvasAttr,poteridY)
      setTimeout(() => { this.handleSaveCanvasImage() }, 900)
      // wx.hideLoading()

      // 小程序的名称
      // this.creatCodeText(ctx,canvasAttr,canvasAttr.codeName,textY,16,"#2f1709")
      // 长按/扫描识别查看商品
      // this.creatCodeText(ctx,canvasAttr,canvasAttr.tips,textY+30,14,"#2f1709")

    },
    /**
     * @description: 生成海报
     * @param {number} marginTB 上下距离
     * @param {number} marginLR 左右距离
     * @param {number} innerLR 上下内边距
     * @param {number} innerTB 左右内边距
     * @param {number} radius 圆角
     * @param {number} fillColor 海报填充背景色
     * @param {number} posterRatio 海报主图片宽高比例
     * @param {String} posterImgUrl 海报主图片url
     * @param {String} title 海报的title
     * @param {number} titleFontSize 字体大小
     * @param {number} titleLineHeight 标题文本的行高大小
     * @param {String} posterCodeUrl 小程序码图片
     * @param {number} codeWidth 小程序码的占屏幕的百分比
     * @param {number} codeRatio 小程序码的宽度比例
     * @param {number} codeRadius 小程序码的圆角
     * @param {number} codeMT 小程序码的margin-top值
     * @param {String} codeName 小程序码名字
     * @param {number} codeNameMT 小程序码名字的margin-top值
     * @param {String} tips 提示语
     * @param {number} codeML 小程序码左边距离
     * @param {number} desTextMT 纵向文本描述 上边距
     * @param {number} desTextML 纵向文本描述 左边距
     * @author: hch
     */

    /**
      *
      * @param {CanvasContext} ctx canvas上下文
      * @param {number} x 圆角矩形选区的左上角 x坐标
      * @param {number} y 圆角矩形选区的左上角 y坐标
      * @param {number} w 圆角矩形选区的宽度
      * @param {number} h 圆角矩形选区的高度
      * @param {number} r 圆角的半径
      * @param {String} fillColor 天聪颜色
      */
    roundRect(ctx, x, y, w, h, r, fillColor='#ffffff') {
      // console.log(x, y, w, h, r)
      ctx.save()
      ctx.beginPath()
      // 绘制左上角圆弧
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
      // 绘制border-top
      // 画一条线 x终点、y终点
      ctx.lineTo(x + w - r, y)
      // 绘制右上角圆弧
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
      // 绘制border-right
      ctx.lineTo(x + w, y + h - r)
      // 绘制右下角圆弧
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
      // 绘制左下角圆弧
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
      // 绘制border-left
      ctx.lineTo(x, y + r)
      // 填充颜色
      ctx.setFillStyle(fillColor)
      ctx.fill()
      // 剪切，剪切之后的绘画绘制剪切区域内进行，需要save与restore 这个很重要 不然没办法保存
      ctx.clip()
    },
    roundRectx(ctx, x, y, w, h, r, fillColor='#ffffff') {
      // console.log(x, y, w, h, r)
      ctx.save()
      ctx.beginPath()
      // 绘制左上角圆弧
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
      // 绘制border-top
      // 画一条线 x终点、y终点
      ctx.lineTo(x + w - r, y)
      // 绘制右上角圆弧
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
      // 绘制border-right
      ctx.lineTo(x + w, y + h - r)
      // 绘制右下角圆弧
      ctx.arc(x + w - r, y + h - r, 0, 0, Math.PI * 0.5)
      // 绘制左下角圆弧
      ctx.arc(x + 0, y + h - r, 0, Math.PI * 0.5, Math.PI)
      // 绘制border-left
      ctx.lineTo(x, y + r)
      // 填充颜色
      ctx.setFillStyle('#ffffff')
      ctx.fill()
      // 剪切，剪切之后的绘画绘制剪切区域内进行，需要save与restore 这个很重要 不然没办法保存
      ctx.clip()
    },
    // 绘制左半圆点
    roundRectLeft(ctx, x, y, w, h, r, fillColor='#ffffff') {
      ctx.save()
      ctx.beginPath()
      // 绘制左上角圆弧
      console.log(x + r, y + r, 0, Math.PI, Math.PI * 1.5)
      // 绘制border-top
      // 画一条线 x终点、y终点
      ctx.lineTo(x + w - r, y)
      // 绘制右上角圆弧
      ctx.arc(x + w - r, y + r, r, 1.5*Math.PI,  Math.PI/2,false)
      // 填充颜色
      ctx.setFillStyle(fillColor)
      ctx.fill()
      // 剪切，剪切之后的绘画绘制剪切区域内进行，需要save与restore 这个很重要 不然没办法保存
      ctx.clip()
    },
    // 绘制右圆点
    roundRectRight(ctx, x, y, w, h, r, fillColor='#ffffff') {
      ctx.save()
      ctx.beginPath()
      // 绘制左上角圆弧
      // console.log(x + r, y + r, 0, Math.PI, Math.PI * 1.5)
      // 绘制border-top
      // 画一条线 x终点、y终点
      // ctx.lineTo(x + w - r, y)
      // 绘制右上角圆弧
      ctx.arc(x + w - r, y + r, r, Math.PI/2, 1.5*Math.PI, false)
      // 填充颜色
      ctx.setFillStyle(fillColor)
      ctx.fill()
      // 剪切，剪切之后的绘画绘制剪切区域内进行，需要save与restore 这个很重要 不然没办法保存
      ctx.clip()
    },
    /**
     * @description: 获取设备信息
     * @param {type}
     * @return {type}
     * @author: hch
     */
    getSystem(){
      let system = wx.getSystemInfoSync()
      this.scale = 667 / 375 //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
      this.systemScale = system.windowWidth / 375 //按照苹果留 375*667比例 其他型号手机等比例缩放 显示
      return {w:system.windowWidth,h:system.windowHeight}
    },
    /**
     * @description: 生成海报背景图
     * @param {type}
     * @return {type}
     * @author: hch
     */
    creatBgImg(ctx,canvasAttr){
      let _this = this
      return new Promise((resolve,reject)=>{
        wx.getImageInfo({
          src: canvasAttr.posterBgUrl,
          success (res) {
            const imgAttr = res//海报背景展示图片信息
            // console.log(_this.system.w,canvasAttr.marginLR)
            let sale = res.width/(_this.system.w-2*canvasAttr.marginLR)
            ctx.drawImage(res.path,canvasAttr.marginLR,canvasAttr.marginTB, _this.system.w-2*canvasAttr.marginLR,(_this.scale*_this.system.w)-2*canvasAttr.marginTB-100)
            ctx.restore()
            ctx.draw(true)
            resolve()
          },
          fail(res) {
            console.log("fail -> res", res)
            uni.showToast({
              title: "海报背景图下载异常",
              duration: 2000,
              icon: "none"
            })
          }
        })
      })
    },
    /**
     * @description: 生成头部海报图
     * @param {type}
     * @return {type}
     * @author: hch
     */
    creatImg(ctx,canvasAttr){
      let _this = this
	  console.log(canvasAttr.posterImgUrl,11111111111111);
      return new Promise((resolve,reject)=>{
        wx.getImageInfo({
          src: canvasAttr.posterImgUrl,
          success (res) {
            ctx.restore()
            ctx.draw(true)
            // console.log(res, canvasAttr.posterImgUrl)
            const imgAttr = res//海报展示图片信息
            let sale = res.width/(_this.system.w-2*canvasAttr.marginLR-2*canvasAttr.innerLR)
            // ctx, x, y,w,h, r
            let x1 = canvasAttr.marginLR
            let y1 = canvasAttr.marginTB
            let w1 =  _this.system.w - (canvasAttr.marginLR*2)

            let h1 = (_this.system.w-2*canvasAttr.marginLR-2*canvasAttr.innerLR)/canvasAttr.posterRatio
            let r = (_this.system.w-2*canvasAttr.marginLR) * canvasAttr.radius
            // console.log(r)
            _this.roundRectx(ctx, x1, y1, w1, h1, r);


          // let path = res.path
          // let sx = (_this.system.w-_this.system.w*canvasAttr.codeWidth)/2
          let sx = canvasAttr.marginLR// 开始剪切的 x 坐标位置
          let sy = canvasAttr.marginTB // 开始剪切的 y 坐标位置
          let sw = _this.system.w - (canvasAttr.marginLR*2) // 被剪切图像的宽度
          let sh = (_this.system.w-2 * canvasAttr.marginLR-2 * canvasAttr.innerLR) / canvasAttr.posterRatio // 被剪切图像的高度
          let x = 0
          let y = 0
          let w = 0
          let h = 0
          // let sy = textY-canvasAttr.codeMT
          // let sw = _this.system.w * canvasAttr.codeWidth
          // let sh = _this.system.w * canvasAttr.codeWidth * canvasAttr.codeRatio
          // let x = ((_this.system.w-_this.system.w*canvasAttr.codeWidth)/2) + 80
          // let y = textY - 10
          // let blw = _this.system.w <= 320 ? 120 : 200
          // let w = blw * (_this.system.w /  _this.system.h)
          // let h = blw * (_this.system.w /  _this.system.h)
            ctx.drawImage(res.path, sx, sy, sw, sh, x, y)
            ctx.restore()
            ctx.draw(true)
            resolve({imgAttr,sale})
          },
          fail(res) {
            console.log("fail -> res", res)
            uni.showToast({
              title: "海报主图下载异常",
              duration: 2000,
              icon: "none"
            })
          }
        })

      })
    },
    /**
     * @description: 生成横向文本标题
     * @param {type}
     * @return {type}
     * @author: hch
     */
    creatTitle(ctx,canvasAttr){
      ctx.restore() //恢复之前保存的绘图上下文
      ctx.save()
      ctx.setFontSize(14)
      ctx.setFillStyle(this.themeColor)
      let text = canvasAttr.title
      let y = (this.system.w-2*canvasAttr.marginLR-2*canvasAttr.innerLR)/canvasAttr.posterRatio+2*canvasAttr.innerLR+canvasAttr.marginTB
      let x = canvasAttr.marginLR+10
      let maxWidth = this.system.w-2*canvasAttr.marginLR-2*canvasAttr.innerLR
      let lineHeight = canvasAttr.titleLineHeight
      // ctx, text, x, y, maxWidth=375, lineHeight=30
      let textY = this.drawText(ctx, text, x, y-30, maxWidth,lineHeight)
      ctx.draw(true)
      return this.drawText(ctx, "", x, y-80, maxWidth,lineHeight)
    },
    // 绘制文字
    createText (ctx, text, x, y, mw, lt, fillstyle = 'fff', size='14') {
      // console.log(text)
      ctx.restore() //恢复之前保存的绘图上下文
      ctx.setFontSize(size)
       ctx.setFillStyle(fillstyle)
      ctx.save()
      let textY = this.drawText(ctx, text, x, y, mw, lt)
      ctx.draw(true)
      return textY
    },
    // 绘制下划线
    createUnderline (ctx, txtw, x, y, size, color, thickness ,offset) {
      var width = txtw
      switch(ctx.textAlign){
        case "center":
        x -= (width/2); break;
        case "right":
        x -= width; break;
      }
      y += size + offset;
      ctx.beginPath()
      ctx.setLineDash([5])
      ctx.strokeStyle = color
      ctx.lineWidth = thickness
      ctx.moveTo(x,y)
      ctx.lineTo(x+width,y)
      ctx.stroke()
    },
    // 绘制图标
    setImage (ctx, src, sx, sy, sw, sh, x, y, w, h) {
      // let _this = this
      return new Promise((resolve,reject)=>{
        wx.getImageInfo({
          src: src,
          success (res) {
            ctx.restore()
            ctx.draw(true)
            const imgAttr = res
            ctx.drawImage(res.path, sx, sy, sw, sh, x, y, w, h)
            ctx.restore()
            ctx.draw(true)
            resolve({imgAttr, x, y})
          },
          fail(res) {
            console.log("fail -> res", res)
            uni.showToast({
              title: "下载异常",
              duration: 2000,
              icon: "none"
            })
          }
        })
      })
    },
    // 绘制价格
    creatcampPrice (ctx, canvasAttr) {
      let price = `￥${canvasAttr.price}`
        ctx.restore() //恢复之前保存的绘图上下文
        ctx.save()
        ctx.setFontSize(16)
        ctx.setFillStyle('#075293')
      let text = price
      let x = canvasAttr.marginLR+canvasAttr.innerLR
      let y = (this.system.w-2*canvasAttr.marginLR-2*canvasAttr.innerLR)/canvasAttr.posterRatio+2*canvasAttr.innerLR+canvasAttr.marginTB
      let maxWidth = this.system.w-2*canvasAttr.marginLR-2*canvasAttr.innerLR
      let lineHeight = canvasAttr.titleLineHeight
        // let y = (this.system.w-2*canvasAttr.marginLR-2*canvasAttr.innerLR)/canvasAttr.posterRatio+2*canvasAttr.innerLR+canvasAttr.marginTB
        let textY = this.drawText(ctx, text, x, y+60, maxWidth, lineHeight)
        ctx.draw(true)
        return textY
    },
    /**
     * @description: 生成纵向文本标题
     * @param {type}
     * @return {type}
     * @author: hch
     */
    creatVerticalTitle(ctx,canvasAttr){
      ctx.restore() //恢复之前保存的绘图上下文
      ctx.save()
      ctx.setFontSize(canvasAttr.titleFontSize)
      canvasAttr.title.forEach((element,i) => {
        this.drawText(ctx, element, canvasAttr.marginTB+canvasAttr.desTextML+i*0,canvasAttr.marginLR+canvasAttr.desTextMT, 15, canvasAttr.titleLineHeight)
      });
      ctx.draw(true)
    },
    /**
     * @param {Object} ctx canvas上下文
     * @param {String} text 需要输入的文本
     * @param {Number} x X轴起始位置
     * @param {Number} y Y轴起始位置
     * @param {Number} maxWidth 单行最大宽度
     * @param {Number} lineHeight 行高
     */
    drawText(ctx, text, x, y, maxWidth=375, lineHeight=30) {
        let canvas = ctx.canvas;
        let arrText = text.split('');
        let line = '';
        for (let n = 0; n < arrText.length; n++) {
            let testLine = line + arrText[n];
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = arrText[n];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
        return y
    },
    /**
     * @description: 生成居中文本
     * @param {type}
     * @return {type}
     * @author: hch
     */
    creatCodeText(ctx,canvasAttr,text,textY,fontSize=14,fillStyle="#2f1709"){
      // console.log(ctx)
      ctx.setFontSize(fontSize)
      ctx.setFillStyle(fillStyle) //文字颜色：默认黑色
      let metrics = ctx.measureText(text);
      let testWidth = metrics.width;
      ctx.fillText(text, 120, 800)
      // ctx.fillText(text,(this.system.w-testWidth)/2,textY+canvasAttr.codeMT+this.system.w*canvasAttr.codeWidth+canvasAttr.codeNameMT+30)
      // 小程序的名称end
    },
    /**
     * @description: 生成文本（带中间划线的）
     * @param {type}
     * @return {type}
     * @author: hch
     */
    creatTextLine(){

    },
    /**
     * @description: 小程序码
     * @param {type}
     * @return {type}
     * @author: hch
     */
    creatCode(ctx,canvasAttr,textY){
      console.log(textY, canvasAttr.codeMT)
      const _this = this
      wx.getImageInfo({
        src: canvasAttr.posterCodeUrl,
        success(res) {
          ctx.restore()
          ctx.draw(true)
          // _this.roundRect(ctx,(_this.system.w-_this.system.w*canvasAttr.codeWidth)/2, textY+canvasAttr.codeMT, _this.system.w*canvasAttr.codeWidth, _this.system.w*canvasAttr.codeWidth*canvasAttr.codeRatio, (_this.system.w*canvasAttr.codeWidth*canvasAttr.codeRatio)*canvasAttr.codeRadius );
          let path = res.path
          let sx = (_this.system.w-_this.system.w*canvasAttr.codeWidth)/2
          let sy = textY-canvasAttr.codeMT
          let sw = _this.system.w * canvasAttr.codeWidth
          let sh = _this.system.w * canvasAttr.codeWidth * canvasAttr.codeRatio
          let x = ((_this.system.w-_this.system.w*canvasAttr.codeWidth)/2) + 90
          let y = textY - 0
          let blw = _this.system.w <= 320 ? 120 : 200
          let w = blw * (_this.system.w /  _this.system.h)
          let h = blw * (_this.system.w /  _this.system.h)
          console.log((_this.system.w-_this.system.w*canvasAttr.codeWidth)/2, _this.system)
          /* path 图片
          * sx 开始剪切的 x 坐标位置
          * sy 开始剪切的 y 坐标位置
          * switch  被剪切图像的宽度
          * sheight 被剪切图像的高度
          * x 在画布上放置图像的 x 坐标位置
          * y 在画布上放置图像的 y 坐标位置。
          * width 要使用的图像的宽度。（伸展或缩小图像）
          * height 要使用的图像的高度。（伸展或缩小图像
          */
          ctx.drawImage(path, null, null, null, null, x, y, w, h)
          ctx.restore()
          ctx.draw(true)
        },
        fail(err) {
          uni.showToast({ title: "海报生成失败", duration: 2000, icon: "none" })
        }
      })
    },
    /**
     * @description: 小程序码
     * @param {type}
     * @return {type}
     * @author: hch
     */
    creatSimpleCode(ctx,canvasAttr){
      const _this = this
      wx.getImageInfo({
        src: canvasAttr.posterCodeUrl,
        success(res) {
          ctx.restore()
          ctx.draw(true)
          _this.roundRect(ctx,canvasAttr.marginLR+canvasAttr.codeML, canvasAttr.marginTB+canvasAttr.codeMT, _this.system.w*canvasAttr.codeWidth, _this.system.w*canvasAttr.codeWidth*canvasAttr.codeRatio, (_this.system.w*canvasAttr.codeWidth*canvasAttr.codeRatio)*canvasAttr.codeRadius );
          ctx.drawImage(res.path, canvasAttr.marginLR+canvasAttr.codeML, canvasAttr.marginTB+canvasAttr.codeMT, _this.system.w*canvasAttr.codeWidth, _this.system.w*canvasAttr.codeWidth*canvasAttr.codeRatio)
          ctx.restore()
          ctx.draw(true)
        },
        fail() {
          uni.showToast({ title: "海报生成失败", duration: 2000, icon: "none" })
        }
      })
    },
    /**
     * @description: 保存到系统相册
     * @param {type}
     * @return {type}
     * @author: hch
     */
    handleSaveCanvasImage() {
      const canvasAttr=this.attrs
      // wx.showLoading({
      //   title: "保存中..."
      // })
      wx.hideLoading()
      let _this = this
      _this.canvasShow = false
      // 把画布转化成临时文件
      uni.canvasToTempFilePath({
        x: canvasAttr.marginLR,
        y: canvasAttr.marginTB,
        width: this.system.w-2*canvasAttr.marginLR, // 画布的宽
        height: (this.scale*this.system.w)-2*canvasAttr.marginTB-90, // 画布的高
        destWidth: (this.system.w-2*canvasAttr.marginLR) * 5,
        destHeight: ((this.scale*this.system.w)-2*canvasAttr.marginTB-100) * 5,
        canvasId: "myCanvas",
        success(res) {
          console.log(res,"生成成功.")
		  _this.$emit("deleteQrCode");
          //保存图片至相册
           uni.previewImage({
              current: 0,
              urls: [res.tempFilePath] // 图片路径必须是一个数组
            })
          // uni.saveImageToPhotosAlbum({
          //   filePath: res.tempFilePath,
          //   success(res) {
          //     wx.hideLoading()
          //     uni.showToast({
          //       title: "图片保存成功，可以去分享啦~",
          //       duration: 2000,
          //       icon: "none"
          //     })
          //     _this.handleCanvasCancel()
          //   },
          //   fail() {
          //     uni.showToast({
          //       title: "保存失败，稍后再试",
          //       duration: 2000,
          //       icon: "none"
          //     })
          //     wx.hideLoading()
          //   }
          // })
        },
        fail(res) {
          console.log("fail -> res", res)
          uni.showToast({
            title: "保存失败，稍后再试",
            duration: 2000,
            icon: "none"
          })
          wx.hideLoading()
        }
      },this)

    },
    /**
     * @description: 取消海报
     * @param {type}
     * @return {type}
     * @author: hch
     */
    handleCanvasCancel() {
      this.canvasShow = false
      this.$emit("cancel", true)
    }

  }
}
</script>

<style lang="scss">
.content {
  text-align: center;
  height: 100%;
}
.canvas-content {
  z-index: 999;
  .canvas-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9;
  }
  .canvas {
    display: none;
    position: fixed !important;
    // top: 4%!important;
    // left: 0 !important;
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 9;
    left: -9999vw;
    top: -9999vh;
  }
  .button-wrapper {
    width: 100%;
    height: 72rpx;
    position: fixed;
    bottom: 100rpx;
    display: flex;
    justify-content: space-around;
    z-index: 999;
  }

  .save-btn {
    font-size: 30rpx;
    line-height: 72rpx;
    color: #fff;
    background: #f9c918;
    width: 40%;
    height: 100%;
    text-align: center;
    border-radius: 45rpx;
    border-radius: 36rpx;
    z-index: 10;
    margin-top: 30px;
  }
  .cancel-btn{
    background: #fff;
    color: $uni-btn-color;
  }
  .canvas-close-btn {
    position: fixed;
    width: 60rpx;
    height: 60rpx;
    padding: 20rpx;
    top: 30rpx;
    right: 0;
    z-index: 12;
  }
}
</style>
