import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center min-h-[300px] rounded-xl">
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Что-то пошло не так.</h2>
            <p className="text-base text-red-500 mb-6">Произошла ошибка при загрузке компонента.</p>
            <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="retry-button px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
                Попробовать снова
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
