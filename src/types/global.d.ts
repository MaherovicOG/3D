import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean;
          "ar-modes"?: string;
          "ar-placement"?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          scale?: string;
          "shadow-intensity"?: string;
          "shadow-softness"?: string;
          "environment-image"?: string;
          "exposure"?: string;
          style?: React.CSSProperties;
          id?: string;
        },
        HTMLElement
      >;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean;
          "ar-modes"?: string;
          "ar-placement"?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          scale?: string;
          "shadow-intensity"?: string;
          "shadow-softness"?: string;
          "environment-image"?: string;
          "exposure"?: string;
          style?: React.CSSProperties;
          id?: string;
        },
        HTMLElement
      >;
    }
  }
}
