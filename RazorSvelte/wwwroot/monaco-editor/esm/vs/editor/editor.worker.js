import{b_ as e,bm as s}from"../../../../editorSimpleWorker-af04217f.js";let o=!1;function n(n){if(o)return;o=!0;const a=new e((e=>{self.postMessage(e)}),(e=>new s(e,n)));self.onmessage=e=>{a.onmessage(e.data)}}self.onmessage=e=>{o||n(null)};export{n as initialize};