module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},96562,e=>e.a(async(t,r)=>{try{let t=await e.y("@neondatabase/serverless-e7acaa0c831d5378");e.n(t),r()}catch(e){r(e)}},!0),54799,(e,t,r)=>{t.exports=e.x("crypto",()=>require("crypto"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},50364,e=>e.a(async(t,r)=>{try{var n=e.i(89171),a=e.i(79832),s=e.i(84501),o=e.i(7304),i=e.i(75225),l=e.i(49129),d=t([a,s]);async function p(){let e=await (0,a.auth)();if(!e?.user)return n.NextResponse.json({error:"Unauthorized"},{status:401});let t=e.user.id,r=await s.db.query.projects.findMany({where:(0,i.eq)(o.projects.userId,t),orderBy:(0,l.desc)(o.projects.updatedAt)});return n.NextResponse.json(r)}async function c(e){let t=await (0,a.auth)();if(!t?.user)return n.NextResponse.json({error:"Unauthorized"},{status:401});let r=t.user.id,{name:i,description:l}=await e.json(),[d]=await s.db.insert(o.projects).values({userId:r,name:i||"Untitled Project",description:l}).returning();return await s.db.insert(o.files).values([{projectId:d.id,name:"pages/_app.tsx",path:"/pages/_app.tsx",language:"typescriptreact",content:`import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
`},{projectId:d.id,name:"pages/index.tsx",path:"/pages/index.tsx",language:"typescriptreact",content:`import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>My Vibe App</title>
        <meta name="description" content="Built with Vibe Coding" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Built with Vibe Coding
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Hello, Vibe! 🚀
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            Start building by chatting with the AI. Describe what you want and watch it come to life.
          </p>
          <div className="flex gap-3 justify-center">
            <button className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-medium rounded-lg transition-colors">
              Get Started
            </button>
            <button className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium rounded-lg border border-slate-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
`},{projectId:d.id,name:"styles/globals.css",path:"/styles/globals.css",language:"css",content:`@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 15, 23, 42;
  --background-end-rgb: 30, 41, 59;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(135deg, rgb(var(--background-start-rgb)), rgb(var(--background-end-rgb)));
  min-height: 100vh;
}
`},{projectId:d.id,name:"components/Button.tsx",path:"/components/Button.tsx",language:"typescriptreact",content:`import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({ variant = "primary", size = "md", children, className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/25",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200",
    outline: "border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white",
    ghost: "hover:bg-slate-700/50 text-slate-400 hover:text-white",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  return <button className={\`\${base} \${variants[variant]} \${sizes[size]} \${className}\`} {...props}>{children}</button>;
}
`},{projectId:d.id,name:"package.json",path:"/package.json",language:"json",content:`{
  "name": "vibe-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  }
}
`},{projectId:d.id,name:"tailwind.config.ts",path:"/tailwind.config.ts",language:"typescript",content:`import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx"],
  theme: { extend: {} },
  plugins: [],
};

export default config;
`},{projectId:d.id,name:"tsconfig.json",path:"/tsconfig.json",language:"json",content:`{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
`},{projectId:d.id,name:"next.config.js",path:"/next.config.js",language:"javascript",content:`/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true };
module.exports = nextConfig;
`}]),n.NextResponse.json(d)}[a,s]=d.then?(await d)():d,e.s(["GET",0,p,"POST",0,c]),r()}catch(e){r(e)}},!1),77981,e=>e.a(async(t,r)=>{try{var n=e.i(47909),a=e.i(74017),s=e.i(96250),o=e.i(59756),i=e.i(61916),l=e.i(74677),d=e.i(69741),p=e.i(16795),c=e.i(87718),u=e.i(95169),g=e.i(47587),x=e.i(66012),m=e.i(70101),h=e.i(26937),b=e.i(10372),v=e.i(93695);e.i(52474);var f=e.i(220),y=e.i(50364),w=t([y]);[y]=w.then?(await w)():w;let j=new n.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/projects/route",pathname:"/api/projects",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/projects/route.ts",nextConfigOutput:"",userland:y,...{}}),{workAsyncStorage:C,workUnitAsyncStorage:E,serverHooks:N}=j;async function R(e,t,r){r.requestMeta&&(0,o.setRequestMeta)(e,r.requestMeta),j.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/projects/route";n=n.replace(/\/index$/,"")||"/";let s=await j.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:y,deploymentId:w,params:R,nextConfig:C,parsedUrl:E,isDraftMode:N,prerenderManifest:A,routerServerContext:P,isOnDemandRevalidate:k,revalidateOnlyGenerated:T,resolvedPathname:q,clientReferenceManifest:I,serverActionsManifest:S}=s,H=(0,d.normalizeAppPath)(n),M=!!(A.dynamicRoutes[H]||A.routes[q]),_=async()=>((null==P?void 0:P.render404)?await P.render404(e,t,E,!1):t.end("This page could not be found"),null);if(M&&!N){let e=!!A.routes[q],t=A.dynamicRoutes[H];if(t&&!1===t.fallback&&!e){if(C.adapterPath)return await _();throw new v.NoFallbackError}}let O=null;!M||j.isDev||N||(O=q,O="/index"===O?"/":O);let U=!0===j.isDev||!M,B=M&&!U;S&&I&&(0,l.setManifestsSingleton)({page:n,clientReferenceManifest:I,serverActionsManifest:S});let D=e.method||"GET",$=(0,i.getTracer)(),L=$.getActiveScopeSpan(),z=!!(null==P?void 0:P.isWrappedByNextServer),F=!!(0,o.getRequestMeta)(e,"minimalMode"),K=(0,o.getRequestMeta)(e,"incrementalCache")||await j.getIncrementalCache(e,C,A,F);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let V={params:R,previewProps:A.preview,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:U,incrementalCache:K,cacheLifeProfiles:C.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n,a)=>j.onRequestError(e,t,n,a,P)},sharedContext:{buildId:y,deploymentId:w}},G=new p.NodeNextRequest(e),W=new p.NodeNextResponse(t),X=c.NextRequestAdapter.fromNodeNextRequest(G,(0,c.signalFromNodeResponse)(t));try{let s,o=async e=>j.handle(X,V).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=$.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${D} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t),s&&s!==e&&(s.setAttribute("http.route",a),s.updateName(t))}else e.updateName(`${D} ${n}`)}),l=async s=>{var i,l;let d=async({previousCacheEntry:a})=>{try{if(!F&&k&&T&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(s);e.fetchMetrics=V.renderOpts.fetchMetrics;let i=V.renderOpts.pendingWaitUntil;i&&r.waitUntil&&(r.waitUntil(i),i=void 0);let l=V.renderOpts.collectedTags;if(!M)return await (0,x.sendResponse)(G,W,n,V.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[b.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==V.renderOpts.collectedRevalidate&&!(V.renderOpts.collectedRevalidate>=b.INFINITE_CACHE)&&V.renderOpts.collectedRevalidate,a=void 0===V.renderOpts.collectedExpire||V.renderOpts.collectedExpire>=b.INFINITE_CACHE?void 0:V.renderOpts.collectedExpire;return{value:{kind:f.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==a?void 0:a.isStale)&&await j.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,g.getRevalidateReason)({isStaticGeneration:B,isOnDemandRevalidate:k})},!1,P),t}},p=await j.handleResponse({req:e,nextConfig:C,cacheKey:O,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:k,revalidateOnlyGenerated:T,responseGenerator:d,waitUntil:r.waitUntil,isMinimalMode:F});if(!M)return null;if((null==p||null==(i=p.value)?void 0:i.kind)!==f.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(l=p.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});F||t.setHeader("x-nextjs-cache",k?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,m.fromNodeOutgoingHttpHeaders)(p.value.headers);return F&&M||c.delete(b.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,h.getCacheControlHeader)(p.cacheControl)),await (0,x.sendResponse)(G,W,new Response(p.value.body,{headers:c,status:p.value.status||200})),null};z&&L?await l(L):(s=$.getActiveScopeSpan(),await $.withPropagatedContext(e.headers,()=>$.trace(u.BaseServerSpan.handleRequest,{spanName:`${D} ${n}`,kind:i.SpanKind.SERVER,attributes:{"http.method":D,"http.target":e.url}},l),void 0,!z))}catch(t){if(t instanceof v.NoFallbackError||await j.onRequestError(e,t,{routerKind:"App Router",routePath:H,routeType:"route",revalidateReason:(0,g.getRevalidateReason)({isStaticGeneration:B,isOnDemandRevalidate:k})},!1,P),M)throw t;return await (0,x.sendResponse)(G,W,new Response(null,{status:500})),null}}e.s(["handler",0,R,"patchFetch",0,function(){return(0,s.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:E})},"routeModule",0,j,"serverHooks",0,N,"workAsyncStorage",0,C,"workUnitAsyncStorage",0,E]),r()}catch(e){r(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__03yfqo_._.js.map