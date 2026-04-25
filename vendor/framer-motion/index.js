"use strict";

const React = require("react");

function toStyle(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const style = {};
  if (value.opacity !== undefined) style.opacity = value.opacity;
  if (value.scale !== undefined) style.transform = `scale(${value.scale})`;
  if (value.x !== undefined || value.y !== undefined) {
    const x = value.x ?? 0;
    const y = value.y ?? 0;
    style.transform = `translate(${x}px, ${y}px)`;
  }
  return style;
}

const motion = new Proxy(
  {},
  {
    get(_target, tagName) {
      return React.forwardRef(function MotionComponent(props, ref) {
        const {
          children,
          initial,
          animate,
          whileHover,
          transition,
          style,
          onMouseEnter,
          onMouseLeave,
          ...rest
        } = props;

        const [hovering, setHovering] = React.useState(false);
        const baseStyle = {
          ...toStyle(initial),
          ...toStyle(animate),
          ...style,
          transition: transition && typeof transition === "object" ? "all 250ms ease" : style?.transition
        };

        const hoverStyle = hovering ? toStyle(whileHover) : null;

        return React.createElement(
          tagName,
          {
            ...rest,
            ref,
            style: hoverStyle ? { ...baseStyle, ...hoverStyle } : baseStyle,
            onMouseEnter: (event) => {
              setHovering(true);
              onMouseEnter?.(event);
            },
            onMouseLeave: (event) => {
              setHovering(false);
              onMouseLeave?.(event);
            }
          },
          children
        );
      });
    }
  }
);

function AnimatePresence({ children }) {
  return React.createElement(React.Fragment, null, children);
}

module.exports = {
  motion,
  AnimatePresence
};
