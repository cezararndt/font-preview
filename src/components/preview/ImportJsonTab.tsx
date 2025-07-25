import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Download, Eraser } from "lucide-react";
import { useFont } from "@/contexts/FontContext";

interface FlattenedEntry {
  key: string;
  value: string;
}

export function ImportJsonTab() {
  const { fontFamily, fontWeight, fontStyle } = useFont();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<FlattenedEntry[]>([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fontStyles = {
    fontFamily: fontFamily || "inherit",
    fontWeight,
    fontStyle,
    fontSize: `${fontSize}px`,
  };

  const flattenJson = (
    obj: Record<string, string>,
    prefix = ""
  ): FlattenedEntry[] => {
    const result: FlattenedEntry[] = [];

    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];

        if (typeof value === "string") {
          result.push({ key: newKey, value });
        } else if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          result.push(...flattenJson(value, newKey));
        } else {
          result.push({ key: newKey, value: String(value) });
        }
      }
    }

    return result;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
      setError("Please select a JSON file");
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

  const loadJsonFile = async () => {
    if (!selectedFile) {
      setError("Please select a JSON file");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const fileText = await selectedFile.text();
      const parsedJson = JSON.parse(fileText);

      const flattened = flattenJson(parsedJson);
      setJsonData(flattened);

      setIsLoading(false);
    } catch (error) {
      console.error("JSON parsing error:", error);
      setError("Failed to parse JSON file. Please check the file format.");
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setJsonData([]);
    setSearchTerm("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const exportFilteredData = () => {
    const filteredData = jsonData.filter(
      (entry) =>
        entry.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const csvContent = [
      "Key,Value",
      ...filteredData.map((entry) => `"${entry.key}","${entry.value}"`),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedFile?.name.replace(".json", "")}_flattened.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter data based on search term
  const filteredData = jsonData.filter(
    (entry) =>
      entry.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Import JSON Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>JSON File</Label>

            {/* File Drop Zone */}
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
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSelection();
                      }}
                      className="mt-2"
                    >
                      <Eraser />
                      Clear
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Click to upload or drag and drop JSON file
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports: .json files
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />

            <p className="text-xs text-muted-foreground">
              Upload a JSON file to flatten its structure into key-value pairs
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            onClick={loadJsonFile}
            disabled={!selectedFile || isLoading}
            className="w-full"
          >
            {isLoading ? "Processing..." : "Process JSON"}
          </Button>
        </CardContent>
      </Card>

      {jsonData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>JSON Data ({jsonData.length} entries)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="json-search">Search</Label>
                <Input
                  id="json-search"
                  placeholder="Search keys or values..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="json-font-size">Font Size</Label>
                <Input
                  id="json-font-size"
                  type="number"
                  min="10"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value) || 14)}
                />
              </div>

              <div className="space-y-2">
                <Label>Actions</Label>
                <Button
                  variant="outline"
                  onClick={exportFilteredData}
                  className="w-full"
                  size="sm"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredData.length} of {jsonData.length} entries
            </div>

            {/* Table */}
            <div className="border rounded-md">
              <div className="">
                <table className="w-full">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left p-3 font-medium border-b">
                        Key
                      </th>
                      <th className="text-left p-3 font-medium border-b">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((entry, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-mono text-sm text-muted-foreground max-w-xs">
                          <div className="truncate" title={entry.key}>
                            {entry.key}
                          </div>
                        </td>
                        <td className="p-3">
                          <div
                            className="break-words"
                            style={fontStyles}
                            title={entry.value}
                          >
                            {entry.value}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredData.length === 0 && searchTerm && (
              <div className="text-center py-8 text-muted-foreground">
                No entries found matching your search criteria
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
