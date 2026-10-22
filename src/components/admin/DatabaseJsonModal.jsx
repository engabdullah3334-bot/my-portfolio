import React, { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Validates JSON text against an expected template structure.
 * Checks:
 * 1. Valid JSON syntax
 * 2. Matches expected type (object vs array)
 * 3. Crucial Security / Integrity Guard: All template keys (كلمات القالب المفتاحية) MUST remain intact.
 *    User cannot accidentally delete or rename keys; only content/values can be modified.
 */
export function validateJsonIntegrity(rawText, template, options = {}) {
  const { isArray = false, requiredKeys = [], nestedTemplate = {} } = options;

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    return {
      isValid: false,
      errorType: 'SYNTAX_ERROR',
      message: `خطأ في صياغة JSON: ${err.message}`,
      missingKeys: [],
      data: null,
    };
  }

  // Type check: Array vs Object
  if (isArray) {
    if (!Array.isArray(parsed)) {
      return {
        isValid: false,
        errorType: 'TYPE_MISMATCH',
        message: 'بنية البيانات يجب أن تكون مصفوفة (Array) تحتوي على عناصر [ { ... } ].',
        missingKeys: [],
        data: parsed,
      };
    }

    // Check each item in array if requiredKeys specified
    if (requiredKeys.length > 0) {
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          return {
            isValid: false,
            errorType: 'ITEM_NOT_OBJECT',
            message: `العنصر رقم ${i + 1} ليس كائناً (Object) صالحاً.`,
            missingKeys: [],
            data: parsed,
          };
        }
        const itemKeys = new Set(Object.keys(item));
        const missing = requiredKeys.filter(k => !itemKeys.has(k));
        if (missing.length > 0) {
          const itemIdentifier = item.title || item.name || item.slug || `#${i + 1}`;
          return {
            isValid: false,
            errorType: 'KEYS_MISSING_IN_ITEM',
            message: `العنصر "${itemIdentifier}" (رقم ${i + 1}) ينقصه المفاتيح الأساسية التالية: [${missing.join(', ')}]`,
            missingKeys: missing,
            data: parsed,
          };
        }
      }
    }
  } else {
    // Single Object validation
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {
        isValid: false,
        errorType: 'TYPE_MISMATCH',
        message: 'بنية البيانات يجب أن تكون كائناً (Object) بالصيغة { ... }.',
        missingKeys: [],
        data: parsed,
      };
    }

    // Determine expected keys from template or requiredKeys
    const expectedKeys = requiredKeys.length > 0
      ? requiredKeys
      : template && typeof template === 'object'
        ? Object.keys(template)
        : [];

    if (expectedKeys.length > 0) {
      const currentKeys = new Set(Object.keys(parsed));
      const missing = expectedKeys.filter(k => !currentKeys.has(k));
      if (missing.length > 0) {
        return {
          isValid: false,
          errorType: 'TEMPLATE_KEYS_MISSING',
          message: `تم كسر القالب! المفاتيح الأساسية التالية تم حذفها أو تعديل اسمها: [${missing.join(', ')}]`,
          missingKeys: missing,
          data: parsed,
        };
      }
    }

    // Check nested template keys (e.g., education object inside site_settings)
    if (nestedTemplate && typeof nestedTemplate === 'object') {
      for (const [parentKey, expectedChildKeys] of Object.entries(nestedTemplate)) {
        const childObj = parsed[parentKey];
        if (childObj && typeof childObj === 'object' && !Array.isArray(childObj)) {
          const childKeys = new Set(Object.keys(childObj));
          const missingChild = expectedChildKeys.filter(k => !childKeys.has(k));
          if (missingChild.length > 0) {
            return {
              isValid: false,
              errorType: 'NESTED_KEYS_MISSING',
              message: `داخل الحقل "${parentKey}"، المفاتيح التالية مفقودة: [${missingChild.join(', ')}]`,
              missingKeys: missingChild.map(k => `${parentKey}.${k}`),
              data: parsed,
            };
          }
        }
      }
    }
  }

  return {
    isValid: true,
    errorType: null,
    message: 'بنية القالب سليمة 100%، جميع الكلمات المفتاحية محفوظة.',
    missingKeys: [],
    data: parsed,
  };
}

/**
 * Repairs missing keys in user data by injecting default values from the template
 * without losing any of the user's updated content.
 */
