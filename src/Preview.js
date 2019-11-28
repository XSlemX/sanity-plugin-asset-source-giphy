import React, { useEffect, useRef, useState } from "react"
import Button from "part:@sanity/components/buttons/dropdown"
import styled, { keyframes } from "styled-components"

const Preview = ({src, item, onClick, autoPlay = false}) => {
  const video = useRef(null)
  const [play, setPlay] = useState(false)

  useEffect(() => {
    if (autoPlay) {
      return
    }
    if (video.current) {
      if (play) {
        video.current.play()
      } else {
        video.current.pause()
      }
    }

  }, [play, autoPlay])
  if (!src) {
    return null
  }
  return (
    <Container>
      <Video ref={video} onMouseEnter={() => setPlay(true)}
             onMouseLeave={() => setPlay(false)} src={src} autoPlay={autoPlay} loop/>
      <Button kind={"simple"} onAction={({image}) => onClick(item, image)} items={[
        {
          title: "Save gif",
          icon: () => `📹`,
          image: "original"
        },
        {
          title: "Save still",
          icon: () => `📷`,
          image: "original_still"
        }
      ]} renderItem={item => (
        <div>
          <item.icon/>
          {item.title}</div>
      )}>Select</Button>
    </Container>
  )
}

const FadeIn = keyframes` 
0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`

const Container = styled.div`
  display: flex;
    flex-flow: column wrap;
    max-width: 300px;
    padding: 12px;
    animation: ${FadeIn} 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

`

const Video = styled.video`
    width: 300px;
    height: 300px;
    object-fit: cover;
`

export default Preview
