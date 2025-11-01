import { useState } from "react"

export const ChatShell = () =>{

    const [userInput, setUserInput] = useState("")
    const [messages, setMessages] = useState<string[]>([])

    const onSend = ()=>{

      try {
        const req = await fetch("/api/ai/chat/stream/", {
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({q}),
            signal:ctrl.signal
        })
        const streamResponse = req.json() // it will come as stream, needo convert it to string
        const encode = Text.decoder()
        const decoded_Message = encode(streamresponse)
        setMessages((messagesessages, decoded_Message)

      }

    }

    const onAbort = ()=>{

    }


    return(
        <div>
            <div>
                {messages.map((message,idx)=>{ return   message })}
            </div>
        
            <input/>

            <div>
                Send
            </div>

            <div>
                Abort
            </div>
        </div>
    )
}