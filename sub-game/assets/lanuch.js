
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node
    },

    start () {
        wx.onMessage(data => {
            console.log(data);
            switch (data.message) {
                case 'Show':
                    this._show();
                    this.fetchFriendData();
                    console.log("show");
                    break;
                case 'Submit':
                    var highScore = data.score;
                    this.submitScore(highScore);
                    break;
            }
        });
    },

    _show () {
        let moveTo = cc.moveTo(0.5, 0, 73);
        this.display.runAction(moveTo);
    },

    _hide () {
        let moveTo = cc.moveTo(0.5, 0, 1000);
        this.display.runAction(moveTo);
    },

    fetchFriendData()
    {
        //取出所有好友数据
        wx.getFriendCloudStorage({
            keyList:[
                "HighScore",
            ],
            success:res => {
                console.log("wx.getFriendCloudStorage success", res);
            },
            fail:res => {
                console.log("wx.getFriendCloudStorage fail", res);
            },
        });
    },
    submitScore(score) { //提交得分
        wx.setUserCloudStorage({
            KVDataList: [{key: "HighScore", value: "" + score}],
            success: function (res) {
                console.log('setUserCloudStorage', 'success', res)
            },
            fail: function (res) {
                console.log('setUserCloudStorage', 'fail')
            },
            complete: function (res) {
                console.log('setUserCloudStorage', 'ok')
            }
        });
    },
});
