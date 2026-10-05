/* HFL Tech — AgentMesh cost-effectiveness calculator. Illustrative until HFL publishes measured pricing/benchmark data. */
(function(){
  const root=document.querySelector('[data-cost-calculator]');
  if(!root) return;
  const fmt=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
  const get=id=>root.querySelector('#'+id);
  const num=id=>Math.max(0,Number(get(id).value)||0);
  const pct=id=>Math.min(100,Math.max(0,num(id)))/100;
  const out={base:root.querySelector('[data-out="base"]'),agent:root.querySelector('[data-out="agent"]'),infra:root.querySelector('[data-out="infra"]'),hours:root.querySelector('[data-out="hours"]'),labor:root.querySelector('[data-out="labor"]'),total:root.querySelector('[data-out="total"]'),rate:root.querySelector('[data-out="rate"]')};
  const rateLabel=root.querySelector('.cost-highlight span');
  if(rateLabel) rateLabel.textContent='INFRASTRUCTURE COST REDUCTION';
  const update=()=>{
    const tasks=num('calc-tasks'), basePerK=num('calc-base'), agentPerK=num('calc-agent');
    const coverage=pct('calc-coverage'), minutes=num('calc-minutes'), hourly=num('calc-hourly');
    const base=tasks/1000*basePerK, agent=tasks/1000*agentPerK;
    const infra=Math.max(0,base-agent), hours=tasks*coverage*minutes/60, labor=hours*hourly, total=infra+labor;
    const rate=base>0?Math.max(0,Math.min(100,((base-agent)/base)*100)):0;
    out.base.textContent=fmt.format(base); out.agent.textContent=fmt.format(agent); out.infra.textContent=fmt.format(infra);
    out.hours.textContent=hours.toFixed(1)+' h'; out.labor.textContent=fmt.format(labor); out.total.textContent=fmt.format(total); out.rate.textContent=rate.toFixed(0)+'%';
  };
  root.querySelectorAll('input').forEach(el=>el.addEventListener('input',update)); update();
})();
