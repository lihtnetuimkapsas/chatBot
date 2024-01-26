import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import  { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"

const API_KEY = "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";

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, write something",
      sender: "ChatGPT"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);
    await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMessages) {
     let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant"
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
     });

     const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old."
     }

     const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
     }

     await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
     }).then((data) => {
      return data.json();
     }).then((data) => {
      console.log(data);
     });
  }

  return (
      <div className='App'>
        <div style={{position: "relative", height:"800px", width:"700px"}}>
          <MainContainer>
            <ChatContainer>
              <MessageList
                typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null }>

              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
              </MessageList>
              <MessageInput placeholder='Type text here' onSend={handleSend}/>
            </ChatContainer>
          </MainContainer>
        </div>
      </div>
  )
}
export default App
