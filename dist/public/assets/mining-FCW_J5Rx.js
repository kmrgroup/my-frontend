import{r as m,u as o,j as e,C as x,a as u,B as l,b as h,c as p,A as j,d as f}from"./index-CvaSkwsT.js";function N(){const[n,a]=m.useState(!1),s=sessionStorage.getItem("userId"),{data:i,refetch:c}=o({queryKey:[`/api/users/${s}`],enabled:!!s,refetchInterval:2e3}),d=async()=>{if(s){a(!0);try{setTimeout(async()=>{await f("POST",`/api/mining/${s}`,{mined:2e-5,hashRate:0}),a(!1),c()},1e4)}catch(r){console.error("Mining error:",r),a(!1)}}};return e.jsxs("div",{className:"space-y-6 pb-16 md:pb-0",children:[e.jsx("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-center gap-4",children:e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold",children:"Neural Mining"}),e.jsx("p",{className:"text-muted-foreground",children:"Mine NeuraCoin by training neural networks"})]})}),e.jsx("div",{className:"grid gap-6",children:e.jsxs(x,{children:[e.jsx(u,{children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h2",{className:"text-xl font-semibold",children:"Mining Status"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(l,{className:"h-5 w-5 text-primary"}),e.jsxs("span",{className:"font-medium",children:[(i==null?void 0:i.totalMined)||"0.00000000"," NC"]})]})]})}),e.jsx(h,{children:n?e.jsx("div",{className:"p-6 rounded-lg bg-primary/5 border border-primary/10",children:e.jsxs("div",{className:"flex flex-col items-center space-y-4",children:[e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"}),e.jsx(l,{className:"h-16 w-16 text-primary animate-bounce relative z-10"})]}),e.jsx("p",{className:"text-sm font-medium animate-pulse",children:"Mining in Progress..."}),e.jsx("div",{className:"grid grid-cols-3 gap-2",children:Array.from({length:9}).map((r,t)=>e.jsx("div",{className:"w-2 h-2 rounded-full bg-primary animate-pulse",style:{animationDelay:`${t*.1}s`}},t))})]})}):e.jsxs(p,{className:"w-full",onClick:d,disabled:n,children:[e.jsx(j,{className:"w-4 h-4 mr-2"}),"Participate in Mining"]})})]})})]})}export{N as default};
