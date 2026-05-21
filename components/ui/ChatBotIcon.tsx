import Image from 'next/image'
import React from 'react'

type ChatBotIconProps = {
  width?: number
  height?: number
  className?: string
}

const ChatBotIcon = ({
  width = 20,
  height = 20,
  className = '',
}: ChatBotIconProps) => {
  return (
    <div className={className}>
      <Image
        src="/chatboticon.png"
        alt="chat Bot Icon"
        width={width}
        height={height}
      />
    </div>
  )
}

export default ChatBotIcon