import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FontLoader } from "@/components/FontLoader"
import { FontPreview } from "@/components/FontPreview"
import { ErrorDisplay } from "@/components/ErrorDisplay"
import { FontProvider, useFont } from "@/contexts/FontContext"

function AppContent() {
  const { isLoaded, error } = useFont()

  return (
    <div className="container max-w-5xl mx-auto p-6">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Font Preview Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FontLoader />
          <ErrorDisplay error={error} />
          {isLoaded && <FontPreview />}
        </CardContent>
      </Card>
    </div>
  )
}

function App() {
  return (
    <FontProvider>
      <AppContent />
    </FontProvider>
  )
}

export default App