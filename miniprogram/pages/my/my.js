getApp();

Page({
    data: {
        userInfo: {},
        mode: [ "联系客服", "意见反馈" ],
        avatarUrl:'',
        nickName:''
    },
    initInfo(){
        let avatarUrl = wx.getStorageSync('avatarUrl') || '';
        let nickName = wx.getStorageSync('nickName') || '';
        let userInfo = {
            avatarUrl:avatarUrl,
            nickName:nickName
        };
        this.setData({
            userInfo:userInfo,
        })
    },
    getUserInfo(event){
        let userInfo = event.detail.userInfo;
        console.log(userInfo);
        wx.setStorageSync('avatarUrl', userInfo.avatarUrl);
        wx.setStorageSync('nickName', userInfo.nickName);
        if (userInfo.hasOwnProperty('username')) {
          wx.setStorageSync('username', userInfo.username);
      }
        this.initInfo();
    },
    createCollections(){
        wx.showLoading({
          title: '初始化中',
        });
        let collections = ['myCost','myCostNew','myFilm','myFormList','myPeriod',
                            'mySleepClock','myType','myWish','myAnniversaryDay',
                            'myLoopImg',"myPassword"];
        let arr = [];
        for(let i = 0; i < collections.length; i++){
            arr.push(
                wx.cloud.callFunction({
                    name: 'dbCreate',
                    data:{
                        db: collections[i],
                    }
                })
            );
        }
        Promise.all(arr)
        .then(res=>{
            wx.hideLoading({});
            wx.showToast({
                title: '初始化成功',
            })
            console.log(res);
        }).catch(err=>{
            wx.hideLoading({});
            wx.showToast({
                title: '初始化失败',
            })
            console.log('err',err);
        });
    },
        // wx.cloud.database();
    onLoad: function() { 
        var s = this;
        this.initInfo();
        // wx.login({
        //     success: function() {
        //         wx.getUserInfo({
        //             success: function(e) {
        //                 s.setData({
        //                     userInfo: e.userInfo
        //                 });
        //             }
        //         });
        //     }
        // });
    }
});