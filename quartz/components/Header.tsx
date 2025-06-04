import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Header: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return children.length > 0 ? <header>{children}</header> : null
}

Header.css = `
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0; /* Removed extra space at the top */
  padding-left: 0; /* Removed extra space on the left */
  gap: 1.5rem;
}

header h1 {
  margin: 0;
  flex: auto;
  text-align: left; /* Align logo and text to the left */
}
`

export default (() => Header) satisfies QuartzComponentConstructor
