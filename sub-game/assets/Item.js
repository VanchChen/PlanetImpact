cc.Class({
    extends: cc.Component,

    properties: {
        rankLbl: {
            default: null,
            type: cc.Label
        },
        nameLbl: {
            default: null,
            type: cc.Label
        },
        scoreLbl: {
            default: null,
            type: cc.Label
        },
        avatarImgView: cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('touched', function() {
            console.log('Item ' + this.itemID + ' clicked');
        }, this);
    },

    updateItem: function(rank, name, score, avatarUrl) {
        this.rankLbl.string = rank;
        this.nameLbl.string = name;
        this.scoreLbl.string = score;
        // this.avatarImgView. = rank;
        this.createImage(avatarUrl)
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