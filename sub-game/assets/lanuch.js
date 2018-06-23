
cc.Class({
    extends: cc.Component,

    properties: {
        display: cc.Node,
        itemTemplate0: {
            default: null,
            type: cc.Node
        },
        itemTemplate1: {
            default: null,
            type: cc.Node
        },
        backView: {
            default: null,
            type: cc.Node
        },
    },

    start () {
        this.index = 0
        this.pageType = 'start'
        wx.onMessage(data => {
            console.log(data);
            switch (data.message) {
                case 'Show':
                    this.pageSize = data.pageSize
                    this.pageType = data.pageType
                    this.totalHeight = data.totalHeight
                    this.totalWidth = data.totalWidth
                    this.fetchFriendData();
                    console.log("show");
                    break;
                case 'Submit':
                    var highScore = data.score;
                    this.submitScore(highScore);
                    break;
            }
        });
        // this.fetchFriendData()
    },

    _show () {
        
        // this.dataArray = [234,4324,234,234,4423,123,5634,75,3,23,2325,543,346547,789,234,8978,134,8769,32];
        // this.dataArray.sort((a, b) => {
        //     return b - a
        // })
        this.dataArray.sort((a, b) => {
            if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                return 0;
            }
            if (a.KVDataList.length == 0) {
                return 1;
            }
            if (b.KVDataList.length == 0) {
                return -1;
            }
            return b.KVDataList[0].value - a.KVDataList[0].value;
        });

        if (this.pageType == 'start') {
            this.pageIndex = 0
        } else if (this.pageType == 'later') {
            var index = this.pageIndex + 1
            console.log((index * this.pageSize) + ' and ' + this.dataArray.length)
            if ((index * this.pageSize) >= this.dataArray.length) {
                index = Math.floor(this.dataArray.length / this.pageSize)
                console.log(index)
            }
            this.pageIndex = index
        } else if (this.pageType == 'former') {
            var index = this.pageIndex - 1
            if (index < 0) {
                index = 0
            }
            this.pageIndex = index
        }
        this.configureContent();
    },

    // _hide () {
    //     let moveTo = cc.moveTo(0.5, 0, 1000);
    //     this.display.runAction(moveTo);
    // },

    configureContent: function () {

        // let children = this.backView.getChildren()
        // while (children.length > 0) {
        //     console.log('==================================')
        //     children[0].removeFromParent(true)
        //     console.log('remove ' + i)
        // }
        this.backView.removeAllChildren()
        console.log(this.backView.getChildren())
        console.log('page: ' + this.pageIndex)
        console.log('size: ' + this.pageSize)
        for (let i = this.pageIndex * this.pageSize, j = 0; i < (this.pageIndex + 1) * this.pageSize; ++ i, ++ j) {
            if (i >= this.dataArray.length) {
                return
            }
            let data = this.dataArray[i]
            var item
            if (j % 2 == 0) {
                item = cc.instantiate(this.itemTemplate0);
            } else {
                item = cc.instantiate(this.itemTemplate1);
            }
            this.backView.addChild(item);
            item.width = this.totalWidth
            item.height = this.totalHeight / this.pageSize
            console.log(this.totalHeight)
            console.log(item.height)
    		item.setPosition(0, ((0.5 * this.pageSize - j) - 0.5) * item.height);
            item.getComponent('Item').updateItem(i + 1, data.nickname, data.KVDataList[0].value, data.avatarUrl);
            console.log('---------------------------------')
            console.log(data)
            console.log('add ' + j + ', ' + i)
    	}
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
                this.dataArray = res.data
                this._show();
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
    // update: function(dt) {
    //     this.updateTimer += dt;
    //     if (this.updateTimer < this.updateInterval) {
    //         return; // we don't need to do the math every frame
    //     }
    //     this.updateTimer = 0;
    //     let items = this.items;
    //     // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
    //     let isDown = this.scrollView.content.y < this.lastContentPosY;
    //     // 实际创建项占了多高（即它们的高度累加）
    //     let offset = this.itemTemplate.height * items.length;
    //     let newY = 0;

    //     // 遍历数组，更新item的位置和显示
    //     for (let i = 0; i < items.length; ++i) {
    //         let viewPos = this.getPositionInView(items[i]);
    //         if (isDown) {
    //             // 提前计算出该item的新的y坐标
    //             newY = items[i].y + offset;
    //             // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
    //             // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
    //             if (viewPos.y < -this.bufferZone && newY < 0) {
    //                 items[i].setPositionY(newY);
    //                 let item = items[i].getComponent('Item');
    //                 let itemId = item.itemID - items.length; // update item id
    //                 item.updateItem(i, itemId);
    //             }
    //         } else {
    //             // 提前计算出该item的新的y坐标
    //             newY = items[i].y - offset;
    //             // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
    //             // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
    //             if (viewPos.y > this.bufferZone && newY > -this.content.height) {
    //                 items[i].setPositionY(newY);
    //                 let item = items[i].getComponent('Item');
    //                 let itemId = item.itemID + items.length;
    //                 item.updateItem(i, itemId);
    //             }
    //         }
    //     }

    //     // // 更新lastContentPosY和总项数显示
    //     // this.lastContentPosY = this.scrollView.content.y;
    //     // this.lblTotalItems.string = "Total Items: " + this.totalCount;
    // },
});
