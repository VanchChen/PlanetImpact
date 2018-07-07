cc.Class({
    extends: cc.Component,

    properties: {
        nameLbl: {
            default: null,
            type: cc.Label
        },
        countLbl: {
            default: null,
            type: cc.Label
        },
        coverView: {
            default: null,
            type: cc.Node
        },
        labelView: {
            default: null,
            type: cc.Node
        },
        starImgView: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('touched', function() {
            console.log('Item ' + this.itemID + ' clicked');
        }, this);
    },

    updateItem: function(name, progress, starUrl, isUnlock) {
        this.nameLbl.string = name;
        this.countLbl.string = progress;
        this.labelView.active = !isUnlock
        this.coverView.active = !isUnlock
        var self = this;
        cc.loader.loadRes(starUrl, cc.SpriteFrame, function (err, spriteFrame) {	
            self.starImgView.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        // this.avatarImgView. = rank;
        // this.createImage(avatarUrl)
    },

    createImage(avatarUrl) {
        if (CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.avatarImgView.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                        this.avatarImgView.node.active = false;
                    }
                };
                image.src = avatarUrl;
            }catch (e) {
                cc.log(e);
                this.avatarImgView.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                this.avatarImgView.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
