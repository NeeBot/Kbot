function reload(r) {
    if(r.room == "시립대 봇제작방" || r.room == "조우영"){
        if(r.sender == "조우영" || r.sender == "Nee"){
            reloadcheck = 1;
            var Timer = new Date();
            file = "storage/emulated/0/kbot/response.js";
            checksum = org.jsoup.Jsoup.connect("https://github.com/NeeBot/Kbot/commits/master").get().select("div.repository-content>a").attr("href").split('commit/')[1];
            conn = new java.net.URL("https://raw.githubusercontent.com/NeeBot/Kbot/"+checksum+"/response.js").openConnection();
            br = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream()));
            str = "";
            tmp = null;
            while ((tmp = br.readLine()) != null) {
                str += tmp + "\n";
            }
            var filedir = new java.io.File(file);
            var bw = new java.io.BufferedWriter(new java.io.FileWriter(filedir));
            bw.write(str.toString());
            bw.close();
            var time = (new Date() - Timer) / 1000;
            r.replier.reply("파일저장 완료 / " + time + "s\n" + new Date() );
            Api.reload();
            var time = (new Date() - Timer) / 1000;
            reloadcheck = 0;
            r.replier.reply("reloading 완료 / " + time + "s\n" + new Date());
        }
    }
}

var D = require("DBManager.js")("D");              //DB

