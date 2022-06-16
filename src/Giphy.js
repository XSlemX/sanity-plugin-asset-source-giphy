import React, {useEffect, useState} from "react"
import FormField from "part:@sanity/components/formfields/default"
import FieldSet from "part:@sanity/components/fieldsets/default"
import config from "config:asset-source-giphy"
import {
  Dialog,
  Button,
  Card,
  TextInput as Input,
  Container,
  Heading,
  Select,
  studioTheme,
  Spinner,
  ThemeProvider, Inline, Radio, Label, Stack, Flex
} from '@sanity/ui'
import axios from "axios"
import useDebounce from "./useDebounce"
import Preview from "./Preview"
import NoApiKeyWarning from "./NoApiKeyWarning"


//console
const instance = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs",
})

const ratings = ["G", "PG", "PG-13", "R"].map(r => ({title: r, value: r}))

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
    setSearchTerm(e.currentTarget.value)
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
    <ThemeProvider theme={studioTheme}>
      <Dialog width={200} header={"Giphy Image Source"} onClose={onClose} id={"giphy-dialog"} title={"Testing"}>
        {isSearching && <Spinner fullscreen/>}

        <Card padding={4}>
          <FieldSet columns={1}>
            <FormField label={"Phrase"} labelFor={"searchInput"} description={"Result will come as you type"}>

              <Input placeholder={"Type phrase here"} id={"searchInput"} onChange={handleChange} value={searchTerm}
                     isClearable
                     onClear={() => setSearchTerm("")}
                     clearButton/>

            </FormField>

            <FormField label={"Rating"} labelFor={"ratingSelect"} description={"Choose what rating you would like"}>
                <Inline space={3}>
                  {ratings.map(r => (
                    <Label size={3}>
                      <Inline space={1}>
                        {r.title}
                        <Radio
                          defaultChecked={r.value === rating.value }
                          name="rating"
                          onChange={e => setRating(e.currentTarget.value)}
                          value={r.value}
                        />
                      </Inline>
                    </Label>
                  ))}
                </Inline>
            </FormField>
            <FormField>
              <Card>
                <Inline space={[3, 3, 4]}>
                  <Button
                    fontSize={[2, 2, 3]}
                    mode="ghost"
                    padding={[3, 3, 4]}
                    text="See trending"
                    onClick={handleTrendingClick}
                  />
                  <Button
                    fontSize={[2, 2, 3]}
                    padding={[3, 3, 4]}
                    text="I feel lucky"
                    tone="primary"
                    onClick={handleRandomClick}
                  />
                </Inline>
              </Card>
            </FormField>
          </FieldSet>
        </Card>
        <Container width={100} padding={4}>
          <Heading>{text}</Heading>
          <Flex wrap={"wrap"}>
            {results.map(result => (
              <Preview autoPlay={!!config.autoPlayAll} src={result.images.preview.mp4} item={result}
                       onClick={chooseItem}/>
            ))}
          </Flex>
        </Container>
      </Dialog>
    </ThemeProvider>
  )
}

export default Giphy
