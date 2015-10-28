var request = require('request');
var qs = require('querystring');
var request = require('request');
 var Models          = require('../models');


function ClubSync(opts) {
    opts = opts || {};
    this.transport = opts.transport || null;
}

ClubSync.prototype.postSync = function (options) {


  return Models.User.findOne({id: options.author}).then(function (result) {

    return post(result.get('uuid'),options);

  }, function () {
      return Promise.reject(new errors.NotFoundError('无法找到当前用户'));
  });

}


function post(uuid,options){

    var url ='http://dockerclub.net/api/v1/topics';
    var post_data = {
            //如何处理访问id
            accesstoken:uuid,
            title: options.title,
            tab: 'seminar',
            content:options.markdown
        };
     console.log(JSON.stringify(post_data));
     var method ='post';
     var  header ={
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      };
      var objects = {
        method:'POST',//这里是发送的方法
        url: url,
        headers:header,
        body: qs.stringify(post_data) //post的数据
      };
      function callback(error, response, body) {
        //console.log("response"+JSON.stringify(response));
        console.log("error"+JSON.stringify(error));
        console.log("body"+JSON.stringify(body));
      }
      request(objects, callback);
}



module.exports = new ClubSync();
