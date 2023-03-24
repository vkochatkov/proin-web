"use strict";(self.webpackChunkproin_web=self.webpackChunkproin_web||[]).push([[88],{8330:function(n,t,e){e.d(t,{z:function(){return s}});e(2791);var r=e(1087),c=e(184),s=function(n){var t=n.children,e=n.href,s=n.to,o=n.type,i=void 0===o?"button":o,a=n.size,u=void 0===a?"default":a,l=n.inverse,d=void 0!==l&&l,f=n.danger,v=void 0!==f&&f,h=n.onClick,p=n.disabled,m=void 0!==p&&p,j=n.transparent,x=void 0!==j&&j,b=n.icon,g=void 0!==b&&b,_=n.customClassName,N="button ".concat(_&&"".concat(_)," ").concat(g&&"button__icon"," button--").concat(u," ").concat(d?"button--inverse":""," ").concat(v?"button--danger":""," ").concat(x?"button--transparent":"");return e?(0,c.jsx)("a",{className:N,href:e,children:t}):s?(0,c.jsx)(r.rU,{to:s,className:N,children:t}):(0,c.jsx)("button",{className:N,type:i,onClick:h,disabled:m,children:t})}},453:function(n,t,e){e.d(t,{h:function(){return c}});e(2791);var r=e(184),c=function(n){var t=n.children;return(0,r.jsx)("header",{className:"header",children:t})}},6248:function(n,t,e){e.d(t,{Z:function(){return c}});e(2791);var r=e(184),c=function(n){var t=n.className,e=void 0===t?"":t,c=n.style,s=void 0===c?{}:c,o=n.children;return(0,r.jsx)("div",{className:"card ".concat(e),style:s,children:o})}},9379:function(n,t,e){e.d(t,{x:function(){return i}});var r=e(4165),c=e(5861),s=e(9439),o=e(2791),i=function(){var n=(0,o.useState)(!1),t=(0,s.Z)(n,2),e=t[0],i=t[1],a=(0,o.useState)(),u=(0,s.Z)(a,2),l=u[0],d=u[1],f=(0,o.useRef)([]),v=(0,o.useCallback)(function(){var n=(0,c.Z)((0,r.Z)().mark((function n(t){var e,c,s,o,a,u,l=arguments;return(0,r.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return e=l.length>1&&void 0!==l[1]?l[1]:"GET",c=l.length>2&&void 0!==l[2]?l[2]:null,s=l.length>3&&void 0!==l[3]?l[3]:{},i(!0),o=new AbortController,f.current.push(o),n.prev=6,n.next=9,fetch(t,{method:e,body:c,headers:s,signal:o.signal});case 9:return a=n.sent,n.next=12,a.json();case 12:if(u=n.sent,f.current=f.current.filter((function(n){return n!==o})),a.ok){n.next=16;break}throw new Error(u.message);case 16:return i(!1),n.abrupt("return",u);case 20:throw n.prev=20,n.t0=n.catch(6),d(n.t0.message),i(!1),n.t0;case 25:case"end":return n.stop()}}),n,null,[[6,20]])})));return function(t){return n.apply(this,arguments)}}(),[]);return(0,o.useEffect)((function(){return function(){f.current.forEach((function(n){return n.abort()}))}}),[]),{isLoading:e,error:l,sendRequest:v,clearError:function(){d(void 0)}}}},2645:function(n,t,e){e.d(t,{v:function(){return r}});var r=function(n){return n.user}},3088:function(n,t,e){e.r(t),e.d(t,{default:function(){return _}});var r=e(4165),c=e(5861),s=e(9439),o=e(2791),i=e(9434),a=e(9379),u=e(9224),l=e(7401),d=e(6248),f=e(2645),v=e(7689),h=e(5516),p=e(184),m=function(n){var t=n.name,e=n.logo,r=n.description,c=n.projectId,s=(0,i.v9)(f.v).token,o=(0,i.I0)(),a=(0,v.s0)(),l=(0,p.jsx)("img",{src:e?"".concat("http://localhost:5000","/").concat(e):"",alt:"logo"});return(0,p.jsx)("div",{onClick:function(){return n=c,o((0,h.A)()),o((0,u.AO)(s,n)),void a("/project-edit/".concat(n));var n},children:(0,p.jsxs)(d.Z,{className:"item",children:[!e&&(0,p.jsx)("div",{className:"item__image-empty"}),e&&l,(0,p.jsxs)("div",{className:"item__text-container",children:[(0,p.jsx)("p",{className:"item__name",children:t}),(0,p.jsx)("p",{className:"item__description",children:r})]})]})})},j=function(n){var t=n.projects;return(0,p.jsx)(p.Fragment,{children:t.map((function(n){return(0,p.jsx)(m,{projectId:n._id,name:n.projectName,logo:n.logoUrl,description:n.description},n._id)}))})},x=e(453),b=function(n){return(0,p.jsx)(p.Fragment,{children:(0,p.jsxs)(x.h,{children:[(0,p.jsxs)("button",{className:"main-navigation__menu-btn",onClick:function(){},children:[(0,p.jsx)("span",{}),(0,p.jsx)("span",{}),(0,p.jsx)("span",{})]}),n.children]})})},g=e(8330),_=function(){var n=(0,a.x)(),t=n.sendRequest,e=n.isLoading,d=(0,i.v9)((function(n){return n.mainProjects})),f=d.projects,h=d.currentProject,m=(0,i.v9)((function(n){return n.user})),x=m.userId,_=m.token,N=(0,v.s0)(),k=(0,o.useState)(!1),w=(0,s.Z)(k,2),Z=w[0],C=w[1],y=(0,i.I0)();(0,o.useEffect)((function(){var n=function(){var n=(0,c.Z)((0,r.Z)().mark((function n(){var e;return(0,r.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,t("".concat("http://localhost:5000","/projects/user/").concat(x));case 2:e=n.sent,y((0,u.id)(e.projects));case 4:case"end":return n.stop()}}),n)})));return function(){return n.apply(this,arguments)}}();n()}),[t,x,y]),(0,o.useEffect)((function(){Z&&h&&"success"===h.status&&(N("/project-edit/".concat(h._id)),C(!1))}),[h,Z,N]);return(0,p.jsx)(p.Fragment,{children:(0,p.jsxs)("div",{className:"container",children:[(0,p.jsx)(b,{children:(0,p.jsx)(g.z,{size:"small",transparent:!0,icon:!0,onClick:function(){C(!0),y((0,u.eq)(_))},children:(0,p.jsx)("img",{src:"/plus_icon.svg",className:"button__icon",alt:"button icon"})})}),e&&(0,p.jsx)("div",{className:"loading",children:(0,p.jsx)(l.T,{})}),!e&&(0,p.jsx)(j,{projects:f})]})})}}}]);
//# sourceMappingURL=88.d1876dc8.chunk.js.map