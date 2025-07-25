import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GoogleFontsLoader } from "./loaders/GoogleFontsLoader"
import { ImportLoader } from "./loaders/ImportLoader"
import { TypekitLoader } from "./loaders/TypekitLoader"
import { useFont } from "@/contexts/FontContext"

export function FontLoader() {
  const { fontSource, setFontSource, resetAll } = useFont()

  const renderLoader = () => {
    switch (fontSource) {
      case "typekit":
        return <TypekitLoader />
      case "google":
        return <GoogleFontsLoader />
      case "import":
        return <ImportLoader />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="font-source">Font Source</Label>
        <Select value={fontSource} onValueChange={setFontSource}>
          <SelectTrigger id="font-source">
            <SelectValue placeholder="Select font source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="typekit">Adobe Typekit</SelectItem>
            <SelectItem value="google">Google Fonts</SelectItem>
            <SelectItem value="import">Font import</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {renderLoader()}

      <div className="flex gap-2">
        <Button variant="outline" onClick={resetAll}>
          Reset All
        </Button>
      </div>
    </div>
  )
}