export function autoRepairKeys(parsedData, template, options = {}) {
  const { isArray = false, requiredKeys = [], nestedTemplate = {} } = options;

  if (isArray && Array.isArray(parsedData)) {
    const defaultItem = template && template[0] ? template[0] : {};
    return parsedData.map(item => {
      const fixed = { ...item };
      requiredKeys.forEach(k => {
        if (!(k in fixed)) {
          fixed[k] = defaultItem[k] !== undefined ? defaultItem[k] : '';
        }
      });
      return fixed;
    });
  }

  if (!isArray && parsedData && typeof parsedData === 'object') {
    const fixed = { ...template, ...parsedData };
    if (nestedTemplate && typeof nestedTemplate === 'object') {
      for (const [parentKey, expectedChildKeys] of Object.entries(nestedTemplate)) {
        if (template[parentKey] && typeof template[parentKey] === 'object') {
          fixed[parentKey] = {
            ...template[parentKey],
            ...(fixed[parentKey] || {}),
          };
        }
      }
    }
    return fixed;
  }

  return parsedData;
}

/**
 * High-Tech Cyberpunk Direct Database JSON Editor Modal
 */
export default function DatabaseJsonModal({
  isOpen,
  onClose,
  title = 'Direct Database Raw JSON Editor',
  tableName = 'public.table',
  initialData,
  templateData,
  validationOptions = {},
  onSave,
}) {
  const [rawText, setRawText] = useState('');
  const [saving, setSaving] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const textareaRef = useRef(null);

  // Initialize raw text on open or data change
  useEffect(() => {
    if (isOpen && initialData !== undefined) {
      try {
        setRawText(JSON.stringify(initialData, null, 2));
      } catch {
        setRawText(String(initialData));
      }
      setErrorMessage('');
      setSaveSuccess(false);
      setCopySuccess(false);
    }
  }, [isOpen, initialData]);

  // Real-time live validation
  const validation = useMemo(() => {
    if (!rawText.trim()) {
      return {
        isValid: false,
        errorType: 'EMPTY',
        message: 'محتوى المحرر فارغ حالياً.',
        missingKeys: [],
        data: null,
      };
    }
    return validateJsonIntegrity(rawText, templateData, validationOptions);
  }, [rawText, templateData, validationOptions]);

  // Statistics for editor footer
  const stats = useMemo(() => {
    const lines = rawText ? rawText.split('\n').length : 0;
    const chars = rawText.length;
    const sizeKb = (new Blob([rawText]).size / 1024).toFixed(2);
    let itemsCount = null;
    if (validation.data) {
      if (Array.isArray(validation.data)) {
        itemsCount = `${validation.data.length} عناصر`;
      } else if (typeof validation.data === 'object') {
        itemsCount = `${Object.keys(validation.data).length} حقول`;
      }
    }
    return { lines, chars, sizeKb, itemsCount };
  }, [rawText, validation]);

  // Handle Tab key inside textarea to insert 2 spaces
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      textarea.value = value.substring(0, start) + '  ' + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      setRawText(textarea.value);
    }
  };

  // Format / Beautify JSON
  const handleFormat = () => {
    try {
      const parsed = JSON.parse(rawText);
      setRawText(JSON.stringify(parsed, null, 2));
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(`تعذر التنسيق بسبب خطأ في الصياغة: ${err.message}`);
    }
  };

  // Minify JSON
  const handleMinify = () => {
    try {
      const parsed = JSON.parse(rawText);
      setRawText(JSON.stringify(parsed));
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(`تعذر التصغير: ${err.message}`);
    }
  };

  // Auto-Repair Missing Keys
  const handleAutoRepair = () => {
    try {
      let parsed = JSON.parse(rawText);
      const repaired = autoRepairKeys(parsed, templateData, validationOptions);
      setRawText(JSON.stringify(repaired, null, 2));
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(`أصلح خطأ الـ Syntax أولاً لتتمكن من استعادة المفاتيح: ${err.message}`);
    }
  };

  // Reset to original database value
  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من التراجع عن جميع التعديلات والعودة للنسخة الأصلية من قاعدة البيانات؟')) {
      setRawText(JSON.stringify(initialData, null, 2));
      setErrorMessage('');
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      /* ignore */
    }
  };

  // Commit to Database
  const handleCommit = async () => {
    if (!validation.isValid) {
      setErrorMessage(validation.message || 'لا يمكن الحفظ لوجود أخطاء في القالب أو الصياغة.');
      return;
    }

    setSaving(true);
    setErrorMessage('');
    setSaveSuccess(false);

    try {
      await onSave(validation.data);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMessage(err.message || 'فشلت عملية الحفظ في قاعدة البيانات.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#090d16] border border-cyber-border rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100 animate-fadeIn">
        
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-cyber-border bg-cyber-surface/90">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan font-mono text-base font-bold shadow-sm">
              ⚡
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base sm:text-lg">{title}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyber-card border border-cyber-cyan/40 text-cyber-cyan">
                  {tableName}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                تعديل مباشر على هيئة JSON مع حماية القوالب والمفاتيح الأساسية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-cyber-card border border-cyber-border text-slate-400 hover:text-white hover:border-slate-400 flex items-center justify-center text-sm transition-all"
            title="إغلاق (Esc)"
          >
            ✕
          </button>
        </div>

        {/* ── Real-Time Security & Template Guard Banner ─────────────────── */}
        <div className="px-6 py-3 border-b border-cyber-border/70 transition-all">
          {validation.isValid ? (
            <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold text-sm">🛡️</span>
                <span>
                  <strong>القالب سليم ومحمي 100%:</strong> جميع الكلمات المفتاحية الأصلية موجودة، والتعديلات تمس المحتوى فقط.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
                Keys Intact
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-bold text-base leading-none">⚠️</span>
                <div>
                  <strong className="block text-red-300 font-semibold mb-0.5">
                    تحذير أمان: تم تعطيل الحفظ لحماية استقرار قاعدة البيانات!
                  </strong>
                  <span className="text-slate-300">{validation.message}</span>
                  {validation.missingKeys.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[11px] text-slate-400 font-mono">المفاتيح المفقودة:</span>
                      {validation.missingKeys.map(k => (
                        <span key={k} className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[11px]">
                          {k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {validation.missingKeys.length > 0 && (
                <button
                  type="button"
                  onClick={handleAutoRepair}
                  className="px-3.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow"
                >
                  🛠️ استعادة المفاتيح الناقصة تلقائياً
                </button>
              )}
            </div>
          )}

          {errorMessage && (
            <div className="mt-2 p-2.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          {saveSuccess && (
            <div className="mt-2 p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-pulse">
              <span>✅</span>
              <span>تم حفظ التعديلات في قاعدة البيانات بنجاح وتحديث الواجهة مباشرة!</span>
            </div>
          )}
        </div>

        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-2 bg-cyber-card/60 border-b border-cyber-border text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFormat}
              className="px-3 py-1.5 rounded-lg bg-cyber-surface hover:bg-cyber-surface/80 border border-cyber-border text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              title="تنسيق وترتيب الأسطر والأقواس"
            >
              <span>✨</span>
              <span>تنسيق (Format)</span>
            </button>
            <button
              type="button"
              onClick={handleMinify}
              className="px-3 py-1.5 rounded-lg bg-cyber-surface hover:bg-cyber-surface/80 border border-cyber-border text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="ضغط الكود في سطر واحد"
            >
              تصغير (Minify)
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-cyber-surface hover:bg-cyber-surface/80 border border-cyber-border text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
              title="استرجاع البيانات الأصلية من قاعدة البيانات"
            >
              <span>🔄</span>
              <span>تراجع للأصل</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-cyber-surface hover:bg-cyber-surface/80 border border-cyber-border text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{copySuccess ? '✓' : '📋'}</span>
              <span>{copySuccess ? 'تم النسخ!' : 'نسخ الكود'}</span>
            </button>
          </div>
        </div>

        {/* ── Code Textarea ────────────────────────────────────────────────── */}
        <div className="relative flex-1 p-4 bg-[#050811] overflow-hidden flex flex-col">
          <textarea
            ref={textareaRef}
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              setErrorMessage('');
            }}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            className="w-full flex-1 h-[420px] bg-transparent text-emerald-400 font-mono text-xs sm:text-sm p-4 rounded-xl border border-cyber-border/70 focus:border-cyber-cyan focus:outline-none resize-none leading-relaxed overflow-y-auto selection:bg-cyber-cyan/30"
            placeholder="// أدخل بيانات الـ JSON هنا..."
          />
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-cyber-border bg-cyber-surface">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>سطور: <strong className="text-white">{stats.lines}</strong></span>
            <span>حجم: <strong className="text-white">{stats.sizeKb} KB</strong></span>
            {stats.itemsCount && (
              <span className="hidden sm:inline">نطاق: <strong className="text-cyber-cyan">{stats.itemsCount}</strong></span>
            )}
            <span className="text-[11px] text-slate-500 hidden md:inline">
              (مفتاح Tab يُدخل مسافتين)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyber-card border border-cyber-border text-slate-300 hover:text-white hover:bg-cyber-card/80 transition-all cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleCommit}
              disabled={!validation.isValid || saving}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                validation.isValid && !saving
                  ? 'bg-gradient-to-r from-cyber-cyan to-cyber-blue text-cyber-bg hover:opacity-90 shadow-cyber-cyan/20'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <span>{saving ? '⏳' : '💾'}</span>
              <span>{saving ? 'جاري الحفظ في Supabase...' : 'حفظ في قاعدة البيانات'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
