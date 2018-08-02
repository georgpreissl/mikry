	

var boTouchstart = 'ontouchstart' in document.documentElement;
//console.log('boTouchstart:',boTouchstart);
var boDebug = false;
var nrPairs = 6;
var arKeywords = ["cute kittens","unicorns","rainbow","flowers","puppies","funny","teddies"];

$secIntro = $('#secIntro');
$title = $secIntro.find('h1');
$secGame = $('#secGame');
$cardsWrap = $secGame.find("#cardsWrap");
$form = $secIntro.find('form');
$hallOfFame = $('#hallOfFame');
$secOutro = $('#secOutro');
$secList = $('#secList');
$inpKeyword = $('#inpKeyword');

if(boDebug){
	nrPairs = 3;
	
	$secIntro.hide();
	$secOutro.hide();
	$secList.hide();
	$hallOfFame.hide();
	$('#scoreForm').hide();
	
	loadFlickr();
} else {
	startIntro();
}



function startIntro(){

	$secIntro.hide();	
	$secGame.hide();
	$hallOfFame.hide();
	$('#scoreForm').hide();
	$secList.hide();
	$secOutro.hide();
	
	$secIntro.fadeIn();

	$inpKeyword.attr("placeholder",arKeywords[Math.floor(Math.random()*arKeywords.length)])

	$('.inp').focus(function(e){
		$(this).attr("placeholder","");
		$(this).val("").css('color', '#333')
	})
	
	$('#start').click(function(e){
		e.preventDefault();
		
		stKeyWord = $inpKeyword.val() ? $inpKeyword.val() : $inpKeyword.attr("placeholder");
		
		// $('#retryForm').find('#inpKeyword').val(inpKeyword);
		
		
		// validNr = !isNaN(nrPairs) || nrPairs > 0 || nrPairs <30;
		// validNr ? $('.inp').eq(1).addClass('notValid') : $('.inp').eq(1).removeClass('notValid');
		boValid = false;
		boValid = (stKeyWord !== ""); 
		boValid ? $('.inp').eq(0).addClass('notValid') : $('.inp').eq(0).removeClass('notValid');
		
		if(boValid){
			$('#secIntro').fadeOut('fast','swing',function(){
				$secGame.show();
				loadFlickr();
		
			});

		} else {
			return;			
			
		}
		
	});
}


function loadFlickr(){
	// show the loader-animation
	$loader = $('<div/>').attr('id','loader').appendTo($('body')).hide().fadeIn();

	// load flickr-json and init
	$.getJSON('http://api.flickr.com/services/feeds/photos_public.gne?tags='+stKeyWord+'&tagmode=any&format=json&jsoncallback=?', init);
	
};



function init(dataFlickr){

	nrCards=nrPairs*2;

	// quadratisch, hoch, quer

	nrx_array=[
		[2,2,2], // 3 Pairs
		[3,2,3], // 4 Pairs
		[3,2,4], // etc.
		[3,2,3],
		[4,3,4],
		[4,3,5],
		[4,3,6],
		[5,4,5],
	];
	xnrs = nrx_array[nrPairs-2];


	
	
	picLoaded=0;
	pairsFound=0;
	fc=false;
	sc=false;
	twoCardsOpen = false;
	startClick = false;
	kw_valid=false;
	arCards = [];
	arImages = [];
	arCachedImages = [];

	dataLater = dataFlickr;
	$('.card').remove();
	arCards=[];
		
	for(i=0; i<nrPairs; i++){
		arCards.push(i,i);
	}
	arCards.sort(function(){return Math.random() - 0.5;});
	
	
	for(i=0; i<arCards.length; i++){
		
		imageSrc = dataFlickr.items[arCards[i]].media.m;
		arImages.push(imageSrc);
		cardHtml = "";
		//data-image='"+imageSrc+"'
		cardHtml += "<div nr='"+arCards[i]+"' class='card' >\
			<div class='flipper' >\
				<div class='front' ></div>\
				<div class='back' style='background-image: url("+imageSrc+"); '></div>\
			</div>\
		</div>";
		$cardsWrap.append(cardHtml);
		
	};
	$cards = $('.card')
	$cards.fastclick(logic);

	var nrImages = arImages.length;
	var nrLoaded = 0;
	
	for (var i = 0; i < nrImages; i++) {
		var cacheImage = document.createElement('img');
		//set the onload method before the src is called otherwise will fail to be called in IE
		cacheImage.onload = function(){
			nrLoaded++;
			if (nrLoaded == nrImages) {
				$loader.fadeOut('fast','swing',function(){
// 					$cards.each(function(i,el){
// 						$(this).delay(i*100).fadeTo(250,1)
// 					});
					$cards.showInSequence("ready",500,function(){
						console.log('Var: ','done');
					})
				})

			}
		}
		cacheImage.src = arImages[i];
		arCachedImages.push(cacheImage);
	}	

	$(window).resize();

	
}

