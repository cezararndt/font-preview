import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFont } from "@/contexts/FontContext";
import { hasGlyph } from "./hasGlyph";

interface GlyphInfo {
  char: string;
  code: string;
  unicode: string;
  name?: string;
  category: string;
}

export function GlyphsTab() {
  const { fontFamily, fontWeight, fontStyle } = useFont();
  const [supportedGlyphs, setSupportedGlyphs] = useState<GlyphInfo[]>([]);
  const [filteredGlyphs, setFilteredGlyphs] = useState<GlyphInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const fontStyles = useMemo(
    () => ({
      fontFamily: fontFamily || "inherit",
      fontWeight,
      fontStyle,
      fontSize: `${fontSize}px`,
    }),
    [fontFamily, fontWeight, fontStyle, fontSize]
  );

  const testCharacters = useMemo(() => {
    const testChars: number[] = [];

    for (let i = 32; i <= 126; i++) {
      testChars.push(i);
    }

    for (let i = 160; i <= 255; i++) {
      testChars.push(i);
    }

    for (let i = 256; i <= 383; i++) {
      testChars.push(i);
    }

    for (let i = 384; i <= 591; i++) {
      testChars.push(i);
    }

    const commonSymbols = [
      0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2015, 0x2016, 0x2017, 0x2018,
      0x2019, 0x201a, 0x201b, 0x201c, 0x201d, 0x201e, 0x201f, 0x2020, 0x2021,
      0x2022, 0x2023, 0x2024, 0x2025, 0x2026, 0x2027, 0x2030, 0x2031, 0x2032,
      0x2033, 0x2034, 0x2035, 0x2036, 0x2037, 0x2038, 0x2039, 0x203a, 0x203b,
      0x203c, 0x203d, 0x203e,

      0x20a0, 0x20a1, 0x20a2, 0x20a3, 0x20a4, 0x20a5, 0x20a6, 0x20a7, 0x20a8,
      0x20a9, 0x20aa, 0x20ab, 0x20ac, 0x20ad, 0x20ae, 0x20af, 0x20b0, 0x20b1,
      0x20b2, 0x20b3, 0x20b4, 0x20b5, 0x20b6, 0x20b7, 0x20b8, 0x20b9, 0x20ba,
      0x20bb, 0x20bc, 0x20bd,

      0x2190, 0x2191, 0x2192, 0x2193, 0x2194, 0x2195, 0x2196, 0x2197, 0x2198,
      0x2199, 0x219a, 0x219b, 0x219c, 0x219d, 0x219e, 0x219f, 0x21a0, 0x21a1,
      0x21a2, 0x21a3,

      0x2200, 0x2201, 0x2202, 0x2203, 0x2204, 0x2205, 0x2206, 0x2207, 0x2208,
      0x2209, 0x220a, 0x220b, 0x220c, 0x220d, 0x220e, 0x220f, 0x2210, 0x2211,
      0x2212, 0x2213, 0x2214, 0x2215, 0x2216, 0x2217, 0x2218, 0x2219, 0x221a,
      0x221b, 0x221c, 0x221d, 0x221e, 0x221f, 0x2220, 0x2221, 0x2222, 0x2223,
      0x2224, 0x2225, 0x2226, 0x2227, 0x2228, 0x2229, 0x222a, 0x222b, 0x222c,
      0x222d, 0x222e, 0x222f, 0x2230, 0x2231,

      0x25a0, 0x25a1, 0x25a2, 0x25a3, 0x25a4, 0x25a5, 0x25a6, 0x25a7, 0x25a8,
      0x25a9, 0x25b2, 0x25b3, 0x25b6, 0x25b7, 0x25bc, 0x25bd, 0x25c0, 0x25c1,
      0x25c6, 0x25c7, 0x25ca, 0x25cb, 0x25cf, 0x25d0, 0x25d1, 0x25e6,

      0x2600, 0x2601, 0x2602, 0x2603, 0x2660, 0x2663, 0x2665, 0x2666, 0x2669,
      0x266a, 0x266b, 0x266c, 0x266d, 0x266e, 0x266f,

      0x2701, 0x2702, 0x2703, 0x2704, 0x2705, 0x2706, 0x2707, 0x2708, 0x2709,
      0x270a, 0x270b, 0x270c, 0x270d, 0x270e, 0x270f, 0x2710, 0x2711, 0x2712,
      0x2713, 0x2714, 0x2715, 0x2716, 0x2717, 0x2718, 0x2719, 0x271a, 0x271b,
      0x271c, 0x271d, 0x271e, 0x271f, 0x2720, 0x2721, 0x2722, 0x2723, 0x2724,
      0x2725, 0x2726, 0x2727, 0x2729, 0x272a, 0x272b, 0x272c, 0x272d, 0x272e,
      0x272f, 0x2730, 0x2731, 0x2732, 0x2733, 0x2734, 0x2735, 0x2736, 0x2737,
      0x2738, 0x2739, 0x273a, 0x273b, 0x273c, 0x273d, 0x273e, 0x273f, 0x2740,
      0x2741, 0x2742, 0x2743, 0x2744, 0x2745, 0x2746, 0x2747, 0x2748, 0x2749,
      0x274a, 0x274b, 0x274c, 0x274d, 0x274e, 0x274f, 0x2750, 0x2751, 0x2752,
      0x2753, 0x2754, 0x2755, 0x2756, 0x2757, 0x2758, 0x2759, 0x275a, 0x275b,
      0x275c, 0x275d, 0x275e,
    ];

    testChars.push(...commonSymbols);
    return testChars;
  }, []);

  const getCharacterName = useMemo(
    () =>
      (code: number): string => {
        const names: { [key: number]: string } = {
          32: "SPACE",
          33: "EXCLAMATION MARK",
          34: "QUOTATION MARK",
          35: "NUMBER SIGN",
          36: "DOLLAR SIGN",
          37: "PERCENT SIGN",
          38: "AMPERSAND",
          39: "APOSTROPHE",
          40: "LEFT PARENTHESIS",
          41: "RIGHT PARENTHESIS",
          42: "ASTERISK",
          43: "PLUS SIGN",
          44: "COMMA",
          45: "HYPHEN-MINUS",
          46: "FULL STOP",
          47: "SOLIDUS",
          58: "COLON",
          59: "SEMICOLON",
          60: "LESS-THAN SIGN",
          61: "EQUALS SIGN",
          62: "GREATER-THAN SIGN",
          63: "QUESTION MARK",
          64: "COMMERCIAL AT",
          91: "LEFT SQUARE BRACKET",
          92: "REVERSE SOLIDUS",
          93: "RIGHT SQUARE BRACKET",
          94: "CIRCUMFLEX ACCENT",
          95: "LOW LINE",
          96: "GRAVE ACCENT",
          123: "LEFT CURLY BRACKET",
          124: "VERTICAL LINE",
          125: "RIGHT CURLY BRACKET",
          126: "TILDE",
          160: "NO-BREAK SPACE",
          161: "INVERTED EXCLAMATION MARK",
          162: "CENT SIGN",
          163: "POUND SIGN",
          164: "CURRENCY SIGN",
          165: "YEN SIGN",
          169: "COPYRIGHT SIGN",
          174: "REGISTERED SIGN",
          8364: "EURO SIGN",
          8482: "TRADE MARK SIGN",
        };

        if (code >= 48 && code <= 57)
          return `DIGIT ${String.fromCharCode(code)}`;
        if (code >= 65 && code <= 90)
          return `LATIN CAPITAL LETTER ${String.fromCharCode(code)}`;
        if (code >= 97 && code <= 122)
          return `LATIN SMALL LETTER ${String.fromCharCode(
            code
          ).toUpperCase()}`;

        return (
          names[code] ||
          `CHARACTER ${code.toString(16).toUpperCase().padStart(4, "0")}`
        );
      },
    []
  );

  const getCategory = useMemo(
    () =>
      (code: number): string => {
        if (code >= 48 && code <= 57) return "numbers";
        if (code >= 65 && code <= 90) return "uppercase";
        if (code >= 97 && code <= 122) return "lowercase";
        if (code >= 160 && code <= 255) return "latin-1";
        if (code >= 256 && code <= 591) return "latin-extended";
        if (code >= 0x20a0 && code <= 0x20cf) return "currency";
        if (code >= 0x2190 && code <= 0x21ff) return "arrows";
        if (code >= 0x2200 && code <= 0x22ff) return "mathematical";
        if (code >= 0x25a0 && code <= 0x25ff) return "geometric";
        if (code >= 0x2600 && code <= 0x26ff) return "miscellaneous";
        if (code >= 0x2700 && code <= 0x27bf) return "dingbats";
        if (code >= 0x2000 && code <= 0x206f) return "punctuation";
        if (code >= 32 && code <= 126) return "basic-latin";
        return "other";
      },
    []
  );

  const testFontSupport = useMemo(
    () => async () => {
      if (!fontFamily) return;

      setIsLoading(true);
      setSupportedGlyphs([]);

      const supported: GlyphInfo[] = [];

      const batchSize = 50;
      for (let i = 0; i < testCharacters.length; i += batchSize) {
        const batch = testCharacters.slice(i, i + batchSize);

        for (const code of batch) {
          const char = String.fromCharCode(code);

          if (hasGlyph(fontFamily, char)) {
            supported.push({
              char,
              code: code.toString(),
              unicode: `U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
              name: getCharacterName(code),
              category: getCategory(code),
            });
          }
        }

        setSupportedGlyphs([...supported]);

        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      setIsLoading(false);
    },
    [fontFamily, testCharacters, getCharacterName, getCategory]
  );

  const filteredGlyphsMemo = useMemo(() => {
    let filtered = supportedGlyphs;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (glyph) => glyph.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (glyph) =>
          glyph.char.includes(searchTerm) ||
          glyph.unicode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (glyph.name &&
            glyph.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [supportedGlyphs, searchTerm, selectedCategory]);

  useEffect(() => {
    setFilteredGlyphs(filteredGlyphsMemo);
  }, [filteredGlyphsMemo]);

  useEffect(() => {
    if (fontFamily) {
      testFontSupport();
    }
  }, [fontFamily, testFontSupport]);

  const availableCategories = useMemo(() => {
    const categoriesWithGlyphs = new Set<string>();

    if (supportedGlyphs.length > 0) {
      categoriesWithGlyphs.add("all");
    }

    supportedGlyphs.forEach((glyph) => {
      categoriesWithGlyphs.add(glyph.category);
    });

    const allCategories = [
      { value: "all", label: "All" },
      { value: "basic-latin", label: "Basic Latin" },
      { value: "uppercase", label: "Uppercase" },
      { value: "lowercase", label: "Lowercase" },
      { value: "numbers", label: "Numbers" },
      { value: "punctuation", label: "Punctuation" },
      { value: "latin-1", label: "Latin-1" },
      { value: "latin-extended", label: "Latin Extended" },
      { value: "currency", label: "Currency" },
      { value: "arrows", label: "Arrows" },
      { value: "mathematical", label: "Mathematical" },
      { value: "geometric", label: "Geometric" },
      { value: "miscellaneous", label: "Misc Symbols" },
      { value: "dingbats", label: "Dingbats" },
      { value: "other", label: "Other" },
    ];

    return allCategories.filter((category) =>
      categoriesWithGlyphs.has(category.value)
    );
  }, [supportedGlyphs]);

  useEffect(() => {
    const currentCategoryExists = availableCategories.some(
      (cat) => cat.value === selectedCategory
    );
    if (!currentCategoryExists && availableCategories.length > 0) {
      setSelectedCategory("all");
    }
  }, [availableCategories, selectedCategory]);

  if (!fontFamily) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Font Glyphs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 text-center text-muted-foreground">
              <p>Please load a font first to view its supported glyphs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="glyph-search">Search Glyphs</Label>
              <Input
                id="glyph-search"
                placeholder="Search by character, unicode, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Input
                id="font-size"
                type="number"
                min="12"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value) || 24)}
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-1">
                {availableCategories.map((category) => (
                  <Button
                    key={category.value}
                    variant={
                      selectedCategory === category.value
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-3 mb-2">
            <strong>Note:</strong> This glyph detection strategy is not 100%
            precise. Some characters might not display even if supported.
          </div>

          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              <span>
                Testing font support... {supportedGlyphs.length} found so far
              </span>
            ) : (
              <span>
                Showing {filteredGlyphs.length} of {supportedGlyphs.length}{" "}
                supported characters
              </span>
            )}
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2 border rounded-md p-4">
            {filteredGlyphs.map((glyph, index) => (
              <div
                key={index}
                className="border rounded p-2 hover:bg-gray-50 transition-colors"
                title={`${glyph.name}\n${glyph.unicode}\nCategory: ${glyph.category}`}
              >
                <div className="text-center select-none" style={fontStyles}>
                  {glyph.char}
                </div>
                <div className="text-xs text-center text-gray-500 mt-1 truncate">
                  {glyph.unicode}
                </div>
              </div>
            ))}
          </div>

          {!isLoading &&
            filteredGlyphs.length === 0 &&
            supportedGlyphs.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No glyphs found matching your search criteria
              </div>
            )}

          {!isLoading && supportedGlyphs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No supported glyphs found for this font
            </div>
          )}

          {isLoading && (
            <div className="text-center py-4 text-muted-foreground">
              <div className="animate-pulse">Testing font glyph support...</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
