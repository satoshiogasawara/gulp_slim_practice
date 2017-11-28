/*
$(function(){

var flg01 = 'default';
$('.sp_navbtn').click(function(){
	$('#nav_box').slideToggle("normal");
});

$(window).on("resize", function(){

	var w = $(window).width();
    var x = 640;
    if (w <= x) {
    	$('#nav_box').css("display", "none");
    };

    if (x < w){
    	$('#nav_box').css("display", "block");
    };

});

});
*/



/*
//ボタンon,off切り替えjs
$(function(){
	$('a img.btn').hover(function(){
	$(this).attr('src', $(this).attr('src').replace('_off', '_on'));
		}, function(){
			if (!$(this).hasClass('current_page')) {
			$(this).attr('src', $(this).attr('src').replace('_on', '_off'));
		}
	});

	// ページ内スクロール
	$('a[href^=#]').click(function(){
		var speed = 500;
		var href= $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top-49;
		$("html, body").animate({scrollTop:position}, speed, "swing");
		return false;
	});

});
*/

/* ------------
// ------------ スマホ ナビスライド ------------
$(function(){
	$('.sp_nav_btn').click(function(){
		$('#SpNavi').slideToggle("normal");
	});
});
------------ */



// ------------ スムーススクロール ------------
// $(function(){
// 	$('a[href^='#']').click(function(){
// 		var speed = 500;
// 		var href= $(this).attr("href");
// 		var target = $(href == "#" || href == "" ? 'html' : href);
// 		var position = target.offset().top;
// 		$("html, body").animate({scrollTop:position}, speed, "swing");
// 		return false;
// 	});
// });

$(function(){
	var pagetop = $('.totop a');
	pagetop.click(function(){
		$('body, html').animate({ scrollTop: 0 }, 500);
        return false;
	});
});

$(function(){
	$('.fa-bars').click(function(){
		$(this).css('display', 'none');
		$('.fa-times').css('display', 'block');
	});
	$('.fa-times').click(function(){
		$(this).css('display', 'none');
		$('.fa-bars').css('display', 'block');
	});
});

$(function(){
	$('.fa-bars').click(function(){
		$('.menubar').fadeToggle('slow');
	});
	$('.fa-times').click(function(){
		$('.menubar').fadeToggle('slow');
	});
});

/* ------------
// ------------ googlemap表示 ------------
function googleMap() {

	var latlng = new google.maps.LatLng(43.068625,141.350801);// 座標

	var myOptions = {
	zoom: 16, //拡大比率
	center: latlng,
	mapTypeControlOptions: { mapTypeIds: ['style', google.maps.MapTypeId.ROADMAP] },
	scrollwheel: false, //スクロール設定 スクロール可true スクロール不可false
	disableDefaultUI: false //コントロールの表示設定 コントロール有false コントロール無true
	};

	var map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);

	//ピンのスタイル設定
	//var icon = new google.maps.MarkerImage('/icon.png',//画像url
	//new google.maps.Size(70,84),//アイコンサイズ
	//new google.maps.Point(0,0)//アイコン位置
	//);

	var markerOptions = {
	position: latlng,
	map: map,
	//icon: icon,//ピンのスタイル
	title: '地図',//タイトル
	animation: google.maps.Animation.DROP//アニメーション 不使用時にコメントアウト
	};

	var marker = new google.maps.Marker(markerOptions);

	//取得スタイルの貼り付け
	var styleOptions = [
	{
	"stylers": [
	{ "hue": '#003366' }//カラー変更不要時にコメントアウト
	]
	}
	];

	var styledMapOptions = { name: '色変更' }//地図右上のタイトル

	var sampleType = new google.maps.StyledMapType(styleOptions, styledMapOptions);
	map.mapTypes.set('style', sampleType);
	map.setMapTypeId('style');
	};

	google.maps.event.addDomListener(window, 'load', function() {
	googleMap();

});
------------ */
