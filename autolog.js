let request = require("superagent"),
    cheerio = require('cheerio'),
    studentId = 716901010033,
    autoCourseid = 2704; 
    //2704 大学英语（二）
    //856  离散数学 
    //958  英语听力 
    //1172 操作系统 
    //2457 计算机组成与系统结构 
    //2466 马克思主义基本原理 
request
  .get('http://www.onlinesjtu.com/SCEPlayer/Default.aspx')
  .query({ 
      studentid: studentId, 
      courseid: autoCourseid,
      termidentify: "2017_1"
    })
   .end(function(err, res){
        let html = res.res.text;
        let $ = cheerio.load(html);
        let lessons = $('.section-list ul li>a');
        lessons.each(function(index, item){
            let lession_id = item.attribs["data-id"]
                request
                    .post('http://www.onlinesjtu.com/SCEPlayer/Default.aspx/AddDacLog')
                    .set('Content-Type', 'application/json')
                    .send({ resourceId: lession_id, studentId })
                    .end(function(err, res){
                        console.log("考勤成功：" + res.res.text);
                    });            
        });
  });

//http://www.onlinesjtu.com/learningspace/learning/student/kaoqinquery/kaoqin_list.asp?courseid=856&term_identify=2017_1
//http://218.1.73.12/PingJia/Default.aspx?sid=716901010033&cid=2704&ct=2017-3-26&term=2017_1
// btsubmit:提交评价
// ddlcourse:2704
// ddlcoursetime:2017-3-26 0:00:00
// gvquestion$ctl02$hfid:1
// gvquestion$ctl02$rblscore:5
// gvquestion$ctl03$hfid:2
// gvquestion$ctl03$rblscore:5
// gvquestion$ctl04$hfid:3
// gvquestion$ctl04$rblscore:5
// gvquestion$ctl05$hfid:4
// gvquestion$ctl05$rblscore:5
// gvquestion$ctl06$hfid:5
// gvquestion$ctl06$rblscore:5
// rblcomment:1
// tbcomment: