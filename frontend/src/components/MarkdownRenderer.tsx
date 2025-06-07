import React from "react";
import ReactMarkdown from "react-markdown";
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

interface MarkdownRendererProps {

  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {

  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkParse, remarkHtml]}
      className="text-black markdown-content"
    />
  );
};

export default MarkdownRenderer;
