//- 分页
var data = {
"rows":[
	{	
		"logoUrl": "aaa",
	 	"title": "xxx",
	  	"price": 19001
  	},
  	{
		"logoUrl": "bbb",
	 	"title": "xxx",
	  	"price": 19002
  	},
  	{
		"logoUrl": "ccc",
	 	"title": "xxx",
	  	"price": 19003
  	},
  	{
		"logoUrl": "ddd",
	 	"title": "xxx",
	  	"price": 19004
  	},
  	{
		"logoUrl": "eee",
	 	"title": "xxx",
	  	"price": 19000
  	},
  	{
		"logoUrl": "fff",
	 	"title": "xxx",
	  	"price": 19000
  	},
  	{
		"logoUrl": "ggg",
	 	"title": "xxx",
	  	"price": 19000
  	},
  	{
		"logoUrl": "hhh",
	 	"title": "xxx",
	  	"price": 19000
  	}
],
"total": 99
};


!(function($) {
	//配置选项
	var defaults = {
		url: '',//ajax接口地址(必选)
		limit: 8,//每页商品数//(必选)
		className: '',//分页组件外层结构类(必选)
		onClick: function(index, total, rows) {
			console.info(index, total, rows);
		},//点击分页回调(必选)
		maxPage: 7,//最多分页按钮数(可选)
		edge: 1//左右最少分页按钮数(可选)
	};

	$.extend ({
		setPages: function(options) {
			var opts = $.extend({},defaults,options||{});
			var PAGING = {
				SL: {
					$pageOuter: $('.' + opts.className)
				},
				DOM: {
					ellipsis:'<span class="x-ellipsis">...</span>',//省略号
					$pageBox: $('<div class="x-pageBoxer"></div>'),//分页组件最外层结构
				},//虚拟dom存储对象
				pIndex: 1,//当前分页下标
				pageNum: 0,
				firstLoad: true,

				maxPage: opts.maxPage || 7,//最多显示多少个分页按钮
				url: opts.url,//ajax接口地址(必选)
				limit:opts.limit,//每页商品数//(必选)
				headL: opts.edge,//左边最少页数(可选)
				tailL: opts.edge, //右边最少页数(可选)
				className: opts.className,//自定义样式类(可选)
				onClick: opts.onClick,//点击分页回调(必选)
				//填充分页按钮
				fillPages: function(bool, index) {
					if (bool) {
						return '<div class="active x-pageBtn">' + index + '</div>';
					} else {
						return '<div class="x-pageBtn">' + index + '</div>';
					}
				},
				// 页面加载
				initPaging: function() {
					var offset = this.pIndex * this.limit;//偏移量

					// $.ajax({
					// 	type: 'GET',
					// 	url: this.url,
					// 	data: {
					// 		"offset": offset, 
					// 		"limit": this.limit
					// 	},
					// 	success: function(data) {
							//处理data
							var total = data.total,
								rows = data.rows,
								pageNum = this.pageNum = Math.ceil(total / this.limit);
							this.switchPages();
							if (!this.firstLoad) {
								opts.onClick(this.pIndex, total, rows);
							} else {
								this.firstLoad = false;
							}
					// 	}
					// });
				},
				//点击分页按钮
				clickPaging: function() {
					var pageBtn = this.SL.$pageOuter.find('.x-pageBtn');
					pageBtn.each(function(i, e) {
						var _this = $(this),
							index = _this.html();
						_this.on('click', function(e) {
							e.stopPropagation();
							PAGING.pIndex = index;
							_this.addClass('active').siblings().removeClass('active');
							PAGING.initPaging();
						});
					});
				},
				//切换分页选项
				switchPages: function() {
					this.SL.$pageOuter.empty();//清空
					var i = '',
						j = '',//索引
						totalP = this.pageNum,//一共的页数
						pageL = this.maxPage,//可展现页数
						half = (pageL - 1) / 2,//分页半长
						mainL = pageL - this.headL - this.tailL,//中间长度
						code = '';//分页字符串
					if (totalP < this.pIndex) {
						console.log('总页数不能小于当前页数！');
						return false;
					}
					//不需要省略
					if (totalP < pageL) {
						// console.log('不需要省略');
						for (i = 0; i < totalP; i++) {
							code += (i + 1 == this.pIndex) ? this.fillPages(true, i + 1) : this.fillPages(false, i + 1);
						}
					} else {
						//只需要右边省略
						if (this.pIndex < half + 1) {
							// console.log('只需要右边省略', this.pIndex, half + 1);
							var tailer = '';
							for ( i = 0; i < this.headL + mainL; i++) {
								code += (i + 1 == this.pIndex) ? this.fillPages(true, i + 1) : this.fillPages(false, i + 1);
							}
							code += this.DOM.ellipsis;
							for (i = totalP; i > totalP - this.tailL; i--) {
								tailer = this.fillPages(false, i) + tailer;
							}
							code += tailer;
						}
						//只需要左边省略
						else if (this.pIndex >= totalP - half) {
							// console.log('只需要左边省略', this.pIndex, totalP - half);
							var header = '';
							for (j = 0, i = totalP; j < pageL - this.headL; i--, j++) {
								code = ((this.pIndex == i) ? this.fillPages(true, i) : this.fillPages(false, i)) + code;
							}
							code = this.DOM.ellipsis + code;
							for (i = 0; i < this.headL; i++) {
								header += this.fillPages(false, i + 1);
							}
							code = header + code;
						}
						//两边需要省略	
						else {
							var header = '',
								tailer = '',
								partA = '',
								partB = '';
							for (i = 0; i < this.headL; i++) {
								header += this.fillPages(false, i + 1);
							}
							header += this.DOM.ellipsis;
							for (i = totalP; i > totalP - this.tailL; i--) {
								tailer = this.fillPages(false, i) + tailer;
							}
							tailer = this.DOM.ellipsis + tailer;
							var offset_m = (mainL + 1) / 2,
								counter = (parseInt(this.pIndex) + parseInt(offset_m));
							for (i = j = this.pIndex; i < counter; i++, j--) {
								partA = ((i == j) ? '' : this.fillPages(false, j)) + partA;
								partB += (i == j) ? this.fillPages(true, i) :  this.fillPages(false, i);
							}
							code = header + partA + partB + tailer;
						}
					}
					var $pageBox = this.DOM.$pageBox.clone();
						$pageBox.append($(code));
						this.SL.$pageOuter.append($pageBox);
					this.clickPaging();
				},
				init: function() {
					this.initPaging();
					this.clickPaging();
					console.log(opts, defaults);
				}
			}
			PAGING.init();
		}
	});	
})(jQuery);

$.setPages({
	url: "192.168.1.116/api/getNewGoods.action",//ajax接口地址(必选)
	limit: 8,//每页商品数//(必选)
	className: 'a',//自定义样式类(必选)
	onClick: function(index, total, rows) {
		console.info(index, total, rows);
	},//点击分页回调(必选)
	maxPage: 7,//最多分页按钮数(可选)
	edge: 1//左右最少分页按钮数(可选)
});