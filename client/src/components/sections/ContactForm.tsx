import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { contactSchema, type ContactInput } from '@/lib/schemas';
import { spring } from '@/lib/motion';
import { useToast } from '@/app/ToastProvider';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const input =
  'w-full rounded-2xl border border-line-strong bg-surface px-4 text-sm text-fg placeholder:text-muted transition-colors duration-200 focus-visible:border-a2-text';

const FIELDS = ['name', 'email', 'message'] as const;

export function ContactForm() {
  const { toast } = useToast();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '', website: '' },
    mode: 'onTouched',
  });

  const send = useMutation({
    mutationFn: (values: ContactInput) => api('/contact', { method: 'POST', body: values }),
  });

  const messageLength = watch('message')?.length ?? 0;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await send.mutateAsync(values);
      reset();
      setSent(true);
      toast({ kind: 'success', title: 'Message sent', description: "Thanks for reaching out. I'll reply soon." });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 && Array.isArray(err.details)) {
          for (const d of err.details as Array<{ path: string; message: string }>) {
            if ((FIELDS as readonly string[]).includes(d.path)) {
              setError(d.path as (typeof FIELDS)[number], { message: d.message });
            }
          }
          toast({ kind: 'error', title: 'Please check the highlighted fields' });
        } else if (err.status === 429) {
          toast({ kind: 'error', title: 'Too many messages', description: err.message });
        } else if (err.code === 'NETWORK_ERROR' || err.code === 'TIMEOUT') {
          toast({
            kind: 'error',
            title: "Couldn't reach the server",
            description: 'It may be waking up. Please try again in a moment, or email me directly.',
          });
        } else {
          toast({ kind: 'error', title: 'Message not sent', description: err.message });
        }
      } else {
        toast({ kind: 'error', title: 'Something went wrong', description: 'Please try again.' });
      }
    }
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent"
          role="status"
          className="flex min-h-80 flex-col items-center justify-center text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={spring.soft}
        >
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...spring.bouncy, delay: 0.1 }}>
            <CheckCircle2 className="h-14 w-14 text-a2-text" aria-hidden="true" />
          </motion.span>
          <h3 className="mt-5 font-heading text-display-sm">Message sent</h3>
          <p className="mt-2 max-w-xs text-muted">Thanks for reaching out. I'll get back to you soon.</p>
          <div className="mt-8">
            <Button variant="secondary" onClick={() => setSent(false)}>
              Send another message
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          className="relative space-y-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Honeypot: invisible to people, and skipped by keyboard and screen readers */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Website
              <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
            </label>
          </div>

          <div>
            <label htmlFor="cf-name" className="mb-2 block text-sm font-medium">
              Name
            </label>
            <input
              id="cf-name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'cf-name-err' : undefined}
              className={cn(input, 'h-12', errors.name && 'border-a3')}
              {...register('name')}
            />
            {errors.name && (
              <p id="cf-name-err" role="alert" className="mt-2 text-sm text-a3">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="cf-email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="cf-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'cf-email-err' : undefined}
              className={cn(input, 'h-12', errors.email && 'border-a3')}
              {...register('email')}
            />
            {errors.email && (
              <p id="cf-email-err" role="alert" className="mt-2 text-sm text-a3">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor="cf-message" className="text-sm font-medium">
                Message
              </label>
              <span className={cn('font-mono text-xs', messageLength > 2000 ? 'text-a3' : 'text-muted')}>
                {messageLength}/2000
              </span>
            </div>
            <textarea
              id="cf-message"
              rows={6}
              placeholder="Tell me about your idea, opportunity or question"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'cf-message-err' : undefined}
              className={cn(input, 'min-h-40 resize-y py-3', errors.message && 'border-a3')}
              {...register('message')}
            />
            {errors.message && (
              <p id="cf-message-err" role="alert" className="mt-2 text-sm text-a3">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button type="submit" size="lg" magnetic disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                Send message
              </>
            )}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}