import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Eraser, Upload } from "lucide-react";
import { useFont } from "@/contexts/FontContext";

export function ImportLoader() {
  const { setError, loadFont, fontFileRef } = useFont();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = [".woff2", ".woff", ".ttf", ".otf"];
  const acceptedMimeTypes = [
    "font/woff2",
    "font/woff",
    "font/ttf",
    "font/otf",
    "application/font-woff2",
    "application/font-woff",
    "application/x-font-ttf",
    "application/x-font-otf",
    "font/opentype",
    "font/truetype",
  ];

  const extractFontNameFromFile = (fileName: string): string => {
    return fileName
      .replace(/\.(woff2?|[ot]tf)$/i, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.toLowerCase().match(/\.(woff2?|[ot]tf)$/);
    const isValidType = acceptedMimeTypes.includes(file.type) || fileExtension;

    if (!isValidType) {
      setError(
        `Please select a valid font file (${acceptedFormats.join(", ")})`
      );
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file) {
      const syntheticEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      handleFileSelect(syntheticEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const loadFontFromFile = async () => {
    if (!selectedFile) {
      setError("Please select a font file");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const fontUrl = URL.createObjectURL(selectedFile);

      const fontFamilyName = extractFontNameFromFile(selectedFile.name);

      const uniqueFontFamily = `imported-${Date.now()}-${fontFamilyName.replace(
        /\s+/g,
        "-"
      )}`;

      const fontFormat = selectedFile.name.toLowerCase().endsWith(".woff2")
        ? "woff2"
        : selectedFile.name.toLowerCase().endsWith(".woff")
        ? "woff"
        : selectedFile.name.toLowerCase().endsWith(".ttf")
        ? "truetype"
        : selectedFile.name.toLowerCase().endsWith(".otf")
        ? "opentype"
        : "truetype";

      const fontFaceCSS = `
        @font-face {
          font-family: "${uniqueFontFamily}";
          src: url("${fontUrl}") format("${fontFormat}");
          font-display: swap;
        }
      `;

      if (fontFileRef?.current) {
        document.head.removeChild(fontFileRef.current);
        fontFileRef.current = null;
      }

      const styleElement = document.createElement("style");
      styleElement.textContent = fontFaceCSS;
      document.head.appendChild(styleElement);

      fontFileRef!.current = styleElement;

      await new Promise((resolve) => setTimeout(resolve, 100));

      if (document.fonts) {
        try {
          const fontLoaded = document.fonts.check(`16px "${uniqueFontFamily}"`);
          if (!fontLoaded) {
            await document.fonts.load(`16px "${uniqueFontFamily}"`);
          }
        } catch (fontLoadError) {
          console.warn("Font loading check failed:", fontLoadError);
        }
      }

      loadFont(uniqueFontFamily);

      setIsLoading(false);
    } catch (error) {
      console.error("Font loading error:", error);
      setError("Failed to load font file");
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Font File</Label>

        <Card
          className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-8 px-4">
            {selectedFile ? (
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className="mt-2"
                >
                  <Eraser/>
                  Clear
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports: {acceptedFormats.join(", ")}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <Button
        onClick={loadFontFromFile}
        disabled={!selectedFile || isLoading}
        className="w-full"
      >
        {isLoading ? "Loading Font..." : "Load Font"}
      </Button>
    </div>
  );
}