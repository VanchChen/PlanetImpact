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
    },

    // LIFE-CYCLE CALLBACKS:
    _setConstNum () {
        this.normalPlanetWidth = this.node.width / 5;
        this.minPlanetWidth = this.normalPlanetWidth * 0.8;
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
        
        this.singleScoreLabel.setOpacity(0);
        this.circle.setOpacity(0);

        this.saveEvent(this.loadEvent())

        this.restart();
    },

    onShow() {
        console.log('on show');
        //wx.onShow(showApp)
    },

    onShown () {
        console.log('on shown');
    },

    // showApp(res) {
    //     print(res)
    // },
    
    start () {
        console.log('start');
        this.rankPage = 0

        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D();
            wx.showShareMenu({withShareTicket:true});

            wx.onShareAppMessage(function(res){
                return {
                    title: '弹弹弹！嗖嗖嗖！好玩上瘾的游戏，推荐给你！',
                    imageUrl: "res/raw-assets/resources/Share.png",
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
        this.failing = false;

        //clear score
        this.score = 0;
        this.combo = 0;
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

    continue () {
        this.rankPage = 0
        this.rankScene.active = false
        this.libraryScene.active = false
        this.failScene.active = false;
        this.singleScore = 0;

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
        var hasFriendAch = cc.sys.localStorage.getItem('friendAchievement');
        var hasGroupAch = cc.sys.localStorage.getItem('groupAchievement');
        var starStorage = new Array('Earth');
        // if (hasFriendAch == 1) {
        //     starStorage.push('Venus')
        // }
        // if (hasGroupAch == 1) {
        //     starStorage.push('Neptune')
        // }
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
        
        this.mars.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.earth.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);

        //clear bounce count
        Global.bounceCount = 0;

        //恢复火星
        this.mars.active = true;

        //添加触摸监听
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    // Logic:
    fail () {
        // reset
        this.failing = true;
        this.marsBegan = false;
        this.earth.onContact = false;

        this.failScoreLabel.getComponent(cc.Label).string = this.score;

        var highScore = cc.sys.localStorage.getItem('hiScore');
        highScore = Math.max(highScore, this.score);
        this.setEventCount("历史最高", highScore)
        cc.sys.localStorage.setItem('hiScore', highScore);

        this.submitScore(highScore);

        this.highScoreLabel.getComponent(cc.Label).string = '历史最高分：' + highScore;

        this.failScene.active = true;
        
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
            this.guideScene.opacity == 255 || this.libraryScene.active) {
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

        this.powerBar.active = true;
        var positionX = 0;
        var offset = this.earth.width / 2 + this.powerBar.width / 2;
        if (this.circle.position.x > this.earth.position.x) {
            positionX = this.earth.position.x - offset;
        } else {
            positionX = this.earth.position.x + offset;
        }
        this.powerBar.setPosition(cc.v2(positionX, this.earth.position.y));
    },

    onTouchEnd (event) {
        if (this.loginScene.active || this.rankScene.active || 
            this.guideScene.opacity == 255 || this.libraryScene.active) {
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
        this.libraryScene.active = false
        // this.showLibraryScene()

        var notVirgin = cc.sys.localStorage.getItem('notVirgin');
        if (!notVirgin) {
            cc.sys.localStorage.setItem('notVirgin', 1);
            this.showGuideScene();
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

            wx.postMessage({
                message: 'Show',
                pageSize: size,
                pageType: page
            })
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
    },

    loadLibraryContents() {
        let libraryData = this.loadEvent()
        var contentNode = this.libraryScrollView.content;
        contentNode.setPosition(-0.5 * this.libraryScrollView.node.width, 0.5 * this.libraryScrollView.node.height)
        contentNode.width = this.libraryScrollView.node.width
        contentNode.height = this.libraryScrollView.node.height
        for (let i = 0; i < libraryData.length; ++ i) {
            let libraryObject = libraryData[i]
            console.log(libraryObject)
            var item = cc.instantiate(this.libraryItem);
            // item.parent = this.libraryScrollView.content;
            let marginX = this.node.width / 10
            item.width = 0.5 * (contentNode.width - marginX * 3)
            item.height = item.width / 2 * 3// 0.5 * (contentNode.height - margin * 3)
            let marginY = (contentNode.height - 2 * item.height) / 3
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
                    // if (libraryObject.progress == libraryObject.target) {
                    //     libraryObject.isUnlock = true
                    // }
                }
                libraryData[i] = libraryObject
                break
            }
        }
        this.saveEvent(libraryData)
    },

    loadEvent() {
        let data = cc.sys.localStorage.getItem('userEvent').replace(/\ufeff/g,"")
        var libraryData = null
        console.log('data:' + data)
        if (data === null || data.length === 0) {
            libraryData = [{name: "", progress: 0, target: 0, starImage: "Earth"},
            {name: "好友挑战", progress: 0, target: 1, starImage: "Venus"},
            {name: "查看群排行", progress: 0, target: 1, starImage: "Neptune"},
            {name: "历史最高", progress: 0, target: 50, starImage: "Pink"}]
            cc.sys.localStorage.setItem('userEvent', JSON.stringify(libraryData));
        } else {
            libraryData = JSON.parse(data);
        }
        //console.log("load data: " + libraryData)
        return libraryData
    },

    saveEvent(data) {
        cc.sys.localStorage.setItem('userEvent', JSON.stringify(data));
    },

    showGuideScene () {
        this.guideScene.opacity = 255;
        this.startBtn.active = false;
        this.loginFriendBtn.active = false;
    },

    checkFriendRank () {

    },

    share2Friend () {
        wx.shareAppMessage({
            title: '弹弹弹！嗖嗖嗖！好玩上瘾的游戏，推荐给你！',
            imageUrl: "res/raw-assets/resources/Share.png",
            success(res){
                console.log(res)
                cc.sys.localStorage.setItem('friendAchievement', 1);
                this.setEventCount("好友挑战")
            },
            fail(res){
                console.log(res)
            } 
        })
    },

    share2Group () {
        wx.shareAppMessage({
            title: '弹弹弹！嗖嗖嗖！好玩上瘾的游戏，推荐给你！',
            imageUrl: "res/raw-assets/resources/Share.png",
            success(res){
                console.log(res)
                cc.sys.localStorage.setItem('groupAchievement', 1);
                this.setEventCount("查看群排行")
            },
            fail(res){
                console.log(res)
            } 
        })
    },

    // Update:
    update (dt) {
        this.updateBg();

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
