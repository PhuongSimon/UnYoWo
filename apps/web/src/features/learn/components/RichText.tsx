interface RichTextProps {
  /** Text where **double asterisks** mark the highlighted part. */
  text: string
}

function RichText({ text }: RichTextProps) {
  const parts = text.split('**')

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <strong key={index} className="font-semibold text-accent">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  )
}

export default RichText
