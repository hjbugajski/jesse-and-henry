/**
 * The focus guard portion of this file is adapted from the Radix Primitives Focus Guards
 * https://github.com/radix-ui/primitives/tree/6469d41dcc6e84fe41d70a2703924338e7562dd1/packages/react/focus-guards
 *
 * ---
 *
 * MIT License

 * Copyright (c) 2022 WorkOS

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use client';

import { useEffect, useRef, useState } from 'react';

import { FocusScope } from '@radix-ui/react-focus-scope';
import Link from 'next/link';

import { Button } from '@/lib/components/button';
import { Icons } from '@/lib/components/icons';
import { linkProps } from '@/lib/utils/link';
import type { PayloadNavigationGlobal } from '@/payload/payload-types';

function createFocusGuard() {
  const element = document.createElement('span');

  element.setAttribute('data-radix-focus-guard', '');
  element.tabIndex = 0;
  element.style.outline = 'none';
  element.style.opacity = '0';
  element.style.position = 'fixed';
  element.style.pointerEvents = 'none';

  return element;
}

let count = 0;

export function Navigation({ callToAction, links, showCta }: PayloadNavigationGlobal) {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (open) {
      const edgeGuards = document.querySelectorAll('[data-radix-focus-guard]');

      document.body.classList.add('overflow-hidden');
      ref.current?.insertAdjacentElement('afterbegin', edgeGuards[0] ?? createFocusGuard());
      ref.current?.insertAdjacentElement('beforeend', edgeGuards[1] ?? createFocusGuard());

      count++;
    } else {
      document.body.classList.remove('overflow-hidden');
      document.querySelectorAll('[data-radix-focus-guard]').forEach((node) => node.remove());
    }

    return () => {
      if (count === 1) {
        document.querySelectorAll('[data-radix-focus-guard]').forEach((node) => node.remove());
      }

      count--;
    };
  }, [open]);

  useEffect(() => {
    const handleResize = () => {
      const width = document.documentElement.clientWidth || 0;

      if (width >= 992) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleMenu = () => setOpen((open) => !open);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <div
        aria-hidden
        data-state={open ? 'open' : 'closed'}
        className="data-[state=open]:fixed data-[state=open]:inset-x-0 data-[state=open]:top-0 data-[state=open]:bottom-0 data-[state=open]:z-40 data-[state=open]:backdrop-blur-md"
      />
      <nav
        ref={ref}
        role={open ? 'dialog' : 'navigation'}
        data-state={open ? 'open' : 'closed'}
        className="fixed right-0 bottom-0 left-0 z-50 flex h-16 flex-row items-center justify-between gap-4 bg-neutral-99/50 data-[state=closed]:backdrop-blur-md md-lg:top-0 md-lg:bottom-[unset]"
      >
        <FocusScope loop={open} trapped={open} className="w-full outline-none">
          <ul className="flew-row mx-auto flex h-full w-full max-w-7xl items-center gap-4 px-4">
            <li className="mr-auto">
              <Link
                href="/"
                className="font-serif tracking-widest uppercase no-underline"
                onClick={closeMenu}
              >
                J&H
              </Link>
            </li>
            {links?.map((link) => (
              <li key={link.id} className="hidden md-lg:inline-block">
                <Link {...linkProps(link)} className="text-sm no-underline">
                  {link.text}
                </Link>
              </li>
            ))}
            {showCta && callToAction ? (
              <li>
                <Button
                  asChild
                  // @ts-expect-error – valid field
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  color={callToAction.color}
                  iconPosition={callToAction.icon ? 'right' : 'none'}
                  size="md"
                  variant="solid"
                >
                  <Link {...linkProps(callToAction)}>
                    {callToAction.text}
                    {callToAction.icon && <Icons name={callToAction.icon} />}
                  </Link>
                </Button>
              </li>
            ) : null}
            <li className="md-lg:hidden">
              <Button
                onClick={toggleMenu}
                aria-label={open ? 'Close navigation' : 'Open navigation'}
                size="icon"
              >
                <Icons name={open ? 'close' : 'menu'} size="lg" />
              </Button>
            </li>
          </ul>
          <dialog
            aria-live="polite"
            aria-hidden={!open}
            open={open}
            data-state={open ? 'open' : 'closed'}
            className="bg-neutral-99/50 data-[state=open]:right-0 data-[state=open]:bottom-16 data-[state=open]:left-0 data-[state=open]:z-50 data-[state=open]:flex data-[state=open]:w-full data-[state=open]:flex-col data-[state=open]:items-end"
          >
            <ul className="flex w-full flex-1 flex-col gap-1 p-3">
              {links?.map((link) => (
                <li key={link.id} className="w-full">
                  <Link
                    {...linkProps(link)}
                    onClick={closeMenu}
                    className="inline-flex w-full justify-center px-4 py-2 text-lg no-underline"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </dialog>
        </FocusScope>
      </nav>
    </>
  );
}
