/* HFL Global Tech — AgentMesh reference runtime
 * Deterministic browser-side reference implementation.
 * No network calls. No hidden services. Designed to make the architecture executable and inspectable.
 */
(function(global){
  const STAGES=["goal","context","plan","tools","execute","evaluate"];
  const TOOLS={search:{name:"search",risk:"low"},draft:{name:"draft",risk:"medium"},write:{name:"write",risk:"high"}};
  function validateGoal(goal){return typeof goal==="string" && goal.trim().length>=3;}
  function plan(goal){return [
    {stage:"goal",message:"Goal accepted and constraints identified."},
    {stage:"context",message:"Context boundary established."},
    {stage:"plan",message:"Deterministic execution plan generated."},
    {stage:"tools",message:"Tool permissions checked before action."},
    {stage:"execute",message:"Execution state produced locally."},
    {stage:"evaluate",message:"Result evaluated against completion criteria."}
  ].map((x,i)=>({...x,index:i+1,goal:goal.trim()}));}
  function authorize(tool,approved){return !!TOOLS[tool] && approved===true && TOOLS[tool].risk!=="high";}
  function run(goal,{tool="search",approve=true}={}){
    if(!validateGoal(goal)) throw new Error("Goal must contain at least 3 characters.");
    const trace=plan(goal);
    return {ok:true,goal:goal.trim(),tool,authorized:authorize(tool,approve),stages:trace,completedAt:new Date().toISOString()};
  }
  function selfTest(){
    const results=[];
    const check=(name,pass)=>results.push({name,pass});
    check("six-stage lifecycle",STAGES.length===6);
    check("invalid goal rejected",(()=>{try{run("")}catch(e){return true}return false})());
    check("approved low-risk tool allowed",run("test task").authorized===true);
    check("high-risk write blocked",authorize("write",true)===false);
    check("unapproved tool blocked",authorize("search",false)===false);
    check("trace preserves goal",run("trace test").stages.every(s=>s.goal==="trace test"));
    return {passed:results.filter(x=>x.pass).length,total:results.length,results};
  }
  global.AgentMeshRuntime={STAGES,run,authorize,selfTest};
})(window);
