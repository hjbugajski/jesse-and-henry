'use client';

import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useForm } from 'react-hook-form';
import { type InferType, mixed, object, string } from 'yup';

import { updateGuest } from '@/actions/guests';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/icons';
import { useToast } from '@/lib/hooks/use-toast';
import type { ActionState } from '@/lib/types/action-state';
import { cn } from '@/lib/utils/cn';
import type { PayloadGuestsCollection } from '@/payload/payload-types';

const rsvpArray = ['rsvpRehearsalDinner', 'rsvpWeddingDay', 'rsvpPoolDay'];

const conditionalRsvpIs = (...args: unknown[]) => args.some((arg) => arg === 'accept');

const acceptDeclineSchema = mixed<string>()
  .oneOf(['accept', 'decline'], 'Selection is required')
  .required('Required');

const conditionalYesNoSchema = mixed<string>().when(rsvpArray, {
  is: conditionalRsvpIs,
  then: (schema) => schema.oneOf(['yes', 'no'], 'Selection is required').required('Required'),
  otherwise: (schema) => schema.optional(),
});

const conditionalMealPreferenceSchema = mixed<string>().when(rsvpArray, {
  is: conditionalRsvpIs,
  then: (schema) =>
    schema.oneOf(['beef', 'fish', 'vegetarian'], 'Selection is required').required('Required'),
  otherwise: (schema) => schema.optional(),
});

const conditionalStringSchema = string().when(rsvpArray, {
  is: conditionalRsvpIs,
  then: (schema) => schema.required('Required'),
  otherwise: (schema) => schema.optional(),
});

const formSchema = object({
  rsvpWelcomeParty: acceptDeclineSchema,
  rsvpRehearsalDinner: acceptDeclineSchema,
  rsvpWeddingDay: acceptDeclineSchema,
  rsvpPoolDay: acceptDeclineSchema,
  transportationToVenue: conditionalYesNoSchema,
  transportationFromVenue: conditionalYesNoSchema,
  legalName: conditionalStringSchema,
  dateOfBirth: conditionalStringSchema,
  countryOfBirth: conditionalStringSchema,
  mealPreference: conditionalMealPreferenceSchema,
  allergies: string().optional(),
});

type RsvpFormProps = {
  guest: PayloadGuestsCollection;
  disabled?: boolean;
};

