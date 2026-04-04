import type { ComponentType } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordian';
import type { PayloadFaqBlock, PayloadFaqsCollection } from '@/payload/payload-types';

interface FaqBlockProps extends PayloadFaqBlock {
  RichText: ComponentType<{ data?: PayloadFaqsCollection['answer'] }>;
}

export function FaqBlock({ faqs, RichText }: FaqBlockProps) {
  if (!faqs?.length) {
    return null;
  }

  return (
    <Accordion type={faqs.length === 1 ? 'single' : 'multiple'}>
      {faqs
        .filter((faq) => typeof faq !== 'string')
        .map(({ question, answer, id }) => (
          <AccordionItem value={id} key={id}>
            <AccordionHeader asChild>
              <h2>
                <AccordionTrigger>{question}</AccordionTrigger>
              </h2>
            </AccordionHeader>
            <AccordionContent>
              <RichText data={answer} />
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
}