function response(room, msg, sender, isGroupChat, replier, imageDB) {


    var r = {replier: replier, m: msg, msg: msg, s: sender, sender: sender, r: room, room: room, g: isGroupChat, i: imageDB, imageDB:imageDB,
        reply: function (str) {
            this.replier.reply(new String(str));
        }
    };

    if (room == "조우영" || room =="시립대 봇제작방") {
        if(sender == "조우영" || sender == "Nee"){
            if (msg.indexOf("$$") == 0){
                try {
                    replier.reply(eval(msg.substring(2)));
                    return;
                } catch (e) { replier.reply(e + "\n" + e.stack); }
            }
        }
        
        if (r.msg == "$로딩"){                  //리로딩
            reload(r);
        }

    }
    
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var date = today.getDay();
    var YYYYMMDD = year + month + date;
    
    if(msg == "$시간"){
    	r.replier.reply(YYYYMMDD); 
    }


    if (room == "조우영" || room == "킹익들" || room == "98+군인" || room == "시립대 봇제작방" || room == "김정빈") {

        var YEAR = Date().split(' ')[3];
        var MONTH = Date().replace('Jan', '01').replace('Feb', '02').replace('Mar', '03').replace('Apr', '04').replace('May', '05').replace('June', '06').replace('Jul', '07').replace('Aug', '08').replace('Sept', '05').replace('Oct', '05').replace('Nov', '05').replace('Dec', '05').split(' ')[1]; 
        var DATE = Date().split(' ')[2];
        
        if (msg == "$시간"){
            replier.reply(YEAR+MONTH+DATE);
        }
        if (msg.indexOf("$기능") == 0) {
            if(msg == "$기능"){
                replier.reply("$실검 / $날씨\n\n자세한 기능을 알고싶으면\n'$기능 [기능명]'을 입력하세요");
            }
            else if(msg.split(" ")[1] == "실검"){
                replier.reply("사용방법 : '$실검'을 입력하세요.");
            }
            else if(msg.split(" ")[1] == "날씨"){
                replier.reply("사용방법 :\n$날씨 [지역명](시나 군, 동 단위)\n으로 입력하세요");
            }
        }

        if (msg == "$실검") {                                                                                                                                                                                                               //네이버 실시간 검색어 가져오기
            var when = Utils.getWebText("https://www.naver.com/").split("<ul class=\"ah_l\" style=\"display:none;\" data-list=\"11to20\">")[1].split("<div style=\"position:relative;width:1080px;margin:0 auto;z-index:11\">")[0].replace(/(<([^>]+)>)/g, "").split("데이터랩 그래프 보기")[10].split("도움말")[0].trim("\n");
            var html = Utils.getWebText("https://www.naver.com/").split("<h3 class=\"blind\">급상승 검색어 검색어</h3>")[1].split("</ul>")[0].replace(/(<([^>]+)>)/g, "").trim().split("\n");                                               //웹 파싱 - 네이버 홈페이지
            for (var i = 0; i <= html.length - 1; i++) {
                html[i] = html[i].trim()
            }
            replier.reply("네이버 실시간 검색어\n" + when + "\n" + html.join("\n"));                                                                                                                        //실검 답장
        }

        if(msg.indexOf("$날씨") == 0){

            var wl1 = msg.replace("$날씨 ", "").length;
            // var wl2 = msg.replace("$날씨 ", "").split("도 ")[1].length;

            if(msg.split(" ")[1].lastIndexOf("시") == wl1 - 1 && msg.split(" ")[1].length <= 4) {                                     //$날씨 xx시
                var weatherU1 = Utils.getWebText("https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + msg.replace("$날씨 ", "").substr(0, wl1 - 1) + "날씨").split("<div class=\"api_title_area blind\">")[1].split("<div class=\"weather_box\">")[0].replace(/(<([^>]+)>)/g, "").trim("\n");
                var weatherU2 = Utils.getWebText("https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + msg.replace("$날씨 ", "").substr(0, wl1 - 1) + "날씨").split("<div class=\"info_data\">")[1].split("<div class=\"table_info bytime _todayWeatherByTime\"> ")[0].replace(/(<([^>]+)>)/g, "").split("\n").filter(v=>!(/^\s*$/.test(v))).map(v=>v.trim()).join("\n").replace("도씨", "");
                replier.reply(weatherU1 + "\n" + weatherU2);
            }
            else if(msg.split(" ")[1].lastIndexOf("군") == 2) {                                //$날씨 xx군
                var weatherU1 = Utils.getWebText("https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + msg.replace("$날씨 ", "").substr(0, wl1 - 1) + "날씨").split("<div class=\"api_title_area blind\">")[1].split("<div class=\"weather_box\">")[0].replace(/(<([^>]+)>)/g, "").trim("\n");
                var weatherU2 = Utils.getWebText("https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + msg.replace("$날씨 ", "").substr(0, wl1 - 1) + "날씨").split("<div class=\"info_data\">")[1].split("<div class=\"table_info bytime _todayWeatherByTime\"> ")[0].replace(/(<([^>]+)>)/g, "").split("\n").filter(v=>!(/^\s*$/.test(v))).map(v=>v.trim()).join("\n").replace("도씨", "");
                replier.reply(weatherU1 + "\n" + weatherU2);
            }
            else if(msg.split(" ")[1].indexOf("광역시") == 2) {                                //$날씨 xx광역시
                var weatherU1 = Utils.getWebText("https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + msg.replace("$날씨 ", "").replace("광역", "") + "날씨").split("<div class=\"api_title_area blind\">")[1].split("<div class=\"weather_box\">")[0].replace(/(<([^>]+)>)/g, "").trim("\n");
                var weatherU2 = Utils.getWebText("https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + msg.replace("$날씨 ", "").replace("광역", "") + "날씨").split("<div class=\"info_data\">")[1].split("<div class=\"table_info bytime _todayWeatherByTime\"> ")[0].replace(/(<([^>]+)>)/g, "").split("\n").filter(v=>!(/^\s*$/.test(v))).map(v=>v.trim()).join("\n").replace("도씨", "");
                replier.reply(weatherU1 + "\n" + weatherU2);
            }
            else if(msg.split(" ")[1].indexOf("특별시") == 2) {                                //$날씨 xx특별시
                var weatherU1 = Utils.getWebText("https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + msg.replace("$날씨 ", "").replace("특별", "") + "날씨").split("<div class=\"api_title_area blind\">")[1].split("<div class=\"weather_box\">")[0].replace(/(<([^>]+)>)/g, "").trim("\n");
                var weatherU2 = Utils.getWebText("https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + msg.replace("$날씨 ", "").replace("특별", "") + "날씨").split("<div class=\"info_data\">")[1].split("<div class=\"table_info bytime _todayWeatherByTime\"> ")[0].replace(/(<([^>]+)>)/g, "").split("\n").filter(v=>!(/^\s*$/.test(v))).map(v=>v.trim()).join("\n").replace("도씨", "");
                replier.reply(weatherU1 + "\n" + weatherU2);
            }
            else if(msg.split(" ")[1].lastIndexOf("동") == wl1 - 1) {                                     //$날씨 xx동
                var weatherU1 = Utils.getWebText("https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + msg.replace("$날씨 ", "") + "날씨").split("<div class=\"api_title_area blind\">")[1].split("<div class=\"weather_box\">")[0].replace(/(<([^>]+)>)/g, "").trim("\n");
                var weatherU2 = Utils.getWebText("https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + msg.replace("$날씨 ", "") + "날씨").split("<div class=\"info_data\">")[1].split("<div class=\"table_info bytime _todayWeatherByTime\"> ")[0].replace(/(<([^>]+)>)/g, "").split("\n").filter(v=>!(/^\s*$/.test(v))).map(v=>v.trim()).join("\n").replace("도씨", "");
                replier.reply(weatherU1 + "\n" + weatherU2);


                /*else if(msg.split(" ")[1].lastindexOf("도") == 3 && msg.split(" ")[2].lastindexOf("시") == wl2 - 1) {                     //날씨 xxx도 xx시-수정.보완필요
                    var weatherU1 = Utils.getWebText("https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + msg.replace("$날씨 ", "").split("<div class=\"api_title_area blind\">")[1].split("<div class=\"weather_box\">")[0].replace(/(<([^>]+)>)/g, "").trim("\n");
                    var weatherU2 = Utils.getWebText("https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=" + msg.replace("$날씨 ", "").split("<div class=\"info_data\">")[1].split("<div class=\"table_info bytime _todayWeatherByTime\"> ")[0].replace(/(<([^>]+)>)/g, "").split("\n").filter(v=>!(/^\s*$/.test(v))).map(v=>v.trim()).join("\n").replace("도씨", "");
                    replier.reply(weatherU1 + "\n" + weatherU2);
                }*/
            
                
            }
            if (sender == "김창환" || sender == "최은혁" || sender == "선일"){
                replier.reply("대한민국 육군이 말하는 중입니다 조용히해주십시오");
            }
        }
        // if(msg.indexOf("$야구") == 0){
        //      var baseballscore = org.jsoup.Jsoup.connect('https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=%EC%95%BC%EA%B5%AC').get().select('tbody[class=_scroll_content]').get(0).select('tr[class]').toArray().map(v=>v.text()).join("\n");
        // }
    }
}