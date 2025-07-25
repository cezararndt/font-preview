import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFont } from "@/contexts/FontContext"

export function PreviewTab() {
  const { fontFamily, fontWeight, fontStyle } = useFont()
  const [previewText, setPreviewText] = useState("Hello")

  const fontStyles = {
    fontFamily: fontFamily || 'inherit',
    fontWeight,
    fontStyle
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="preview-text">Preview Text</Label>
        <Input
          id="preview-text"
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          placeholder="Enter text to preview"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Font Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="text-4xl text-center p-6 bg-white border rounded-md"
            style={fontStyles}
          >
            {previewText}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['16px', '24px', '32px'].map((size) => (
          <div key={size} className="p-3 bg-white border rounded-md">
            <p className="text-xs text-gray-500 mb-1">{size}</p>
            <div
              style={{
                ...fontStyles,
                fontSize: size
              }}
            >
              {previewText}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}