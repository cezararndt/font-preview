import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFont } from "@/contexts/FontContext"

export function TypekitLoader() {
  const { typekitUrl, setTypekitUrl, setError, loadFont, linkRef } = useFont()
  const [isLoading, setIsLoading] = useState(false)

  const extractFontFamily = (cssText: string) => {
    const fontFamilyMatch = cssText.match(/font-family:\s*"([^"]+)"/i)
    if (fontFamilyMatch) {
      return fontFamilyMatch[1]
    }

    const classMatch = cssText.match(/\.([\w-]+)\s*{\s*font-family:/i)
    if (classMatch) {
      return classMatch[1]
    }

    return ""
  }

  const handleLoadFont = async () => {
    if (!typekitUrl.trim()) {
      setError("Please enter a CSS URL")
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
      link.href = typekitUrl
      link.crossOrigin = "anonymous"

      link.onload = async () => {
        try {
          const response = await fetch(typekitUrl)
          const cssText = await response.text()
          const extractedFontFamily = extractFontFamily(cssText)

          linkRef.current = link
          loadFont(extractedFontFamily)
          setIsLoading(false)
        } catch {
          setError("Could not parse font family from CSS")
          setIsLoading(false)
        }
      }

      link.onerror = () => {
        setError("Failed to load CSS file")
        setIsLoading(false)
      }

      document.head.appendChild(link)
    } catch {
      setError("An error occurred while loading the font")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="typekit-url">Typekit CSS URL</Label>
        <Input
          id="typekit-url"
          type="url"
          autoComplete="off"
          placeholder="https://p.typekit.net/p.css?s=1&k=..."
          value={typekitUrl}
          onChange={(e) => setTypekitUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Enter the full Typekit CSS URL from your Adobe Fonts project
        </p>
      </div>

      <Button
        onClick={handleLoadFont}
        disabled={!typekitUrl.trim() || isLoading}
        className="w-full"
      >
        {isLoading ? "Loading..." : "Load Font"}
      </Button>
    </div>
  )
}