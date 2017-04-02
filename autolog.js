let request = require("superagent"),
    cheerio = require('cheerio'),
    studentId = 716901010033,
    autoCourseids = [2704, 856, 958, 1172, 2457, 2466]; 
    //2704 大学英语 856  离散数学 958  英语听力 1172 操作系统 2457 计算机组成与系统结构 2466 马克思主义基本原理 

require('superagent-proxy')(request);

var proxy = 'http://127.0.0.1:8888';

if (process.env.NODE_ENV === 'log') {
    autoCourseids.forEach((courseid)=> {
        request
            .get('http://www.onlinesjtu.com/SCEPlayer/Default.aspx')
            .query({ 
                studentid: studentId, 
                courseid: courseid,
                termidentify: "2017_1"
                })
            .end(function(err, res){
                    let html = res.res.text,
                        $ = cheerio.load(html),
                        lessons = $('.section-list ul li>a');
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
    });
} else if (process.env.NODE_ENV === 'evaluate') {
    console.log("评价服务器运行极度缓慢，评价中，请等候...")
    autoCourseids.forEach((courseid)=> {
        request
            .get('http://www.onlinesjtu.com/learningspace/learning/student/kaoqinquery/kaoqin_list.asp')
            .query({ 
                courseid: courseid,
                term_identify: "2017_1"
                })
            .end(function(err, res){
                let html = res.res.text,
                    $ = cheerio.load(html),
                    ct = $("table").next().find("tbody tr").children().eq(1).text();
                request
                    .get('http://218.1.73.12/PingJia/Default.aspx')
                    .query({ 
                        sid: studentId, 
                        cid: courseid,
                        term: "2017_1",
                        ct
                    })
                    .end(function(err, res){
                        let html = res.res.text,
                            $ = cheerio.load(html),
                            ET = $("#__EVENTVALIDATION").val(),
                            VS = $("#__VIEWSTATE").val(),
                            VSG = $("#__VIEWSTATEGENERATOR").val()

                        request
                            .post('http://218.1.73.12/PingJia/Default.aspx')
                            .query({ 
                                sid: studentId, 
                                cid: courseid,
                                term: "2017_1",
                                ct
                            })
                            .proxy(proxy)
                            .set('Content-Type', 'application/x-www-form-urlencoded')
                            .set('Referer', 'http://218.1.73.12/PingJia/Default.aspx?sid='+ studentId +'&cid='+ courseid +'&ct='+ ct +'&term=2017_1')
                            .send({
                                __EVENTVALIDATION: ET,
                                __VIEWSTATE: VS,
                                __VIEWSTATEGENERATOR: VSG,
                                __VIEWSTATEENCRYPTED: "",
                                btsubmit: "提交评价",
                                ddlcourse: courseid,
                                ddlcoursetime: ct + " 0:00:00",
                                gvquestion$ctl02$hfid:1,
                                gvquestion$ctl02$rblscore:5,
                                gvquestion$ctl03$hfid:2,
                                gvquestion$ctl03$rblscore:5,
                                gvquestion$ctl04$hfid:3,
                                gvquestion$ctl04$rblscore:5,
                                gvquestion$ctl05$hfid:4,
                                gvquestion$ctl05$rblscore:5,
                                gvquestion$ctl06$hfid:5,
                                gvquestion$ctl06$rblscore:5,
                                rblcomment:1,
                                tbcomment:""
                            })
                            .end(function(err, res){
                                console.log(courseid + ": 评价成功");
                            });
                    }); 
            });
        

    });

} else {
    console.log("请运行npm run log 或 evaluate");
}

