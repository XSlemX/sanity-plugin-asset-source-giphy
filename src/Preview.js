import React, { useEffect, useRef, useState } from "react"
import Button from "part:@sanity/components/buttons/default"
import ButtonGroup from "part:@sanity/components/buttons/button-group"
import Card from "part:@sanity/components/previews/card"

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
      <Card title={item.title} media={() => <Video ref={video} onMouseEnter={() => setPlay(true)}
                                                   onMouseLeave={() => setPlay(false)} src={src} autoPlay={autoPlay}
                                                   loop/>}
            date={item.import_datetime} subtitle={`Rating: ${item.rating}`}
            mediaDimensions={{
              ...item.images.original,
              fit: "clip"
            }}>

        <ButtonGroup>
          <Button inverted onClick={() => onClick(item, "original")}>
            Original
          </Button>
          <Button inverted color={"primary"} onClick={() => onClick(item, "original_still")}>
            Still image
          </Button>
        </ButtonGroup>
      </Card>


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
    padding: 6px 0;
    animation: ${FadeIn} 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

`

const Video = styled.video`
    width: 300px;
    height: 300px;
    object-fit: cover;
`

export default Preview
