(() => {
  const rgba = value => { const n = value.match(/[\d.]+/g)?.map(Number); return n && n.length >= 3 ? [...n.slice(0,3), n[3] ?? 1] : [0,0,0,0]; };
  const over = (front, back) => [...front.slice(0,3).map((v,i) => v*front[3]+back[i]*(1-front[3])),1];
  const luminance = c => c.slice(0,3).map(v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[0.2126,0.7152,0.0722][i],0);
  const visible = el => (el.getBoundingClientRect().width>0 && el.getBoundingClientRect().height>0) && !el.closest('[hidden]') && getComputedStyle(el).visibility!=='hidden' && (!el.closest('details:not([open])') || !!el.closest('summary'));
  const background = el => {const chain=[];for(let p=el;p;p=p.parentElement)chain.push(p);return chain.reverse().reduce((bg,p)=>over(rgba(getComputedStyle(p).backgroundColor),bg),[255,255,255,1]);};
  const failures=[];let minimum=Infinity,checked=0;
  const nodes=[...document.querySelectorAll('body,body *')].flatMap(el=>[...el.childNodes].filter(node=>node.nodeType===3).map(node=>({node,el})));
  for(const {node,el} of nodes){if(!el||!node.textContent.trim()||!visible(el)||el.closest('script,style,option,button:disabled,input:disabled,select:disabled,textarea:disabled'))continue;
    const style=getComputedStyle(el);const bg=background(el),fg=over(rgba(style.color),bg);const a=luminance(fg),b=luminance(bg);const contrast=(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
    const large=Number(style.fontSize.replace('px',''))>=24 || (Number(style.fontSize.replace('px',''))>=18.66&&Number(style.fontWeight)>=700);
    checked++;minimum=Math.min(minimum,contrast);if(contrast<(large?3:4.5)-0.01)failures.push({text:node.textContent.trim().slice(0,90),contrast:Number(contrast.toFixed(2)),font:style.fontSize,color:style.color});
  }
  const small=[...document.querySelectorAll('button,a,input,select,textarea,summary')].filter(el=>visible(el)&&!el.matches(':disabled')&&!el.classList.contains('skip-link')).flatMap(el=>{let r=el.getBoundingClientRect();const label=el.matches('input[type=checkbox],input[type=radio]')?el.closest('label'):null;if(label)r=label.getBoundingClientRect();return r.width<44||r.height<44?[{name:(el.getAttribute('aria-label')||el.textContent||el.getAttribute('type')||el.tagName).trim().slice(0,65),width:Math.round(r.width),height:Math.round(r.height)}]:[];});
  return {theme:document.documentElement.dataset.theme,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,checked,minimum:Number(minimum.toFixed(2)),contrastFailures:failures.slice(0,15),smallTargets:small.slice(0,20)};
})()
