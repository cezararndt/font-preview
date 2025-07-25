import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFont } from "@/contexts/FontContext"

interface FontInfo {
  family: string
  weights: string[]
  styles: string[]
  unicodeRanges: string[]
}

const getPreferredWeight = (weights: string[]): string => {
  return weights.includes("400") ? "400" : weights[0] || "400"
}

const getPreferredStyle = (styles: string[]): string => {
  return styles.includes("normal") ? "normal" : styles[0] || "normal"
}

export function GoogleFontsLoader() {
  const {
    googleFontsUrl,
    setGoogleFontsUrl,
    fontInfos,
    setFontInfos,
    selectedFont,
    setSelectedFont,
    selectedWeight,
    setSelectedWeight,
    selectedStyle,
    setSelectedStyle,
    setError,
    loadFont,
    linkRef
  } = useFont()
  
  const [isLoading, setIsLoading] = useState(false)

  const parseWeightRange = (weightStr: string): string[] => {
    const trimmed = weightStr.trim()
    
    if (trimmed.includes(' ')) {
      const [min, max] = trimmed.split(' ').map(w => parseInt(w))
      if (!isNaN(min) && !isNaN(max)) {
        const commonWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900]
        return commonWeights
          .filter(w => w >= min && w <= max)
          .map(w => w.toString())
      }
    }
    
    return [trimmed]
  }

  const extractFontInfo = (cssText: string): FontInfo[] => {
    const fontFaces = cssText.match(/@font-face\s*{[^}]+}/g) || []
    const fontInfoMap = new Map<string, FontInfo>()

    fontFaces.forEach(fontFace => {
      const familyMatch = fontFace.match(/font-family:\s*['"]([^'"]+)['"]/i)
      const weightMatch = fontFace.match(/font-weight:\s*([^;]+)/i)
      const styleMatch = fontFace.match(/font-style:\s*([^;]+)/i)
      const unicodeMatch = fontFace.match(/unicode-range:\s*([^;]+)/i)

      if (familyMatch) {
        const family = familyMatch[1]
        const weightStr = weightMatch ? weightMatch[1].trim() : '400'
        const style = styleMatch ? styleMatch[1].trim() : 'normal'
        const unicodeRange = unicodeMatch ? unicodeMatch[1].trim() : ''

        if (!fontInfoMap.has(family)) {
          fontInfoMap.set(family, {
            family,
            weights: [],
            styles: [],
            unicodeRanges: []
          })
        }

        const fontInfo = fontInfoMap.get(family)!
        
        const weights = parseWeightRange(weightStr)
        weights.forEach(weight => {
          if (!fontInfo.weights.includes(weight)) {
            fontInfo.weights.push(weight)
          }
        })
        
        if (!fontInfo.styles.includes(style)) {
          fontInfo.styles.push(style)
        }
        
        if (unicodeRange && !fontInfo.unicodeRanges.includes(unicodeRange)) {
          fontInfo.unicodeRanges.push(unicodeRange)
        }
      }
    })

    fontInfoMap.forEach(fontInfo => {
      fontInfo.weights.sort((a, b) => parseInt(a) - parseInt(b))
    })

    return Array.from(fontInfoMap.values())
  }

  const handleLoadFont = async () => {
    if (!googleFontsUrl.trim()) {
      setError("Please enter a Google Fonts CSS URL")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      if (linkRef.current) {
        document.head.removeChild(linkRef.current)
        linkRef.current = null
      }

      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = googleFontsUrl
      link.crossOrigin = "anonymous"
      
      link.onload = async () => {
        try {
          const response = await fetch(googleFontsUrl)
          const cssText = await response.text()
          const extractedFontInfos = extractFontInfo(cssText)
          
          if (extractedFontInfos.length > 0) {
            setFontInfos(extractedFontInfos)
            const firstFont = extractedFontInfos[0]
            
            const defaultWeight = getPreferredWeight(firstFont.weights)
            const defaultStyle = getPreferredStyle(firstFont.styles)
            
            setSelectedFont(firstFont.family)
            setSelectedWeight(defaultWeight)
            setSelectedStyle(defaultStyle)
            linkRef.current = link
            loadFont(firstFont.family, defaultWeight, defaultStyle)
          } else {
            setError("No fonts found in the CSS file")
          }
          
          setIsLoading(false)
        } catch {
          setError("Could not parse font families from CSS")
          setIsLoading(false)
        }
      }

      link.onerror = () => {
        setError("Failed to load Google Fonts CSS file")
        setIsLoading(false)
      }

      document.head.appendChild(link)

    } catch {
      setError("An error occurred while loading the Google Font")
      setIsLoading(false)
    }
  }

  const handleFontSelection = (fontFamily: string) => {
    setSelectedFont(fontFamily)
    const fontInfo = fontInfos.find(f => f.family === fontFamily)
    if (fontInfo) {
      const newWeight = getPreferredWeight(fontInfo.weights)
      const newStyle = getPreferredStyle(fontInfo.styles)
      setSelectedWeight(newWeight)
      setSelectedStyle(newStyle)
      loadFont(fontFamily, newWeight, newStyle)
    }
  }

  const handleWeightChange = (weight: string) => {
    setSelectedWeight(weight)
    loadFont(selectedFont, weight, selectedStyle)
  }

  const handleStyleChange = (style: string) => {
    setSelectedStyle(style)
    loadFont(selectedFont, selectedWeight, style)
  }

  const getCurrentFontInfo = () => {
    return fontInfos.find(f => f.family === selectedFont)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="google-fonts-url">Google Fonts CSS URL</Label>
        <Input
          id="google-fonts-url"
          type="url"
          autoComplete="off"
          placeholder="https://fonts.googleapis.com/css2?family=..."
          value={googleFontsUrl}
          onChange={(e) => setGoogleFontsUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Enter the Google Fonts CSS URL (e.g., from Google Fonts embed code)
        </p>
      </div>

      <Button onClick={handleLoadFont} disabled={!googleFontsUrl.trim() || isLoading} className="w-full">
        {isLoading ? "Loading..." : "Load Google Font"}
      </Button>

      {fontInfos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Font Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fontInfos.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="font-select">Font Family</Label>
                <Select value={selectedFont} onValueChange={handleFontSelection}>
                  <SelectTrigger id="font-select">
                    <SelectValue placeholder="Choose a font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontInfos.map((fontInfo) => (
                      <SelectItem key={fontInfo.family} value={fontInfo.family}>
                        {fontInfo.family}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {getCurrentFontInfo() && getCurrentFontInfo()!.weights.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="weight-select">Font Weight</Label>
                <Select value={selectedWeight} onValueChange={handleWeightChange}>
                  <SelectTrigger id="weight-select">
                    <SelectValue placeholder="Choose weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentFontInfo()!.weights.map((weight) => (
                      <SelectItem key={weight} value={weight}>
                        {weight === "100" ? "100 (Thin)" :
                         weight === "200" ? "200 (Extra Light)" :
                         weight === "300" ? "300 (Light)" :
                         weight === "400" ? "400 (Normal)" : 
                         weight === "500" ? "500 (Medium)" :
                         weight === "600" ? "600 (Semi Bold)" :
                         weight === "700" ? "700 (Bold)" :
                         weight === "800" ? "800 (Extra Bold)" :
                         weight === "900" ? "900 (Black)" : weight}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {getCurrentFontInfo() && getCurrentFontInfo()!.styles.length > 1 && (
              <div className="space-y-2">
                <Label htmlFor="style-select">Font Style</Label>
                <Select value={selectedStyle} onValueChange={handleStyleChange}>
                  <SelectTrigger id="style-select">
                    <SelectValue placeholder="Choose style" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentFontInfo()!.styles.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style === "normal" ? "Normal" : 
                         style === "italic" ? "Italic" : style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}