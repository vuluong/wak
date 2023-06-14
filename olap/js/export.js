/**
 * @license Highcharts JS v8.2.0 (2020-08-20)
 *
 * Exporting module
 *
 * (c) 2010-2019 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
"use strict";!function(t){"object"==typeof module&&module.exports?module.exports=t.default=t:"function"==typeof define&&define.amd?define("highcharts/modules/exporting",["highcharts"],function(e){return t(e),t.Highcharts=e,t}):t("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(e){var t=e?e._modules:{};function n(e,t,n,i){e.hasOwnProperty(t)||(e[t]=i.apply(null,n))}n(t,"Extensions/FullScreen.js",[t["Core/Chart/Chart.js"],t["Core/Globals.js"],t["Core/Utilities.js"]],function(e,t,n){var i=n.addEvent,o=(r.prototype.close=function(){var e=this,t=e.chart;e.isOpen&&e.browserProps&&t.container.ownerDocument instanceof Document&&t.container.ownerDocument[e.browserProps.exitFullscreen](),e.unbindFullscreenEvent&&e.unbindFullscreenEvent(),e.isOpen=!1,e.setButtonText()},r.prototype.open=function(){var e,t=this,n=t.chart;t.browserProps&&(t.unbindFullscreenEvent=i(n.container.ownerDocument,t.browserProps.fullscreenChange,function(){t.isOpen?(t.isOpen=!1,t.close()):(t.isOpen=!0,t.setButtonText())}),(e=n.renderTo[t.browserProps.requestFullscreen]())&&e.catch(function(){alert("Full screen is not supported inside a frame.")}),i(n,"destroy",t.unbindFullscreenEvent))},r.prototype.setButtonText=function(){var e,t=this.chart,n=t.exportDivElements,i=t.options.exporting,o=null===(e=null==i?void 0:i.buttons)||void 0===e?void 0:e.contextButton.menuItems,r=t.options.lang;null!=i&&i.menuItemDefinitions&&null!=r&&r.exitFullscreen&&r.viewFullscreen&&o&&n&&n.length&&(n[o.indexOf("viewFullscreen")].innerHTML=this.isOpen?r.exitFullscreen:i.menuItemDefinitions.viewFullscreen.text||r.viewFullscreen)},r.prototype.toggle=function(){var e=this;e.isOpen?e.close():e.open()},r);function r(e){this.chart=e,this.isOpen=!1;var t=e.renderTo;this.browserProps||("function"==typeof t.requestFullscreen?this.browserProps={fullscreenChange:"fullscreenchange",requestFullscreen:"requestFullscreen",exitFullscreen:"exitFullscreen"}:t.mozRequestFullScreen?this.browserProps={fullscreenChange:"mozfullscreenchange",requestFullscreen:"mozRequestFullScreen",exitFullscreen:"mozCancelFullScreen"}:t.webkitRequestFullScreen?this.browserProps={fullscreenChange:"webkitfullscreenchange",requestFullscreen:"webkitRequestFullScreen",exitFullscreen:"webkitExitFullscreen"}:t.msRequestFullscreen&&(this.browserProps={fullscreenChange:"MSFullscreenChange",requestFullscreen:"msRequestFullscreen",exitFullscreen:"msExitFullscreen"}))}return t.Fullscreen=o,i(e,"beforeRender",function(){this.fullscreen=new t.Fullscreen(this)}),t.Fullscreen}),n(t,"Mixins/Navigation.js",[],function(){return{initUpdate:function(e){e.navigation||(e.navigation={updates:[],update:function(t,n){this.updates.forEach(function(e){e.update.call(e.context,t,n)})}})},addUpdate:function(e,t){t.navigation||this.initUpdate(t),t.navigation.updates.push({update:e,context:t})}}}),n(t,"Extensions/Exporting.js",[t["Core/Chart/Chart.js"],t["Mixins/Navigation.js"],t["Core/Globals.js"],t["Core/Options.js"],t["Core/Renderer/SVG/SVGRenderer.js"],t["Core/Utilities.js"]],function(e,t,p,n,i,m){var b=p.doc,o=p.isTouchDevice,w=p.win,r=n.defaultOptions,x=m.addEvent,S=m.css,y=m.createElement,d=m.discardElement,v=m.extend,h=m.find,E=m.fireEvent,C=m.isObject,F=m.merge,k=m.objectEach,f=m.pick,s=m.removeEvent,g=m.uniqueKey,l=w.navigator.userAgent,a=p.Renderer.prototype.symbols,P=/Edge\/|Trident\/|MSIE /.test(l),M=/firefox/i.test(l);v(r.lang,{hideSeries:"Hide all series",showSeries:"Show all series",viewFullscreen:"View in full screen",exitFullscreen:"Exit from full screen",printChart:"Print chart",downloadPNG:"Download PNG image",downloadJPEG:"Download JPEG image",downloadPDF:"Download PDF document",downloadSVG:"Download SVG vector image",contextButtonTitle:"Chart context menu"}),r.navigation||(r.navigation={}),F(!0,r.navigation,{buttonOptions:{theme:{},symbolSize:14,symbolX:12.5,symbolY:10.5,align:"right",buttonSpacing:3,height:22,verticalAlign:"top",width:24}}),F(!0,r.navigation,{menuStyle:{border:"1px solid #999999",background:"#ffffff",padding:"5px 0"},menuItemStyle:{padding:"0.5em 1em",color:"#333333",background:"none",fontSize:o?"14px":"11px",transition:"background 250ms, color 250ms"},menuItemHoverStyle:{background:"#335cad",color:"#ffffff"},buttonOptions:{symbolFill:"#666666",symbolStroke:"#666666",symbolStrokeWidth:3,theme:{padding:5}}}),r.exporting={type:"image/png",url:"https://export.highcharts.com/",printMaxWidth:780,scale:2,buttons:{contextButton:{className:"highcharts-contextbutton",menuClassName:"highcharts-contextmenu",symbol:"menu",titleKey:"contextButtonTitle",menuItems:["viewFullscreen","printChart","separator","downloadPNG","downloadJPEG","downloadPDF","downloadSVG"]},hideSeriesButton:{symbolSize:16,symbolX:21,symbolY:19,symbol:"url(images/hide_series.png)",titleKey:"hideSeries",onclick:function(){for(var e=this.series,t=0;t<e.length;t++)if(null==e[t].startAngleRad)e[t].hide();else for(j=0;j<e[t].data.length;j++)e[t].data[j].setVisible(!1)}},showSeriesButton:{symbolSize:16,symbolX:21,symbolY:19,symbol:"url(images/show_series.png)",titleKey:"showSeries",onclick:function(){for(var e=this.series,t=0;t<e.length;t++)if(null==e[t].startAngleRad)e[t].show();else for(j=0;j<e[t].data.length;j++)e[t].data[j].setVisible(!0)}}},menuItemDefinitions:{viewFullscreen:{textKey:"viewFullscreen",onclick:function(){this.fullscreen.toggle()}},printChart:{textKey:"printChart",onclick:function(){this.print()}},separator:{separator:!0},downloadPNG:{textKey:"downloadPNG",onclick:function(){this.exportChart()}},downloadJPEG:{textKey:"downloadJPEG",onclick:function(){this.exportChart({type:"image/jpeg"})}},downloadPDF:{textKey:"downloadPDF",onclick:function(){this.exportChart({type:"application/pdf"})}},downloadSVG:{textKey:"downloadSVG",onclick:function(){this.exportChart({type:"image/svg+xml"})}}}},p.post=function(e,t,n){var i=y("form",F({method:"post",action:e,enctype:"multipart/form-data"},n),{display:"none"},b.body);k(t,function(e,t){y("input",{type:"hidden",name:t,value:e},null,i)}),i.submit(),d(i)},p.isSafari&&p.win.matchMedia("print").addListener(function(e){p.printingChart&&(e.matches?p.printingChart.beforePrint():p.printingChart.afterPrint())}),v(e.prototype,{sanitizeSVG:function(e,t){var n=e.indexOf("</svg>")+6,i=e.substr(n);return e=e.substr(0,n),t&&t.exporting&&t.exporting.allowHTML&&i&&(i='<foreignObject x="0" y="0" width="'+t.chart.width+'" height="'+t.chart.height+'"><body xmlns="http://www.w3.org/1999/xhtml">'+i.replace(/(<(?:img|br).*?(?=\>))>/g,"$1 />")+"</body></foreignObject>",e=e.replace("</svg>",i+"</svg>")),e=e.replace(/zIndex="[^"]+"/g,"").replace(/symbolName="[^"]+"/g,"").replace(/jQuery[0-9]+="[^"]+"/g,"").replace(/url\(("|&quot;)(.*?)("|&quot;)\;?\)/g,"url($2)").replace(/url\([^#]+#/g,"url(#").replace(/<svg /,'<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ (|NS[0-9]+\:)href=/g," xlink:href=").replace(/\n/," ").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g,'$1="rgb($2)" $1-opacity="$3"').replace(/&nbsp;/g," ").replace(/&shy;/g,"­"),this.ieSanitizeSVG&&(e=this.ieSanitizeSVG(e)),e},getChartHTML:function(){return this.styledMode&&this.inlineStyles(),this.container.innerHTML},getSVG:function(n){var r,e,t,i,o,s,l,a,u=this,c=F(u.options,n);return c.plotOptions=F(u.userOptions.plotOptions,n&&n.plotOptions),c.time=F(u.userOptions.time,n&&n.time),e=y("div",null,{position:"absolute",top:"-9999em",width:u.chartWidth+"px",height:u.chartHeight+"px"},b.body),l=u.renderTo.style.width,a=u.renderTo.style.height,o=c.exporting.sourceWidth||c.chart.width||/px$/.test(l)&&parseInt(l,10)||(c.isGantt?800:600),s=c.exporting.sourceHeight||c.chart.height||/px$/.test(a)&&parseInt(a,10)||400,v(c.chart,{animation:!1,renderTo:e,forExport:!0,renderer:"SVGRenderer",width:o,height:s}),c.exporting.enabled=!1,delete c.data,c.series=[],u.series.forEach(function(e){(i=F(e.userOptions,{animation:!1,enableMouseTracking:!1,showCheckbox:!1,visible:e.visible})).isInternal||c.series.push(i)}),u.axes.forEach(function(e){e.userOptions.internalKey||(e.userOptions.internalKey=g())}),r=new p.Chart(c,u.callback),n&&["xAxis","yAxis","series"].forEach(function(e){var t={};n[e]&&(t[e]=n[e],r.update(t))}),u.axes.forEach(function(t){var e=h(r.axes,function(e){return e.options.internalKey===t.userOptions.internalKey}),n=t.getExtremes(),i=n.userMin,o=n.userMax;e&&(void 0!==i&&i!==e.min||void 0!==o&&o!==e.max)&&e.setExtremes(i,o,!0,!1)}),t=r.getChartHTML(),E(this,"getSVG",{chartCopy:r}),t=u.sanitizeSVG(t,c),c=null,r.destroy(),d(e),t},getSVGForExport:function(e,t){var n=this.options.exporting;return this.getSVG(F({chart:{borderRadius:0}},n.chartOptions,t,{exporting:{sourceWidth:e&&e.sourceWidth||n.sourceWidth,sourceHeight:e&&e.sourceHeight||n.sourceHeight}}))},getFilename:function(){var e=this.userOptions.title&&this.userOptions.title.text,t=this.options.exporting.filename;return t?t.replace(/\//g,"-"):("string"==typeof e&&(t=e.toLowerCase().replace(/<\/?[^>]+(>|$)/g,"").replace(/[\s_]+/g,"-").replace(/[^a-z0-9\-]/g,"").replace(/^[\-]+/g,"").replace(/[\-]+/g,"-").substr(0,24).replace(/[\-]+$/g,"")),(!t||t.length<5)&&(t="chart"),t)},exportChart:function(e,t){var n=this.getSVGForExport(e,t);e=F(this.options.exporting,e),p.post(e.url,{filename:e.filename?e.filename.replace(/\//g,"-"):this.getFilename(),type:e.type,width:e.width||0,scale:e.scale,svg:n},e.formAttributes)},moveContainers:function(t){(this.fixedDiv?[this.fixedDiv,this.scrollingContainer]:[this.container]).forEach(function(e){t.appendChild(e)})},beforePrint:function(){var e=this,t=b.body,n=e.options.exporting.printMaxWidth,i={childNodes:t.childNodes,origDisplay:[],resetParams:void 0};e.isPrinting=!0,e.pointer.reset(null,0),E(e,"beforePrint"),n&&e.chartWidth>n&&(i.resetParams=[e.options.chart.width,void 0,!1],e.setSize(n,void 0,!1)),[].forEach.call(i.childNodes,function(e,t){1===e.nodeType&&(i.origDisplay[t]=e.style.display,e.style.display="none")}),e.moveContainers(t),e.printReverseInfo=i},afterPrint:function(){var e,n,t,i=this;i.printReverseInfo&&(e=i.printReverseInfo.childNodes,n=i.printReverseInfo.origDisplay,t=i.printReverseInfo.resetParams,i.moveContainers(i.renderTo),[].forEach.call(e,function(e,t){1===e.nodeType&&(e.style.display=n[t]||"")}),i.isPrinting=!1,t&&i.setSize.apply(i,t),delete i.printReverseInfo,delete p.printingChart,E(i,"afterPrint"))},print:function(){var e=this;e.isPrinting||(p.printingChart=e,p.isSafari||e.beforePrint(),setTimeout(function(){w.focus(),w.print(),p.isSafari||setTimeout(function(){e.afterPrint()},1e3)},1))},contextMenu:function(t,e,n,i,o,r,s){var l,a,u=this,c=u.options.navigation,p=u.chartWidth,d=u.chartHeight,h="cache-"+t,f=u[h],g=Math.max(o,r);f||(u.exportContextMenu=u[h]=f=y("div",{className:t},{position:"absolute",zIndex:1e3,padding:g+"px",pointerEvents:"auto"},u.fixedDiv||u.container),l=y("ul",{className:"highcharts-menu"},{listStyle:"none",margin:0,padding:0},f),u.styledMode||S(l,v({MozBoxShadow:"3px 3px 10px #888",WebkitBoxShadow:"3px 3px 10px #888",boxShadow:"3px 3px 10px #888"},c.menuStyle)),f.hideMenu=function(){S(f,{display:"none"}),s&&s.setState(0),u.openMenu=!1,S(u.renderTo,{overflow:"hidden"}),m.clearTimeout(f.hideTimer),E(u,"exportMenuHidden")},u.exportEvents.push(x(f,"mouseleave",function(){f.hideTimer=w.setTimeout(f.hideMenu,500)}),x(f,"mouseenter",function(){m.clearTimeout(f.hideTimer)}),x(b,"mouseup",function(e){u.pointer.inClass(e.target,t)||f.hideMenu()}),x(f,"click",function(){u.openMenu&&f.hideMenu()})),e.forEach(function(t){var e;"string"==typeof t&&(t=u.options.exporting.menuItemDefinitions[t]),C(t,!0)&&(t.separator?e=y("hr",null,null,l):(e=y("li",{className:"highcharts-menu-item",onclick:function(e){e&&e.stopPropagation(),f.hideMenu(),t.onclick&&t.onclick.apply(u,arguments)},innerHTML:t.text||u.options.lang[t.textKey]},null,l),u.styledMode||(e.onmouseover=function(){S(this,c.menuItemHoverStyle)},e.onmouseout=function(){S(this,c.menuItemStyle)},S(e,v({cursor:"pointer"},c.menuItemStyle)))),u.exportDivElements.push(e))}),u.exportDivElements.push(l,f),u.exportMenuWidth=f.offsetWidth,u.exportMenuHeight=f.offsetHeight),a={display:"block"},n+u.exportMenuWidth>p?a.right=p-n-o-g+"px":a.left=n-g+"px",i+r+u.exportMenuHeight>d&&"top"!==s.alignOptions.verticalAlign?a.bottom=d-i-g+"px":a.top=i+r-g+"px",S(f,a),S(u.renderTo,{overflow:""}),u.openMenu=!0,E(u,"exportMenuShown")},addButton:function(e){var t,n,i,o,r,s,l,a=this,u=a.renderer,c=F(a.options.navigation.buttonOptions,e),p=c.onclick,d=c.menuItems,h=c.symbolSize||12;a.btnCount||(a.btnCount=0),a.exportDivElements||(a.exportDivElements=[],a.exportSVGElements=[]),!1!==c.enabled&&(r=(o=(i=c.theme).states)&&o.hover,s=o&&o.select,a.styledMode||(i.fill=f(i.fill,"#ffffff"),i.stroke=f(i.stroke,"none")),delete i.states,p?l=function(e){e&&e.stopPropagation(),p.call(a,e)}:d&&(l=function(e){e&&e.stopPropagation(),a.contextMenu(n.menuClassName,d,n.translateX,n.translateY,n.width,n.height,n),n.setState(2)}),c.text&&c.symbol?i.paddingLeft=f(i.paddingLeft,25):c.text||v(i,{width:c.width,height:c.height,padding:0}),a.styledMode||(i["stroke-linecap"]="round",i.fill=f(i.fill,"#ffffff"),i.stroke=f(i.stroke,"none")),(n=u.button(c.text,0,0,l,i,r,s).addClass(e.className).attr({title:f(a.options.lang[c._titleKey||c.titleKey],"")})).menuClassName=e.menuClassName||"highcharts-menu-"+a.btnCount++,c.symbol&&(t=u.symbol(c.symbol,c.symbolX-h/2,c.symbolY-h/2,h,h,{width:h,height:h}).addClass("highcharts-button-symbol").attr({zIndex:1}).add(n),a.styledMode||t.attr({stroke:c.symbolStroke,fill:c.symbolFill,"stroke-width":c.symbolStrokeWidth||1})),n.add(a.exportingGroup).align(v(c,{width:n.width,x:f(c.x,a.buttonOffset)}),!0,"spacingBox"),a.buttonOffset+=(n.width+c.buttonSpacing)*("right"===c.align?-1:1),a.exportSVGElements.push(n,t))},destroyExport:function(e){var n,i=e?e.target:this,t=i.exportSVGElements,o=i.exportDivElements,r=i.exportEvents;t&&(t.forEach(function(e,t){e&&(e.onclick=e.ontouchstart=null,n="cache-"+e.menuClassName,i[n]&&delete i[n],i.exportSVGElements[t]=e.destroy())}),t.length=0),i.exportingGroup&&(i.exportingGroup.destroy(),delete i.exportingGroup),o&&(o.forEach(function(e,t){m.clearTimeout(e.hideTimer),s(e,"mouseleave"),i.exportDivElements[t]=e.onmouseout=e.onmouseover=e.ontouchstart=e.onclick=null,d(e)}),o.length=0),r&&(r.forEach(function(e){e()}),r.length=0)}}),i.prototype.inlineToAttributes=["fill","stroke","strokeLinecap","strokeLinejoin","strokeWidth","textAnchor","x","y"],i.prototype.inlineBlacklist=[/-/,/^(clipPath|cssText|d|height|width)$/,/^font$/,/[lL]ogical(Width|Height)$/,/perspective/,/TapHighlightColor/,/^transition/,/^length$/],i.prototype.unstyledElements=["clipPath","defs","desc"],e.prototype.inlineStyles=function(){var d,e,h,t=this.renderer,f=t.inlineToAttributes,g=t.inlineBlacklist,m=t.inlineWhitelist,x=t.unstyledElements,y={};function v(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()})}e=b.createElement("iframe"),S(e,{width:"1px",height:"1px",visibility:"hidden"}),b.body.appendChild(e),(h=e.contentWindow.document).open(),h.write('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),h.close(),function e(n){var t,i,o,r,s,l,a,u="";function c(e,t){if(s=l=!1,m){for(a=m.length;a--&&!l;)l=m[a].test(t);s=!l}for("transform"===t&&"none"===e&&(s=!0),a=g.length;a--&&!s;)s=g[a].test(t)||"function"==typeof e;s||i[t]===e&&"svg"!==n.nodeName||y[n.nodeName][t]===e||(f&&-1===f.indexOf(t)?u+=v(t)+":"+e+";":e&&n.setAttribute(v(t),e))}if(1===n.nodeType&&-1===x.indexOf(n.nodeName)){if(t=w.getComputedStyle(n,null),i="svg"===n.nodeName?{}:w.getComputedStyle(n.parentNode,null),y[n.nodeName]||(d=h.getElementsByTagName("svg")[0],o=h.createElementNS(n.namespaceURI,n.nodeName),d.appendChild(o),y[n.nodeName]=F(w.getComputedStyle(o,null)),"text"===n.nodeName&&delete y.text.fill,d.removeChild(o)),M||P)for(var p in t)c(t[p],p);else k(t,c);if(u&&(r=n.getAttribute("style"),n.setAttribute("style",(r?r+";":"")+u)),"svg"===n.nodeName&&n.setAttribute("stroke-width","1px"),"text"===n.nodeName)return;[].forEach.call(n.children||n.childNodes,e)}}(this.container.querySelector("svg")),d.parentNode.removeChild(d)},a.menu=function(e,t,n,i){return[["M",e,t+2.5],["L",e+n,t+2.5],["M",e,t+i/2+.5],["L",e+n,t+i/2+.5],["M",e,t+i-1.5],["L",e+n,t+i-1.5]]},a.menuball=function(e,t,n,i){var o=i/3-2;return[].concat(this.circle(n-o,t,o,o),this.circle(n-o,t+o+4,o,o),this.circle(n-o,t+2*(4+o),o,o))},e.prototype.renderExporting=function(){var t=this,e=t.options.exporting,n=e.buttons,i=t.isDirtyExporting||!t.exportSVGElements;t.buttonOffset=0,t.isDirtyExporting&&t.destroyExport(),i&&!1!==e.enabled&&(t.exportEvents=[],t.exportingGroup=t.exportingGroup||t.renderer.g("exporting-group").attr({zIndex:3}).add(),k(n,function(e){t.addButton(e)}),t.isDirtyExporting=!1),x(t,"destroy",t.destroyExport)},x(e,"init",function(){var i=this;function n(e,t,n){i.isDirtyExporting=!0,F(!0,i.options[e],t),f(n,!0)&&i.redraw()}i.exporting={update:function(e,t){n("exporting",e,t)}},t.addUpdate(function(e,t){n("navigation",e,t)},i)}),e.prototype.callbacks.push(function(e){e.renderExporting(),x(e,"redraw",e.renderExporting)})}),n(t,"masters/modules/exporting.src.js",[],function(){})});