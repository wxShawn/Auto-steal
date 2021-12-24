let Ats = {
  //Login token
  token: '',
  //Ajax
  ajax: function(options, res) {
    let xhr = new XMLHttpRequest();
    xhr.open(options.type, options.url);
    xhr.setRequestHeader('token', this.token);
    xhr.send();
    xhr.onload = function() {
        res(xhr.responseText);
    }
  },

  //偷取，id:土地id
  steal: function(id) {
    this.ajax({
      type: 'post',
      url: `https://gas.mtvs.tv/api/app/record/factory/steal?memberFactoryId=${id}`,
    }, (res) => {
      res = JSON.parse(res);
      if (res && res.code == 200){
        let temData = Math.floor(res.data * 100) / 100;
        console.log(`你成功盗取了${temData}个果实`);
      } else {
        console.log(res.msg);
      }
    })
  },

  //根据ID查询岛屿并偷取，id:岛主id
  start: function(id) {
    this.ajax({
      type: 'get',
      url: `https://gas.mtvs.tv/api/app/member/factory?memberId=${id}`,
    }, (res) => {
      if (JSON.parse(res).msg == "NO LOGIN") {
        console.log('Token has expired!');
        return;
      }
      let data = JSON.parse(res).data;
      if (data) {
        if (data.length == 0) {
          console.log('Island is empty');
        } else {
          for (let j = 0; j < data.length; j++) {
            if ((data[j].stolenNum && data[j].stolenNum != 0) || (data[j].status && data[j].status == 'pick')) {
              console.log(`${data[j].memberId}号岛屿有果实成熟。`);
              this.steal(data[j].id);
            } else {
              console.log('果实未成熟或无法偷取。')
            }
          }
        }
      } else {
        console.log('Island is not found!');
      }
    });
  },

  //使用自定义ID，num1:起始数, num2:终止数
  startByCustomId: function(num1, num2) {
    for (let id = num1; id <= num2; id++) {
      this.start(id);
    }
  },

  //使用好友列表ID，num:好友数量
  startByUsersId: function(num) {
    this.ajax({
      url: `https://gas.mtvs.tv/api/app/member/friend?size=${num}&page=0`,
      type: 'get',
    }, (res) => {
      res = JSON.parse(res).data.content;
      for (let i = 0; i < res.length; i++) {
        let id = res[i].id;
        this.start(id);
      }
    });
  },
}