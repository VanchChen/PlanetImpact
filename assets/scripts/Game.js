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
        circleOpacity: 10,
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
        percentageLbl: cc.Label,
        loginScene: {
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
        share2RebornBtn: cc.Node,
        videoAdBtn: cc.Node,
        videoNoAdBtn: cc.Node,
        alertScene: cc.Node,
        alertImg: cc.Node,
        alertBtn: cc.Node,
        ufoNode: cc.Node,
        guideText: cc.Node,
        libraryBtn: cc.Node,
        bloodCountLbl: cc.Label,
        bloodCountHomeLbl: cc.Label,
        bigPlanet: cc.Node,
        stonePrefab: cc.Prefab,
        stone: cc.Node,
        bigNun: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    _setConstNum () {
        this.normalPlanetWidth = this.node.width / 5;
        this.minPlanetWidth = this.normalPlanetWidth * 0.8;
        this.libraryAlertWaitingArray = new Array();
        this.ufoScore = 30;
        this.ufoSpeed = 100;
        this.frapIndex = 0;
        this.totalStoneCount = 20;
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
        this.powerBar.active = false;
        this.alertScene.active = false;
        this.ufoNode.active = false;
        
        this.singleScoreLabel.opacity = 0;
        this.circle.opacity = 0;

        this.showLibraryAlert();

        this.saveEvent(this.loadEvent())
        // for (var i = 0; i < 4; ++ i ) {
        //     let data = this.loadEvent()
        //     let libraryObject = data[i]
        //     console.log(libraryObject)
        //     this.libraryAlertWaitingArray.push(libraryObject)
        // }

        this.loadHint()

        this.showPlanet(false);

        //禁止特殊场景
        this.hideAllSubScene();

        //创建对象池
        // this.stonePool = new cc.NodePool();
        // this.stoneArray = new Array();
        // for (let i = 0; i < this.totalStoneCount; i++) {
        //     let stone = cc.instantiate(this.stonePrefab);
        //     this.stonePool.put(stone);
        // }

        let date = new Date()
        let lastDateStr = cc.sys.localStorage.getItem('loginDate');
        if (lastDateStr != null) {
            var yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)// "" + date.getFullYear() + date.getMonth() + (date.getDay() - 1)
            let yesterdayStr = "" + yesterday.getFullYear() + (yesterday.getMonth() + 1) + yesterday.getDate()
            if (lastDateStr == yesterdayStr) {
                this.setEventCount("连续登录")
            }
        }
        cc.sys.localStorage.setItem('loginDate', "" + date.getFullYear() + (date.getMonth() + 1) + date.getDate());
    },
    
    start () {
        console.log('start');
        this.rankPage = 0
        
        var bloodCount = cc.sys.localStorage.getItem('bloodCount');
        console.log(bloodCount)
        var notVirgin = cc.sys.localStorage.getItem('notCherry');
        if (!bloodCount) {
            bloodCount = 2
            cc.sys.localStorage.setItem("bloodCount", bloodCount)
        }
        this.bloodCountHomeLbl.string = "x " + (bloodCount - 1)

        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D();
            wx.showShareMenu({withShareTicket:true});

            let self = this

            wx.onShow(function (res) {
                console.log(res);
                let shareTicket = res.shareTicket
                if (shareTicket != null && shareTicket != undefined) {
                    self.showRankWithShareTickets(shareTicket)
                }
            })

            var launchOption = wx.getLaunchOptionsSync();
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
                    imageUrl: "res/raw-assets/resources/ShareImage.png",
                    success(res){
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
        this.clearConfigs();

        this.continue();
    },

    clearConfigs () {
        this.failing = false;
        
        this.isShowGroupRank = false
        this.shareTicket = null

        this.showPlanet(true);

        //clear score
        this.score = 0;
        this.combo = 0;
        this.times = 0;

        this.watchedVideoAd = false;
        this.resetedAd = false;

        this.scoreLabel.getComponent(cc.Label).string = '';

        this.reloadStarArray();
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
        this.hideAllSubScene();
        this.singleScore = 0;
        this.ufoNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.ufoNode.active = false
        this.ufoMutation = false
        this.scoreLabel.active = true
        this.times += 1
        this.earthHighSpeed = 0;

        if (this.isGuideMode) {
            var finished = cc.callFunc(function () {
                this.guideText.active = false;
            }, this);
            var spawn = cc.sequence(cc.fadeOut(1), finished);
            this.guideText.runAction(spawn);
        }
        this.isGuideMode = false;
         
        // this.mars.active = true;
        var action = cc.fadeIn(0.01);
        this.mars.stopAllActions();
        this.mars.runAction(action);
        this.mars.getComponent(cc.PhysicsCircleCollider).enabled = true;

        let width = this.node.width;
        let height = this.node.height;

        //科学难度
        this.ufoShowRate = 0;
        var holeRadius;
        var positionRatio = 0.25;
        this.ufoSpeed = 100;
        if (this.score <= 5) {
            holeRadius = this.normalPlanetWidth * 3;
        } else if (this.score <= 10) {
            holeRadius = (3 - (this.score - 5) / (20 - 5) * (3 - 2)) * this.normalPlanetWidth;
        } else if (this.score <= 20) {
            holeRadius = (3 - (this.score - 5) / (20 - 5) * (3 - 2)) * this.normalPlanetWidth;
            this.ufoShowRate = 0.5;
        } else if (this.score <= 50) {
            holeRadius = (2 - (this.score - 20) / (50 - 20) * (2 - 1.5)) * this.normalPlanetWidth;
            this.ufoShowRate = 0.5;
            this.ufoSpeed = 120;
        } else if (this.score <= 100) {
            holeRadius = (1.5 - (this.score - 50) / (100 - 50) * (1.5 - 1)) * this.normalPlanetWidth;
            this.ufoShowRate = 0.75;
            this.ufoSpeed = 150;
        } else if (this.score <= 150) {
            holeRadius = Math.random() * this.normalPlanetWidth * 0.3 + this.normalPlanetWidth * 0.7;
            this.ufoShowRate = 1;
            this.ufoSpeed = 170;
        } else if (this.score <= 200) {
            holeRadius = Math.random() * this.normalPlanetWidth * 0.3 + this.normalPlanetWidth * 0.6;
            this.ufoShowRate = 1;
            this.ufoSpeed = 200;
        } else {
            holeRadius = Math.random() * this.normalPlanetWidth * 0.3 + this.normalPlanetWidth * 0.5;
            this.ufoShowRate = 1;
            this.ufoSpeed = 200;
        }
        holeRadius = Math.max(holeRadius, this.normalPlanetWidth);
        this.blackHole.width = this.blackHole.height = holeRadius;
        var subNode = this.blackHole.getChildByName('InsideHole');
        subNode.width = subNode.height = this.blackHole.width * 0.8;
        subNode = this.blackHole.getChildByName('Goal');
        subNode.width = subNode.height = this.blackHole.width;

        //重置地球
        this.earth.setPosition((Math.random() * 2 - 1) * width  * positionRatio / 2, 0);
        this.earth.width = this.normalPlanetWidth
        this.earth.height = this.normalPlanetWidth
        var earthIndex = Math.floor(Math.random() * this.starStorage.length);
        this.earth.active = false;
        
        var self = this;
        cc.loader.loadRes(this.starStorage[earthIndex], cc.SpriteFrame, function (err, spriteFrame) {	
            self.earth.getComponent(cc.Sprite).spriteFrame = spriteFrame;	
            self.earth.active = true;	
            self.earth.scale = 0;
            self.earth.runAction(cc.scaleTo(0.2, 1));
        });
        
        //黑洞动画
        var blackHolePosition = cc.v2((Math.random() * 2 - 1) * width  * positionRatio, height / 3);
        blackHolePosition.x = Math.max(blackHolePosition.x, -width / 4);
        blackHolePosition.x = Math.min(blackHolePosition.x, width / 4);
        this.blackHole.runAction(cc.moveTo(0.5, blackHolePosition));

        //火星动画
        this.mars.active = true;
        var marsPositionX = (Math.random() * 2 - 1) * width  * positionRatio / 2;
        if (marsPositionX * this.earth.position.x < 0) {
            marsPositionX *= -1;
        }
        this.mars.setPosition(marsPositionX, -height/3);
        this.mars.width = this.mars.height = this.normalPlanetWidth;
        this.mars.scale = 0;
        this.mars.runAction(cc.scaleTo(0.2, 1));
        
        this.mars.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.mars.getComponent(cc.RigidBody).angularVelocity = 50;
        this.earth.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.earth.getComponent(cc.RigidBody).angularVelocity = 50;

        //clear bounce count
        Global.bounceCount = 0;
        
        if (this.score > this.ufoScore) {
            if (Math.random() > (1 - this.ufoShowRate)) {
                this.showUfo();
            }
        }

        //计算击中点
        let earthCenter = this.earth.position;
        let directionConst = (blackHolePosition.x - earthCenter.x) / (blackHolePosition.y - earthCenter.y);
        let tmpConst = Math.sqrt((this.normalPlanetWidth * this.normalPlanetWidth) / (1 + directionConst * directionConst));
        var targetCenter = cc.v2();
        targetCenter.y = earthCenter.y - tmpConst;
        targetCenter.x = earthCenter.x - directionConst * tmpConst;
        this.circle.setPosition(targetCenter);

        //生成新石头
        //this.spawnNewStone();

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
        this.scoreLabel.active = false

        var btnOffsetY = -20;
        this.videoAdScene.active = true;
        var bloodCount = cc.sys.localStorage.getItem('bloodCount');
        this.bloodCountLbl.string = "x " + (bloodCount - 1)

        let width = this.node.width;
        this.videoAdBtn.x = 0;
        this.videoAdBtn.y = btnOffsetY;
        this.videoNoAdBtn.x = 0;
        this.videoNoAdBtn.y = -this.videoAdBtn.height * 0.5 - this.videoNoAdBtn.height * 0.5 - 30;
        this.share2RebornBtn.x = 0
        this.share2RebornBtn.y = this.videoAdBtn.height * 0.5 + this.videoAdBtn.y + 20
        this.videoAdLabel.string = this.score// "本次得分: " + this.score;
        var highScore = cc.sys.localStorage.getItem('hiScore');
        highScore = Math.max(highScore, this.score);
        this.reviveHighScoreLabel.getComponent(cc.Label).string = '历史最高分：' + highScore;

        var bannerTop = cc.game.canvas.height / 4 - this.videoNoAdBtn.y;
        var bannerWidth = this.node.width;
        this.bannerAd = wx.createBannerAd({
            adUnitId: 'adunit-83999fbec2ba4998',
            style: {
                left: 0,
                top: bannerTop,
                width: bannerWidth
            }
        })
        this.bannerAd.show();

        //添加触摸监听
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }, 

    showFailOrAlert() {
        if (CC_WECHATGAME) {
            this.bannerAd.destory();
        }
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
        this.showPlanet(false);

        this.failScoreLabel.getComponent(cc.Label).string = this.score;

        var highScore = cc.sys.localStorage.getItem('hiScore');
        highScore = Math.max(highScore, this.score);
        this.setEventCount("历史最高", highScore)
        cc.sys.localStorage.setItem('hiScore', highScore);

        this.submitScore(highScore);

        this.highScoreLabel.getComponent(cc.Label).string = '历史最高分：' + highScore;
        this.percentageLbl.string = "超过" + this.getPercentage(this.score) + "%的玩家"

        //this.audio.getComponents(cc.AudioSource)[2].play();
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

            this.bigNun.runAction(cc.moveTo(0.6, cc.v2(0, this.bigNun.y + 20)));
            this.bigPlanet.runAction(cc.sequence(cc.scaleTo(0.1, 1.5), cc.scaleTo(0.5, 1.2)));
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
            this.singleScoreLabel.getComponent(cc.Label).fontSize = 25;
        } else {
            scoreText = '命中';
            this.singleScoreLabel.getComponent(cc.Label).fontSize = 20;
        }
        scoreText += '  +' + this.singleScore;
        var bounceScore = Global.bounceCount * 2 * (this.combo + 1);
        this.score += bounceScore;
        if (bounceScore > 0) {
            scoreText += '\n反弹  +' + bounceScore;
            //this.setEventCount("单局反弹")
        }
        if (this.combo > 0) {
            scoreText += '\n完美连击 x' + this.combo;
        }
        this.singleScoreLabel.getComponent(cc.Label).string = scoreText;
        this.scoreLabel.getComponent(cc.Label).string = this.score;

        var highScore = cc.sys.localStorage.getItem('hiScore');
        highScore = Math.max(highScore, this.score);
        this.setEventCount("历史最高", highScore)

        //动画
        var scoreAnimation = cc.sequence(cc.scaleTo(0.1, 1.5), cc.scaleTo(0.1, 1));
        this.scoreLabel.runAction(scoreAnimation);

        var showScore = cc.sequence(cc.fadeIn(0.1), cc.fadeOut(1.2));
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

        //石头动画
        //this.recycleStone();
    },

    guide () {
        this.singleScore = 0;

        let width = this.node.width;
        let height = this.node.height;

        this.guideText.active = true;
        this.guideText.opacity = 255;
        //黑洞
        this.blackHole.width = this.blackHole.height = this.normalPlanetWidth * 3;
        var subNode = this.blackHole.getChildByName('InsideHole');
        subNode.width = subNode.height = this.blackHole.width * 0.8;
        subNode = this.blackHole.getChildByName('Goal');
        subNode.width = subNode.height = this.blackHole.width;
        //加载地球纹理
        this.earth.active = false;	
        var self = this;
        cc.loader.loadRes('Earth', cc.SpriteFrame, function (err, spriteFrame) {	
            self.earth.getComponent(cc.Sprite).spriteFrame = spriteFrame;	
            self.earth.active = true;	
        });
        this.earth.scale = 1;
        this.earth.width = this.normalPlanetWidth;
        this.earth.height = this.normalPlanetWidth;
        
        this.isGuideMode = true;

        this.ufoShowRate = 0;
        this.ufoNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.ufoNode.active = false
        this.ufoMutation = false
        
        this.mars.setPosition(0, -height / 3);
        this.earth.setPosition(0, -height / 15);
        this.blackHole.setPosition(0, height / 3);
        this.guideText.setPosition(0, height / 10);
        this.circle.setPosition(0, this.earth.position.y - this.earth.height);
        
        this.mars.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.earth.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.mars.getComponent(cc.RigidBody).angularVelocity = 50;
        this.earth.getComponent(cc.RigidBody).angularVelocity = 50;

        //clear bounce count
        Global.bounceCount = 0;

        //恢复火星
        this.mars.active = true;
        var action = cc.fadeIn(0.01);
        this.mars.stopAllActions();
        this.mars.runAction(action);
        this.mars.getComponent(cc.PhysicsCircleCollider).enabled = true;

        //添加触摸监听
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    getPercentage(score) {
        var percentage
        if (score <= 10) {
            percentage = (score + 1) * 4.545
        } else if (score <= 50) {
            percentage = 50 + (score - 10) * 1
        } else if (score <= 100) {
            percentage = 90 + (score - 50) * 0.12
        } else if (score <= 200) {
            percentage = 96 + (score - 100) * 0.02
        } else if (score <= 400) {
            percentage = 98 + (score - 200) * 0.005
        } else if (score <= 899) {
            percentage = 99 + (score - 400) * 0.002
        } else {
            percentage = 99.99
        }
        return percentage.toFixed(2)
    },

    useBlood() {
        var bloodCount = cc.sys.localStorage.getItem('bloodCount');
        if (bloodCount > 1) {
            this.bannerAd.destory();
            this.failing = false
            this.watchedVideoAd = true
            this.continue()
            cc.sys.localStorage.setItem('bloodCount', Math.max(bloodCount - 1, 1));
        }
    },

    share2Reborn () {
        var self = this;
        if (CC_WECHATGAME) {
            wx.shareAppMessage({
                title: '听说99%的人都玩不过50分！不服来战',
                imageUrl: "res/raw-assets/resources/ShareImage.png",
                success(res){
                    console.log(res)
                    self.bannerAd.destory();
                    self.failing = false
                    self.showPlanet(true);
                    self.watchedVideoAd = true
                    self.continue()
                },
                fail(res){
                    console.log(res)
                } 
            })
        }
    },

    reloadStarArray() {
        this.starStorage = new Array('Earth');
        let libraryData = this.loadEvent()
        for (var i = 0; i < libraryData.length; ++ i) {
            let libraryObject = libraryData[i]
            if (libraryObject.progress >= libraryObject.target) {
                this.starStorage.push(libraryObject.starImage)
            }
        }
    },

    // Touch Event:
    onTouchBegan (event) {
        if (this.loginScene.active || this.rankScene.active || this.libraryScene.active) {
            return;
        }

        if (this.marsBegan || !this.mars.active) return;

        this.audio.getComponents(cc.AudioSource)[1].play();

        this.touchBagan = true;
        this.powerBar.getComponent(cc.ProgressBar).progress = 0.15;
        this.progressDirection = 0;

        //展示圆圈
        this.circle.opacity = this.circleOpacity;
        this.onTouchMove(event);
    },

    onTouchMove (event) {
        if (this.loginScene.active || this.rankScene.active || 
            this.libraryScene.active) {
            return;
        }

        var touchPosition = cc.v2(event.touch.getLocation());

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
            this.libraryScene.active) {
            return;
        }

        if (this.marsBegan || !this.mars.active) return;

        this.audio.getComponents(cc.AudioSource)[1].stop();

        this.powerBar.active = false;

        var progress = this.powerBar.getComponent(cc.ProgressBar).progress;

        //计算定制的方向
        let rigidBody = this.mars.getComponent(cc.RigidBody);
        let center = rigidBody.getWorldCenter();
        //计算方向向量
        let worldCirclePosition = this.node.convertToWorldSpaceAR(this.circle.position);
        var vel = cc.v2(worldCirclePosition).sub(center).normalizeSelf();
        //乘以质量和最大初速度
        vel = vel.mulSelf(rigidBody.getMass() * 4000);
        //根据进度条调整力度
        vel = vel.mulSelf(progress);
        //实施动量
        rigidBody.applyLinearImpulse(vel,rigidBody.getWorldCenter(),true);

        //motion start
        this.marsBegan = true;
        this.duringGame = true;
        //restore size
        this.touchBagan = false;
        this.mars.width = this.mars.height = this.normalPlanetWidth;
        //圆圈消失
        this.circle.opacity = 0;

        //添加触摸监听
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
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
            this.clearConfigs();
            this.guide();
        } else {
            this.restart();
        }
    },

    rankTapped () {
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
        if (shareTicket === null || shareTicket === undefined) {
            shareTicket = this.shareTicket
        }
        this.isShowGroupRank = true
        this.shareTicket = shareTicket
        this.rankTapped()
    },

    back2Login () {
        this.showPlanet(false);
        this.hideAllSubScene();
         
        var bloodCount = cc.sys.localStorage.getItem('bloodCount');
        this.bloodCountHomeLbl.string = "x " + (bloodCount - 1)
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
        let itemH = itemW
        let marginY = marginX

        contentNode.height = Math.floor((libraryData.length + 1) / 2) * (itemH + marginY) + marginY

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
            var self = this;
            cc.loader.loadRes(starUrl, cc.SpriteFrame, function (err, spriteFrame) {    
                self.alertImg.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
            this.alertScene.active = true
        } else {
            if (this.methodWaiting != null) {
                this.methodWaiting()
                this.methodWaiting = null
            }
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
            {name: "", progress: 0, target: 0, starImage: "Earth", key: "none", version: "latefucking11july"},
            {name: "好友挑战", progress: 0, target: 1, starImage: "Venus", key: "friend"},
            {name: "查看群排行", progress: 0, target: 1, starImage: "Neptune", key: "group"},
            {name: "历史最高", progress: 0, target: 50, starImage: "Pink", key: "hiscore"},
            {name: "累计复活", progress: 0, target: 1, starImage: "DirtyPink", key: "revive"},
            {name: "连续登录", progress: 1, target: 2, starImage: "Iron", key: "loginlogin"},
        ]
        if (data === null || data.length === 0) {
            libraryData = oriData
            cc.sys.localStorage.setItem('userEvent', JSON.stringify(libraryData));
        } else {
            data = data.replace(/\ufeff/g,"")
            libraryData = JSON.parse(data);
            let version = data[0].version
            if (version != "latefucking11july") {
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
    },

    showGuideScene () {
        this.loginScene.active = false;
        
        this.clearConfigs();
        this.guide();
    },

    share2Friend () {
        var self = this;
        if (CC_WECHATGAME) {
            wx.shareAppMessage({
                title: '听说99%的人都玩不过50分！不服来战',
                imageUrl: "res/raw-assets/resources/ShareImage.png",
                success(res){
                    console.log(res)
                    self.setEventCount("好友挑战", 1)
                    self.getBlood()
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
                imageUrl: "res/raw-assets/resources/ShareImage.png",
                success(res){
                    self.setEventCount("查看群排行", 1)
                    let shareTicket = res.shareTickets[0]
                    console.log("share to group")
                    if (shareTicket != null && shareTicket != undefined) {
                        console.log("group rank")
                        self.shareTicket = shareTicket
                        self.methodWaiting = self.showRankWithShareTickets
                        self.showLibraryAlert()
                        self.getBlood()
                        // self.showRankWithShareTickets(shareTicket)
                    }
                },
                fail(res){
                } 
            })
        }
    },

    getBlood() {
        var bloodCount = cc.sys.localStorage.getItem('bloodCount');
        cc.sys.localStorage.setItem('bloodCount', bloodCount + 1);
        this.bloodCountHomeLbl.string = "x " + bloodCount
    },

    showVideoAd () {
		if (!CC_WECHATGAME) {
			return
        }
        
        this.bannerAd.destory();

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
                self.showPlanet(true);
                self.watchedVideoAd = true
                self.setEventCount("累计复活")
                console.log("复活+1") 
                self.continue()
            } else {
                // 播放中途退出，不下发游戏奖励
                self.showFailOrAlert()
                console.log("复活+0")
            }
            videoAd.offClose(this);
        })
    },

    showUfo() {
        let y = (Math.random() * 0.2 + 0.4) * (this.blackHole.y + this.earth.y)
        this.ufoNode.setPosition(50, y);
        this.ufoNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.ufoSpeed,0);
        this.ufoNode.active = true;
    },

    driveUfo() {
        if (this.ufoNode.active) {
            let width = this.node.width;
            let rigidBody = this.ufoNode.getComponent(cc.RigidBody);
            if (this.ufoNode.position.x > width * 0.5 - 0.5 * this.ufoNode.width - 10) {
                this.ufoNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(-this.ufoSpeed,0);
            } else if (this.ufoNode.position.x < -width * 0.5 + 0.5 * this.ufoNode.width + 10) {
                this.ufoNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.ufoSpeed,0);
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
        if (this.ufoMutation) {
            this.earth.width = this.earth.height = this.earth.width - this.normalPlanetWidth * 0.6 / 30;
            if (this.earth.width <= this.normalPlanetWidth * 0.6) {
                this.ufoMutation = false;
            }
        }
    },

    ufoSuccess() {
        this.ufoNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.ufoNode.active = false
        this.ufoMutation = true
        
        if (CC_WECHATGAME) {
            wx.vibrateShort();
        }
    },

    showPlanet (isShow) {
        this.blackHole.active = isShow;
        this.mars.active = isShow;
        this.earth.active = isShow;
        this.scoreLabel.active = isShow;

        this.bigNun.getComponent(cc.RigidBody).linearVelocity = cc.v2();
        if (isShow) {
            var spawn = cc.spawn(cc.moveTo(0.5,cc.v2(0,- this.node.height / 2 - this.bigPlanet.height / 3)).easing(cc.easeOut(3.0)), cc.scaleTo(0.5, 1.2));
            this.bigPlanet.runAction(spawn);

            this.bigNun.runAction(cc.moveTo(0.5, cc.v2(0, this.node.height / 2 + this.bigNun.height / 4)).easing(cc.easeOut(3.0)));
        } else {
            var spawn = cc.spawn(cc.moveTo(0.5,cc.v2(0,0)).easing(cc.easeOut(3.0)), cc.scaleTo(0.5, 1));
            this.bigPlanet.runAction(spawn);

            this.bigNun.runAction(cc.moveTo(0.5, cc.v2(0, this.node.height)).easing(cc.easeOut(3.0)));
        }
    },

    hideAllSubScene () {
        this.rankScene.active = false
        this.libraryScene.active = false
        this.failScene.active = false;
        this.videoAdScene.active = false;
    },

    recycleStone () {
        var copyArray = Array.from(this.stoneArray);
        this.stoneArray.splice(0, this.stoneArray.length);
        for (var i = 0; i < copyArray.length; i++) {
            let stone = copyArray[i];
            if (stone.position.y < this.normalPlanetWidth) {
                //小于一个地球高度，就保留
                this.stoneArray.push(stone);
            } else {
                var finished = cc.callFunc(function () {
                    stone.removeFromParent();
                    this.stonePool.put(stone);
                    console.log("回收一个，池内共" + this.stonePool.size())
                }, this);
                var spawn = cc.sequence(cc.spawn(cc.moveTo(0.2,this.blackHole.position), cc.scaleTo(0.2, 0)), finished);
                stone.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
                stone.runAction(spawn);
                console.log("执行一个动画")
            }
        }
    },

    spawnNewStone () {
        for (let i = 0; i < 3; i++) {
            let stone = this.stonePool.get();
            if (stone == null) {
                console.log("Run out stones!");
                return;
            } 

            //console.log("before stone parent is " + stone.parent + "pos is "+ stone.position);
            this.node.addChild(stone);
            this.stoneArray.push(stone);
            var stonePosition = cc.v2();
            stonePosition.x = Math.random() * this.node.width / 4 - this.node.width / 8;
            stonePosition.y = this.earth.position.y - this.earth.height / 2 - Math.random() * (this.node.height / 3 - this.normalPlanetWidth);
            stone.setPosition(stonePosition);
            //console.log("after stone parent is " + stone.parent + "pos is "+ stone.position);
            console.log("添加一个到堆栈");
        }
    },

    // Update:
    update (dt) {
        this.updateBg();
        this.driveUfo();
        this.updateNun();

        if (this.rankScene.active) {
            this._updateSubDomainCanvas();

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

        //friction
        var distance = this.earth.position.sub(this.blackHole.position);
        var gap = Math.sqrt(distance.x * distance.x + distance.y * distance.y);
        if (gap <= (this.earth.width / 2 + this.blackHole.width / 2)) {
            this.earth.getComponent(cc.RigidBody).linearDamping = Math.max(5.5 - 2.5 * (this.times / 25), 3);
        } else {
            this.earth.getComponent(cc.RigidBody).linearDamping = 3;
        }
        
        // shadow
        // this.frapIndex += 1
        // let marsVel = this.mars.getComponent(cc.RigidBody).linearVelocity;
        // let velValue = Math.sqrt(Math.sqrt(marsVel.x * marsVel.x + marsVel.y * marsVel.y))
        // let shadowMargin = Math.round(20 * 7 / velValue)
        // if (this.frapIndex % shadowMargin == 0 && velValue > 10 && !this.earth.onContact) {
            
        //     if (Math.abs(marsVel.x) > 0 || Math.abs(marsVel.y) > 0) {
        //         var item = cc.instantiate(this.shadowPrefab);
        //         item.width = this.mars.width
        //         item.height = this.mars.height
        //         item.opacity = 125
        //         item.setPosition(this.mars.x, this.mars.y);
        //         this.mars.parent.addChild(item)
        
        //         let self = this
        //         setTimeout( function(){
        //             item.destroy()
        //         }, 300 )
        //     }
        // }

        //手松开，未碰到地球的情况下，火星停止了算失败
        if (this.marsBegan && !this.earth.onContact) {
            let marsVel = this.mars.getComponent(cc.RigidBody).linearVelocity;
            if (Math.abs(marsVel.x) <= this.spriteStopRatio && Math.abs(marsVel.y) <= this.spriteStopRatio) {
                //运动停止
                this.duringGame = false;
                console.log("fail1");
                this.fail();
                
                return;
            }
        }

        //碰到地球的情况
        if (this.earth.onContact) {
            if (this.marsBegan) {
                // this.mars.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
                // this.mars.active = false;
                var action = cc.fadeOut(0.3);
                this.mars.runAction(action);
                this.mars.getComponent(cc.PhysicsCircleCollider).enabled = false;
                this.marsBegan = false;

                this.audio.getComponents(cc.AudioSource)[0].play();

                if (CC_WECHATGAME) {
                    wx.vibrateShort();
                }

                let earthVel = this.earth.getComponent(cc.RigidBody).linearVelocity;
                let velValue = Math.sqrt(earthVel.x * earthVel.x + earthVel.y * earthVel.y);
                this.earthHighSpeed = velValue;
            }

            this.ufoContactDetect()

            let vel = this.earth.getComponent(cc.RigidBody).linearVelocity;
            //cc.log(vel);
            if (Math.abs(vel.x) <= this.spriteStopRatio && Math.abs(vel.y) <= this.spriteStopRatio) {
                //运动停止
                this.duringGame = false;
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

        let delta = 0.6;
        let earthVel = this.earth.getComponent(cc.RigidBody).linearVelocity;
        let velValue = Math.sqrt(earthVel.x * earthVel.x + earthVel.y * earthVel.y)
        if (this.touchBagan) {
            var progress = this.powerBar.getComponent(cc.ProgressBar).progress;
            delta = 0.6 + (2.4 * progress)
            let augularVel = 50 + 450 * progress
            this.mars.getComponent(cc.RigidBody).angularVelocity = augularVel;
            this.earth.getComponent(cc.RigidBody).angularVelocity = augularVel;
        } else if (this.marsBegan && !this.onContact) {
            delta = this.highDelta;
            // this.mars.getComponent(cc.RigidBody).angularVelocity = 200;
            // this.earth.getComponent(cc.RigidBody).angularVelocity = 200;
        } else {
            if (velValue > 0) {
                delta = 0.6 + (2.4 / this.earthHighSpeed * velValue)
                let augularVel = 50 + 450 / this.earthHighSpeed * velValue
                this.mars.getComponent(cc.RigidBody).angularVelocity = augularVel;
                this.earth.getComponent(cc.RigidBody).angularVelocity = augularVel;
            }
        }
        this.highDelta = delta

        let height = this.node.height;
        this.bg1.setPosition(this.bg1.position.x + delta, this.bg1.position.y + delta);
        this.bg2.setPosition(this.bg2.position.x + delta, this.bg2.position.y + delta);
        this.bg3.setPosition(this.bg3.position.x + delta, this.bg3.position.y + delta);
        this.bg4.setPosition(this.bg4.position.x + delta, this.bg4.position.y + delta);
        
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

        //适配大佬
        this._setFrame(this.bigPlanet, 0, 0, width * 0.8, width * 0.8);
        this._setFrame(this.bigNun, 0, height, width, width);
        this.bigNun.getComponent(cc.PhysicsCircleCollider).radius = width / 2;

        //适配星球
        this._setFrame(this.mars, 0, 0 , this.normalPlanetWidth, this.normalPlanetWidth);
        this._setFrame(this.earth, 0, 0 , this.normalPlanetWidth, this.normalPlanetWidth);
        this._setFrame(this.circle, 0, 0, this.normalPlanetWidth, this.normalPlanetWidth);
        this.mars.getComponent(cc.PhysicsCircleCollider).radius = this.normalPlanetWidth / 2;
        this.earth.getComponent(cc.PhysicsCircleCollider).radius = this.normalPlanetWidth / 2;
        this.ufoNode.width = 0.8 * this.normalPlanetWidth;
        this.ufoNode.height = this.ufoNode.width / 100 * 35;
        let angle = 20;
        this.ufoNode.runAction(cc.repeatForever(cc.sequence(cc.skewTo(1, angle, -angle), cc.skewTo(1, -angle, angle))));

        //适配教程图片
        this.guideText.active = false;
        
        //添加动画
        let goal = this.blackHole.getChildByName('Goal');
        goal.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(2, 50), cc.fadeTo(2, 255))));
    },

    updateNun () {
        if (this.failing == true || this.failing == undefined) return;

        if (this.bigNun.y <= 0) return;

        var speed = Math.sqrt(this.score) / 75;
        speed = Math.min(speed, 0.2);
        speed = Math.max(speed, 0.075);
        this.bigNun.y -= speed;
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
