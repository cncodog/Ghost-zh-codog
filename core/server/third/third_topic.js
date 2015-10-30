
/*  第三方论坛集成
    */

var Models          = require('../models');
var rp = require('request-promise');
var qs = require('querystring');
var  moment = require("moment");
var ADD_TOPIC_URL = 'http://dockerclub.net/api/v1/topics';
var DEL_TOPIC_URL ='http://dockerclub.net/api/v1/topic/de_collect';

function ThirdTopics () {
}


ThirdTopics.prototype.addTopic = function (post,uid) {

  return Models.User.findOne({id: uid}).then(function (result) {
      console.log('result' + JSON.stringify(result));
      console.log('result' + JSON.stringify(post));
        //用户信息
        var actor = result.get('name');//作者
        var email = result.get('email');//邮箱
        var uuid  = result.get('uuid');
        //post信息
        var title = post.get('title');
        var markdown = post.get('markdown');
        var slug = post.get('slug');
        var createtime =moment(post.get('created_at')).format("YYYY/MM/DD HH:mm:ss");
        //var pl_time =moment(post.get('created_at'), "MM/DD/YYYY");
        var pl_time  = moment(post.get('created_at')).format("YYYY/MM/DD");
        var link_url = pl_time  +  '/' + slug;
        //var now = moment();


        var head_html = '** 作者: '+ actor + '发布了[《' +title+'》](http://blog.dockerclub.net/'+link_url+') '
                        +'发布时间:'+ createtime + "**</p>" + markdown;


      //  var head_markdown = '**来自xxx的博客，访问原始链接请查看** [内容](链接)';
        //定义数据
        var options = {
          method: 'POST',
          uri: ADD_TOPIC_URL,
          form: {
            accesstoken:uuid,
            title: title,
            tab: 'seminar',
            content:head_html

          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
        return rp(options)
          .then(function (body) {
              console.log('同步失败' + body);
              return eval('(' + body + ')');
          })
          .catch(function (err) {
              console.log('同步失败' + err);
              return eval('{success:false}');

        });
  }, function () {
      return Promise.reject(new errors.NotFoundError('无法找到当前用户'));
  });

}



/**
ThirdTopics.prototype.delTopic = function(postid,uid){


  return Models.User.findOne({id: uid}).then(function (result) {
        //定义数据
        var _options = {
          method: 'POST',
          uri: DEL_TOPIC_URL,
          form: {
            accesstoken:result.get('uuid'),
            topic_id:postid
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        };
        return rp(_options)
          .then(function (body) {
              console.log('同步失败' + body);
              return eval('(' + body + ')');
          })
          .catch(function (err) {
          //  return eval('(' + 'success:false,topic_id:'+ ')');
          console.log('同步失败' + err);
        });
  }, function () {
      return Promise.reject(new errors.NotFoundError('无法找到当前用户'));
  });

}**/


module.exports = new  ThirdTopics();
