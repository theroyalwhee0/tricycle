/**
 * MimeType enumeration.
 * This is not a comprehensive list.
 */
export enum MimeTypes {
    // General.
    TextPlain = 'text/plain',
    // Data.
    ApplicationJson = 'application/json',
    // Web Pages.
    TextHtml = 'text/html',
    TextCss = 'text/css',
    // Fonts.
    FontTtf = 'font/ttf',
    FontOtf = "font/otf",
    FontWoff = "font/woff",
    FontWoff2 = "font/woff2",
    // Scripts.
    TextJavascript = 'text/javascript',
    // Images.
    ImageGif = 'image/gif',
    ImageJpg = 'image/jpeg',
    ImagePng = 'image/png',
    ImageSvg = 'image/svg+xml',
    ImageIco = 'image/vnd.microsoft.icon',
}

/**
 * Extension to MimeType mapping.
 * This is not a comprehensive list.
 */
export enum ExtensionTypes {
    // General.
    '.txt' = MimeTypes.TextPlain,
    // Data.
    '.json' = MimeTypes.ApplicationJson,
    // Web Pages.
    '.htm' = MimeTypes.TextHtml,
    '.html' = MimeTypes.TextHtml,
    '.css' = MimeTypes.TextCss,
    // Fonts.
    '.ttf' = MimeTypes.FontTtf,
    '.woff' = MimeTypes.FontWoff,
    '.woff2' = MimeTypes.FontWoff2,
    '.otf' = MimeTypes.FontOtf,
    // Scripts.
    '.js' = MimeTypes.TextJavascript,
    '.mjs' = MimeTypes.TextJavascript,
    // Images.
    '.gif' = MimeTypes.ImageGif,
    '.jpg' = MimeTypes.ImageJpg,
    '.jpeg' = MimeTypes.ImageJpg,
    '.png' = MimeTypes.ImagePng,
    '.svg' = MimeTypes.ImageSvg,
    '.ico' = MimeTypes.ImageIco,
};