import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Dialog from "part:@sanity/components/dialogs/fullscreen"
import Input from "part:@sanity/components/textinputs/default"
import Spinner from "part:@sanity/components/loading/spinner"
import config from "config:asset-source-giphy"
import axios from "axios"
import useDebounce from "./useDebounce"
import Preview from "./Preview"
import Button from "part:@sanity/components/buttons/default"
import NoApiKeyWarning from "./NoApiKeyWarning"

const instance = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs",
})

const Giphy = ({onClose, onSelect}) => {

  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [text, setText] = useState("")
  const [hasApiKey, setHasApiKey] = useState(false)

  const debounced = useDebounce(searchTerm, 500)


  useEffect(() => {
    setHasApiKey(!!config.api_key)
  }, [])
  useEffect(() => {
    if (debounced && debounced.length >= 3) {
      setIsSearching(true)
      search()
        .then(setResults)
        .then(() => {
          setText(`Showing result for ${debounced}`)
          setIsSearching(false)
        })
    } else {
      setResults([])
    }
  }, [debounced])

  useEffect(() => {
    handleTrendingClick()
  }, [])

  const search = (searchType = "search", params = {}) => {
    return instance.get(`/${searchType}`, {
      params: {
        q: debounced,
        api_key: config.apiKey,
        limit: 24,
        ...params
      }
    }).then(response => response.data).then(data => data.data)
  }

  const handleChange = e => {
    setSearchTerm(e.target.value)
  }

  const handleRandomClick = () => {
    setIsSearching(true)
    search("random", {}).then(result => {
      chooseItem(result)
      setIsSearching(false)
    })
  }

  const handleTrendingClick = () => {
    setIsSearching(true)
    setSearchTerm("")
    search("trending").then(results => {
      setText("Showing result for Trending")
      setResults(results)
      return results
    })
      .then(() => {
        setIsSearching(false)
      })
  }

  const chooseItem = (item, image) => {
    if (!item.images.hasOwnProperty(image)) {
      console.warn("No such image on this item", image)
      return
    }

    onSelect([{
      kind: "url",
      value: item.images[image].url,
      assetDocumentProps: {
        originalFilename: item.title, // Use this filename when the asset is saved as a file by someone.
        source: {
          // The source this image is from
          name: "giphy.com",
          // A string that uniquely idenitfies it within the source.
          // In this example the URL is the closest thing we have as an actual ID.
          id: item.id
        },
        description: item.title,
        creditLine: "By giphy.com"
      }
    }])
  }

  if(hasApiKey) {
    return <NoApiKeyWarning/>
  }

  return (
    <Dialog title={"Select image from Giphy"} onClose={onClose} isOpen>
      <InputContainer>
        <InputInner>
          <label htmlFor={"searchInput"}>Enter phrase</label>
          <Input id={"searchInput"} onChange={handleChange} value={searchTerm} isClearable
                 onClear={() => setSearchTerm("")}/>

        </InputInner>
        {isSearching && <Spinner inline/>}

      </InputContainer>
      <Button color={"primary"} kind={"simple"} onClick={handleTrendingClick}>See trending</Button>
      <Button color={"warning"} kind={"simple"} onClick={handleRandomClick}>I feel lucky</Button>
      <div>
        <h3>{text}</h3>
        <Grid>

          {results.map(result => (
            <Preview autoPlay={!!config.autoPlayAll} src={result.images.preview.mp4} item={result}
                     onClick={chooseItem}/>
          ))}
        </Grid>
      </div>
    </Dialog>
  )
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const InputInner = styled.div`
  flex-grow: 1;
  margin-right: 24px;
`

const Grid = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  width: 100%;
`

export default Giphy
