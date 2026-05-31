import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error in UI:', error, info)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 text-4xl">😵</div>
          <h1 className="text-xl font-semibold text-ink-50">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-ink-400">
            The app hit an unexpected error. Your saved data is safe in this
            browser. Try reloading.
          </p>
          <pre className="mt-4 max-h-32 w-full overflow-auto rounded-lg bg-ink-950/70 p-3 text-left text-xs text-red-300">
            {this.state.error.message}
          </pre>
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-ink-950 hover:bg-brand-400"
            >
              Reload app
            </button>
            <button
              onClick={this.handleReset}
              className="rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-ink-100 hover:bg-white/10"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
