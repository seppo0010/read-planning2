(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{75410:function(){},48628:function(){},31601:function(){},67792:function(){},34977:function(){},75042:function(){},18685:function(){},20067:function(){},55382:function(){},72095:function(){},72061:function(){},61219:function(){},90333:function(e,n,t){Promise.resolve().then(t.bind(t,88066))},88066:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return j}});var l=t(57437),s=t(29039),a=t(53180),o=t(2265);let c="Due date",u="Length",r="Read at",i="Carded at",d=new Date,m="Para leer",f="Le\xeddo",x="Tarjeteado",h="date",p="Subject",b=e=>fetch(e).then(e=>e.json());function j(){let{data:e,error:n}=(0,s.ZP)("https://sheets.googleapis.com/v4/spreadsheets/".concat(encodeURI("1S6KMZCx4slqZm0yLF8cKqVmyFQjsO8hfZLebbz2wAsM"),"/values/").concat(encodeURI("Pending"),"?key=").concat(encodeURIComponent("AIzaSyA6LYbb-Xlq0lkeCLMb88sSWFVE9beq1Z0")),b),[t,j]=(0,o.useState)(null),[g,v]=(0,o.useState)(null),[N,y]=(0,o.useState)(null),[S,_]=(0,o.useState)(null),[L,w]=(0,o.useState)(null),[C,E]=(0,o.useState)(null),[q,F]=(0,o.useState)(null),[I,P]=(0,o.useState)(null),[k,D]=(0,o.useState)(null);return(0,o.useEffect)(()=>{if(!e||!e.values||k)return;let n=e.values,t=new a.DataFrame(n.slice(1).map(e=>e.concat(["","","","","",""]).slice(0,6)),{columns:n[0].slice(0,6),config:{tableMaxColInConsole:7,tableMaxRow:10}}).asType(u,"int32");E(a.toJSON(t.column(p).unique())[0]),D(t)},[e,k,q]),(0,o.useEffect)(()=>{k&&P(null===q?k:k.query(k.column(p).apply(e=>e===q)))},[k,q]),(0,o.useEffect)(()=>{I&&(_(I),j(I.loc({columns:[c,u]}).groupby([c]).sum().rename({[u+"_sum"]:m,[c]:h}).dropNa()),v(I.loc({columns:[r,u]}).groupby([r]).sum().rename({[u+"_sum"]:f,[r]:h}).dropNa()),y(I.loc({columns:[i,u]}).groupby([i]).sum().rename({[u+"_sum"]:x,[i]:h}).dropNa()))},[I,n]),(0,o.useEffect)(()=>{if(!t||!g||!N)return;let e=a.concat({dfList:[t,g,N],axis:0}).sortValues(h).fillNa(0).groupby([h]).max().rename({["".concat(m,"_max")]:m,["".concat(f,"_max")]:f,["".concat(x,"_max")]:x}).setIndex({column:h,drop:!0}).cumSum({axis:0}),n=new a.Series(e.index.map(e=>new Date(e)>d),{columns:["isFuture"]});a.concat({dfList:[e,n,new a.Series(e.index,{columns:[h]})],axis:1}).setIndex({column:h,drop:!0}).apply(e=>{let[n,t,l,s]=e;return s?[n,null,null,s]:[n,t,l,s]}).plot("plot_div").line({config:{columns:[m,f,x]},layout:{title:"Progreso",xaxis:{title:"Fecha"},yaxis:{title:"P\xe1ginas"}}})},[t,g]),(0,o.useEffect)(()=>{S&&w(a.toJSON(S.query(S[r].isNa().and(S[c].apply(e=>new Date(e).getTime()).lt(d.getTime()+6048e5)))))},[S]),(0,l.jsxs)("main",{className:"flex min-h-screen flex-col items-center justify-between p-24",children:[(0,l.jsx)("h1",{children:"Lectura"}),null!==C&&(0,l.jsx)("div",{children:(0,l.jsxs)("select",{value:null!=q?q:"",onChange:e=>F(""!==e.target.value?e.target.value:null),children:[(0,l.jsx)("option",{value:"",children:"Todas las materias"}),C.map(e=>(0,l.jsx)("option",{value:e,children:e},e))]})}),n&&(0,l.jsx)("div",{children:"Failed to load"}),!e&&(0,l.jsx)("div",{children:"Loading"}),(0,l.jsx)("div",{id:"plot_div"}),L&&(0,l.jsxs)("div",{children:[(0,l.jsx)("h2",{children:"Pr\xf3ximos textos"}),(0,l.jsx)("div",{children:(0,l.jsxs)("table",{className:"border-collapse border border-slate-400",children:[(0,l.jsx)("thead",{children:(0,l.jsxs)("tr",{children:[(0,l.jsx)("th",{className:"border border-slate-300 text-left",children:"Nombre"}),(0,l.jsx)("th",{className:"border border-slate-300 text-left",children:"Longitud"})]})}),(0,l.jsx)("tbody",{children:L.map(e=>(0,l.jsxs)("tr",{children:[(0,l.jsx)("td",{className:"border border-slate-300",children:e.Name}),(0,l.jsxs)("td",{className:"border border-slate-300",children:[e.Length," p\xe1ginas"]})]},e.Name))})]})})]})]})}}},function(e){e.O(0,[801,575,281,0,425,399,566,636,938,712,971,23,744],function(){return e(e.s=90333)}),_N_E=e.O()}]);