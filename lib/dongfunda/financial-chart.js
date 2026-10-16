// Chart layout from accepted preview; R31 adds explicit decimal precision and a times-ratio scale.
export function renderFinancialChart(svg, data, mode) {
    const ns='http://www.w3.org/2000/svg',s=(tag,attrs={},text)=>{const n=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;return n};
    const num=(v,unit,decimals=unit==='%'||unit==='เท่า'?2:1)=>v==null?'ไม่มีข้อมูล':v.toLocaleString('en-US',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
    function addWatermark(svg,{w,left,right,top,bottom}){
      const message='ควรตรวจสอบงบด้วยตัวเองทุกครั้ง',asset={width:2001,height:2001,bounds:{x:234,y:469,width:1533,height:1063},dataURL:'/images/dongfunda-chart-watermark.png'};
      const cx=(left+right)/2,cy=(top+bottom)/2,narrow=w<340,lines=narrow?['ควรตรวจสอบงบ','ด้วยตัวเองทุกครั้ง']:[message];
      const logoWidth=narrow?44:64,logoHeight=logoWidth*asset.bounds.height/asset.bounds.width,lineHeight=narrow?16:20,fontSize=narrow?12:16;
      const totalHeight=logoHeight+8+lines.length*lineHeight,logoX=cx-logoWidth/2,logoY=cy-totalHeight/2;
      const group=s('g',{'data-brand-watermark':'','aria-hidden':'true','pointer-events':'none'});
      const viewport=s('svg',{x:logoX,y:logoY,width:logoWidth,height:logoHeight,viewBox:`${asset.bounds.x} ${asset.bounds.y} ${asset.bounds.width} ${asset.bounds.height}`,'preserveAspectRatio':'xMidYMid meet','data-logo-watermark':'','class':'df-logo-watermark','aria-label':'DongFunda','pointer-events':'none',style:'overflow:hidden;pointer-events:none'});
      viewport.append(s('image',{x:0,y:0,width:asset.width,height:asset.height,href:asset.dataURL,'data-logo-image':'','pointer-events':'none'}));group.append(viewport);
      const text=s('text',{x:cx,'text-anchor':'middle','class':'df-watermark','data-watermark':'','aria-hidden':'true','pointer-events':'none',style:`font-size:${fontSize}px;font-weight:600;fill:var(--df-ink);opacity:0.4;pointer-events:none;user-select:none`});
      lines.forEach((line,i)=>text.append(s('tspan',{x:cx,y:logoY+logoHeight+8+fontSize+i*lineHeight},line)));
      group.append(text);svg.append(group);
      const tb=text.getBBox(),x=Math.min(logoX,tb.x),y=Math.min(logoY,tb.y),rightEdge=Math.max(logoX+logoWidth,tb.x+tb.width),bottomEdge=Math.max(logoY+logoHeight,tb.y+tb.height);
      const box={x,y,width:rightEdge-x,height:bottomEdge-y},labels=[...svg.querySelectorAll('[data-value-label]')].map(n=>n.getBBox());
      const overlaps=(a,b)=>a.x<b.x+b.width+4&&a.x+a.width+4>b.x&&a.y<b.y+b.height+4&&a.y+a.height+4>b.y;
      const offsets=[0];for(let d=4;d<=100;d+=4)offsets.push(d,-d);
      for(const offset of offsets){
        const candidate={...box,y:box.y+offset};
        if(candidate.y>=top+4&&candidate.y+candidate.height<=bottom-4&&!labels.some(b=>overlaps(candidate,b))){group.setAttribute('transform',`translate(0,${offset})`);break}
      }
      const desc=svg.querySelector('desc');if(desc)desc.textContent+='. DongFunda. '+message;
    }

    function draw(svg){
      const w=svg.getBoundingClientRect().width;if(w<1)return;
      const rows=data.modes[mode],metric=data.metrics.find(m=>m.id===svg.dataset.metric),values=rows.map(r=>r[metric.id].value).filter(v=>v!=null);
      const probe=s('text',{},num(rows.at(-1)[metric.id].value,metric.unit,metric.decimals)+(metric.unit==='%'?'%':''));svg.replaceChildren(probe);
      const edgePadding=w<420?Math.max(8,probe.getComputedTextLength()/2+4):8;
      const left=64,right=w-edgePadding,top=75,bottom=247,step=(right-left)/rows.length,largest=Math.max(...values,0),quantum=metric.unit==='เท่า'?0.1:metric.unit==='%'?5:largest>50000?10000:2000,max=Math.max(quantum,Math.ceil(largest*1.15/quantum)*quantum),x=i=>left+step*(i+.5),y=v=>bottom-v/max*(bottom-top);
      svg.replaceChildren();svg.setAttribute('viewBox',`0 0 ${w} 305`);
      svg.append(s('title',{},metric.label),s('desc',{},rows.map(r=>`${r.label}: ${r[metric.id].value==null?'รออัปเดต':num(r[metric.id].value,metric.unit,metric.decimals)} ${metric.unit}`).join('; ')),s('rect',{x:left,y:top,width:right-left,height:bottom-top,class:'df-frame','data-chart-frame':''}));
      for(const v of [0,max/2,max])svg.append(s('line',{x1:left,x2:right,y1:y(v),y2:y(v),class:'df-gridline'}),s('text',{x:left-8,y:y(v)+4,'text-anchor':'end'},v.toLocaleString('en-US')));
      svg.append(s('text',{x:0,y:14,class:'axis-title','data-axis':'y'},metric.unit));
      if(metric.type==='line'){
        let pts=[];const flush=()=>{if(pts.length>1)svg.append(s('polyline',{points:pts.join(' '),fill:'none',stroke:'var(--df-blue)','stroke-width':2.5}));pts=[]};
        rows.forEach((r,i)=>{if(r[metric.id].value==null){flush();return}pts.push(`${x(i)},${y(r[metric.id].value)}`)});flush();
      }
      const labels=[];
      rows.forEach((r,i)=>{
        const p=r[metric.id],cx=x(i);
        svg.append(s('text',{x:cx,y:bottom+21+(step<36&&i%2===1?22:0),'text-anchor':'middle','data-year-label':'','data-year':r.year},r.label));
        if(p.value==null){svg.append(s('text',{x:cx,y:bottom-10,'text-anchor':'middle','data-missing-label':'','data-year':r.year},'รออัปเดต'));return}
        const yy=y(p.value);
        if(metric.type==='bar'){const bw=Math.min(52,step*.58);svg.append(s('rect',{x:cx-bw/2,y:yy,width:bw,height:bottom-yy,fill:'var(--df-blue)',opacity:.85}))}
        else svg.append(s('circle',{cx,cy:yy,r:4.5,fill:'var(--df-blue)'}));
        const label=s('text',{x:cx,y:yy-10,'text-anchor':'middle','data-value-label':'','data-row-index':i},num(p.value,metric.unit,metric.decimals)+(metric.unit==='%'?'%':''));svg.append(label);labels.push({label,cx,yy});
        const hit=s('rect',{x:cx-step/2,y:top,width:step,height:bottom-top,fill:'transparent','data-chart-hit':''});hit.append(s('title',{},`${r.label}: ${num(p.value,metric.unit,metric.decimals)} ${metric.unit}`));svg.append(hit);
      });
      // Preserve every numeric label and its horizontal center. Stagger only when measured text overlaps.
      const placed=[];
      const overlaps=(a,b)=>a.x<b.x+b.width+4&&a.x+a.width+4>b.x&&a.y<b.y+b.height+4&&a.y+a.height+4>b.y;
      for(const {label,cx,yy}of labels){
        let box=label.getBBox(),attempt=0;
        while(placed.some(p=>overlaps(box,p))&&attempt<10){label.setAttribute('y',Number(label.getAttribute('y'))-box.height-5);box=label.getBBox();attempt++}
        placed.push({x:box.x,y:box.y,width:box.width,height:box.height});
        if(attempt){const line=s('line',{x1:cx,x2:cx,y1:Number(label.getAttribute('y'))+4,y2:yy-5,stroke:'var(--df-muted)','stroke-width':1,'data-label-guide':''});svg.insertBefore(line,label)}
      }
      addWatermark(svg,{w,left,right,top,bottom});
    }


  draw(svg);
}
