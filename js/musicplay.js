$(function(){
	$playerMask = $('#playerMask');//镂空图标
	$play_icon = $('.play_icon');//图标
	$playCtl = $('#playCtl');//CD孔
	$play_stage = $('.play_stage');//中心播放舞台
	$playState = $('.playState');//播放状态显示图标
	$playerBtn = $('#playerBtn');//旋转的图片
	$lyric_content=$('#lyric_content');//歌词面板
	$music_title = $('#music_title');//标题
	$audio = $('audio');//音乐
	audioStatus = "playing";
	$lyric_ul = $('#lyric_ul');
	$play_icon.hide();
	$play_stage.mouseenter(function(){
		$playerBtn.css({
			'animation-play-state':'paused'
		});
		$play_icon.show();
	});
	$play_stage.mouseleave(function(){
		playBtn_css();
		$play_icon.hide();
	});
	$play_icon.click(function(){
		$playState.toggleClass('stop');
		if($playState.hasClass('stop')){
			console.log('bofang');
			$audio.get(0).play();
//			$playerBtn.css({ 
//			'animation-play-state':'running'
//			});
		}else{ 
			$audio.get(0).pause();
//			$audio.get(0).currentTime=0;
//			$playerBtn.css({ 
//			'animation-play-state':'paused'
//			});
		}
	});
	$audio.bind("playing",function(){
		$playerBtn.css({ 
			'animation-play-state':'running'
			});
		console.log('currentTime'+$audio.get(0).currentTime);
		//设置定时器，刷新歌词
		var sit_refresh_lyric = setInterval(function(){
			var i = 0;
			for(var k in lrcObj){
				if($audio.get(0).currentTime>k){
					$('li:eq('+i+')').addClass('red');
					if(i>0){
						$('li:eq('+(i-1)+')').removeClass('red');
					}
					console.log('定位到改行');
				}
				i++;
			}
			console.log('定时器');
			if($audio.ended){
				console.log('播放结束');
				clearInterval(sit_refresh_lyric);
			};
		},1000);//1s刷新一次歌词列表
	});
	$audio.bind("pause",function(){
		$playerBtn.css({
			'animation-play-state':'paused'
		});
	})
	
	$.get('lyric/Naomi & Goro - Top Of The World.lrc').success(function(result){
		lrcObj = parseLyric(result);
		var i = 0;
		for(var k in lrcObj){
			var txt = lrcObj[k];
//			console.log('txt:'+txt);
			$li = $('<li></li>').text(txt);
			$li.attr({ 
				"date-no":i++ 
			});
//			console.log("$li:"+$li.html());
			$lyric_ul.append($li);
		}
	}); 
});
function playBtn_css(){
//	console.log('$audio.paused:'+$audio.paused);
	if($playState.hasClass('stop')){
		$playerBtn.css({ 
			'animation-play-state':'running'
			});
	}else{
		$playerBtn.css({
			'animation-play-state':'paused'
		});
	}
}
// 解析歌词
// 这一函数来自 https://github.com/TivonJJ/html5-music-player
// 参数：原始歌词文件
function parseLyric(lrc) {
    if(lrc === '') return '';
    var lyrics = lrc.split("\n");
    //歌词标题赋值
    $music_title.text(lyrics[1].substring(lyrics[1].indexOf(':')+1,lyrics[1].indexOf(']')));
    var lrcObj = {};
    for(var i=0;i<lyrics.length;i++){
        var lyric = decodeURIComponent(lyrics[i]);
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var timeRegExpArr = lyric.match(timeReg);
        if(!timeRegExpArr)continue;
        var clause = lyric.replace(timeReg,'');
        for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*/i)).slice(1));
            var time = min * 60 + sec;
            lrcObj[time] = clause;
        }
    }
    return lrcObj;
}

