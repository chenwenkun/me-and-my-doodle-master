Page({
  data: {
    name: '', // 用户输入的名字
    message: '', // 用户输入的留言
    messages: [] // 所有的留言
  },
  onLoad: function() {
    // 获取所有的留言
    wx.cloud.database().collection('messages').get().then(res => {
      this.setData({
        messages: res.data
      });
    });
  },
  inputName: function(e) {
    this.setData({
      name: e.detail.value
    });
  },
  confirmDelete: function(event) {
    let index = event.currentTarget.dataset.index;
    let id = this.data.messages[index]._id; // 获取数据库中的ID

    wx.showModal({
      title: '确认',
      content: '确定要删除这条留言吗？',
      success: (res) => {
        if (res.confirm) {
          // 从数据库中删除留言
          wx.cloud.database().collection('messages').doc(id).remove().then(res => {
            this.data.messages.splice(index, 1);
            this.setData({
              messages: this.data.messages
            });
            wx.showToast({
              title: '删除成功'
            });
          });
        }
      }
    });
  },
  inputMessage: function(e) {
    this.setData({
      message: e.detail.value
    });
  },
  submitMessage: function() {
    const { name, message } = this.data;
    if (!name.trim() || !message.trim()) {
      wx.showToast({
        title: '名字和留言不能为空',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    // 将留言添加到数据库
    wx.cloud.database().collection('messages').add({
      data: {
        name: name,
        content: message
      },
      success: (res) => {
        wx.showToast({
          title: '提交成功'
        });

        // 将新留言添加到留言列表，并清空输入框
        this.setData({
          messages: this.data.messages.concat({ name: name, content: message }),
          name: '',
          message: ''
        });
      },
      fail: (res) => {
        wx.showToast({
          title: '提交失败，请重试',
          icon: 'none'
        });
      }
    });
  }
});
