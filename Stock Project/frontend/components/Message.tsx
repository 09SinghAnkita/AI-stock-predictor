import Prism, { highlight } from 'prismjs';
import 'prismjs/components/prism-typescipt';
import 'prismjs/theme/prism.css'

export default function({role,text} :{role:'user'|'assistant',text: string}){

    const html = text.replace(/```(\w+)?\n([\s\S]*?)```/g,(_m, lang, code)=>{

        const l = (lang|| 'typescript') as any;
        const highlighted = Prism.highlight(code, (Prism as any).languages[l] || Prism.languages.typescript,l);
        return `<pre class="rounded-xl overflow-auto p-3 bg-netural-100 dark:bg-netural-900"><code>${highlighted}</code></pre>`
    }).replace(/\n/g,"<br/>");

    return (
        <div className={`rounded-2xl p-3 ${role==='user'?'bg-blue-50 dark:bg-blue-900/3': 'bg-neutral-50 dark:bg-neutral-800'}`}>
            <div className='prose prose-sm max-w-none dark:prose-invert' dangerouslySetInnerHTML={{__html : html}}/>
            <button className='mt-2 text-xs underline' onClick={()=>navigator.clipboard.writeText(text)}>copy</button>
        </div>
    )

}