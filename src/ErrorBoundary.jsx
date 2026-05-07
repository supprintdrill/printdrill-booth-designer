import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      errorMessage: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || "Something went wrong.",
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Booth Designer Error:", error);
    console.error("Booth Designer Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error-screen">
          <div className="app-error-card">
            <h1>Something went wrong</h1>

            <p>
              The booth designer could not load correctly. Please refresh the page and try again.
            </p>

            <span>
              If the issue continues, contact PrintDrill support.
            </span>

            <button onClick={() => window.location.reload()}>
              Refresh Booth Designer
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;