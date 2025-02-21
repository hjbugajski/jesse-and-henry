import { RichText } from '@/components/rich-text';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@/lib/components/accordian';
import type { PayloadFaqBlock } from '@/payload/payload-types';

export function FaqBlock({ faqs }: PayloadFaqBlock) {
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
