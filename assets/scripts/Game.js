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
        bgOffset:0,
        normalPlanetWidth:0,
        minPlanetWidth:0,

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
            type: cc.Label
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
        failScane: {
            default: null,
            type: cc.Node
        },
        loginScane: {
            default: null,
            type: cc.Node
        },
        guideScane: {
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
        perfectBoomPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _setConstNum () {
        this.normalPlanetWidth = this.node.height / 10;
        this.minPlanetWidth = this.normalPlanetWidth * 0.8;
    },

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        // 去除重力
        cc.director.getPhysicsManager().gravity = cc.v2();
        //常数设置
        this._setConstNum();

        //UI适配
        this._updateUI();
        this.guideScane.active = false;
        
        this.singleScoreLabel.setOpacity(0);
        this.circle.setOpacity(0);

        this.restart();
    },

    restart () {
        this.failing = false;

        //clear score
        this.score = 0;
        this.combo = 0;
        this.scoreLabel.getComponent(cc.Label).string = '得分: ' + this.score;

        this.continue();
    },

    continue () {
        this.failScane.active = false;
        this.singleScore = 0;

        this.mars.active = true;

        let width = this.node.width;
        let height = this.node.height;

        //科学难度
        var holeRadius;
        if (this.score <= 20) {
            holeRadius = this.normalPlanetWidth * 2;
        } else if (this.score <= 50) {
            holeRadius = Math.random() * this.normalPlanetWidth / 2 + this.normalPlanetWidth * 1.5;
        } else if (this.score <= 100) {
            holeRadius = Math.random() * this.normalPlanetWidth / 2 + this.normalPlanetWidth;
        } else {
            holeRadius = Math.random() * this.normalPlanetWidth / 2 + this.normalPlanetWidth / 2;
        }
        this.blackHole.width = this.blackHole.height = holeRadius;
        //重置黑洞
        var holeIndex = Math.floor(Math.random() * 3) + 1;
        this.blackHole.active = false;	
        var self = this;
        cc.loader.loadRes('Goal' + holeIndex, cc.SpriteFrame, function (err, spriteFrame) {	
            self.blackHole.getComponent(cc.Sprite).spriteFrame = spriteFrame;	
            self.blackHole.active = true;	
        });
        
        this.mars.setPosition(Math.random() * width / 2 - width / 4, -height/3);
        this.earth.setPosition(Math.random() * width / 2 - width / 4, Math.random() * height / 4 - height / 8);
        this.blackHole.setPosition(Math.random() * width / 2 - width / 4, height / 3);
        
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

        var highScore = cc.sys.localStorage.getItem('highScore');
        highScore = Math.max(highScore, this.score);
        cc.sys.localStorage.setItem('highScore', highScore);

        this.highScoreLabel.getComponent(cc.Label).string = '历史最高分：' + highScore;

        this.failScane.active = true;
        
        this.audio.getComponents(cc.AudioSource)[2].play();
        //添加触摸监听
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },//

    success (gap) {
        var border = Math.max(Math.abs(this.blackHole.width / 2 - this.earth.width / 2), this.earth.width / 2);
        if (gap < border) {
            //perfect
            this.combo++;
            this.singleScore = this.combo * 2;
            this.score += this.singleScore;

            this.audio.getComponents(cc.AudioSource)[4].play();
        } else {
            this.combo = 0;
            this.singleScore = 1;
            this.score++;
            
            this.audio.getComponents(cc.AudioSource)[3].play();
        }

        //动画
        var newStar = cc.instantiate(this.perfectBoomPrefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.blackHole.position);

        //显示单次得分
        this.singleScoreLabel.position = this.earth.position;
        var scoreText = '';
        if (this.combo > 0) {
            scoreText = '完美';
        } else {
            scoreText = '命中';
        }
        scoreText += '  +' + this.singleScore;
        var bounceScore = Global.bounceCount * (this.combo + 1);
        this.score += bounceScore;
        if (bounceScore > 0) {
            scoreText += '\n反弹  +' + bounceScore;
        }
        this.singleScoreLabel.getComponent(cc.Label).string = scoreText;
        this.scoreLabel.getComponent(cc.Label).string = '得分: ' + this.score;
        var showScore = cc.sequence(cc.fadeIn(0.1), cc.fadeOut(0.8));
        this.singleScoreLabel.runAction(showScore);

        //suck 吸入
        var finished = cc.callFunc(function () {
            this.earth.scale = 1;
            this.earth.getComponent(cc.RigidBody).angularVelocity = 0;
            this.continue();
        }, this);
        var spawn = cc.sequence(cc.spawn(cc.moveTo(0.2,this.blackHole.position), cc.scaleTo(0.2, 0)), finished);
        this.earth.getComponent(cc.RigidBody).angularVelocity = 2000;
        this.earth.runAction(spawn);
    },

    // Touch Event:
    onTouchBegan (event) {
        if (this.loginScane.active) {
            return;
        }

        if (this.guideScane.active) {
            var self = this;
            var finished = cc.callFunc(function () {
                self.guideScane.active = false;
            }, this, 0);
            var fadeAction = cc.sequence(cc.fadeOut(0.2), finished);
            this.guideScane.runAction(fadeAction); 

            event.stopPropagation();
            return;
        }

        if (this.marsBegan || !this.mars.active) return;

        this.touchTime = new Date();
        this.audio.getComponents(cc.AudioSource)[1].play();

        this.touchBagan = true;
        //展示圆圈
        this.circle.setOpacity(this.circleOpacity);
        this.onTouchMove(event);
    },

    onTouchMove (event) {
        this.circle.setPosition(this.node.convertToNodeSpaceAR(cc.v2(event.touch.getLocation())));
    },

    onTouchEnd (event) {
        if (this.marsBegan || !this.mars.active) return;

        this.audio.getComponents(cc.AudioSource)[1].stop();

        //时间毫秒差
        var diffTime = (new Date().getTime() - this.touchTime.getTime());
        diffTime = Math.min(diffTime, 3000);//最大3秒
        diffTime = Math.max(diffTime, 500);//最小1秒

        let rigidBody = this.mars.getComponent(cc.RigidBody);
        let center = rigidBody.getWorldCenter();
        //计算方向向量
        var vel = cc.v2(event.touch.getLocation()).sub(center).normalizeSelf();
        //乘以质量和最大初速度
        vel = vel.mulSelf(rigidBody.getMass() * 7500);
        //根据时间差调整力度
        vel = vel.mulSelf(diffTime).divSelf(3000);
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
        this.loginScane.active = false;

        var notVirgin = cc.sys.localStorage.getItem('notVirgin');
        if (!notVirgin) {
            cc.sys.localStorage.setItem('notVirgin', 1);
            this.guideScane.active = true;
        }
    },

    // Update:
    update (dt) {
        this.updateBg();

        //失败界面只更新背景图
        if (this.failing) {
            return;
        }

        //模拟黑洞引力
        //this.updateForce();

        //蓄力缩小
        if (this.touchBagan) {
            if (this.mars.width > this.minPlanetWidth) {
                this.mars.width -= 0.3;
                this.mars.height -= 0.3;
            }
            
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
            if (Math.abs(marsVel.x) <= 0.5 && Math.abs(marsVel.y) <= 0.5) {
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

                wx.vibrateShort();
            }

            let vel = this.earth.getComponent(cc.RigidBody).linearVelocity;
            //cc.log(vel);
            if (Math.abs(vel.x) <= 0.5 && Math.abs(vel.y) <= 0.5) {
                //运动停止
                this.earth.onContact = false;
                cc.log('stop');
                //do sth ..
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

    updateForce () {
        let marsBody = this.mars.getComponent(cc.RigidBody);
        let earthBody = this.earth.getComponent(cc.RigidBody);
        let holePosition = this.blackHole.getComponent(cc.RigidBody).getWorldCenter();

        var force = holePosition.subSelf(marsBody.getWorldCenter()).normalizeSelf().mulSelf(this.gravityForce * marsBody.getMass());
        marsBody.applyForceToCenter(force);
        force = holePosition.subSelf(earthBody.getWorldCenter()).normalizeSelf().mulSelf(this.gravityForce * earthBody.getMass());
        earthBody.applyForceToCenter(force);
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
        this._setViewFullScreen(this.loginScane);
        this._setViewFullScreen(this.guideScane);
        this._setViewFullScreen(this.failScane);

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
