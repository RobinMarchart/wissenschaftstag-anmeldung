(this["webpackJsonpwissenschaftstag-anmeldung"]=this["webpackJsonpwissenschaftstag-anmeldung"]||[]).push([[0],{215:function(e,t){},226:function(e,t,n){},227:function(e,t,n){},228:function(e,t,n){},231:function(e,t,n){},232:function(e,t,n){"use strict";n.r(t);var a=n(0),s=n.n(a),o=n(28),r=n.n(o),i=(n(90),n(91),n(237)),l=n(239),h=n(14),c=n(15),u=n(18),p=n(16),m=n(19),d=n(240),f=n(234),g=n(235),k=n(79),E=n.n(k),w=n(23),v=n(20);n(226);function b(e){return s.a.createElement(d.a.Body,null,s.a.createElement(f.a,null,s.a.createElement("img",{className:"mr-3 workshop-image",src:e.Image.src,alt:e.Image.alt}),s.a.createElement(f.a.Body,null,s.a.createElement("div",{className:"workshop-card-body"},s.a.createElement(E.a,{escapeHtml:!1,source:e.Description})))))}function A(e){return s.a.createElement("div",{className:"workshop-card"},s.a.createElement(d.a,null,s.a.createElement(d.a.Header,null,s.a.createElement("div",{className:"workshop-header-float-group"},s.a.createElement("h5",null,e.Workshop.title),s.a.createElement("div",{className:"buffer"}),s.a.createElement(g.a,{variant:"secondary"},e.Workshop.short?"45 Min.":"90 Min."))),s.a.createElement(b,{Image:e.Workshop.image,Description:e.Workshop.description}),s.a.createElement(d.a.Footer,null,"Von ",e.Workshop.authors.join(" & "))))}var C=function(e){function t(e){var n;return Object(h.a)(this,t),(n=Object(u.a)(this,Object(p.a)(t).call(this,e))).state={collapsed:!0},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"workshop-card"},s.a.createElement(d.a,null,s.a.createElement(l.a.Toggle,{as:d.a.Header,eventKey:this.props.Key.toString(),onClick:function(){return e.setState({collapsed:!e.state.collapsed})}},s.a.createElement("div",{className:"workshop-card-accordion-header"},s.a.createElement("div",{className:"workshop-header-float-group"},s.a.createElement("h4",null,this.props.Workshop.title),s.a.createElement("div",{className:"buffer"}),s.a.createElement(g.a,{variant:"secondary"},this.props.Workshop.short?"45 Min.":"90 Min.")),s.a.createElement(w.a,{icon:this.state.collapsed?v.b:v.a,size:"lg"}))),s.a.createElement(l.a.Collapse,{eventKey:this.props.Key.toString()},s.a.createElement("div",null,s.a.createElement(b,{Image:this.props.Workshop.image,Description:this.props.Workshop.description}),s.a.createElement(d.a.Footer,null,"Von ",this.props.Workshop.authors.join(" & "))))))}}]),t}(s.a.Component),S=n(29),B=n(238),O=n(83),I=n(241),y=localStorage;function D(){var e=y.getItem("registration");return e?JSON.parse(e):null}var W=n(236),N=n(81),Q=(n(227),function(e){function t(e){var n;return Object(h.a)(this,t),(n=Object(u.a)(this,Object(p.a)(t).call(this,e))).prev=null,n.state={waiting:!1,finished:!1},n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"animationFinsishedHandler",value:function(){!1===this.props.state?this.setState({waiting:!0,finished:!1}):this.props.state&&this.setState({waiting:!1,finished:!0})}},{key:"render",value:function(){return this.prev!==this.props.state&&(null===this.prev?this.props.state?this.state={waiting:!1,finished:!0}:this.state={waiting:!0,finished:!1}:this.state={waiting:!1,finished:!1},this.prev=this.props.state),s.a.createElement("div",null,s.a.createElement(W.a,{in:this.state.waiting,onExited:this.animationFinsishedHandler.bind(this),unmountOnExit:!0},s.a.createElement(w.a,{icon:v.d,spin:!0,size:"2x"})),s.a.createElement(N.a,{in:this.state.finished,onExited:this.animationFinsishedHandler.bind(this),unmountOnExit:!0},s.a.createElement(w.a,{icon:v.c,size:"2x"})))}}]),t}(s.a.Component)),G=(n(228),function(e){function t(e){var n;return Object(h.a)(this,t),(n=Object(u.a)(this,Object(p.a)(t).call(this,e))).state={workshop:D(),chosen:"",chosen2:"",send:null,short:!1},n.state.workshop&&(n.state.chosen=n.state.workshop[3],n.state.chosen2=n.state.workshop[4]),n.form={},n.changed=!1,window.addEventListener("beforeunload",n.warnIfUnsaved.bind(Object(S.a)(n))),n}return Object(m.a)(t,e),Object(c.a)(t,[{key:"warnIfUnsaved",value:function(e){if(this.changed&&!this.state.send){var t=null===this.state.send?"Nicht alle \xe4nderungen wurden gesendet!":"Nicht alle \xc4nderungen wurden gesendet, bitte kurz warten!";return(e||window.event).returnValue=t,t}}},{key:"handleSubmit",value:function(e){e.preventDefault();var t=[this.form.name1.value,this.form.name2.value,this.form.class.value,this.form.workshop.value,this.state.short?this.form.workshop2.value:""];console.debug(t),function(e){try{y.setItem("registration",JSON.stringify(e))}catch(t){console.error(t)}}(t),this.setState({workshop:t,send:!1})}},{key:"handleWorkshopChange",value:function(e){var t=this;this.props.Workshops.find((function(e){return e.title===t.form.workshop.value})).short?this.setState({chosen:this.form.workshop.value,send:null,short:!0}):this.setState({chosen:this.form.workshop.value,send:null,short:!1}),this.changed=!0}},{key:"handleSecondWorkshopChange",value:function(e){this.setState({chosen2:this.form.workshop2.value,send:null}),this.changed=!0}},{key:"renderChosenWorkshop",value:function(){var e=this;if(this.state.chosen){var t=this.props.Workshops.find((function(t){return t.title===e.state.chosen}));if(t)return s.a.createElement(A,{Workshop:t})}}},{key:"renderSecondWorkshop",value:function(){var e=this;if(this.state.short&&this.state.chosen){var t=this.props.Workshops.filter((function(t){return t.short&&t.title!==e.state.chosen}));return s.a.createElement(B.a.Group,{controlId:"formWorkshop2"},s.a.createElement(B.a.Label,null,"Workshop"),s.a.createElement(B.a.Control,{as:"select",defaultValue:this.state.workshop?this.state.workshop[4]:null,onChange:this.handleSecondWorkshopChange.bind(this),ref:function(t){return e.form.workshop2=t}},t.map((function(e,t){return s.a.createElement("option",{key:t.toString()},e.title)}))))}}},{key:"renderSecondChosenWorkshop",value:function(){var e=this;if(this.state.short&&this.state.chosen2){var t=this.props.Workshops.find((function(t){return t.title===e.state.chosen2}));if(t)return s.a.createElement(A,{Workshop:t})}}},{key:"handleStateChange",value:function(){this.setState({send:null}),this.changed=!0}},{key:"render",value:function(){var e=this;return this.props.ThisRef&&this.props.ThisRef(this),s.a.createElement(B.a,{onSubmit:this.handleSubmit.bind(this)},s.a.createElement(B.a.Row,null,s.a.createElement(B.a.Group,{controlId:"formName1",as:O.a,md:"4"},s.a.createElement(B.a.Label,null,"Vorname"),s.a.createElement(B.a.Control,{required:!0,type:"text",onChange:this.handleStateChange.bind(this),placeholder:"Otto",defaultValue:this.state.workshop?this.state.workshop[0]:null,ref:function(t){return e.form.name1=t}})),s.a.createElement(B.a.Group,{controlId:"formName2",as:O.a,md:"4"},s.a.createElement(B.a.Label,null,"Nachname"),s.a.createElement(B.a.Control,{required:!0,type:"text",onChange:this.handleStateChange.bind(this),placeholder:"Maier",defaultValue:this.state.workshop?this.state.workshop[1]:null,ref:function(t){return e.form.name2=t}})),s.a.createElement(B.a.Group,{controlId:"formClass",as:O.a,md:"4"},s.a.createElement(B.a.Label,null,"Classe"),s.a.createElement(B.a.Control,{as:"select",onChange:this.handleStateChange.bind(this),defaultValue:this.state.workshop?this.state.workshop[2]:null,ref:function(t){return e.form.class=t}},this.props.Classes.map((function(e,t){return s.a.createElement("option",{key:t.toString()},e)}))))),s.a.createElement(B.a.Group,{controlId:"formWorkshop"},s.a.createElement(B.a.Label,null,"Workshop"),s.a.createElement(B.a.Control,{as:"select",defaultValue:this.state.workshop?this.state.workshop[3]:null,onChange:this.handleWorkshopChange.bind(this),ref:function(t){return e.form.workshop=t}},this.props.Workshops.map((function(e,t){return s.a.createElement("option",{key:t.toString()},e.title)})))),this.renderChosenWorkshop(),this.renderSecondWorkshop(),this.renderSecondChosenWorkshop(),s.a.createElement("div",{className:"submit-group"},s.a.createElement(I.a,{type:"submit"},"Anmelden"),s.a.createElement("div",{className:"submit-status"},s.a.createElement(Q,{state:this.state.send}))))}}]),t}(s.a.Component)),j=(n(231),n(51));var F=function(e){return s.a.createElement("div",{className:"app"},s.a.createElement(i.a,null,s.a.createElement(l.a,null,j.workshops.map((function(e,t){return s.a.createElement(C,{Key:t,key:t.toString(),Workshop:e})}))),s.a.createElement("div",{className:"separator"}),s.a.createElement(G,{Classes:["extern","10a","10b","10c","10d","10e"],Workshops:j.workshops})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));void 0===window.baseUrl&&(window.baseUrl="http://localhost:4000/"),r.a.render(s.a.createElement(F,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},51:function(e){e.exports=JSON.parse('{"workshops":[{"title":"Umfrage","authors":["Hanna Hoogen","Robin Marchart"],"image":{"src":"workshops/0.jpg","alt":"\ud83e\udd86"},"short":false,"maxParticipants":20,"description":"\\n##### Testing the login function \\n\\n###### TODO\\n\\n+ test1\\n+ test2\\n\\nlol\\n"},{"title":"Umfrage","authors":["Hanna Hoogen","Robin Marchart"],"image":{"src":"workshops/1.jpg","alt":"\ud83e\udd86"},"short":false,"maxParticipants":20,"description":"\\n##### Testing the login function \\n\\n###### TODO\\n\\n+ test1\\n+ test2\\n\\nlol\\n"},{"title":"Kurzumfrage","authors":["Hanna Hoogen","Robin Marchart"],"image":{"src":"workshops/2.jpg","alt":"\ud83e\udd86"},"short":true,"maxParticipants":20,"description":"\\n##### Testing the login function \\n\\n###### TODO\\n\\n+ test1\\n+ test2\\n\\nlol\\n"},{"title":"Kurzumfrage2","authors":["Hanna Hoogen","Robin Marchart"],"image":{"src":"workshops/3.jpg","alt":"\ud83e\udd86"},"short":true,"maxParticipants":20,"description":"\\n##### Testing the login function \\n\\n###### TODO\\n\\n+ test1\\n+ test2\\n\\nlol\\n"}],"key":"-----BEGIN PGP PUBLIC KEY BLOCK-----\\n\\n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\\nXPg9jHjpxmZnGx4b\\n=EywK\\n-----END PGP PUBLIC KEY BLOCK-----\\n"}')},85:function(e,t,n){e.exports=n(232)},91:function(e,t,n){}},[[85,1,2]]]);
//# sourceMappingURL=main.c21d5b3a.chunk.js.map