/*
 * MCarousel 0.1
 * Copyright (c) 2016 yuyafei https://github.com/Miller547719886
 * Date: 2016-9-1
 * 使用MCarousel轮播图组件可以方便地让用户实现图片轮播效果。
 */

!(function($) {
    //参数选项设置
    var listBox = $('.carousel .listBox'),
        items = $('.carousel .item'),
        index = 1,
        loop = setInterval(function () {
            $('.playBoxR').trigger('click');
        },5000),
        transitioned = true,
        direction = true,//右true 左false
        scrollLength = 0,
        scrollWidth = 0,
        eventType = 'click'||'touch',
        rtime = new Date(1, 1, 2000, 12,00,00),
        timeout = false,
        delta = 200,

        //默认设定
        defaults = {
            'speed' : "1000",//切换速度(单位为'ms')
            'effect' : "scroll",//切换模式(fade-渐变/scroll-滚动)
            'delay' : "200",//延迟(单位为'ms')
            "doc" : true ,//是否显示索引的那个圈圈
            "arrow" : true,//是否显示箭头(默认为显示)
            "carouselData" : [//自定义图片(需要裁切为1000*360尺寸！)
                {
                    "src":"./img/oYYBAFcHXSmAKAldAAKR0TIwTC0951.jpg",
                    "alt":"1",
                    "href":"//dahao.de"
                },
                {
                    "src":"./img/oYYBAFcEvVaAbb61AAMCrHIU_DQ326.jpg",
                    "alt":"2",
                    "href":"//dahao.de"
                },
                {
                    "src":"./img/oYYBAFbX46mAeL56AARNsz2Jhs8026.jpg",
                    "alt":"3",
                    "href":"//dahao.de"
                },
                {
                    "src":"./img/oYYBAFbVcv6AGEw7AARD8EguBSQ058.jpg",
                    "alt":"4",
                    "href":"//dahao.de"
                },
                {
                    "src":"./img/oYYBAFbFu42AEseIAAJcNXX3yD0807.jpg",
                    "alt":"5",
                    "href":"//dahao.de"
                },
                {
                    "src":"./img/d2a02697894902d195ace93a4efb10f7.jpg",
                    "alt":"6",
                    "href":"//dahao.de"
                }
            ]
        };

    //向jq原型中插入代码，插件名为MCarousel
    $.fn.MCarousel = function (options) {
        var opts = $.extend({},defaults,options||{}),
            itemNum = opts.carouselData.length;

        // this.each(function () { 
        //     var $this=$(this);
        //     $this.init();
        // });

        init = function () {
            setItems();
            setSRC();
            scrollLength = parseInt($('.carousel .item').width());
            scrollWidth = parseInt($('.carousel .item').width());
        }

        //根据carouselData动态添加div
        setItems = function () {
           for (var i = 0;i < itemNum + 4;i++) {
                var item = $('<div class="item"><a href=""><img width="100%" src="" alt=""></a></div>');
                $('.listBox').append(item);
           }
           $('.carousel .item').eq(2).addClass('active');
        }

        //填充图片路径
        setSRC = function () {
            var img = $('.carousel img');
            img.each(function (i,ele) {
                if (i == 0) {
                    img.eq(i).attr({"src":opts.carouselData[opts.carouselData.length - 2].src,"alt":opts.carouselData[opts.carouselData.length - 2].alt});
                    img.eq(i).parent('a').attr("href",opts.carouselData[opts.carouselData.length - 2].href)
                } else if (i == 1) {
                    img.eq(i).attr({"src":opts.carouselData[opts.carouselData.length - 1].src,"alt":opts.carouselData[opts.carouselData.length - 1].alt});
                    img.eq(i).parent('a').attr("href",opts.carouselData[opts.carouselData.length - 1].href)
                } else if (i == img.length - 2) {
                    img.eq(i).attr({"src":opts.carouselData[0].src,"alt":opts.carouselData[0].alt});
                    img.eq(i).parent('a').attr("href",opts.carouselData[0].href)
                } else if (i == img.length - 1) {
                    img.eq(i).attr({"src":opts.carouselData[1].src,"alt":opts.carouselData[1].alt});
                    img.eq(i).parent('a').attr("href",opts.carouselData[1].href)
                } else {
                    img.eq(i).attr({"src":opts.carouselData[i - 2].src,"alt":opts.carouselData[i - 2].alt});
                    img.eq(i).parent('a').attr("href",opts.carouselData[i - 2].href)
                }
            })
        }

        // 箭头显示
        $('.MCarousel .maskLeft').on({
            mouseover:function () {
                $(this).find('.playPrev').css('opacity',1);
                $('.MCarousel .maskRight').find('.playNext').css('opacity',1);
            },
            mouseleave:function () {
                $(this).find('.playPrev').css('opacity',0);
                $('.MCarousel .maskRight').find('.playNext').css('opacity',0);
            },
            // 移动端箭头消失
            touchstart:function(event){
                $(this).find('.playPrev').css('opacity',1);
                $('.MCarousel .maskRight').find('.playNext').css('opacity',1);
                var delay = setTimeout(function(){
                    $('.MCarousel .maskLeft').find('.playPrev').css('opacity',0);
                    $('.MCarousel .maskRight').find('.playNext').css('opacity',0);
                },500)
            }
        })

        $('.MCarousel .maskRight').on({
            mouseover:function () {
                $(this).find('.playNext').css('opacity',1);
                $('.MCarousel .maskLeft').find('.playPrev').css('opacity',1);
            },
            mouseleave:function () {
                $(this).find('.playNext').css('opacity',0);
                $('.MCarousel .maskLeft').find('.playPrev').css('opacity',0);
            },
            // 移动端箭头消失
            touchstart:function(event){
                $(this).find('.playNext').css('opacity',1);
                $('.MCarousel .maskLeft').find('.playPrev').css('opacity',1);
                var delay = setTimeout(function(){
                    $('.MCarousel .maskRight').find('.playNext').css('opacity',0);
                    $('.MCarousel .maskLeft').find('.playPrev').css('opacity',0);
                },500)
            }
        })



        //响应式支持
        $(window).on('resize',function () {
            rtime = new Date();
            clearInterval(loop);
            scrollLength = parseInt($('.carousel .item').width());
            var n_scrollLength = parseInt($('.carousel .item').width());
            if (n_scrollLength!= scrollWidth) {
                scrollWidth = n_scrollLength;
                $('.carousel .listBox').css({transition:'none',transform:'translate3d(-' + ((index - 1)*n_scrollLength) + 'px,0px,0px)'});
                // $('.playBoxR').on('click',function(){playNext();})
                // $('.playBoxL').on('click',function(){playPrev();})
            }
            if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
            }
        })

        resizeend = function () {
            if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
            } else {
                timeout = false;
                loop = setInterval(function(){$('.playBoxR').trigger('click')},5000);
            }
        }

        //动画结束后执行
        $('.carousel .listBox').on('transitionend',function(){
            transitioned = true;
            if(direction){
                if(index == itemNum + 1){
                    index = 1;switched = true;
                    $('.carousel .listBox').css({transition:'none',transform:'translate3d(0px,0px,0px)'});
                    translate = 0;
                    $('.carousel .item.active').removeClass('active').siblings($('.carousel .item')).eq(2).addClass('active')
                }
            } else {
                if (index == 0) {
                    index = itemNum;switched = true;
                    $('.carousel .listBox').css({transition:'none',transform:'translate3d(-' + (opts.carouselData.length - 1) * scrollLength+'px,0px,0px)'});
                    translate = - (opts.carouselData.length - 1)*scrollLength;
                    $('.carousel .item.active').removeClass('active').siblings($('.carousel .item')).eq(-3).addClass('active');
                }
            }
            eventOn();
            loop = setInterval(function () {
                $('.playBoxR').trigger('click')
            },5000);
        })

        //执行动画
        playNext = function () {
            direction = true;
            clearInterval(loop);
            eventOff();
            if (index<= itemNum) {
                    $('.carousel .listBox').css('transition','transform 500ms ease 0s');
                    // console.log(translate,scrollLength);  
                    $('.carousel .listBox').css('transform','translate3d(' + (translate - scrollLength) + 'px, 0px, 0px)');
                    $('.carousel .item.active').removeClass('active').next($('carousel .item')).addClass('active');
                    index++;}
                    translate+= translate - scrollLength;
            }
        playThis = function () {
            clearInterval(loop);
            eventOff();
            $('.carousel .listBox').css('transition','transform 500ms ease 0s');
            $('.carousel .listBox').css('transform','translate3d(' + translate  + 'px, 0px, 0px)');
        }
        playPrev = function () {
            direction = false;
            clearInterval(loop);
            eventOff();
            if (index >= 1) {
                $('.carousel .listBox').css('transition','transform 500ms ease 0s'); 
                $('.carousel .listBox').css('transform','translate3d(' + (translate + scrollLength) + 'px, 0px, 0px)');
                $('.carousel .item.active').removeClass('active').prev($('carousel .item')).addClass('active');
                index--}
                translate += translate + scrollLength;
        }

        //响应事件
        getPosition = function () {
            transformArray = $('.carousel .listBox').css('transform');
            translateArray = transformArray.split(',');
            translate = parseInt(translateArray[4]);
        }
        getPositionNow = function () {
            transformArray_n = $('.carousel .listBox').css('transform');
            translateArray_n = transformArray.split(',');
            translate_n = parseInt(translateArray[4]);
        }
        clickNext = function () {
            $('.playBoxR').on('click',function(){
                getPosition();
                playNext();
            })
        }
        clickNext();
        clickPrev = function () {
            $('.playBoxL').on('click',function(){
                getPosition();
                playPrev();
            })
        }
        clickPrev();

        eventOff = function () {
            $('.playBoxL').off('click');
            $('.playBoxR').off('click');
            $('.MCarousel .clickSpace').get(0).removeEventListener('touchstart',ts,false);
            $('.MCarousel .clickSpace').get(0).removeEventListener('touchmove',tm,false);
            $('.MCarousel .clickSpace').get(0).removeEventListener('touchend',te,false);
        }

        eventOn = function () {
            clickPrev();
            clickNext();
            $('.MCarousel .clickSpace').get(0).addEventListener('touchstart',ts,false);
            $('.MCarousel .clickSpace').get(0).addEventListener('touchmove',tm,false);
            $('.MCarousel .clickSpace').get(0).addEventListener('touchend',te,false);      
        }

        //移动端支持
        var startX = 0,
            startY = 0,
            moveX = 0,
            moveY = 0,
            endX = 0,
            endY = 0;
            transformArray = $('.carousel .listBox').css('transform'),
            translateArray = transformArray.split(','),
            translate = parseInt(translateArray[4]),
            translate_n = translate,
            transformArray_n = $('.carousel .listBox').css('transform'),
            translateArray_n = transformArray.split(','),
            translate_n = parseInt(translateArray[4]),
            switched = false;

        ts = function (event) {
            startX = event.touches[0].pageX;
            startY = event.touches[0].pageY;
            clearInterval(loop);
            getPosition();
        }

        $('.MCarousel .clickSpace').get(0).addEventListener('touchstart',ts,false);

        tm = function (event) {
            getPositionNow();
            if(translate_n == translate){
            switched = false;
            event.preventDefault();
            clearInterval(loop);
            moveX = event.touches[0].pageX;
            moveY = event.touches[0].pageY;
            var deltaX = moveX - startX;
            var deltaY = moveY - startY;
            $('.carousel .listBox').css('transition','none'); 
            $('.carousel .listBox').css('transform','translate3d(' + (translate + deltaX) + 'px, 0px, 0px)');
            }
        }

        $('.MCarousel .clickSpace').get(0).addEventListener('touchmove',tm,false);

        te = function (event) {
            getPositionNow();
            if(translate_n == translate){
                clearInterval(loop);
                switched = false;
                eventType ='touch';
                endX = event.changedTouches[0].pageX;
                endY = event.changedTouches[0].pageY;
                var deltaX = endX - startX;
                var deltaY = endY - startY;
                if(Math.abs(deltaX)>60) {
                    if(deltaX<0)
                    {
                        eventOff();
                        playNext();//下一张
                    }
                    else{
                        eventOff();
                        playPrev();//上一张
                    }
                } else {//反弹回去
                    playThis();
                }
            }
        }
        $('.MCarousel .clickSpace').get(0).addEventListener('touchend',te,false);
        init();
    }
})(jQuery);