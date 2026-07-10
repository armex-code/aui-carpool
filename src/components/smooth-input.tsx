"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type SmoothInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  wrapperClassName?: string;
};

type SmoothTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  wrapperClassName?: string;
};

function getMeasuredValue(input: HTMLInputElement, end: number) {
  const value = input.value.slice(0, end);
  if (input.type !== "password") return value;
  return "•".repeat(value.length);
}

export function SmoothInput({
  className,
  wrapperClassName,
  onBlur,
  onChange,
  onClick,
  onFocus,
  onKeyDown,
  ...props
}: SmoothInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [caretLeft, setCaretLeft] = useState(0);
  const [caretHeight, setCaretHeight] = useState(20);
  const [focused, setFocused] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  const updateCaret = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;

    const selectionStart = input.selectionStart ?? input.value.length;
    const selectionEnd = input.selectionEnd ?? selectionStart;
    const styles = window.getComputedStyle(input);
    const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
    const letterSpacing = Number.parseFloat(styles.letterSpacing) || 0;

    canvasRef.current ??= document.createElement("canvas");
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const measured = getMeasuredValue(input, selectionStart);
    ctx.font = styles.font;
    const width =
      ctx.measureText(measured).width +
      Math.max(0, measured.length - 1) * letterSpacing;

    setCaretLeft(paddingLeft + width - input.scrollLeft);
    setCaretHeight(Number.parseFloat(styles.lineHeight) || input.clientHeight * 0.55);
    setCollapsed(selectionStart === selectionEnd);
  }, []);

  useLayoutEffect(() => {
    updateCaret();
  }, [props.value, props.defaultValue, updateCaret]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleSelectionChange = () => {
      if (document.activeElement === input) updateCaret();
    };
    const resizeObserver = new ResizeObserver(updateCaret);

    document.addEventListener("selectionchange", handleSelectionChange);
    resizeObserver.observe(input);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      resizeObserver.disconnect();
    };
  }, [updateCaret]);

  const showCaret = focused && collapsed && !props.disabled && !props.readOnly;

  return (
    <span className={cn("relative block", wrapperClassName)}>
      <input
        ref={inputRef}
        className={cn(
          "w-full rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink caret-transparent placeholder:text-ink-faint focus:border-pine-500 focus:outline-2 focus:outline-pine-200 disabled:bg-paper-dim",
          className,
        )}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onChange={(event) => {
          onChange?.(event);
          requestAnimationFrame(updateCaret);
        }}
        onClick={(event) => {
          onClick?.(event);
          requestAnimationFrame(updateCaret);
        }}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
          requestAnimationFrame(updateCaret);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          requestAnimationFrame(updateCaret);
        }}
        {...props}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 w-0.5 -translate-y-1/2 rounded-full bg-pine-700 opacity-0 shadow-[0_0_0_1px_rgb(15_81_50_/_0.12)] transition-[left,opacity] duration-200 ease-out motion-reduce:transition-none",
          showCaret && "opacity-100",
        )}
        style={{
          height: caretHeight,
          left: caretLeft,
        }}
      />
    </span>
  );
}

export function SmoothTextarea({
  className,
  wrapperClassName,
  onBlur,
  onChange,
  onClick,
  onFocus,
  onKeyDown,
  ...props
}: SmoothTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const [caret, setCaret] = useState({ left: 14, top: 12, height: 20 });
  const [focused, setFocused] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [text, setText] = useState(String(props.value ?? props.defaultValue ?? ""));

  const updateCaret = useCallback(() => {
    const textarea = textareaRef.current;
    const marker = markerRef.current;
    if (!textarea || !marker) return;

    const styles = window.getComputedStyle(textarea);
    const selectionStart = textarea.selectionStart ?? textarea.value.length;
    const selectionEnd = textarea.selectionEnd ?? selectionStart;

    setText(textarea.value.slice(0, selectionStart));
    setCollapsed(selectionStart === selectionEnd);

    requestAnimationFrame(() => {
      const nextMarker = markerRef.current;
      const nextTextarea = textareaRef.current;
      if (!nextMarker || !nextTextarea) return;

      setCaret({
        left: nextMarker.offsetLeft - nextTextarea.scrollLeft,
        top: nextMarker.offsetTop - nextTextarea.scrollTop,
        height:
          Number.parseFloat(styles.lineHeight) ||
          Number.parseFloat(styles.fontSize) * 1.35 ||
          20,
      });
    });
  }, []);

  useLayoutEffect(() => {
    updateCaret();
  }, [props.value, props.defaultValue, updateCaret]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleSelectionChange = () => {
      if (document.activeElement === textarea) updateCaret();
    };
    const resizeObserver = new ResizeObserver(updateCaret);

    document.addEventListener("selectionchange", handleSelectionChange);
    resizeObserver.observe(textarea);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      resizeObserver.disconnect();
    };
  }, [updateCaret]);

  const showCaret = focused && collapsed && !props.disabled && !props.readOnly;

  return (
    <span className={cn("relative block", wrapperClassName)}>
      <textarea
        ref={textareaRef}
        className={cn(
          "min-h-24 w-full rounded-xl border border-line-strong bg-white px-3.5 py-2.5 text-sm text-ink caret-transparent placeholder:text-ink-faint focus:border-pine-500 focus:outline-2 focus:outline-pine-200 disabled:bg-paper-dim",
          className,
        )}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        onChange={(event) => {
          onChange?.(event);
          requestAnimationFrame(updateCaret);
        }}
        onClick={(event) => {
          onClick?.(event);
          requestAnimationFrame(updateCaret);
        }}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
          requestAnimationFrame(updateCaret);
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          requestAnimationFrame(updateCaret);
        }}
        onScroll={updateCaret}
        {...props}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 whitespace-pre-wrap break-words rounded-xl border border-transparent px-3.5 py-2.5 text-sm text-transparent",
          className,
        )}
      >
        {text}
        <span ref={markerRef}>{"\u200b"}</span>
      </span>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute w-0.5 rounded-full bg-pine-700 opacity-0 shadow-[0_0_0_1px_rgb(15_81_50_/_0.12)] transition-[left,top,opacity] duration-200 ease-out motion-reduce:transition-none",
          showCaret && "opacity-100",
        )}
        style={{
          height: caret.height,
          left: caret.left,
          top: caret.top,
        }}
      />
    </span>
  );
}
