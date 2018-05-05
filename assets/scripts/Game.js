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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
        // 去除重力
        cc.director.getPhysicsManager().gravity = cc.v2();

        this.score = 0;

        //添加触摸监听
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

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
    },

    onTouchBegan (event) {
        this.touchTime = new Date();
    },

    onTouchEnd (event) {
        //时间毫秒差
        var diffTime = (new Date().getTime() - this.touchTime.getTime());
        diffTime = Math.min(diffTime, 3000);//最大3秒
        diffTime = Math.max(diffTime, 1000);//最小1秒

        let rigidBody = this.mars.getComponent(cc.RigidBody);
        let center = rigidBody.getWorldCenter();
        //计算方向向量
        var vel = cc.v2(event.touch.getLocation()).sub(center).normalizeSelf();
        //乘以质量和最大初速度
        vel = vel.mulSelf(rigidBody.getMass() * 5000);
        //根据时间差调整力度
        vel = vel.mulSelf(diffTime).divSelf(3000);
        //实施动量
        rigidBody.applyLinearImpulse(vel,rigidBody.getWorldCenter(),true);
    },

    _setBound (node,x, y, width, height) {
        node.offset.x = x;
        node.offset.y = y;
        node.size.width = width;
        node.size.height = height;
    },

    start () {

    },

    update (dt) {

    },
});
