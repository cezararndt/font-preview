import {
  createContext,
  useContext,
  useState,
  useRef,
  type ReactNode,
} from "react";

interface FontContextType {
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  isLoaded: boolean;
  error: string;

  fontSource: "typekit" | "google" | "import";

  googleFontsUrl: string;
  fontInfos: FontInfo[];
  selectedFont: string;
  selectedWeight: string;
  selectedStyle: string;

  typekitUrl: string;

  setFontFamily: (family: string) => void;
  setFontWeight: (weight: string) => void;
  setFontStyle: (style: string) => void;
  setIsLoaded: (loaded: boolean) => void;
  setError: (error: string) => void;
  setFontSource: (source: "typekit" | "google" | "import") => void;
  setGoogleFontsUrl: (url: string) => void;
  setFontInfos: (infos: FontInfo[]) => void;
  setSelectedFont: (font: string) => void;
  setSelectedWeight: (weight: string) => void;
  setSelectedStyle: (style: string) => void;
  setTypekitUrl: (url: string) => void;

  loadFont: (family: string, weight?: string, style?: string) => void;
  resetAll: () => void;

  linkRef: React.MutableRefObject<HTMLLinkElement | null>;

  fontFileRef?: React.MutableRefObject<HTMLStyleElement | null>;
}

interface FontInfo {
  family: string;
  weights: string[];
  styles: string[];
  unicodeRanges: string[];
}

const FontContext = createContext<FontContextType | undefined>(undefined);

const getPreferredWeight = (weights: string[]): string => {
  return weights.includes("400") ? "400" : weights[0] || "400";
};

const getPreferredStyle = (styles: string[]): string => {
  return styles.includes("normal") ? "normal" : styles[0] || "normal";
};

export function FontProvider({ children }: { children: ReactNode }) {
  const [fontFamily, setFontFamily] = useState("");
  const [fontWeight, setFontWeight] = useState("400");
  const [fontStyle, setFontStyle] = useState("normal");
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState("");

  const [fontSource, setFontSource] = useState<"typekit" | "google" | "import">(
    "typekit"
  );

  const [googleFontsUrl, setGoogleFontsUrl] = useState("");
  const [fontInfos, setFontInfos] = useState<FontInfo[]>([]);
  const [selectedFont, setSelectedFont] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("400");
  const [selectedStyle, setSelectedStyle] = useState("normal");

  const [typekitUrl, setTypekitUrl] = useState("");

  const linkRef = useRef<HTMLLinkElement | null>(null);
  const fontFileRef = useRef<HTMLStyleElement | null>(null);

  const loadFont = (family: string, weight = "400", style = "normal") => {
    setFontFamily(family);
    setFontWeight(weight);
    setFontStyle(style);
    setIsLoaded(true);
    setError("");
  };

  const resetAll = () => {
    if (linkRef.current) {
      document.head.removeChild(linkRef.current);
      linkRef.current = null;
    }

    setFontFamily("");
    setFontWeight("400");
    setFontStyle("normal");
    setIsLoaded(false);
    setError("");

    setGoogleFontsUrl("");
    setFontInfos([]);
    setSelectedFont("");
    setSelectedWeight("400");
    setSelectedStyle("normal");
    setTypekitUrl("");

    if (fontFileRef.current) {
      document.head.removeChild(fontFileRef.current);
      fontFileRef.current = null;
    }
  };

  const value: FontContextType = {
    fontFamily,
    fontWeight,
    fontStyle,
    isLoaded,
    error,

    fontSource,

    googleFontsUrl,
    fontInfos,
    selectedFont,
    selectedWeight,
    selectedStyle,

    typekitUrl,

    setFontFamily,
    setFontWeight,
    setFontStyle,
    setIsLoaded,
    setError,
    setFontSource,
    setGoogleFontsUrl,
    setFontInfos,
    setSelectedFont,
    setSelectedWeight,
    setSelectedStyle,
    setTypekitUrl,

    loadFont,
    resetAll,

    linkRef,

    fontFileRef,
  };

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
}

export { getPreferredWeight, getPreferredStyle };