function logic(){
	if(!startClick){
		startTime = new Date().getTime();
		startClick=true;
		db('Starttime erstellt','');
	}
	twoCardsOpen === true ? close2Cards() : null;
	if(!fc && !sc){
		fc=true;
		$c1=$(this);
		$c1.off('click');
		nr1=$c1.attr('nr');
		$c1.addClass('a');
	//	$c1.css('backgroundImage', 'url('+$(this).data('image')+')')
	} else if(fc && !sc){
		sc=true;
		$c2=$(this);
		$c2.off('click');
		nr2=$c2.attr('nr');
		$c2.addClass('a');
//		$c2.css('backgroundImage', 'url('+$(this).data('image')+')')
		//$c2.find('img').css('opacity', '1');
		if(nr1==nr2){
			$c1.addClass('removed');
			//$c1.fadeOut();
			$c1.off('click');
			$c2.addClass('removed');
			//$c2.fadeOut();
			$c2.off('click');
			fc=false;
			sc=false;
			pairsFound++;
			pairsFound == nrPairs ? startOutro() : null;
			
		} else {
			twoCardsOpen = true;
			timer = setTimeout(close2Cards,2000)
		}
	} 
}

function close2Cards(){
	twoCardsOpen = false;
	if(timer!==undefined){
		clearTimeout(timer);
	};
	$c2.removeClass('a');
	$c1.removeClass('a');
	// 		$c1.css('backgroundImage', 'url(hidden.jpg)');
// 			$c2.css('backgroundImage', 'url(hidden.jpg)');
	//$c1.find('img').css('opacity', '0');
	//$c2.find('img').css('opacity', '0');
	$c1.click(logic);
	$c2.click(logic);
	fc=false;
	sc=false;	
}
function startOutro(){
	$('#secGame').hide();
	$('#secOutro').show();
	//$('#hallOfFame').fadeIn();
	endTime = new Date().getTime();
	db('Var: ','endTime erstellt!');
	ms = endTime-startTime;
	s = ms/1000;
	s = s.toString();
	s = s.substring(0, s.length - 2);
	db('Var: ',s);
	$('#sec').text(s);
	minTime = nrPairs*2;
	parseInt(s) < 60 ? $('#scoreForm').fadeIn() : null;
	$('#nrPairs').text(nrPairs);
	
	$('#try-again').off('click').click(function(e){
		e.preventDefault();
		$('#secGame').show();
		$('#scoreForm').hide();

		$('#hallOfFame').hide();
		$('#secOutro').hide();
		$('.card').removeClass('hidden');
		kw_pairs = $('#kw_pairs_again').val();
		nrPairs = kw_pairs.split(' ')[1];
		stKeyWord = kw_pairs.split(' ')[0];

//		init(dataLater);
		loadFlickr();
	});
	
	$('#hallOfFame').off('click').click(function(e){
		$.ajax({
			type: 'post',
			url: 'all.php',
			data: {
				pairs : nrPairs
			},
			success: function(data){
					showHoF(data);

			}
		})		
	})
	
	
	$('#submitScoreButton').off('click').click(function(e){
		e.preventDefault();
		$('#hallOfFame').hide();
		
		player=$('#player').val();

		if(player === ""){
			$('#scoreForm .inp').eq(0).addClass('notValid');
		} else {
			$('#scoreForm .inp').eq(0).removeClass('notValid');
		
	// 		player="mark";
	// 		
	// 		nrPairs=3;
	// 		s=5;
	// 		kw="asldf";
			
			$.ajax({
				type: 'post',
				url: 'all.php',
				data: {
					player : player,
					keyword : stKeyWord,
					pairs : nrPairs,
					sec : s
				},
				success: function(data){
					showHoF(data);

				}
			})
		};
	})



$(window).resize(function(e){
	ww=$(window).width()-20;
	wh=$(window).height()-20;
	
	ratio = ww/wh;
	
	if(ww > 900){
		ww=900;
		wh=ww/ratio;
	}
	
	if(ratio>1.2){
		nrX = xnrs[2];
		db("Querformat!","");
	} else if(ratio<.8){ 
		nrX = xnrs[1];
		db("hochformat!","");
	} else {
		nrX = xnrs[0];
		db("Quadratisch!","");
	};
	
	nrY = Math.ceil(nrCards / nrX);

	KartenblockWidth = wh/nrY * nrX;	
	KartenblockHeight = ww/nrX * nrY;
	
	if( KartenblockWidth > ww ){
		//$('#cards').css('width', ' auto');
		$('#cardsWrap').width(ww);
		db('Kartenblock wäre zu breit!','');
	}

	if( KartenblockHeight > wh ){
		$('#cardsWrap').width(wh/nrY*nrX);
		db('Kartenblock wäre zu hoch!','');
	}	
	
	perc = 100/nrX;
	$(".card").css('width', perc+'%')
	$(".card").css('paddingBottom', perc+'%')	
	
	db('ww: ',ww);
	db('wh: ',wh);
	db('r: ',ratio);
	db('nrX: ',nrX);	
	db('nrY: ',nrY);
	db('KartenblockWidth: ',KartenblockWidth);
	db('KartenblockHeight: ',KartenblockHeight);
	

})


function showHoF(data){
	$('body').css('overflow', 'scroll');
	$('#hallOfFame').hide();
	
	$('#list > h4').text(nrPairs + " Pairs");
	$('#list > table').find('.scoreRow').remove();
	
	$('#list > table').append(data);
	$('body').addClass('listActive');


	$('#closeList').off('click').click(function(e){
		e.preventDefault();
		$('body').removeClass('listActive');
		$('#scoreForm').hide();
		$(window).scrollTop(0);
		$('body').css('overflow', 'hidden');
		
	})	
}	
/*	
	$('.urteil').hide();

	ul=$('.urteil').length-1;
	minZeit = pairs*2000; // 2000ms für ein Paar
	maxZeit = pairs*10000; // 10000ms für ein Paar
	zepMax = 5000; // 5s als MaxZeit für ein Paar
	zep = ms/pairs;
	zz=zepMax/zep;
	zz=Math.floor(zz);
	zz>ul? zz=ul : null;
	$('.urteil').eq(zz).show();
*/	
}

function db(a,b){
	if(boDebug){
		console.log(a,b);
	}
};

$.fn.fastclick = function(fnCb){
	return this.each(function(i,el){
		if(boTouchstart){
			$(this).on('touchstart', fnCb);
		} else {
			$(this).on('click', fnCb);			
		}
		
	});
}

$.fn.showInSequence = function(className,duration,callBack){
	nrElements = this.length;
	
	step = duration/nrElements;
	$all = this;
	setTimeout(callBack,duration)	
	return this.each(function(i,el){
		setTimeout(function(){
			$all.eq(i).addClass(className)
		},i*step);
		
	});

}

