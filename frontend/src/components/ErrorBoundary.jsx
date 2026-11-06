import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Smart KRISHI caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-stone-200 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={36} />
            </div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-stone-600 text-base mb-6">
              The application encountered a temporary display issue. Don't worry, your data is safe.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-2xl transition active:scale-95 shadow-sm text-base cursor-pointer"
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-2xl transition active:scale-95 text-base cursor-pointer"
              >
                <Home size={18} />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

