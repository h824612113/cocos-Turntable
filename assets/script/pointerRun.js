var awardMapping = [
    {
        attitude: '',
        awardWords: '谢谢参与',
        amount: '',
        angleValue: '0'
    },
    {
        attitude: '',
        awardWords: '美女给你',
        amount: '一个吻',
        angleValue: '1'
    },
    {
        attitude:'',
        awardWords:'美女给你',
        amount:'两个吻',
        angleValue:'2'
    },
    {
        attitude:'',
        awardWords:'美女给你',
        amount:'三个吻',
        angleValue:'3'
      },
    {
        attitude:'',
        awardWords:'美女给你',
        amount:'四个吻',
        angleValue:'4'
    },
    { 
        attitude:'',
        awardWords:'美女给你',
        amount:'五个吻',
        angleValue:'5'
    },
    { 
        attitude:'',
        awardWords:'美女给你',
        amount:'六个吻',
        angleValue:'6'
    },		   
    {
        attitude:'',
        awardWords:'美女给你',
        amount:'七个吻',
        angleValue:'7'
    },	
    {
        attitude:'',
        awardWords:'南塔斯',
        amount:'跳钢管舞',
        angleValue:'8'
    }
]
cc.Class({
    extends: cc.Component,

    properties: {
        pointer: {
            default: null,
            type: cc.Sprite,
            tooltip: '转盘指针'
        },
        pointerButton: {
            default: null,
            type: cc.Sprite,
            tooltip: '点击按钮'
        },
        awardWords: {
            default: null,
            type: cc.Label,
            tooltip: '中奖提示信息'
        },
        amount: {
            default: null,
            type: cc.Label,
            tooltip: '奖品提示信息'
        },
        rotateDuration: {
            default: 6,
            type:cc.Integer,
            tooltip: '指针旋转持续时间(s)'
        },
        turnsNum: {
            default: 10,
            type:cc.Integer,
            tooltip: '指针旋转圈数'
        },
        alreadyAngle: {
            default: 0,
            type: cc.Integer,
            slide: true,
            min: -360,
            max: 0,
            step: 1,
            tooltip: '当前指针旋转偏移角度, 负数值为正向旋转;不支持反向旋转'
        }
    },

    onLoad () {
        this.isClicked = false // 是否已点击
        this.eachAngle = 360 / (awardMapping.length - 1) // 每个奖项所占角度 45度
        this.pointer.node.angle = this.alreadyAngle % 360 // 指针当前指向位置
        this.pointerButtonClick()
    },
    pointerButtonClick() {
        // 触摸
        this.pointerButton.node.on(cc.Node.EventType.TOUCH_START, this.pointerButtonStartControl, this)
        // 点击抬起
        // this.pointerButton.node.on(cc.Node.EventType.MOUSE_UP, this.pointerButtonStartControl, this)
    },
    pointerButtonStartControl() {
        if (!this.isClicked) {
            this.awardWords.string = ''
            this.isClicked = true
            // 以下测试
            var result = parseInt(Math.random()*(8 - 1 + 1) + 1)
            console.log(result)
            var filterArr = awardMapping.filter(item => Number(item.angleValue) === result)
            this.awards = filterArr[0]
            this.runPointer()
            // 以上测试

            // 接收后端数据替换为cc.loader.load,本地测试json使用cc.loader.loadRes
            // var remoteUrl = "JSON/query"
            // cc.loader.loadRes(remoteUrl, (err, res) => {
            //     var filterArr = awardMapping.filter(item => Number(item.angleValue) === res.json.result)
            //     // 若没有找到对应奖项 则默认显示第一个 谢谢参与 此时图片需要调整
            //     // this.awards = filterArr.length ? filterArr[0] : awardMapping[0]
            //     // 针对当前图片 都有奖的情况 result值应为 1 - 8
            //     this.awards = filterArr[0]
            //     this.runPointer()
            // })
        }
    },
    getOffsetAngle() {
        // 每个奖项的偏移角度 res 为awardMapping中奖项下标
        var res = Number(this.awards.angleValue)
        var eachAngle = this.eachAngle // 每个奖项所占角度 45度
        var alreadyAngle = Math.abs(this.alreadyAngle)
        var maxAngle = res * eachAngle - 1 - alreadyAngle// 当前奖项 所占最大角度
        var minAngle = (res - 1) * eachAngle + 1 - alreadyAngle// 当前奖项 所占最小角度
        this.offsetAngle = parseInt(Math.random()*(maxAngle - minAngle + 1) + minAngle) // 1-44 46-89
        // console.log(maxAngle,minAngle,this.offsetAngle)
    },
    runPointer() {
        // 根据angleValue来旋转
        this.getOffsetAngle()
        var action = cc.rotateBy(this.rotateDuration, 360 * this.turnsNum + this.offsetAngle)
        var callback = cc.callFunc(this.showResult, this)
        var sequence = cc.sequence(action, callback)
        this.pointer.node.runAction(sequence).easing(cc.easeCubicActionOut(this.rotateDuration))
    },
    showResult() {
        this.isClicked = false // 修改点击状态为可点击
        this.alreadyAngle = Math.abs(this.pointer.node.angle % 360)
        // console.log('动作结束', this.alreadyAngle)
        if (!this.isClicked) {
            this.awardWords.string = this.awards.awardWords + this.awards.amount
        }
    },
    start () {
    },
    
    update (dt) {
    },
});
