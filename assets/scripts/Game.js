// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

window.Global = {
    bounceCount: 0,
};

cc.Class({
    extends: cc.Component,

    properties: {
        circleOpacity: 60,
        gravityForce: 10,
        spriteStopRatio: 15,
        bgOffset:0,
        normalPlanetWidth:0,
        minPlanetWidth:0,
        progressDirection:0,

        bg1: {
            default: null,
            type: cc.Node
        },
        bg2: {
            default: null,
            type: cc.Node
        },
        bg3: {
            default: null,
            type: cc.Node
        },
        bg4: {
            default: null,
            type: cc.Node
        },
        wall: {
            default: null,
            type: cc.Node
        },
        mars: {
            default: null,
            type: cc.Node
        },
        earth: {
            default: null,
            type: cc.Node
        },
        blackHole: {
            default: null,
            type: cc.Node
        },
        scoreLabel: {
            default: null,
            type: cc.Node
        },
        failScoreLabel: {
            default: null,
            type: cc.Label
        },
        singleScoreLabel: {
            default: null,
            type: cc.Node
        },
        highScoreLabel: {
            default: null,
            type: cc.Node
        },
        reviveHighScoreLabel: {
            default: null,
            type: cc.Node
        },
        failScene: {
            default: null,
            type: cc.Node
        },
        loginScene: {
            default: null,
            type: cc.Node
        },
        guideScene: {
            default: null,
            type: cc.Node
        },
        audio: {
            default: null,
            type: cc.Node
        },
        circle: {
            default: null,
            type: cc.Node
        },
        galaxy: {
            default: null,
            type: cc.Node
        },
        friendRankBtn: {
            default: null,
            type: cc.Node
        },
        restartBtn: {
            default: null,
            type: cc.Node
        },
        friendBtn: {
            default: null,
            type: cc.Node
        },
        groupBtn: {
            default: null,
            type: cc.Node
        },
        questionBtn: {
            default: null,
            type: cc.Node
        },
        rankScene: {
            default: null,
            type: cc.Node
        },
        rankingScrollView: {
            default: null,
            type: cc.Node
        },
        rankTitleLbl: cc.Label,
        startBtn: {
            default: null,
            type: cc.Node
        },
        loginFriendBtn: {
            default: null,
            type: cc.Node
        },
        sentinel: {
            default: null,
            type: cc.Node
        },
        powerBar: {
            default: null,
            type: cc.Node
        },
        libraryScene: {
            default: null,
            type: cc.Node
        },
        libraryScrollView: cc.ScrollView,
        libraryItem: cc.Node,
        videoAdScene: {
            default: null,
            type: cc.Node 
        },
        videoAdLabel: cc.Label,
        videoAdBtn: cc.Node,
        videoNoAdBtn: cc.Node,
        videoAdProgressBar: cc.ProgressBar,
        alertScene: cc.Node,
        alertImg: cc.Node,
        alertLbl: cc.Label,
        alertBtn: cc.Node,
        ufoNode: cc.Node,
        guideText: cc.Node,
        guideFinger: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    _setConstNum () {
        this.normalPlanetWidth = this.node.width / 5;
        this.minPlanetWidth = this.normalPlanetWidth * 0.8;
        this.libraryAlertWaitingArray = new Array();
        this.ufoScore = 50;
        this.ufoShowRate = 0.5;
    },

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        //去除重力
        cc.director.getPhysicsManager().gravity = cc.v2();
        //常数设置
        this._setConstNum();

        //UI适配
        this._updateUI();
        this.guideScene.opacity = 0;
        this.sentinel.getComponent('Sentinel').disappear();
        this.powerBar.active = false;
        this.alertScene.active = false;
        this.ufoNode.active = false;
        
        this.singleScoreLabel.setOpacity(0);
        this.circle.setOpacity(0);

        this.saveEvent(this.loadEvent())
        // for (var i = 0; i < 4; ++ i ) {
        //     let data = this.loadEvent()
        //     let libraryObject = data[i]
        //     console.log(libraryObject)
        //     this.libraryAlertWaitingArray.push(libraryObject)
        // }

        this.loadHint()

        this.restart();
    },
    
    start () {
        console.log('start');
        this.rankPage = 0

        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D();
            wx.showShareMenu({withShareTicket:true});

            let self = this

            wx.onShow(function (res) {
                console.log(res);
                console.log(res.shareTicket);
                let shareTicket = res.shareTicket
                if (shareTicket != null && shareTicket != undefined) {
                    self.showRankWithShareTickets(shareTicket)
                }
            })

            var launchOption = wx.getLaunchOptionsSync();
            console.log("launch option")
            console.log(launchOption)

            let shareTicket = launchOption.shareTicket
            if (shareTicket != null && shareTicket != undefined) {
                this.showRankWithShareTickets(shareTicket)
            }
            // wx.getShareInfo(function(object) {
            //     console.log(object)
            // })

            wx.onShareAppMessage(function(res){
                return {
                    title: '弹弹弹！嗖嗖嗖！好玩上瘾的游戏，推荐给你！',
                    imageUrl: "res/raw-assets/resources/Share.png",
                    success(res){
                        console.log("hahaha")
                        console.log(res)
                    },
                    fail(res){
                        console.log(res)
                    } 
                }
            });
        }
    },

    restart () {
        this.failing = false;
        
        this.isShowGroupRank = false
        this.shareTicket = null

        //clear score
        this.score = 0;
        this.combo = 0;

        this.watchedVideoAd = false;

        // let libraryData = this.loadEvent()
        // for (var i = 0; i < libraryData.length; ++ i) {
        //     let libraryObject = libraryData[i]
        //     if (libraryObject.name == "单局反弹") {
        //         if (libraryObject.progress < libraryObject.target) {
        //             this.setEventCount("单局反弹", 0)
        //         }
        //     }
        // }
        this.scoreLabel.getComponent(cc.Label).string = this.score;

        this.continue();
    },

    restartOrAlert() {
        if (this.libraryAlertWaitingArray.length > 0) {
            this.rankScene.active = false;  
            this.showLibraryAlert(this.restart)
            this.methodWaiting = this.restart
        } else {
            this.restart()
        }
    },

    continue () {
        this.rankPage = 0
        this.rankScene.active = false
        this.libraryScene.active = false
        this.failScene.active = false;
        this.videoAdScene.active = false;
        this.singleScore = 0;
        this.ufoNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.ufoNode.active = false

        if (this.isGuideMode) {
            var finished = cc.callFunc(function () {
                this.guideText.active = false;
            }, this);
            var spawn = cc.sequence(cc.fadeOut(1), finished);
            this.guideText.runAction(spawn);
            
            this.guideFinger.active = false;
        }
        this.isGuideMode = false;

        this.mars.active = true;

        let width = this.node.width;
        let height = this.node.height;

        //科学难度
        var holeRadius;
        if (this.score <= 5) {
            holeRadius = this.normalPlanetWidth * 3;
        } else if (this.score <= 10) {
            holeRadius = Math.random() * this.normalPlanetWidth / 2 + this.normalPlanetWidth * 2.5;
        } else if (this.score <= 20) {
            holeRadius = Math.random() * this.normalPlanetWidth / 2 + this.normalPlanetWidth * 2;
        } else if (this.score <= 50) {
            holeRadius = Math.random() * this.normalPlanetWidth / 2 + this.normalPlanetWidth * 1.5;
        } else if (this.score <= 100) {
            holeRadius = Math.random() * this.normalPlanetWidth / 2 + this.normalPlanetWidth;
        } else if (this.score <= 200) {
            holeRadius = Math.random() * this.normalPlanetWidth / 2 + this.normalPlanetWidth / 2;
        } else {
            holeRadius = Math.random() * this.normalPlanetWidth / 10 + this.normalPlanetWidth / 5 * 2;
        }
        this.blackHole.width = this.blackHole.height = holeRadius;

        //重置地球
        var starStorage = new Array('Earth');
        let libraryData = this.loadEvent()
        for (var i = 0; i < libraryData.length; ++ i) {
            let libraryObject = libraryData[i]
            if (libraryObject.progress >= libraryObject.target) {
                starStorage.push(libraryObject.starImage)
            }
        }

        var earthIndex = Math.floor(Math.random() * starStorage.length);
        this.earth.active = false;	
        var self = this;
        cc.loader.loadRes(starStorage[earthIndex], cc.SpriteFrame, function (err, spriteFrame) {	
            self.earth.getComponent(cc.Sprite).spriteFrame = spriteFrame;	
            self.earth.active = true;	
        });
        
        this.mars.setPosition(Math.random() * width / 2 - width / 4, -height/3);
        this.earth.setPosition(Math.random() * width / 2 - width / 4, Math.random() * height / 4 - height / 8);
        this.blackHole.setPosition(Math.random() * width / 2 - width / 4, height / 3);
        this.galaxy.setPosition(this.blackHole.position);

        this.mars.width = this.normalPlanetWidth
        this.mars.height = this.normalPlanetWidth
        this.earth.width = this.normalPlanetWidth
        this.earth.height = this.normalPlanetWidth
        
        this.mars.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.earth.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);

        //clear bounce count
        Global.bounceCount = 0;

        //恢复火星
        this.mars.active = true;
        
        if (this.score > this.ufoScore) {
            if (Math.random() > (1 - this.ufoShowRate)) {
                this.showUfo();
            }
        }

        //添加触摸监听
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    // Logic:
    fail () {
        this.marsBegan = false;
        this.earth.onContact = false;

        if (this.isGuideMode) {
            this.guide();
            return;
        }

        // reset
        this.failing = true;

        if (this.watchedVideoAd) {
        	this.showFailOrAlert();
        } else {
        	this.showFailHint();
        }
    },

    showFailHint () {
        this.videoAdScene.active = true;

        let width = this.node.width;
        this.videoAdBtn.width = width / 2;
        this.videoAdBtn.height = this.restartBtn.width * 99 / 300;
        this.videoAdBtn.x = 0;
        this.videoAdBtn.y = 0;
        this.videoNoAdBtn.x = 0;
        this.videoNoAdBtn.y = -this.videoAdBtn.height * 0.5 - this.videoNoAdBtn.height * 0.5 - 30;
        this.videoAdLabel.string = this.score// "本次得分: " + this.score;
        this.videoAdProgressBar.totalLength = this.videoAdScene.width * 0.8;
        this.videoAdProgressBar.progress = 0;
        var highScore = cc.sys.localStorage.getItem('hiScore');
        highScore = Math.max(highScore, this.score);
        this.reviveHighScoreLabel.getComponent(cc.Label).string = '历史最高分：' + highScore;

        //添加触摸监听
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }, 

    showFailOrAlert() {
        if (this.libraryAlertWaitingArray.length > 0) {
            this.videoAdScene.active = false;  
            this.showLibraryAlert()
            this.methodWaiting = this.showFail
        } else {
            this.showFail()
        }
    },

    showFail () {
        this.videoAdScene.active = false;     
        this.failScene.active = true;

        this.failScoreLabel.getComponent(cc.Label).string = this.score;

        var highScore = cc.sys.localStorage.getItem('hiScore');
        highScore = Math.max(highScore, this.score);
        this.setEventCount("历史最高", highScore)
        cc.sys.localStorage.setItem('hiScore', highScore);

        this.submitScore(highScore);

        this.highScoreLabel.getComponent(cc.Label).string = '历史最高分：' + highScore;

        this.audio.getComponents(cc.AudioSource)[2].play();
        //添加触摸监听
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    success (gap) {
        var border = Math.max(Math.abs(this.blackHole.width / 2 - this.earth.width / 2), this.earth.width / 2);
        if (gap < border) {
            //perfect
            this.combo++;
            this.singleScore = this.combo * 3;

            this.audio.getComponents(cc.AudioSource)[4].play();
        } else {
            this.combo = 0;
            this.singleScore = 2;
            
            this.audio.getComponents(cc.AudioSource)[3].play();
        }

        this.score += this.singleScore;

        //显示单次得分
        this.singleScoreLabel.position = cc.v2(this.earth.position.x, this.earth.position.y - 50);
        var scoreText = '';
        if (this.combo > 0) {
            scoreText = '完美';
        } else {
            scoreText = '命中';
        }
        scoreText += '  +' + this.singleScore;
        var bounceScore = Global.bounceCount * 2 * (this.combo + 1);
        this.score += bounceScore;
        if (bounceScore > 0) {
            scoreText += '\n反弹  +' + bounceScore;
            //this.setEventCount("单局反弹")
        }
        this.singleScoreLabel.getComponent(cc.Label).string = scoreText;
        this.scoreLabel.getComponent(cc.Label).string = this.score;

        var highScore = cc.sys.localStorage.getItem('hiScore');
        highScore = Math.max(highScore, this.score);
        this.setEventCount("历史最高", highScore)

        //动画
        var scoreAnimation = cc.sequence(cc.scaleTo(0.1, 1.5), cc.scaleTo(0.1, 1));
        this.scoreLabel.runAction(scoreAnimation);

        var showScore = cc.sequence(cc.fadeIn(0.1), cc.fadeOut(0.8));
        this.singleScoreLabel.runAction(showScore);

        //suck 吸入
        var finished = cc.callFunc(function () {
            this.earth.scale = 1;
            this.earth.getComponent(cc.RigidBody).angularVelocity = 100;
            this.continue();
        }, this);
        var spawn = cc.sequence(cc.spawn(cc.moveTo(0.2,this.blackHole.position), cc.scaleTo(0.2, 0)), finished);
        this.earth.getComponent(cc.RigidBody).angularVelocity = 2000;
        this.earth.runAction(spawn);
    },

    guide () {
        this.singleScore = 0;

        let width = this.node.width;
        let height = this.node.height;

        this.guideText.active = true;
        this.guideFinger.active = true;
        if (this.isGuideMode === false) {
            //黑洞
            this.blackHole.width = this.blackHole.height = this.normalPlanetWidth * 3;
            //加载地球纹理
            this.earth.active = false;	
            var self = this;
            cc.loader.loadRes('Earth', cc.SpriteFrame, function (err, spriteFrame) {	
                self.earth.getComponent(cc.Sprite).spriteFrame = spriteFrame;	
                self.earth.active = true;	
            });
        }
        
        this.isGuideMode = true;
        
        this.mars.setPosition(0, -height / 3);
        this.earth.setPosition(0, -height / 15);
        this.blackHole.setPosition(0, height / 3);
        this.galaxy.setPosition(this.blackHole.position);
        this.guideFinger.setPosition(this.earth.x, this.earth.y - this.earth.height / 2 - this.guideFinger.height / 2);
        this.guideText.setPosition(0, height / 10);
        
        this.mars.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.earth.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);

        //clear bounce count
        Global.bounceCount = 0;

        //恢复火星
        this.mars.active = true;
    },

    // Touch Event:
    onTouchBegan (event) {
        if (this.guideScene.opacity == 255) {
            var self = this;
            var finished = cc.callFunc(function () {
                self.guideScene.opacity = 0;
                this.startBtn.active = true;
                this.loginFriendBtn.active = true;
            }, this, 0);
            var fadeAction = cc.sequence(cc.fadeOut(0.2), finished);
            this.guideScene.runAction(fadeAction); 

            event.stopPropagation();
            return;
        }

        if (this.loginScene.active || this.rankScene.active || this.libraryScene.active) {
            return;
        }

        if (this.marsBegan || !this.mars.active) return;

        if (this.isGuideMode) {
            //点下去的时候点对了，就暂时去掉提示
            var touchPosition = this.node.convertToNodeSpaceAR(cc.v2(event.touch.getLocation()));
            if (touchPosition.x > this.guideFinger.x - this.guideFinger.width / 2 && touchPosition.x < this.guideFinger.x + this.guideFinger.width / 2 &&
                touchPosition.y > this.guideFinger.y - this.guideFinger.height / 2 && touchPosition.y < this.guideFinger.y + this.guideFinger.height / 2) {
                this.guideFinger.active = false;
            }
        }

        this.audio.getComponents(cc.AudioSource)[1].play();

        this.touchBagan = true;
        //展示圆圈
        this.circle.setOpacity(this.circleOpacity);
        this.powerBar.getComponent(cc.ProgressBar).progress = 0.15;
        this.progressDirection = 0;

        this.onTouchMove(event);
    },

    onTouchMove (event) {
        if (this.loginScene.active || this.rankScene.active || 
            this.guideScene.opacity > 0 || this.libraryScene.active) {
            return;
        }

        var touchPosition = cc.v2(event.touch.getLocation());
        this.circle.setPosition(this.node.convertToNodeSpaceAR(touchPosition));

        // console.log(touchPosition);
        // if (this.sentinel.active == false) {
        //     this.sentinel.getComponent('Sentinel').appear();
        // }
        // //去除之前的球
        // let rigidBody = this.sentinel.getComponent(cc.RigidBody);
        // rigidBody.linearVelocity = cc.v2(0,0);

        // //发新的球
        // this.sentinel.setPosition(this.mars.position);
        // let center = rigidBody.getWorldCenter();
        // //计算方向向量
        // var vel = touchPosition.sub(center).normalizeSelf();
        // //乘以质量和最大初速度
        // vel = vel.mulSelf(100000000);
        // //实施动量
        // rigidBody.applyLinearImpulse(vel,rigidBody.getWorldCenter(),true);

        //火星如果已经开始动了，就不需要进度条了
        if (this.marsBegan || !this.mars.active) return;

        this.powerBar.active = true;
        var positionX = 0;
        var offset = this.earth.width / 2 + this.powerBar.width / 2;
        if (this.circle.position.x > this.earth.position.x && !this.isGuideMode) {
            positionX = this.earth.position.x - offset;
        } else {
            positionX = this.earth.position.x + offset;
        }
        this.powerBar.setPosition(cc.v2(positionX, this.earth.position.y));
    },

    onTouchEnd (event) {
        if (this.loginScene.active || this.rankScene.active || 
            this.guideScene.opacity > 0 || this.libraryScene.active) {
            return;
        }

        if (this.marsBegan || !this.mars.active) return;

        this.audio.getComponents(cc.AudioSource)[1].stop();

        this.powerBar.active = false;

        //去除哨兵
        // console.log(this.sentinel);
        // this.sentinel.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        // this.sentinel.getComponent('Sentinel').disappear();

        var progress = this.powerBar.getComponent(cc.ProgressBar).progress;

        let rigidBody = this.mars.getComponent(cc.RigidBody);
        let center = rigidBody.getWorldCenter();
        //计算方向向量
        var vel = cc.v2(event.touch.getLocation()).sub(center).normalizeSelf();
        //乘以质量和最大初速度
        vel = vel.mulSelf(rigidBody.getMass() * 4000);
        //根据进度条调整力度
        vel = vel.mulSelf(progress);
        //实施动量
        rigidBody.applyLinearImpulse(vel,rigidBody.getWorldCenter(),true);
        //motion start
        this.marsBegan = true;
        //restore size
        this.touchBagan = false;
        this.mars.width = this.mars.height = this.normalPlanetWidth;
        //圆圈消失
        this.circle.setOpacity(0);
    },

    // Action:
    login () {
        this.loginScene.active = false;
        this.rankScene.active = false;
        this.libraryScene.active = false;
        // this.showLibraryScene()

        var notVirgin = cc.sys.localStorage.getItem('notCherry');
        if (!notVirgin) {
            cc.sys.localStorage.setItem('notCherry', 1);
            this.guide();
        }
    },

    rankTapped () {
        console.log('rankTapped');
        // this.failScane.active = false
        // this.rankScane.active = true
        // wx.postMessage({
        //     message: 'Show',
        //     pageSize: 6,
        //     pageIndex: 0
        // })
        // this.tex = new cc.Texture2D();
        // let openDataContext = wx.getOpenDataContext()
        // console.log(openDataContext);
        // openDataContext.postMessage({
        //     text: 'hello'
        // })
        this.failScene.active = false
        this.videoAdScene.active = false
        this.loginScene.active = false
        this.libraryScene.active = false
        this.rankScene.active = true
        this.showRankPage('start', 6)
    },

    rankFormerTapped () {
        this.showRankPage('former', 6)
    },

    rankLaterTapped () {
        this.showRankPage('later', 6)
    },

    showRankPage (page, size) {
        if (CC_WECHATGAME) {
            sharedCanvas.width =  cc.game.canvas.width * 0.75;
            sharedCanvas.height =  cc.game.canvas.height * 0.6;

            if (this.isShowGroupRank && this.shareTicket != null) {
                let self = this
                this.rankTitleLbl.string = "群排行"
                wx.postMessage({
                    message: 'ShowGroup',
                    pageSize: size,
                    pageType: page,
                    shareTicket: self.shareTicket
                })
            } else {
                this.rankTitleLbl.string = "好友排行"
                wx.postMessage({
                    message: 'Show',
                    pageSize: size,
                    pageType: page
                })
            }
        }
    },

    submitScore (score) {
        if (CC_WECHATGAME) {
            wx.postMessage({
                message: 'Submit',
                score: score
            });
        }
    },

    showRankWithShareTickets(shareTicket) {
        console.log("show rank")
        if (shareTicket === null || shareTicket === undefined) {
            shareTicket = this.shareTicket
        }
        this.isShowGroupRank = true
        this.shareTicket = shareTicket
        this.rankTapped()
    },

    back2Login () {
        this.restart();
        this.loginScene.active = true;
    },

    libraryTapped () {
        this.showLibraryScene()
    },

    showLibraryScene() {
        this.failScene.active = false
        this.loginScene.active = false
        this.rankScene.active = false
        this.loadLibraryContents()
        this.libraryScene.active = true

        cc.sys.localStorage.setItem('redHint', 0);
        this.loadHint()
    },

    loadLibraryContents() {
        let libraryData = this.loadEvent()
        var contentNode = this.libraryScrollView.content;
        contentNode.setPosition(-0.5 * this.libraryScrollView.node.width, 0.5 * this.libraryScrollView.node.height)
        contentNode.width = this.libraryScrollView.node.width

        let contentParent = contentNode.parent
        contentParent.height = this.libraryScrollView.node.height

        let marginX = this.node.width / 15
        let itemW = 0.5 * (contentNode.width - marginX * 3)
        let itemH = itemW / 2 * 3
        let marginY = (this.libraryScrollView.node.height - 2 * itemH) / 3

        contentNode.height = this.libraryScrollView.node.height + Math.floor((libraryData.length - 3) / 2) * (itemH + marginY)

        for (let i = 0; i < libraryData.length; ++ i) {
            let libraryObject = libraryData[i]
            console.log(libraryObject)
            var item = cc.instantiate(this.libraryItem);
            item.width = itemW
            item.height = itemH
            let x = marginX + Math.floor(i % 2) * (item.width + marginX) + 0.5 * item.width
            let y = -marginY - Math.floor(i / 2) * (item.height + marginY) - 0.5 * item.height
            item.setPosition(x, y);
            contentNode.addChild(item)
            item.getComponent('LibraryItem').updateItem(
                libraryObject.name, 
                libraryObject.progress + "/" + libraryObject.target, 
                libraryObject.starImage, 
                libraryObject.progress >= libraryObject.target
            )
        }
    },

    setEventCount (name, count) {
        var libraryData = this.loadEvent()
        for (let i = 0; i < libraryData.length; ++ i) {
            var libraryObject = libraryData[i]
            if (libraryObject.name == name) {
                if (libraryObject.progress < libraryObject.target) {
                    if (count == null) {
                        libraryObject.progress += 1
                    } else {
                        libraryObject.progress = count
                    }
                    if (libraryObject.progress >= libraryObject.target) {
                        //libraryObject.isUnlock = true
                        cc.sys.localStorage.setItem('redHint', 1);
                        this.loadHint();
                        this.libraryAlertWaitingArray.push(libraryObject)
                        console.log('set count')
                        console.log(this.libraryAlertWaitingArray)
                    }
                }
                libraryData[i] = libraryObject
                break
            }
        }
        this.saveEvent(libraryData)
    },

    showLibraryAlert() {
        if (this.libraryAlertWaitingArray.length > 0) {
            let starUrl = this.libraryAlertWaitingArray[0].starImage
            this.libraryAlertWaitingArray.splice(0, 1)
            // this.alertLbl.string = "获得新星球！"
            var self = this;
            cc.loader.loadRes(starUrl, cc.SpriteFrame, function (err, spriteFrame) {    
                self.alertImg.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            this.alertScene.active = true
        }
    },

    closeLibraryAlert() {
        this.alertScene.active = false
        if (this.libraryAlertWaitingArray.length > 0) {
            this.showLibraryAlert()
        } else {
            if (this.methodWaiting != null) {
                this.methodWaiting()
                this.methodWaiting = null
            }
        }
    },

    loadEvent() {
        var data = cc.sys.localStorage.getItem('userEvent')
        var libraryData = null
        var oriData = [
            {name: "", progress: 0, target: 0, starImage: "Earth", key: "none", version: "midsummer"},
            {name: "好友挑战", progress: 0, target: 1, starImage: "Venus", key: "friend"},
            {name: "查看群排行", progress: 0, target: 1, starImage: "Neptune", key: "group"},
            {name: "历史最高", progress: 0, target: 50, starImage: "Pink", key: "hiscore"},
            {name: "累计复活", progress: 0, target: 1, starImage: "DirtyPink", key: "revive"},
        ]
        if (data === null || data.length === 0) {
            libraryData = oriData
            cc.sys.localStorage.setItem('userEvent', JSON.stringify(libraryData));
        } else {
            data = data.replace(/\ufeff/g,"")
            libraryData = JSON.parse(data);
            let version = data[0].version
            if (version != "midsummer") {
                for (var i = 0; i < oriData.length; ++ i) {
                    var item = oriData[i]
                    for (var i = 0; i < libraryData.length; ++ i) {
                        let old = libraryData[i]
                        if (item.name == old.name) {
                            item.progress = old.progress
                            break
                        }
                    }
                    oriData[i] = item
                }
                console.log(oriData)
                libraryData = oriData
                cc.sys.localStorage.setItem('userEvent', JSON.stringify(libraryData));
            }
        }
        //console.log("load data: " + libraryData)
        return libraryData
    },

    saveEvent(data) {
        cc.sys.localStorage.setItem('userEvent', JSON.stringify(data));
    },

    loadHint () {
        var redHint = cc.sys.localStorage.getItem('redHint');
        ///这段代码没用，待修复
        if (redHint === null) {
            cc.sys.localStorage.setItem('redHint', 1);
            redHint = 1
        }
        
        var failHint = cc.find("LibraryBtn/Hint", this.failScene);
        var loginHint = cc.find("LibraryBtn/Hint", this.loginScene);
        if (redHint == 1) {
            failHint.active = true;
            loginHint.active = true;
        } else {
            failHint.active = false;
            loginHint.active = false;
        }
    },

    showGuideScene () {
        this.guideScene.opacity = 255;
        this.startBtn.active = false;
        this.loginFriendBtn.active = false;
    },

    checkFriendRank () {

    },

    share2Friend () {
        var self = this;
        if (CC_WECHATGAME) {
            wx.shareAppMessage({
                title: '听说99%的人都玩不过50分！不服来战',
                imageUrl: "res/raw-assets/resources/Share.png",
                success(res){
                    console.log(res)
                    self.setEventCount("好友挑战", 1)
                    self.showLibraryAlert()
                },
                fail(res){
                    console.log(res)
                } 
            })
        }
    },

    share2Group () {
        var self = this;
        if (CC_WECHATGAME) {
            wx.shareAppMessage({
                title: '想不到群里射术最好的，竟然是他？！',
                imageUrl: "res/raw-assets/resources/Share.png",
                success(res){
                    self.setEventCount("查看群排行", 1)
                    let shareTicket = res.shareTickets[0]
                    console.log("share to group")
                    if (shareTicket != null && shareTicket != undefined) {
                        console.log("group rank")
                        self.shareTicket = shareTicket
                        self.methodWaiting = self.showRankWithShareTickets
                        self.showLibraryAlert()
                        // self.showRankWithShareTickets(shareTicket)
                    }
                },
                fail(res){
                } 
            })
        }
    },

    showVideoAd () {
		if (!CC_WECHATGAME) {
			return
		}

		let videoAd = wx.createRewardedVideoAd({
		    adUnitId: 'adunit-6f73f35cdca5eb92'
		})

		let self = this

		videoAd.load()
		.then(() => {
			videoAd.show()
			self.videoAdScene.active = false
		})
		.catch(err => console.log(err.errMsg))

		videoAd.onClose(res => {
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                self.failing = false
                self.watchedVideoAd = true
                self.setEventCount("累计复活")
                console.log("复活+1") // fucking repeat
                self.continue()
            } else {
                // 播放中途退出，不下发游戏奖励
                self.showFailOrAlert()
                console.log("复活+0")
            }
		})
    },

    showUfo() {
        let y = (Math.random() * 0.2 + 0.4) * (this.blackHole.y + this.earth.y)
        this.ufoNode.setPosition(50, y);
        this.ufoNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(100,0);
        this.ufoNode.active = true;
    },

    driveUfo() {
        if (this.ufoNode.active) {
            let width = this.node.width;
            let rigidBody = this.ufoNode.getComponent(cc.RigidBody);
            if (this.ufoNode.position.x > width * 0.5 - 0.5 * this.ufoNode.width - 10) {
                this.ufoNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(-100,0);
            } else if (this.ufoNode.position.x < -width * 0.5 + 0.5 * this.ufoNode.width + 10) {
                this.ufoNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(100,0);
            }
        }
    },

    ufoContactDetect() {
        if (this.ufoNode.active) {
            var distance = this.earth.position.sub(this.ufoNode.position);
            var gap = Math.sqrt(distance.x * distance.x + distance.y * distance.y);
            if (gap <= (this.earth.width / 2 + this.ufoNode.width / 2)) {
                this.ufoSuccess();
            }
        }
    },

    ufoSuccess() {
        console.log("ufo success")
        this.ufoNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.ufoNode.active = false
        this.earth.width = this.earth.width * 0.6
        this.earth.height = this.earth.height * 0.6
    },

    // Update:
    update (dt) {
        this.updateBg();
        this.driveUfo();

        if (this.rankScene.active) {
            this._updateSubDomainCanvas();

            return;
        }

        //如果在提示中,就开启倒计时
        if (this.videoAdScene.active) {
            var progress = this.videoAdProgressBar.progress;
            if (progress < 1) {
                progress += 1 / 270;
                this.videoAdProgressBar.progress = progress;

                if (progress >= 1) {
                    this.showFailOrAlert();
                }
            }
            return;
        }

        //失败界面只更新背景图
        if (this.failing) {
            return;
        }

        //蓄力缩小
        if (this.touchBagan) {
            if (this.mars.width > this.minPlanetWidth) {
                this.mars.width -= 0.3;
                this.mars.height -= 0.3;
            }

            var progress = this.powerBar.getComponent(cc.ProgressBar).progress;
            if (this.progressDirection === 0) {
                progress += 1 / 120;
            } else {
                progress -= 1 / 120;
            }
            if (progress >= 1) {
                this.progressDirection = 1;
                progress = 1;
            }
            if (progress <= 0.15) {
                this.progressDirection = 0;
                progress = 0.15;
            }
            this.powerBar.getComponent(cc.ProgressBar).progress = progress;
            
            return;
        }

        //弹墙共15就算失败
        if (Global.bounceCount >= 15) {
            console.log("fail0");
            this.fail();
            return;
        }

        //手松开，未碰到地球的情况下，火星停止了算失败
        if (this.marsBegan && !this.earth.onContact) {
            let marsVel = this.mars.getComponent(cc.RigidBody).linearVelocity;
            if (Math.abs(marsVel.x) <= this.spriteStopRatio && Math.abs(marsVel.y) <= this.spriteStopRatio) {
                //运动停止
                console.log("fail1");
                this.fail();
                
                return;
            }
        }

        //碰到地球的情况
        if (this.earth.onContact) {
            if (this.mars.active) {
                this.mars.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
                this.mars.active = false;
                this.marsBegan = false;

                this.audio.getComponents(cc.AudioSource)[0].play();

                if (CC_WECHATGAME) {
                    wx.vibrateShort();
                }
            }

            this.ufoContactDetect()

            let vel = this.earth.getComponent(cc.RigidBody).linearVelocity;
            //cc.log(vel);
            if (Math.abs(vel.x) <= this.spriteStopRatio && Math.abs(vel.y) <= this.spriteStopRatio) {
                //运动停止
                this.earth.onContact = false;
                var distance = this.earth.position.sub(this.blackHole.position);
                var gap = Math.sqrt(distance.x * distance.x + distance.y * distance.y);
                if (gap <= (this.earth.width / 2 + this.blackHole.width / 2)) {
                    this.success(gap);
                } else {
                    console.log("fail2");
                    this.fail();
                }
            }
        }
    },

    _updateSubDomainCanvas () {
        if (CC_WECHATGAME) {
            this.tex.initWithElement(sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },

    updateBg () {
        let height = this.node.height;
        this.bg1.setPosition(this.bg1.position.x + 1, this.bg1.position.y + 1);
        this.bg2.setPosition(this.bg2.position.x + 1, this.bg2.position.y + 1);
        this.bg3.setPosition(this.bg3.position.x + 1, this.bg3.position.y + 1);
        this.bg4.setPosition(this.bg4.position.x + 1, this.bg4.position.y + 1);
        
        if (this.bgOffset < 0 && this.bg2.position.y >= 0) {
            //高大于宽
            this.bg1.setPosition(this.bgOffset, 0);
            this.bg2.setPosition(this.bgOffset, -this.bg2.height);
            this.bg3.setPosition(this.bgOffset - this.bg3.width, 0);
            this.bg4.setPosition(this.bgOffset - this.bg4.width, -this.bg4.height);
        }
        if (this.bgOffset > 0 && this.bg3.position.x >= 0) {
            //宽大于高
            this.bg1.setPosition(0, -this.bgOffset);
            this.bg2.setPosition(0, -this.bgOffset - this.bg2.height);
            this.bg3.setPosition(-this.bg3.width, -this.bgOffset);
            this.bg4.setPosition(-this.bg4.width, -this.bgOffset - this.bg4.height);
        }
    },

    // UI Extension:
    _updateUI () {
        let width = this.node.width;
        let height = this.node.height;

        //适配墙壁
        let wallColliders = this.wall.getComponents(cc.PhysicsBoxCollider);
        this._setBound(wallColliders[0],-width/2,0,3,height);
        this._setBound(wallColliders[1],width/2,0,3,height);

        //适配三种场景
        this._setViewFullScreen(this.loginScene);
        this._setViewFullScreen(this.guideScene);
        this._setViewFullScreen(this.failScene);
        this._setViewFullScreen(this.rankScene);
        this._setViewFullScreen(this.libraryScene);
        this._setViewFullScreen(this.videoAdScene);
        this._setViewFullScreen(this.alertScene);

        this.rankingScrollView.width = width * 0.75;
        this.rankingScrollView.height = height * 0.6;
        this.rankingScrollView.position = cc.v2(0,20);

        this.libraryScrollView.node.width = width * 0.75;
        this.libraryScrollView.node.height = height * 0.6;

        //适配背景
        var maxSize = Math.max(width, height);
        //>0代表宽比高大，<0代表高比宽大
        this.bgOffset = (width - height) / 2;
        if (this.bgOffset > 0) {
            this._setFrame(this.bg1, 0, -this.bgOffset, maxSize, maxSize);
            this._setFrame(this.bg2, 0, -this.bgOffset - maxSize, maxSize, maxSize);
            this._setFrame(this.bg3, -maxSize, -this.bgOffset, maxSize, maxSize);
            this._setFrame(this.bg4, -maxSize, -this.bgOffset - maxSize, maxSize, maxSize);
        } else {
            this._setFrame(this.bg1, this.bgOffset, 0, maxSize, maxSize);
            this._setFrame(this.bg2, this.bgOffset, -maxSize, maxSize, maxSize);
            this._setFrame(this.bg3, this.bgOffset - maxSize, 0, maxSize, maxSize);
            this._setFrame(this.bg4, this.bgOffset - maxSize, - maxSize, maxSize, maxSize);
        }

        //适配星球
        this._setFrame(this.mars, 0, 0 , this.normalPlanetWidth, this.normalPlanetWidth);
        this._setFrame(this.earth, 0, 0 , this.normalPlanetWidth, this.normalPlanetWidth);
        this._setFrame(this.circle, 0, 0, this.normalPlanetWidth, this.normalPlanetWidth);
        this.mars.getComponent(cc.PhysicsCircleCollider).radius = this.normalPlanetWidth / 2;
        this.earth.getComponent(cc.PhysicsCircleCollider).radius = this.normalPlanetWidth / 2;

        //适配失败页面
        this.restartBtn.width = width / 2;
        this.restartBtn.height = this.restartBtn.width * 152 / 500;
        this.restartBtn.x = 0;
        this.restartBtn.y = 0;
        var node = this.restartBtn;
        this._setFrame(this.friendBtn, node.x, node.y - node.height - 20, node.width, node.height);
        this._setFrame(this.friendRankBtn, node.x, node.y + node.height + 10, node.width, node.height);
        node = this.friendBtn;
        this._setFrame(this.groupBtn, node.x, node.y - node.height - 20, node.width, node.height);

        //适配教程图片
        this.guideText.active = false;
        this.guideFinger.active = false;
    },

    _setBound (node,x, y, width, height) {
        node.offset.x = x;
        node.offset.y = y;
        node.size.width = width;
        node.size.height = height;
    },
    _setViewFullScreen (node) {
        this._setFrame(node, 0, 0, this.node.width, this.node.height);
    },
    _setFrame (node, x, y, width, height) {
        node.x = x;
        node.y = y;
        node.width = width;
        node.height = height;
    },
});