export function RsvpForm({ guest, disabled = false }: RsvpFormProps) {
  const [formState, setFormState] = useState<ActionState>({ status: 'idle', message: null });

  const form = useForm<InferType<typeof formSchema>>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      rsvpWelcomeParty: guest.rsvpWelcomeParty || '',
      rsvpRehearsalDinner: guest.rsvpRehearsalDinner || '',
      rsvpWeddingDay: guest.rsvpWeddingDay || '',
      rsvpPoolDay: guest.rsvpPoolDay || '',
      transportationToVenue: guest.transportationToVenue || '',
      transportationFromVenue: guest.transportationFromVenue || '',
      legalName: guest.legalName || '',
      dateOfBirth: guest.dateOfBirth || '',
      countryOfBirth: guest.countryOfBirth || '',
      mealPreference: guest.mealPreference || '',
      allergies: guest.allergies || '',
    },
  });
  const { toast } = useToast();

  const rsvpRehearsalDinner = form.watch('rsvpRehearsalDinner') === 'accept';
  const rsvpWeddingDay = form.watch('rsvpWeddingDay') === 'accept';
  const rsvpPoolDay = form.watch('rsvpPoolDay') === 'accept';
  const attendingEvent = rsvpRehearsalDinner || rsvpWeddingDay || rsvpPoolDay;

  async function onSubmit(values: InferType<typeof formSchema>) {
    if (disabled) {
      return;
    }

    setFormState({ status: 'pending', message: null });

    const cleanValues = Object.entries(values).reduce(
      (prev, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          prev[key] = value;
        }

        return prev;
      },
      {} as Record<string, string>,
    );

    const state = await updateGuest(guest.id, cleanValues);

    if (state.status === 'valid') {
      setFormState(state);
      toast({
        title: 'Submission successful',
        description: `RSVP for ${guest.first} ${guest.last} was successfully submitted.`,
        variant: 'success',
      });
      form.reset(undefined, { keepValues: true });
    } else if (state.status === 'error') {
      setFormState(state);
      toast({
        title: 'Error submitting RSVP',
        description: state.message,
        variant: 'danger',
      });
    } else {
      setFormState({ status: 'idle', message: null });
    }
  }

  return (
    <div className="border-t-2 border-neutral-variant-50/50 py-4">
      <h3 className="font-sans text-lg font-bold normal-case">
        {guest.first} {guest.last}
      </h3>
      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="rsvpWelcomeParty"
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormLabel className="mb-1 block text-sm font-bold">
                    Welcome Party &ndash; July 24
                  </FormLabel>
                  <FormLabel className="block">
                    Join us to kick off our wedding weekend in Florence at 7:00 pm.
                  </FormLabel>
                </div>
                <FormControl>
                  <RadioGroup.Root
                    className="grid grid-cols-2 gap-2"
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <Button
                      asChild
                      color={field.value === 'accept' ? 'secondary' : 'neutral'}
                      size="lg"
                      className={cn(
                        'w-full text-sm [&>svg]:size-4',
                        field.value === 'accept' && 'bg-secondary-90/50',
                      )}
                    >
                      <RadioGroup.Item value="accept">
                        {field.value === 'accept' && <Icons name="circleCheck" />}
                        {field.value === 'accept' ? 'Accepted' : 'Accept'}
                      </RadioGroup.Item>
                    </Button>
                    <Button
                      asChild
                      color={field.value === 'decline' ? 'danger' : 'neutral'}
                      size="lg"
                      className={cn(
                        'w-full text-sm [&>svg]:size-4',
                        field.value === 'decline' && 'bg-danger-90/50',
                      )}
                    >
                      <RadioGroup.Item value="decline">
                        {field.value === 'decline' && <Icons name="circleX" />}
                        {field.value === 'decline' ? 'Declined' : 'Decline'}
                      </RadioGroup.Item>
                    </Button>
                  </RadioGroup.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rsvpRehearsalDinner"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-bold">
                  Rehearsal Dinner &ndash; July 25
                </FormLabel>
                <FormControl>
                  <RadioGroup.Root
                    className="grid grid-cols-2 gap-2"
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <Button
                      asChild
                      color={field.value === 'accept' ? 'secondary' : 'neutral'}
                      size="lg"
                      className={cn(
                        'w-full text-sm [&>svg]:size-4',
                        field.value === 'accept' && 'bg-secondary-90/50',
                      )}
                    >
                      <RadioGroup.Item value="accept">
                        {field.value === 'accept' && <Icons name="circleCheck" />}
                        {field.value === 'accept' ? 'Accepted' : 'Accept'}
                      </RadioGroup.Item>
                    </Button>
                    <Button
                      asChild
                      color={field.value === 'decline' ? 'danger' : 'neutral'}
                      size="lg"
                      className={cn(
                        'w-full text-sm [&>svg]:size-4',
                        field.value === 'decline' && 'bg-danger-90/50',
                      )}
                    >
                      <RadioGroup.Item value="decline">
                        {field.value === 'decline' && <Icons name="circleX" />}
                        {field.value === 'decline' ? 'Declined' : 'Decline'}
                      </RadioGroup.Item>
                    </Button>
                  </RadioGroup.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rsvpWeddingDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-bold">
                  Wedding Day &ndash; July 26
                </FormLabel>
                <FormControl>
                  <RadioGroup.Root
                    className="grid grid-cols-2 gap-2"
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <Button
                      asChild
                      color={field.value === 'accept' ? 'secondary' : 'neutral'}
                      size="lg"
                      className={cn(
                        'w-full text-sm [&>svg]:size-4',
                        field.value === 'accept' && 'bg-secondary-90/50',
                      )}
                    >
                      <RadioGroup.Item value="accept">
                        {field.value === 'accept' && <Icons name="circleCheck" />}
                        {field.value === 'accept' ? 'Accepted' : 'Accept'}
                      </RadioGroup.Item>
                    </Button>
                    <Button
                      asChild
                      color={field.value === 'decline' ? 'danger' : 'neutral'}
                      size="lg"
                      className={cn(
                        'w-full text-sm [&>svg]:size-4',
                        field.value === 'decline' && 'bg-danger-90/50',
                      )}
                    >
                      <RadioGroup.Item value="decline">
                        {field.value === 'decline' && <Icons name="circleX" />}
                        {field.value === 'decline' ? 'Declined' : 'Decline'}
                      </RadioGroup.Item>
                    </Button>
                  </RadioGroup.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rsvpPoolDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-bold">Pool Day &ndash; July 27</FormLabel>
                <FormControl>
                  <RadioGroup.Root
                    className="grid grid-cols-2 gap-2"
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <Button
                      asChild
                      color={field.value === 'accept' ? 'secondary' : 'neutral'}
                      size="lg"
                      className={cn(
                        'w-full text-sm [&>svg]:size-4',
                        field.value === 'accept' && 'bg-secondary-90/50',
                      )}
                    >
                      <RadioGroup.Item value="accept">
                        {field.value === 'accept' && <Icons name="circleCheck" />}
                        {field.value === 'accept' ? 'Accepted' : 'Accept'}
                      </RadioGroup.Item>
                    </Button>
                    <Button
                      asChild
                      color={field.value === 'decline' ? 'danger' : 'neutral'}
                      size="lg"
                      className={cn(
                        'w-full text-sm [&>svg]:size-4',
                        field.value === 'decline' && 'bg-danger-90/50',
                      )}
                    >
                      <RadioGroup.Item value="decline">
                        {field.value === 'decline' && <Icons name="circleX" />}
                        {field.value === 'decline' ? 'Declined' : 'Decline'}
                      </RadioGroup.Item>
                    </Button>
                  </RadioGroup.Root>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {attendingEvent ? (
            <>
              <FormField
                control={form.control}
                name="transportationToVenue"
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel className="mb-1 block text-sm font-bold">
                        Transportation to Borgo Corsignano &ndash; July 25
                      </FormLabel>
                      <FormLabel className="block">
                        Please indicate if you will be using the provided transportation from
                        Florence to Borgo Corsignano. Visit the guest information page for more
                        details.
                      </FormLabel>
                    </div>
                    <FormControl>
                      <RadioGroup.Root
                        className="grid grid-cols-2 gap-2"
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={disabled}
                      >
                        <Button
                          asChild
                          color={field.value === 'yes' ? 'secondary' : 'neutral'}
                          size="lg"
                          className={cn(
                            'w-full text-sm [&>svg]:size-4',
                            field.value === 'yes' && 'bg-secondary-90/50',
                          )}
                        >
                          <RadioGroup.Item value="yes">
                            {field.value === 'yes' && <Icons name="circleCheck" />}
                            Yes
                          </RadioGroup.Item>
                        </Button>
                        <Button
                          asChild
                          color={field.value === 'no' ? 'danger' : 'neutral'}
                          size="lg"
                          className={cn(
                            'w-full text-sm [&>svg]:size-4',
                            field.value === 'no' && 'bg-danger-90/50',
                          )}
                        >
                          <RadioGroup.Item value="no">
                            {field.value === 'no' && <Icons name="circleX" />}
                            No
                          </RadioGroup.Item>
                        </Button>
                      </RadioGroup.Root>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transportationFromVenue"
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel className="mb-1 block text-sm font-bold">
                        Transportation from Borgo Corsignano &ndash; July 28
                      </FormLabel>
                      <FormLabel className="block">
                        Please indicate if you will be using the provided transportation from Borgo
                        Corsignano to Florence. Visit the guest information page for more details.
                      </FormLabel>
                    </div>
                    <FormControl>
                      <RadioGroup.Root
                        className="grid grid-cols-2 gap-2"
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={disabled}
                      >
                        <Button
                          asChild
                          color={field.value === 'yes' ? 'secondary' : 'neutral'}
                          size="lg"
                          className={cn(
                            'w-full text-sm [&>svg]:size-4',
                            field.value === 'yes' && 'bg-secondary-90/50',
                          )}
                        >
                          <RadioGroup.Item value="yes">
                            {field.value === 'yes' && <Icons name="circleCheck" />}
                            Yes
                          </RadioGroup.Item>
                        </Button>
                        <Button
                          asChild
                          color={field.value === 'no' ? 'danger' : 'neutral'}
                          size="lg"
                          className={cn(
                            'w-full text-sm [&>svg]:size-4',
                            field.value === 'no' && 'bg-danger-90/50',
                          )}
                        >
                          <RadioGroup.Item value="no">
                            {field.value === 'no' && <Icons name="circleX" />}
                            No
                          </RadioGroup.Item>
                        </Button>
                      </RadioGroup.Root>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="legalName"
                disabled={disabled}
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel className="mb-1 block text-sm font-bold">
                        Full Legal Name
                      </FormLabel>
                      <FormLabel className="block">
                        This is required to stay at Borgo Corsignano per Italian law.
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                disabled={disabled}
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel className="mb-1 block text-sm font-bold">Date of Birth</FormLabel>
                      <FormLabel className="block">
                        This is required to stay at Borgo Corsignano per Italian law.
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        className="flex flex-row items-center"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="countryOfBirth"
                disabled={disabled}
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel className="mb-1 block text-sm font-bold">
                        Country of Birth
                      </FormLabel>
                      <FormLabel className="block">
                        This is required to stay at Borgo Corsignano per Italian law.
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mealPreference"
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel className="mb-1 block text-sm font-bold">
                        Meal Preference
                      </FormLabel>
                      <FormLabel className="block">
                        Please indicate your meal preference for the wedding day. Your preference{' '}
                        <strong>cannot be changed</strong> once RSVPs close.
                      </FormLabel>
                    </div>
                    <FormControl>
                      <RadioGroup.Root
                        className="grid grid-cols-1 gap-2 xs:grid-cols-3"
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={disabled}
                      >
                        <Button
                          asChild
                          color={field.value === 'beef' ? 'secondary' : 'neutral'}
                          size="lg"
                          className={cn(
                            'w-full text-sm [&>svg]:size-4',
                            'justify-between xs:justify-center',
                            field.value === 'beef' && 'bg-secondary-90/50',
                          )}
                        >
                          <RadioGroup.Item value="beef">
                            <Icons
                              name="circleCheck"
                              className={cn(
                                field.value === 'beef' ? 'visible block' : 'invisible xs:hidden',
                              )}
                            />
                            Steak
                          </RadioGroup.Item>
                        </Button>
                        <Button
                          asChild
                          color={field.value === 'fish' ? 'secondary' : 'neutral'}
                          size="lg"
                          className={cn(
                            'w-full text-sm [&>svg]:size-4',
                            'justify-between xs:justify-center',
                            field.value === 'fish' && 'bg-secondary-90/50',
                          )}
                        >
                          <RadioGroup.Item value="fish">
                            <Icons
                              name="circleCheck"
                              className={cn(
                                field.value === 'fish' ? 'visible block' : 'invisible xs:hidden',
                              )}
                            />
                            Salmon
                          </RadioGroup.Item>
                        </Button>
                        <Button
                          asChild
                          color={field.value === 'vegetarian' ? 'secondary' : 'neutral'}
                          size="lg"
                          className={cn(
                            'w-full text-sm [&>svg]:size-4',
                            'justify-between xs:justify-center',
                            field.value === 'vegetarian' && 'bg-secondary-90/50',
                          )}
                        >
                          <RadioGroup.Item value="vegetarian">
                            <Icons
                              name="circleCheck"
                              className={cn(
                                field.value === 'vegetarian'
                                  ? 'visible block'
                                  : 'invisible xs:hidden',
                              )}
                            />
                            Vegetarian
                          </RadioGroup.Item>
                        </Button>
                      </RadioGroup.Root>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="allergies"
                disabled={disabled}
                render={({ field }) => (
                  <FormItem>
                    <div>
                      <FormLabel className="block">
                        <span className="text-sm font-bold">Allergies or Dietary Restrictions</span>{' '}
                        (optional)
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : null}
          <Button
            type="submit"
            disabled={formState.status === 'pending' || disabled}
            size="lg"
            variant="solid"
          >
            {formState.status === 'pending' ? <Spinner /> : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
