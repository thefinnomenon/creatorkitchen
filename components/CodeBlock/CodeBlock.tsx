import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export default function CodeBlock({
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}) {
  return (
    <NodeViewWrapper className="code-block">
      <select
        contentEditable={false}
        defaultValue={defaultLanguage}
        onChange={(event) => updateAttributes({ language: event.target.value })}
      >
        <option value="null">auto</option>
        <option disabled>—</option>
        {extension.options.lowlight.listLanguages().map((lang, index) => (
          <option key={index} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <pre>
        <NodeViewContent as="code" style={{ padding: 0, fontFamily: 'Menlo', fontSize: '14px' }} />
      </pre>
    </NodeViewWrapper>
  );
}
