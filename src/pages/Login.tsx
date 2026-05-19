import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import { OAuthButtons } from '../components/auth/OAuthButtons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { LoadingScreen } from '../components/shared/LoadingScreen'

export function LoginPage() {
  const { user, loading, signInWithGoogle, signInWithGitHub } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await signInWithGoogle()
    } catch {
      toast.error('Failed to sign in with Google')
    }
  }, [signInWithGoogle])

  const handleGitHubSignIn = useCallback(async () => {
    try {
      await signInWithGitHub()
    } catch {
      toast.error('Failed to sign in with GitHub')
    }
  }, [signInWithGitHub])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="flex h-screen items-center justify-center bg-muted/30">
      <Card className="w-full max-w-sm" aria-label="Sign in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">PromptLoop</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthButtons
            onGoogleSignIn={handleGoogleSignIn}
            onGitHubSignIn={handleGitHubSignIn}
            isLoading={loading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
