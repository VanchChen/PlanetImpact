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
        aimLine: {
            default: null,
            type: cc.Node
        },
        earth: {
            default: null,
            type: cc.Node
        },
    },

    appear () {
        this.node.active = true;
    },

    disappear () {
        this.node.active = false;
        this.aimLine.active = false;
    },

    onBeginContact (contact, selfCollider, otherCollider) {
        console.log("Sentinel Touch!");

        this.earth.onContact = false;

        this.aimLine.active = true;
        var earthPosition = this.earth.position;
        var thisPosition = this.node.position;
        this.aimLine.setPosition(earthPosition);
        console.log(earthPosition, thisPosition);
        this.aimLine.rotation = Math.atan((earthPosition.x - thisPosition.x) / (earthPosition.y - thisPosition.y)) / Math.PI * 180;
        console.log(this.aimLine.rotation);
    }
});
