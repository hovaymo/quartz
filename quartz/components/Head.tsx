import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"
export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    // Url of current page
    const socialUrl =
      fileData.slug === "404" ? url.toString() : joinSegments(url.toString(), fileData.slug!)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath) ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />

        {/* Форсування темної теми і layout прямо в HTML */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html, body {
              background-color: #161618 !important;
              color: #ebebec !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            * {
              --light: #161618 !important;
              --lightgray: #393639 !important;
              --gray: #646464 !important;
              --darkgray: #d4d4d4 !important;
              --dark: #ebebec !important;
              --secondary: #7b97aa !important;
              --tertiary: #84a59d !important;
              --highlight: rgba(143, 159, 169, 0.15) !important;
              --textHighlight: #b3aa0288 !important;
            }
            .page {
              max-width: 900px !important;
              margin: 0 auto !important;
              padding: 0 !important;
              margin-top: 0 !important;
              padding-top: 0 !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .sidebar.left, .sidebar.right {
              display: none !important;
            }
            .page > #quartz-body {
              display: block !important;
              grid-template-columns: 1fr !important;
              margin-top: 0 !important;
              padding-top: 0 !important;
            }
            .page > #quartz-body > article {
              margin-top: 0 !important;
              padding-top: 0 !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            /* Стилі для обкладинки та аватара */
            .cover-container {
              position: relative !important;
              width: 100vw !important;
              left: 50% !important;
              right: 50% !important;
              margin-left: -50vw !important;
              margin-right: -50vw !important;
              overflow: hidden !important;
              padding: 0 !important;
              z-index: 1 !important;
              margin-top: -2rem !important;
              margin-bottom: 0 !important;
            }
            .cover-image {
              width: 100vw !important;
              max-width: 100vw !important;
              height: 220px !important;
              object-fit: cover !important;
              display: block !important;
              margin: 0 !important;
              padding: 0 !important;
              border-radius: 0 !important;
            }
            .avatar-container {
              position: absolute !important;
              left: 0 !important;
              bottom: -60px !important;
              display: flex !important;
              align-items: flex-end !important;
              width: 100% !important;
              padding-left: 0 !important;
              height: 180px !important;
            }
            .avatar-wrapper {
              margin-left: 2.5rem !important;
              padding-left: 0 !important;
            }
            @media (max-width: 900px) {
              .avatar-wrapper {
                margin-left: 1.2rem !important;
              }
            }
            .avatar-image {
              width: 120px !important;
              height: 120px !important;
              border-radius: 50% !important;
              border: 4px solid #fff !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
              background: #fff !important;
              object-fit: cover !important;
              display: block !important;
            }
            .content-spacer {
              height: 130px !important;
              display: block !important;
            }
          `,
          }}
        />

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
