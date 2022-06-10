/*	https://github.com/johnschult/jquery.countdown360 */
!function(t,s,i,e){var n="countdown360",h={radius:15.5,strokeStyle:"#0d6efd",strokeWidth:void 0,fillStyle:"#0046c7",fontColor:"#477050",fontFamily:"sans-serif",fontSize:void 0,fontWeight:700,autostart:!0,seconds:10,onComplete:void 0};function a(s,i){this.element=s,this.settings=t.extend({},h,i),this.settings.fontSize||(this.settings.fontSize=this.settings.radius/1.2),this.settings.strokeWidth||(this.settings.strokeWidth=this.settings.radius/4),this._defaults=h,this._name=n,this._init()}a.prototype={start:function(){this.startedAt=new Date,this._drawCountdownShape(3.5*Math.PI,!0),this._drawCountdownLabel(0),this.interval=setInterval(jQuery.proxy(this._draw,this),1e3)},stop:function(t){clearInterval(this.interval),t&&t()},_init:function(){this.settings.width=2*this.settings.radius+2*this.settings.strokeWidth,this.settings.height=this.settings.width,this.settings.arcX=this.settings.radius+this.settings.strokeWidth,this.settings.arcY=this.settings.arcX,this._initPen(this._getCanvas()),this.settings.autostart&&this.start()},_getCanvas:function(){var s=t('<canvas id="countdown360_'+t(this.element).attr("id")+'" width="'+this.settings.width+'" height="'+this.settings.height+'"></canvas>');return t(this.element).prepend(s[0]),s[0]},_initPen:function(t){this.pen=t.getContext("2d"),this.pen.lineWidth=this.settings.strokeWidth,this.pen.strokeStyle=this.settings.strokeStyle,this.pen.fillStyle=this.settings.fillStyle,this.pen.font=this.settings.fontWeight+" "+this.settings.fontSize+"px "+this.settings.fontFamily,this.pen.textAlign="center",this.pen.textBaseline="middle",this._clearRect()},_clearRect:function(){this.pen.clearRect(0,0,this.settings.width,this.settings.height)},_drawCountdownLabel:function(t){this.pen.fillStyle=this.settings.fontColor,this.pen.fillText(this.settings.seconds-t,this.settings.width/2,this.settings.height/2)},_drawCountdownShape:function(t,s){this.pen.fillStyle=this.settings.fillStyle,this.pen.beginPath(),this.pen.arc(this.settings.arcX,this.settings.arcY,this.settings.radius,1.5*Math.PI,t,!1),this.pen.fill(),s&&this.pen.stroke()},_draw:function(){var t=Math.round(((new Date).getTime()-this.startedAt.getTime())/1e3),s=3.5*Math.PI-2*Math.PI/this.settings.seconds*t;this._clearRect(),this._drawCountdownShape(3.5*Math.PI,!1),t<this.settings.seconds?(this._drawCountdownShape(s,!0),this._drawCountdownLabel(t)):(this._drawCountdownLabel(this.settings.seconds),this.stop(),this.settings.onComplete())}},t.fn[n]=function(s){var i;return this.each(function(){(i=t.data(this,"plugin_"+n))||(i=new a(this,s),t.data(this,"plugin_"+n,i))}),i}}(jQuery,window,document);

$("#countdown").countdown360({
	radius      : 40,
	seconds     : 5,
	strokeWidth : 4,
	fontColor   : '#333',
	fillStyle   : '#a7d0ff',
	strokeStyle : '#003F87',
	fontSize    : 24,
	autostart   : false,
	onComplete  : function () { 

		var hash = $("input[name='hash']").val();
		$.post(`${base_url}go/${hash}/destination`)
		.done(function(read){

			if (!read.status) {
				ShowToast(read.response, false);
				return false;
			}

			let golink = `
			<a rel="noreferrer" class="btn btn-primary btn-sm fw-bold" href='${read.response}'>Go Link</a>
			`;
			$("#linkdestiny").html(golink);
		})
		.fail(function(xhr, statusText, errorThrown) {
			ShowToast(statusText, false);                    
		});   			
	}
}).start()