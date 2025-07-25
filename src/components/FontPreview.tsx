import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFont } from "@/contexts/FontContext"
import { PreviewTab } from "./preview/PreviewTab"
import { GlyphsTab } from "./preview/GlyphsTab"
import { ImportJsonTab } from "./preview/ImportJsonTab"

export function FontPreview() {
  const { fontFamily } = useFont()
  const [activeTab, setActiveTab] = useState("preview")

  useEffect(() => {
    if (fontFamily) {
      setActiveTab("preview")
    }
  }, [fontFamily])

  return (
    <div className="space-y-4">

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="glyphs">Glyphs</TabsTrigger>
          <TabsTrigger value="import">Import JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <PreviewTab />
        </TabsContent>

        <TabsContent value="glyphs">
          <GlyphsTab />
        </TabsContent>

        <TabsContent value="import">
          <ImportJsonTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}