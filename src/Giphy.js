import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Dialog from "part:@sanity/components/dialogs/fullscreen"
import Input from "part:@sanity/components/textinputs/default"
import FormField from "part:@sanity/components/formfields/default"
import FieldSet from "part:@sanity/components/fieldsets/default"
import Spinner from "part:@sanity/components/loading/spinner"
import Select from "part:@sanity/components/selects/default"
import ButtonGroup from "part:@sanity/components/buttons/button-group"
import config from "config:asset-source-giphy"
import axios from "axios"
import useDebounce from "./useDebounce"
import Preview from "./Preview"
import Button from "part:@sanity/components/buttons/default"
import NoApiKeyWarning from "./NoApiKeyWarning"

const instance = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs",
})

const ratings = ["G", "PG", "PG-13", "R"].map(r => ({title: r}))

const Giphy = ({onClose, onSelect}) => {

  const [searchTerm, setSearchTerm] = useState("")
  const [rating, setRating] = useState(ratings[0])
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [text, setText] = useState("")
  const [hasApiKey, setHasApiKey] = useState(false)
  const [isTrendingResult, setIsTrendingResult] = useState(true)

  const debounced = useDebounce(searchTerm, 500)

  useEffect(() => {
    setHasApiKey(!!config.apiKey)
  }, [config])

  useEffect(() => {
    if (debounced && debounced.length >= 3) {
      handleSearch()
    } else {
      setResults([])
    }
  }, [debounced])

  useEffect(() => {
    if (isTrendingResult) {
      handleTrendingClick()
    } else {
      handleSearch()
    }
  }, [rating])

  const search = (searchType = "search", params = {}) => {
    return instance.get(`/${searchType}`, {
      params: {
        q: debounced,
        api_key: config.apiKey,
        limit: 24,
        rating: rating.title,
        ...params
      }
    }).then(response => response.data).then(data => data.data)
  }

  const handleSearch = () => {
    setIsSearching(true)
    setIsTrendingResult(false)
    search()
      .then(setResults)
      .then(() => {
        setText(`Showing result for ${debounced}`)
        setIsSearching(false)
      })
  }

  const handleChange = e => {
    setSearchTerm(e.target.value)
  }

  const handleRandomClick = () => {
    setIsSearching(true)
    search("random", {}).then(result => {
      chooseItem(result, "original")
      setIsSearching(false)
    })
  }

  const handleTrendingClick = () => {
    setIsTrendingResult(true)
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

  if (!hasApiKey) {
    return <NoApiKeyWarning/>
  }

  return (
    <Dialog title={"Select image from Giphy"} onClose={onClose} isOpen>
      {isSearching && <Spinner fullscreen/>}

      <FieldSet legend={"Input controls"} description={"This is a description"} isCollapsible columns={1}>
        <FormField label={"Phrase"} labelFor={"searchInput"} description={"Result will come as you type"}>

          <Input placeholder={"Type phrase here"} id={"searchInput"} onChange={handleChange} value={searchTerm}
                 isClearable
                 onClear={() => setSearchTerm("")}/>

        </FormField>

        <FormField label={"Rating"} labelFor={"ratingSelect"} description={"Choose what rating you would like"}>
          <Select id={"ratingSelect"} items={ratings} onChange={setRating} value={rating} inline/>
        </FormField>
        <FormField>
          <ButtonGroup>
            <Button color={"primary"} inverted onClick={handleTrendingClick}>See trending</Button>
            <Button color={"warning"} inverted onClick={handleRandomClick}>I feel lucky</Button>
          </ButtonGroup>
        </FormField>
      </FieldSet>
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

const Grid = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  justify-content: space-around;
  width: 100%;
`

export default Giphy
