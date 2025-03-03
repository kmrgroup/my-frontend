import{h as l,l as k,u as T,j as e,a0 as C,g as p,C as a,b as c,I as j,c as i,a1 as I,a2 as R,a3 as $,a as M,P as L}from"./index-B-muSI-U.js";import{C as S}from"./copy-T2WXzVU5.js";import{T as P}from"./twitter-G7o6fbOS.js";import{M as U}from"./mail-CLWcakqD.js";import{S as V}from"./star-DqFsDWlQ.js";import{M as E}from"./message-square-BEybZihh.js";/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=l("Gift",[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=l("Share2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=l("Target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=l("Trophy",[["path",{d:"M6 9H4.5a2.5 2.5 0 0 1 0-5H6",key:"17hqa7"}],["path",{d:"M18 9h1.5a2.5 2.5 0 0 0 0-5H18",key:"lmptdp"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",key:"1nw9bq"}],["path",{d:"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",key:"1np0yb"}],["path",{d:"M18 2H6v7a6 6 0 0 0 12 0V2Z",key:"u46fv3"}]]);function B(){const{toast:o}=k(),{data:s,isLoading:N,error:d}=T({queryKey:["/api/referrals/stats"],queryFn:async()=>{const t=await fetch("/api/referrals/stats");if(!t.ok)throw t.status===401?new Error("Please log in to view your referral code"):new Error("Failed to fetch referral stats");return t.json()},retry:1,refetchOnWindowFocus:!1}),x=()=>{const t=(s==null?void 0:s.stats.totalReferrals)||0;return(s==null?void 0:s.stats.currentTier)==="GOLD"||(s==null?void 0:s.stats.currentTier)==="PLATINUM"||(s==null?void 0:s.stats.currentTier)==="SILVER"?100:Math.min(t/5*100,100)},g=()=>{switch((s==null?void 0:s.stats.currentTier)||"NONE"){case"GOLD":return"You've reached the highest tier!";case"PLATINUM":return"Next: Reach Gold tier by growing your network";case"SILVER":return"Next: Reach Platinum tier when your referrals start inviting others";default:return"Next: Reach Silver tier with 5 referrals"}};if(N)return e.jsx("div",{className:"flex items-center justify-center min-h-[200px]",children:e.jsx(C,{className:"h-8 w-8 animate-spin text-primary"})});if(d)return e.jsxs("div",{className:"flex flex-col items-center justify-center min-h-[200px] gap-4",children:[e.jsx(p,{className:"h-8 w-8 text-red-500"}),e.jsx("p",{className:"text-center text-red-500",children:d instanceof Error?d.message:"Failed to load referral data"})]});const r=s==null?void 0:s.code;if(!r)return e.jsxs("div",{className:"flex flex-col items-center justify-center min-h-[200px] gap-4",children:[e.jsx(p,{className:"h-8 w-8 text-yellow-500"}),e.jsx("p",{className:"text-center text-yellow-500",children:"No referral code available. Please try logging out and logging back in."})]});const n=`https://neura.network/ref/${r}`,h=t=>{navigator.clipboard.writeText(t),o({title:"Copied to clipboard",description:"Share with your friends to earn rewards!",duration:2e3})},w=()=>{const t=`Join me on Neura Network and earn rewards! Use my referral code: ${r}
${n}`;window.open(`https://wa.me/?text=${encodeURIComponent(t)}`,"_blank")},y=()=>{const t=`Join me on Neura Network and earn rewards! Use my referral code: ${r}
${n}`;window.open(`https://t.me/share/url?url=${encodeURIComponent(n)}&text=${encodeURIComponent(t)}`,"_blank")},v=()=>{const t=`Join me on Neura Network and earn rewards! Use my referral code: ${r}`;window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(n)}`,"_blank")},f=()=>{const t="Join Neura Network with my referral code",u=`Join me on Neura Network and earn rewards!

Use my referral code: ${r}
${n}`;window.location.href=`mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(u)}`},b=()=>{const t=`Join me on Neura Network and earn rewards!
Use my referral code: ${r}
${n}`;if(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))try{window.location.href=`instagram://share?text=${encodeURIComponent(t)}`}catch{window.open("https://www.instagram.com","_blank"),navigator.clipboard.writeText(t),o({title:"Share on Instagram",description:"Your referral code is ready to share!",duration:3e3})}else window.open("https://www.instagram.com","_blank"),navigator.clipboard.writeText(t),o({title:"Share on Instagram",description:"Your referral code is ready to share!",duration:3e3})};return e.jsxs("div",{className:"space-y-6 pb-16 md:pb-0",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold",children:"Referral Program"}),e.jsx("p",{className:"text-muted-foreground",children:"Invite friends and earn rewards together"})]}),e.jsxs("div",{className:"grid gap-6",children:[e.jsx(a,{children:e.jsx(c,{className:"pt-6",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Your Referral Code"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(j,{value:r,readOnly:!0}),e.jsx(i,{variant:"outline",size:"icon",onClick:()=>h(r),children:e.jsx(S,{className:"h-4 w-4"})})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Share Link"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(j,{value:n,readOnly:!0}),e.jsx(i,{variant:"outline",size:"icon",onClick:()=>h(n),children:e.jsx(A,{className:"h-4 w-4"})})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Share via"}),e.jsxs("div",{className:"flex gap-2 flex-wrap",children:[e.jsxs(i,{variant:"outline",className:"flex items-center gap-2",onClick:w,children:[e.jsx(I,{className:"h-4 w-4"}),"WhatsApp"]}),e.jsxs(i,{variant:"outline",className:"flex items-center gap-2",onClick:y,children:[e.jsx(R,{className:"h-4 w-4"}),"Telegram"]}),e.jsxs(i,{variant:"outline",className:"flex items-center gap-2",onClick:v,children:[e.jsx(P,{className:"h-4 w-4"}),"Twitter"]}),e.jsxs(i,{variant:"outline",className:"flex items-center gap-2",onClick:f,children:[e.jsx(U,{className:"h-4 w-4"}),"Email"]}),e.jsxs(i,{variant:"outline",className:"flex items-center gap-2",onClick:b,children:[e.jsx($,{className:"h-4 w-4"}),"Instagram"]})]})]})]})})}),e.jsxs(a,{children:[e.jsxs(M,{children:[e.jsx("h2",{className:"text-xl font-semibold",children:"Your Progress"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:g()})]}),e.jsx(c,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between text-sm mb-2",children:[e.jsx("span",{children:"Progress to next tier"}),e.jsxs("span",{children:[Math.round(x()),"%"]})]}),e.jsx(L,{value:x(),className:"h-2"})]}),e.jsxs("div",{className:"grid gap-4 md:grid-cols-3",children:[e.jsx("div",{className:`p-4 rounded-lg transition-transform hover:scale-105 cursor-pointer
                    ${(s==null?void 0:s.stats.currentTier)==="SILVER"?"bg-primary/10 border-2 border-primary":"bg-muted/50 hover:bg-muted/70"}`,children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:`p-3 rounded-full transition-colors
                      ${(s==null?void 0:s.stats.currentTier)==="SILVER"?"bg-primary/20":"bg-silver-500/10"}`,children:e.jsx(O,{className:`h-6 w-6 transition-all
                        ${(s==null?void 0:s.stats.currentTier)==="SILVER"?"text-primary animate-pulse":"text-muted-foreground"}`})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold",children:"Silver"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:(s==null?void 0:s.stats.currentTier)==="SILVER"?"✨ Current Tier":"5 Referrals"})]})]})}),e.jsx("div",{className:`p-4 rounded-lg transition-transform hover:scale-105 cursor-pointer
                    ${(s==null?void 0:s.stats.currentTier)==="PLATINUM"?"bg-primary/10 border-2 border-primary":"bg-muted/50 hover:bg-muted/70"}`,children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:`p-3 rounded-full transition-colors
                      ${(s==null?void 0:s.stats.currentTier)==="PLATINUM"?"bg-primary/20":"bg-primary/10"}`,children:e.jsx(V,{className:`h-6 w-6 transition-all
                        ${(s==null?void 0:s.stats.currentTier)==="PLATINUM"?"text-primary animate-pulse":"text-muted-foreground"}`})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold",children:"Platinum"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:(s==null?void 0:s.stats.currentTier)==="PLATINUM"?"✨ Current Tier":"10% Bonus"})]})]})}),e.jsx("div",{className:`p-4 rounded-lg transition-transform hover:scale-105 cursor-pointer
                    ${(s==null?void 0:s.stats.currentTier)==="GOLD"?"bg-primary/10 border-2 border-primary":"bg-muted/50 hover:bg-muted/70"}`,children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:`p-3 rounded-full transition-colors
                      ${(s==null?void 0:s.stats.currentTier)==="GOLD"?"bg-primary/20":"bg-yellow-500/10"}`,children:e.jsx(G,{className:`h-6 w-6 transition-all
                        ${(s==null?void 0:s.stats.currentTier)==="GOLD"?"text-primary animate-pulse":"text-muted-foreground"}`})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold",children:"Gold"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:(s==null?void 0:s.stats.currentTier)==="GOLD"?"✨ Current Tier":"5% Network Bonus"})]})]})})]})]})})]}),e.jsxs("div",{className:"grid gap-6 md:grid-cols-2 lg:grid-cols-4",children:[e.jsx(a,{children:e.jsx(c,{className:"pt-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Total Referrals"}),e.jsx("p",{className:"text-2xl font-bold",children:(s==null?void 0:s.stats.totalReferrals)||0})]}),e.jsx("div",{className:"bg-primary/10 p-3 rounded-full",children:e.jsx(E,{className:"h-6 w-6 text-primary"})})]})})}),e.jsx(a,{children:e.jsx(c,{className:"pt-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Current Tier"}),e.jsx("p",{className:"text-2xl font-bold",children:(s==null?void 0:s.stats.currentTier)||"None"})]}),e.jsx("div",{className:"bg-yellow-500/10 p-3 rounded-full",children:e.jsx(m,{className:"h-6 w-6 text-yellow-500"})})]})})}),e.jsx(a,{children:e.jsx(c,{className:"pt-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Total Rewards"}),e.jsx("p",{className:"text-2xl font-bold",children:(s==null?void 0:s.stats.totalRewards)||"0 NC"})]}),e.jsx("div",{className:"bg-green-500/10 p-3 rounded-full",children:e.jsx(m,{className:"h-6 w-6 text-green-500"})})]})})}),e.jsx(a,{children:e.jsx(c,{className:"pt-6",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:"Pending Rewards"}),e.jsx("p",{className:"text-2xl font-bold",children:(s==null?void 0:s.stats.pendingRewards)||"0 NC"})]}),e.jsx("div",{className:"bg-purple-500/10 p-3 rounded-full",children:e.jsx(m,{className:"h-6 w-6 text-purple-500"})})]})})})]})]})]})}export{B as default};
