import { useState } from 'react';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from './supabase';
import { useI18n } from './i18n';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

export function LeadForm({
  source,
  onSubmitted,
  className = '',
  buttonClassName = '',
}: {
  source: string;
  onSubmitted?: () => void;
  className?: string;
  buttonClassName?: string;
}) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [validationError, setValidationError] = useState('');

  const validate = () => {
    if (!name.trim()) return t.form.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return t.form.invalidEmail;
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError('');
    setStatus('sending');

    if (!supabase) {
      setStatus('error');
      return;
    }

    const { error } = await supabase.from('leads').insert({
      name: name.trim(),
      email: email.trim(),
      source,
    });

    if (error) {
      setStatus('error');
      return;
    }
    setStatus('success');
    onSubmitted?.();
  };

  if (status === 'success') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
          <CheckCircle className="h-6 w-6 text-green-400" strokeWidth={1.5} />
        </div>
        <p className="mt-4 text-sm text-gray-300">{t.form.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.form.namePh}
          aria-label={t.form.name}
          className="w-full rounded-xl border border-white/10 bg-[#0a1628] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-400/50"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.form.emailPh}
          aria-label={t.form.email}
          className="w-full rounded-xl border border-white/10 bg-[#0a1628] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-400/50"
        />
      </div>

      {validationError && (
        <p className="mt-2 text-xs text-red-400">{validationError}</p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-xs text-red-400">{t.form.error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3.5 text-base font-semibold text-black transition hover:bg-sky-400 disabled:opacity-60 ${buttonClassName}`}
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.form.sending}
          </>
        ) : (
          <>
            {t.form.submit}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
