import{h as Q,r as h,j as e,i as W,u as X,k as w,l as G,m as Z,c as S,X as ee,n as se,C as l,b as c,L as v,I as L,B as V,N as C,A as k,o as A,U as te,P as ae,p as $,q as ie}from"./index-B-muSI-U.js";import{T as re,a as ne,b as T,c as P}from"./tabs-DwUyrDo1.js";import{A as K,a as O,b as _}from"./avatar-CfS_E9GH.js";/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=Q("Pencil",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]]),q=h.forwardRef(({className:a,...s},i)=>e.jsx("textarea",{className:W("flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",a),ref:i,...s}));q.displayName="Textarea";const ce="profile_state_",oe=5e3;class m{static getStateKey(s){return`${ce}${s}`}static saveState(s,i){try{const o={formData:i,lastModified:Date.now(),isDirty:!0};sessionStorage.setItem(this.getStateKey(s),JSON.stringify(o)),console.log("Profile state saved:",s)}catch(o){console.error("State save error:",o)}}static getState(s){try{const i=sessionStorage.getItem(this.getStateKey(s));return i?JSON.parse(i):null}catch(i){return console.error("State recovery error:",i),null}}static clearState(s){try{sessionStorage.removeItem(this.getStateKey(s)),console.log("Profile state cleared:",s)}catch(i){console.error("State clear error:",i)}}static hasUnsavedChanges(s){const i=this.getState(s);return(i==null?void 0:i.isDirty)??!1}static startAutoSave(s,i){return window.setInterval(()=>{s&&i&&this.saveState(s,i)},oe)}static stopAutoSave(s){clearInterval(s)}}const g=["https://api.dicebear.com/7.x/bottts/svg?seed=1","https://api.dicebear.com/7.x/bottts/svg?seed=2","https://api.dicebear.com/7.x/bottts/svg?seed=3","https://api.dicebear.com/7.x/bottts/svg?seed=4","https://api.dicebear.com/7.x/bottts/svg?seed=5","https://api.dicebear.com/7.x/bottts/svg?seed=6"];function pe(){var E,I,R,M,D,F,B,H;const a=sessionStorage.getItem("userId"),{data:s,refetch:i}=X({queryKey:[`/api/users/${a}`],enabled:!!a&&a!=="null"&&!isNaN(parseInt(a,10)),retry:3,retryDelay:1e3,staleTime:3e4,initialData:a?w.getProfileCache(a):void 0,onSuccess:t=>{a&&t&&w.setProfileCache(a,t)}}),[o,f]=h.useState(!1),[d,x]=h.useState({displayName:"",avatarUrl:"",bio:"",profession:""}),{toast:u}=G(),[j,U]=h.useState(null);h.useEffect(()=>{if(s&&a){const t=m.getState(a);t&&t.isDirty?window.confirm("We found unsaved changes in your profile. Would you like to recover them?")?(x(t.formData),f(!0)):m.clearState(a):x({displayName:s.displayName||s.username||"",avatarUrl:s.avatarUrl||g[0],bio:s.bio||"",profession:s.profession||""})}},[s,a]),h.useEffect(()=>{if(o&&a){const t=m.startAutoSave(a,d);U(t)}else j&&(m.stopAutoSave(j),U(null));return()=>{j&&m.stopAutoSave(j)}},[o,d,a]);const N=Z({mutationFn:async t=>{try{if(!a)throw new Error("No user ID found");const r=await fetch(`/api/users/${a}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!r.ok){const b=await r.json();throw new Error(b.error||"Failed to update profile")}const p=await r.json();return a&&(w.updateProfileCache(a,p),m.clearState(a)),p}catch(r){throw console.error("Update mutation error:",r),r}},onSuccess:async t=>{ie.setQueryData([`/api/users/${a}`],t),await i(),f(!1),u({title:"Profile Updated",description:"Your profile has been successfully updated."})},onError:t=>{console.error("Profile update error:",t),u({variant:"destructive",title:"Update Failed",description:t.message||"Failed to update profile"})}}),J=()=>{s&&x({displayName:s.displayName||s.username||"",avatarUrl:s.avatarUrl||g[0],bio:s.bio||"",profession:s.profession||""}),f(!0)},Y=()=>{a&&m.clearState(a),s&&x({displayName:s.displayName||s.username||"",avatarUrl:s.avatarUrl||g[0],bio:s.bio||"",profession:s.profession||""}),f(!1)},z=async()=>{var t;try{if(!((t=d.displayName)!=null&&t.trim())){u({variant:"destructive",title:"Validation Error",description:"Display name cannot be empty"});return}await N.mutateAsync(d)}catch(r){console.error("Save error:",r),u({variant:"destructive",title:"Save Failed",description:"Please check your form inputs and try again."})}},y=t=>{const{name:r,value:p}=t.target;x(b=>({...b,[r]:p}))},n={mining:{currentHashRate:((E=s==null?void 0:s.currentHashRate)==null?void 0:E.toString())||"0",totalMined:(s==null?void 0:s.totalMined)||"0",activeTime:"45 days",efficiency:"98.5%",nodesContributed:3,lastReward:"2.5 NC (1 hour ago)"},network:{reputation:(s==null?void 0:s.reputation)||0,totalTransactions:(s==null?void 0:s.totalTransactions)||0,peersConnected:(s==null?void 0:s.peersConnected)||0,activeChallenges:(s==null?void 0:s.activeChallenges)||0,networkContribution:(s==null?void 0:s.networkContribution)||"Unknown",validatorStatus:(s==null?void 0:s.validatorStatus)||"Unknown"},verification:{status:((I=s==null?void 0:s.verification)==null?void 0:I.status)||"Unverified",level:((R=s==null?void 0:s.verification)==null?void 0:R.level)||"Basic",completedSteps:((M=s==null?void 0:s.verification)==null?void 0:M.completedSteps)||[],badges:((D=s==null?void 0:s.verification)==null?void 0:D.badges)||[]}};return e.jsxs("div",{className:"container mx-auto px-4 py-6 space-y-6",children:[e.jsxs("div",{className:"flex flex-col md:flex-row justify-between items-start md:items-center gap-4",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl sm:text-3xl font-bold",children:"Profile"}),e.jsx("p",{className:"text-muted-foreground",children:"Manage your profile and view your stats"})]}),o?e.jsxs("div",{className:"flex gap-2 w-full sm:w-auto",children:[e.jsxs(S,{variant:"outline",onClick:Y,className:"flex-1 sm:flex-none",children:[e.jsx(ee,{className:"h-4 w-4 mr-2"}),"Cancel"]}),e.jsxs(S,{onClick:z,disabled:N.isPending,className:"flex-1 sm:flex-none",children:[e.jsx(se,{className:"h-4 w-4 mr-2"}),N.isPending?"Saving...":"Save Changes"]})]}):e.jsxs(S,{onClick:J,className:"flex items-center gap-2 w-full sm:w-auto",children:[e.jsx(le,{className:"h-4 w-4"}),"Edit Profile"]})]}),e.jsx(l,{children:e.jsx(c,{className:"pt-6 space-y-6",children:o?e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx(v,{htmlFor:"displayName",children:"Display Name"}),e.jsx(L,{id:"displayName",name:"displayName",value:d.displayName,onChange:y,placeholder:"Enter your display name"})]}),e.jsxs("div",{children:[e.jsx(v,{children:"Avatar"}),e.jsx("div",{className:"grid grid-cols-3 sm:grid-cols-6 gap-4 mt-2",children:g.map((t,r)=>e.jsx("div",{className:`cursor-pointer rounded-lg p-2 ${d.avatarUrl===t?"bg-primary/10 ring-2 ring-primary":"hover:bg-muted"}`,onClick:()=>x(p=>({...p,avatarUrl:t})),children:e.jsxs(K,{className:"h-16 w-16",children:[e.jsx(O,{src:t}),e.jsx(_,{children:"Avatar"})]})},r))})]}),e.jsxs("div",{children:[e.jsx(v,{htmlFor:"bio",children:"Bio"}),e.jsx(q,{id:"bio",name:"bio",value:d.bio,onChange:y,placeholder:"Tell us about yourself",className:"h-24"})]}),e.jsxs("div",{children:[e.jsx(v,{htmlFor:"profession",children:"Profession"}),e.jsx(L,{id:"profession",name:"profession",value:d.profession,onChange:y,placeholder:"Your profession"})]})]}):e.jsxs("div",{className:"flex flex-col sm:flex-row items-start gap-6",children:[e.jsxs(K,{className:"h-24 w-24 border-4 border-background",children:[e.jsx(O,{src:(s==null?void 0:s.avatarUrl)||`https://api.dicebear.com/7.x/bottts/svg?seed=${s==null?void 0:s.username}`,alt:(s==null?void 0:s.displayName)||(s==null?void 0:s.username)}),e.jsx(_,{children:(H=((F=s==null?void 0:s.displayName)==null?void 0:F[0])||((B=s==null?void 0:s.username)==null?void 0:B[0]))==null?void 0:H.toUpperCase()})]}),e.jsxs("div",{className:"space-y-4 flex-1",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold",children:(s==null?void 0:s.displayName)||(s==null?void 0:s.username)}),(s==null?void 0:s.profession)&&e.jsx("p",{className:"text-muted-foreground",children:s.profession})]}),(s==null?void 0:s.bio)&&e.jsx("p",{className:"text-muted-foreground",children:s.bio})]})]})})}),e.jsx(l,{children:e.jsx(c,{className:"p-0",children:e.jsxs(re,{defaultValue:"mining",className:"w-full",children:[e.jsx("div",{className:"border-b overflow-x-auto",children:e.jsxs(ne,{className:"h-14 w-full justify-start gap-2 sm:gap-6 p-2 sm:p-4",children:[e.jsxs(T,{value:"mining",className:"flex items-center gap-2 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",children:[e.jsx(V,{className:"h-4 w-4 sm:h-5 sm:w-5"}),"Neural Mining"]}),e.jsxs(T,{value:"network",className:"flex items-center gap-2 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",children:[e.jsx(C,{className:"h-4 w-4 sm:h-5 sm:w-5"}),"Network Stats"]}),e.jsxs(T,{value:"activity",className:"flex items-center gap-2 text-sm sm:text-base whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",children:[e.jsx(k,{className:"h-4 w-4 sm:h-5 sm:w-5"}),"Activity"]})]})}),e.jsxs(P,{value:"mining",className:"p-4 sm:p-6 space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",children:[e.jsx(l,{children:e.jsx(c,{className:"pt-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Current Hash Rate"}),e.jsxs("p",{className:"text-xl sm:text-2xl font-bold text-primary",children:[n.mining.currentHashRate," H/s"]})]}),e.jsx(V,{className:"h-6 w-6 sm:h-8 sm:w-8 text-primary/20"})]})})}),e.jsx(l,{children:e.jsx(c,{className:"pt-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Total Mined"}),e.jsxs("p",{className:"text-xl sm:text-2xl font-bold text-primary",children:[n.mining.totalMined," NC"]})]}),e.jsx(A,{className:"h-6 w-6 sm:h-8 sm:w-8 text-primary/20"})]})})}),e.jsx(l,{children:e.jsx(c,{className:"pt-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Mining Efficiency"}),e.jsx("p",{className:"text-xl sm:text-2xl font-bold text-primary",children:n.mining.efficiency})]}),e.jsx(k,{className:"h-6 w-6 sm:h-8 sm:w-8 text-primary/20"})]})})})]}),e.jsx(l,{children:e.jsxs(c,{className:"pt-6",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Mining History"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{children:"Active Time"}),e.jsx("span",{className:"font-medium",children:n.mining.activeTime})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{children:"Nodes Contributed"}),e.jsx("span",{className:"font-medium",children:n.mining.nodesContributed})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{children:"Last Reward"}),e.jsx("span",{className:"font-medium",children:n.mining.lastReward})]})]})]})})]}),e.jsxs(P,{value:"network",className:"p-4 sm:p-6 space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6",children:[e.jsx(l,{children:e.jsxs(c,{className:"pt-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Network Reputation"}),e.jsxs("p",{className:"text-xl sm:text-2xl font-bold text-primary",children:[n.network.reputation,"%"]})]}),e.jsx(te,{className:"h-6 w-6 sm:h-8 sm:w-8 text-primary/20"})]}),e.jsx(ae,{value:n.network.reputation,className:"mt-2"})]})}),e.jsx(l,{children:e.jsx(c,{className:"pt-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Connected Peers"}),e.jsx("p",{className:"text-xl sm:text-2xl font-bold text-primary",children:n.network.peersConnected})]}),e.jsx(C,{className:"h-6 w-6 sm:h-8 sm:w-8 text-primary/20"})]})})}),e.jsx(l,{children:e.jsx(c,{className:"pt-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Active Challenges"}),e.jsx("p",{className:"text-xl sm:text-2xl font-bold text-primary",children:n.network.activeChallenges})]}),e.jsx(k,{className:"h-6 w-6 sm:h-8 sm:w-8 text-primary/20"})]})})})]}),e.jsx(l,{children:e.jsxs(c,{className:"pt-6",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Network Status"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{children:"Total Transactions"}),e.jsx("span",{className:"font-medium",children:n.network.totalTransactions})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{children:"Network Contribution"}),e.jsx($,{variant:"outline",children:n.network.networkContribution})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{children:"Validator Status"}),e.jsx($,{variant:"outline",className:"bg-primary/10",children:n.network.validatorStatus})]})]})]})})]}),e.jsx(P,{value:"activity",className:"p-4 sm:p-6 space-y-6",children:e.jsx(l,{children:e.jsxs(c,{className:"pt-6",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Recent Activity"}),e.jsx("div",{className:"space-y-4",children:[{type:"Mining Reward",description:"Received 2.5 NC for successful mining operation",time:"1 hour ago",icon:A},{type:"Network Contribution",description:"Validated 50 transactions in the latest block",time:"3 hours ago",icon:C},{type:"Badge Earned",description:"Achieved 'Power Miner' status",time:"1 day ago",icon:A}].map((t,r)=>e.jsxs("div",{className:"flex items-start gap-4 p-4 rounded-lg bg-muted/50",children:[e.jsx("div",{className:"p-2 rounded-full bg-primary/10",children:e.jsx(t.icon,{className:"h-4 w-4 text-primary"})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("p",{className:"font-medium",children:t.type}),e.jsx("span",{className:"text-sm text-muted-foreground",children:t.time})]}),e.jsx("p",{className:"text-sm text-muted-foreground mt-1",children:t.description})]})]},r))})]})})})]})})})]})}export{pe as default};
