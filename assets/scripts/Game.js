// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
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
        failUI: {
            default: null,
            type: cc.Node
        },
        audio: {
            default: null,
            type: cc.Node
        },
        hitAudio: {
            default: null,
            url: cc.AudioClip,
        },
        holdAudio: {
            default: null,
            url: cc.AudioClip,
        },
        failAudio: {
            default: null,
            url: cc.AudioClip,
        },
        successNormalAudio: {
            default: null,
            url: cc.AudioClip,
        },
        successPerfectAudio: {
            default: null,
            url: cc.AudioClip,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        // 去除重力
        cc.director.getPhysicsManager().gravity = cc.v2();

        //适配墙壁
        let width = this.node.width;
        let height = this.node.height;
        let wallColliders = this.wall.getComponents(cc.PhysicsBoxCollider);
        if (wallColliders.length >= 4) {
            //上左下右
            this._setBound(wallColliders[0],0,height/2,width,20);
            this._setBound(wallColliders[1],-width/2,0,20,height);
            this._setBound(wallColliders[2],0,-height/2,width,20);
            this._setBound(wallColliders[3],width/2,0,20,height);
        }
        
        this.singleScoreLabel.setOpacity(0);

        this.restart();
    },

    restart () {
        //clear score
        this.score = 0;
        this.singleScore = 0;
        this.combo = 0;
        this.scoreLabel.getComponent(cc.Label).string = '得分: ' + this.score;
        this.failUI.active = false;
        this.blackHole.height = this.blackHole.width = 200;
        this.hardControl = 170;

        this.mars.active = true;

        let width = this.node.width;
        let height = this.node.height;
        
        this.mars.setPosition(Math.random() * width / 2 - width / 4, -height/3);
        this.earth.setPosition(Math.random() * width / 2 - width / 4, Math.random() * height / 4 - height / 8);
        this.blackHole.setPosition(Math.random() * width / 2 - width / 4, height / 3);

        //添加触摸监听
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    continue () {
        this.failUI.active = false;
        this.singleScore = 0;

        this.mars.active = true;

        let width = this.node.width;
        let height = this.node.height;

        //地狱难度
        this.hardControl -= 3;
        this.blackHole.width = this.blackHole.height = this.hardControl + Math.random() * this.hardControl * 0.3;
        
        this.mars.setPosition(Math.random() * width / 2 - width / 4, -height/3);
        this.earth.setPosition(Math.random() * width / 2 - width / 4, Math.random() * height / 4 - height / 8);
        this.blackHole.setPosition(Math.random() * width / 2 - width / 4, height / 3);

        //添加触摸监听
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    onTouchBegan (event) {
        if (this.marsBegan || !this.mars.active) return;

        this.touchTime = new Date();
        //this.audio.getComponents(cc.AudioSource)[1].stop();
        this.audio.getComponents(cc.AudioSource)[1].play();

        this.touchBagan = true;
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
        this.mars.width = 80;
        this.mars.height = 80;
    },

    _setBound (node,x, y, width, height) {
        node.offset.x = x;
        node.offset.y = y;
        node.size.width = width;
        node.size.height = height;
    },

    fail () {
        this.failScoreLabel.getComponent(cc.Label).string = this.score;

        var highScore = cc.sys.localStorage.getItem('highScore');
        highScore = Math.max(highScore, this.score);
        cc.sys.localStorage.setItem('highScore', highScore);

        this.highScoreLabel.getComponent(cc.Label).string = '历史最高分：' + highScore;

        this.failUI.active = true;
        
        //this.audio.getComponents(cc.AudioSource)[2].stop();
        this.audio.getComponents(cc.AudioSource)[2].play();
        //添加触摸监听
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },

    success (gap) {
        if (gap < Math.abs(this.blackHole.width / 2 - this.earth.width / 2)) {
            //perfect
            this.combo++;
            this.singleScore = this.combo * 2;
            this.score += this.singleScore;
            
            //this.audio.getComponents(cc.AudioSource)[4].stop();
            this.audio.getComponents(cc.AudioSource)[4].play();
        } else {
            this.combo = 0;
            this.singleScore = 1;
            this.score++;
            
            //this.audio.getComponents(cc.AudioSource)[3].stop();
            this.audio.getComponents(cc.AudioSource)[3].play();
        }

        this.scoreLabel.getComponent(cc.Label).string = '得分: ' + this.score;

        //显示单次得分
        this.singleScoreLabel.position = this.earth.position;
        this.singleScoreLabel.getComponent(cc.Label).string = '+' + this.singleScore;
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

    update (dt) {
        this.updateBg();

        if (this.touchBagan) {
            if (this.mars.width > 60) {
                this.mars.width -= 0.3;
                this.mars.height -= 0.3;
            }
            
            return;
        }

        if (this.marsBegan && !this.earth.onContact) {
            let marsVel = this.mars.getComponent(cc.RigidBody).linearVelocity;
            if (Math.abs(marsVel.x) <= 0.5 && Math.abs(marsVel.y) <= 0.5) {
                //运动停止
                this.marsBegan = false;
                this.fail();
                
                return;
            }
        }

        if (this.earth.onContact) {
            if (this.mars.active) {
                this.mars.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
                this.mars.active = false;
                this.marsBegan = false;
                //this.audio.getComponents(cc.AudioSource)[0].stop();
                //cc.log(this.audio.getComponents(cc.AudioSource)[0].getCurrentTime());
                this.audio.getComponents(cc.AudioSource)[0].play();
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
        
        if (this.bg2.position.y >= 0) {
            //back
            this.bg1.setPosition(-160, 0);
            this.bg2.setPosition(-160, -height);
            this.bg3.setPosition(-160 - height, 0);
            this.bg4.setPosition(-160 - height, -height);
        }
    }
});