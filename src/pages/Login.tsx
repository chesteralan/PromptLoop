import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { OAuthButtons } from '../components/auth/OAuthButtons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithGitHub } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-muted/30">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">PromptLoop</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthButtons
            onGoogleSignIn={signInWithGoogle}
            onGitHubSignIn={signInWithGitHub}
            isLoading={loading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
