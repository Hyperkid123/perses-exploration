import { ReactNode, useState } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Accordion, AccordionItem, AccordionContent, AccordionToggle, Flex, FlexItem } from '@patternfly/react-core';

interface AccordionSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface WidgetCardProps {
  title: string;
  sections: AccordionSection[];
  children: ReactNode;
}

const WidgetCard = ({ title, sections, children }: WidgetCardProps) => {
  const [expandedSections, setExpandedSections] = useState<string | undefined>(undefined);
  return (
    <Card isCompact style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CardHeader style={{ flexShrink: 0 }}>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 'var(--pf-t--global--spacer--md)', overflow: 'hidden' }}>
        <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsMd' }} style={{ height: '100%' }}>
          <FlexItem style={{ flexShrink: 0 }}>
            <Accordion isBordered>
              {sections.map((section) => (
                <AccordionItem isExpanded={expandedSections === section.id} key={section.id}>
                  <AccordionToggle
                    onClick={() => {
                      if (expandedSections === section.id) {
                        setExpandedSections(undefined);
                        return;
                      }
                      setExpandedSections(section.id);
                    }}
                    id={`${section.id}-toggle`}
                  >
                    {section.title}
                  </AccordionToggle>
                  <AccordionContent id={`${section.id}-content`} aria-labelledby={`${section.id}-toggle`}>
                    {section.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FlexItem>
          <FlexItem style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '100%' }}>{children}</div>
          </FlexItem>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default WidgetCard;
