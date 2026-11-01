import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  resetKey?: string; // change it (e.g. the pathname) to clear a caught error
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('UI error:', error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 pt-32 text-center">
        <p className="label-mono">Something broke</p>
        <h1 className="mt-3 font-heading text-display-md">This page hit an unexpected error.</h1>
        <p className="mt-4 text-muted">Reloading usually fixes it. If it keeps happening, please let me know.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-8 h-11 rounded-pill bg-a3 px-6 text-sm font-medium text-on-accent"
        >
          Reload page
        </button>
      </div>
    );
  }
}