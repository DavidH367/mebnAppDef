import { useState } from "react";
import { Accordion, AccordionItem, Divider } from "@nextui-org/react";

const CollapseComponent = ({ title, children }) => {
  return (
    <div style={{ width: "90%" }}>
      <Accordion selectionMode="multiple">
        <AccordionItem title={title}>{children}</AccordionItem>
      </Accordion>
      <Divider className="my-4" />
    </div>
  );
};

export default CollapseComponent;
