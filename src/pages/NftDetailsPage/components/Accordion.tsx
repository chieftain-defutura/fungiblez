import React, { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { ReactComponent as Arrow } from "assets/icons/up_arrow.svg";

interface IAccordionProps {
  icon: string | ReactNode;
  title: string;
  children: ReactNode;
  maxHeight?: string | number;
}

const Accordion: React.FC<IAccordionProps> = ({
  title,
  icon,
  children,
  maxHeight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="accordion">
      <motion.header
        initial={false}
        onClick={() => setIsOpen((o) => !o)}
        className={"accordion_header"}
      >
        <div className="accordion_header-block">
          {icon}
          <p className="accordion_header-block_title">{title}</p>
        </div>
        <div
          className={
            isOpen ? "accordion_header-arrow active" : "accordion_header-arrow"
          }
        >
          <Arrow />
        </div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div
              className="accordion_content-box"
              style={{ maxHeight: maxHeight ? maxHeight : "unset" }}
            >
              {children}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
