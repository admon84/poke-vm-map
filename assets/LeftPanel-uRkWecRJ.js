import{A as e,X as t}from"./react-vendor-ZjqdYyzx.js";import"./vendor-B131Y2xX.js";import{n}from"./index-ClmXECPO.js";var r=t();function i({isOpen:t,activeContent:i,onClose:a,children:o}){return(0,r.jsxs)(r.Fragment,{children:[t&&(0,r.jsx)(`div`,{className:`fixed inset-0 bg-black/20 z-[1040] transition-opacity duration-300`,onClick:a,"aria-hidden":`true`}),(0,r.jsxs)(`aside`,{className:`
          fixed left-0 top-[68px] bottom-0 w-96 
          bg-slate-900/95 backdrop-blur-md
          shadow-2xl border-r border-slate-700
          z-[1050]
          transform transition-transform duration-300 ease-out
          ${t?`translate-x-0`:`-translate-x-full`}
        `,"aria-label":`Left panel`,"aria-hidden":!t,children:[(0,r.jsxs)(`div`,{className:`flex items-center justify-between px-4 py-3 border-b border-slate-700`,children:[(0,r.jsxs)(`h2`,{className:`text-lg font-semibold text-white`,children:[i===`nearest`&&`Nearest Locations`,i===`search`&&`Search`,i===`categories`&&`Categories`,i===`saved`&&`Saved Locations`]}),(0,r.jsx)(n,{variant:`ghost`,size:`sm`,onClick:a,"aria-label":`Close panel`,className:`text-white hover:text-slate-900 hover:bg-white`,children:(0,r.jsx)(e,{className:`h-4 w-4`,strokeWidth:2})})]}),(0,r.jsx)(`div`,{className:`overflow-y-auto h-[calc(100vh-57px-53px)] custom-scrollbar`,children:o})]})]})}export{i as LeftPanel};