"use client";
import { Tooltip } from "@nextui-org/react";
import clsx from "clsx";
import { useState } from "react";
import { CopyIcon, CopySucceedIcon } from "./icons";

const CopyableText = ({ text, children }) => {
  const [isCopied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <span className="inline-flex group">
      {children || text}
      <Tooltip
        showArrow={true}
        content={isCopied ? "Copied to clipboard!" : "Copy to clipboard"}
      >
        <button
          onClick={() => copyToClipboard(text)}
          className={clsx(
            " cursor-pointer text-black px-1",
            isCopied ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          {isCopied ? <CopySucceedIcon /> : <CopyIcon />}
        </button>
      </Tooltip>
    </span>
  );
};

export default CopyableText;
