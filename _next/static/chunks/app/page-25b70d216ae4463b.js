(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{75410:function(){},48628:function(){},31601:function(){},67792:function(){},34977:function(){},75042:function(){},18685:function(){},20067:function(){},55382:function(){},72095:function(){},72061:function(){},61219:function(){},90333:function(e,n,t){Promise.resolve().then(t.bind(t,88066))},88066:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return b}});var o=t(57437),s=t(29039),u=t(53180),l=t(2265);let c="Due date",i="Length",a="Read at",r="Carded at",f=new Date,d="Para leer",m="Le\xeddo",p="Tarjeteado",x="date",h=e=>fetch(e).then(e=>e.json());function b(){let{data:e,error:n}=(0,s.ZP)("https://sheets.googleapis.com/v4/spreadsheets/".concat(encodeURI("1S6KMZCx4slqZm0yLF8cKqVmyFQjsO8hfZLebbz2wAsM"),"/values/").concat(encodeURI("Pending"),"?key=").concat(encodeURIComponent("AIzaSyA6LYbb-Xlq0lkeCLMb88sSWFVE9beq1Z0")),h),[t,b]=(0,l.useState)(null),[g,y]=(0,l.useState)(null),[_,v]=(0,l.useState)(null),[w,S]=(0,l.useState)(null);return(0,l.useEffect)(()=>{if(!e)return;let n=e.values,t=new u.DataFrame(n.slice(1).map(e=>e.slice(0,6)),{columns:n[0].slice(0,6),config:{tableMaxColInConsole:7,tableMaxRow:10}}).asType(i,"int32");S(t),b(t.loc({columns:[c,i]}).groupby([c]).sum().rename({[i+"_sum"]:d,[c]:x}).dropNa()),y(t.loc({columns:[a,i]}).groupby([a]).sum().rename({[i+"_sum"]:m,[a]:x}).dropNa()),v(t.loc({columns:[r,i]}).groupby([r]).sum().rename({[i+"_sum"]:p,[r]:x}).dropNa())},[e,n]),(0,l.useEffect)(()=>{if(!t||!g||!_)return;let e=u.concat({dfList:[t,g,_],axis:0}).sortValues(x).fillNa(0).setIndex({column:x,drop:!0}).cumSum({axis:0}),n=new u.Series(e.index.map(e=>new Date(e)>f),{columns:["isFuture"]});u.concat({dfList:[e,n,new u.Series(e.index,{columns:[x]})],axis:1}).setIndex({column:x,drop:!0}).apply(e=>{let[n,t,o,s]=e;return s?[n,null,null,s]:[n,t,o,s]}).plot("plot_div").line({config:{columns:[d,m,p]},layout:{title:"Progreso",xaxis:{title:"Fecha"},yaxis:{title:"P\xe1ginas"}}})},[t,g]),(0,l.useEffect)(()=>{w&&w.print()},[w]),(0,o.jsxs)("main",{className:"flex min-h-screen flex-col items-center justify-between p-24",children:[n&&(0,o.jsx)("div",{children:"Failed to load"}),!e&&(0,o.jsx)("div",{children:"Loading"}),(0,o.jsx)("div",{id:"plot_div"})]})}}},function(e){e.O(0,[801,575,281,0,425,399,566,636,938,712,971,23,744],function(){return e(e.s=90333)}),_N_E=e.O()}]);