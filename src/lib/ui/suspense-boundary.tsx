"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SuspenseBoundaryProps extends React.HTMLAttributes<HTMLElement> {
  loadingComponent: React.ReactNode;
  errorMessage?: string;
}

export default function SuspenseBoundary({ ...props }: SuspenseBoundaryProps) {
  const { loadingComponent, errorMessage } = props;

  return (
    <ErrorBoundary fallback={<ErrorFallback errorMessage={errorMessage} />}>
      <Suspense fallback={loadingComponent}>{props.children}</Suspense>
    </ErrorBoundary>
  );
}

interface ErrorFallbackProps extends React.HTMLAttributes<HTMLElement> {
  errorMessage?: string;
}

export function ErrorFallback({ ...props }: ErrorFallbackProps) {
  return <div>{props.errorMessage ?? "Something went wrong"}</div>;
}
