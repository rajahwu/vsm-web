'use client';

import React from 'react';

interface FlowErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

interface FlowErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export class FlowErrorBoundary extends React.Component<
  FlowErrorBoundaryProps,
  FlowErrorBoundaryState
> {
  state: FlowErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): FlowErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Mission flow error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-zinc-100 p-6 text-center">
        <h1 className="text-2xl font-bold mb-3 text-emerald-400">Mission Flow Error</h1>
        <p className="text-sm text-zinc-400 mb-6">
          {this.state.message || 'Something went wrong during the ritual.'}
        </p>
        <button
          onClick={this.handleReset}
          className="px-6 py-3 bg-emerald-600 text-black font-bold uppercase tracking-wide rounded"
        >
          Reset Flow
        </button>
      </div>
    );
  }
}
