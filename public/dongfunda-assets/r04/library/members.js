(()=>{
const search=document.getElementById('stock-search'),sector=document.getElementById('sector');
if(!search||!sector)return;
const cards=[...document.querySelectorAll('[data-company-card]')];
const normalise=value=>value.toLowerCase().replace(/\s+/g,'');
function filter(){
 const query=normalise(search.value.trim());let count=0;
 for(const card of cards){
  const found=(!query||normalise(card.dataset.search||'').includes(query))&&(sector.value==='all'||sector.value===card.dataset.sector);
  card.hidden=!found;if(found)count++;
 }
 document.querySelector('.guide').hidden=count===0;
 document.getElementById('empty-state').hidden=count>0;
 document.getElementById('result-count').textContent=`พบ ${count} บริษัท`;
 document.getElementById('clear-search').hidden=!search.value;
}
search.addEventListener('input',filter);sector.addEventListener('change',filter);
for(const id of ['clear-search','reset-search'])document.getElementById(id).addEventListener('click',()=>{search.value='';sector.value='all';filter();search.focus();});
filter();
})();
