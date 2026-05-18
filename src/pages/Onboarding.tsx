import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { Rocket } from 'lucide-react'
import { db } from '../lib/firebase'
import { useAuth } from '../components/auth/AuthProvider'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { toast } from 'sonner'

export function OnboardingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.displayName ?? '')
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (cancelled) return
      if (snap.exists()) {
        const data = snap.data()
        if (data.onboardingComplete === true) {
          navigate('/dashboard', { replace: true })
          return
        }
        if (data.name) setName(data.name)
      }
      setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [user, navigate])

  async function handleComplete() {
    if (!user || !name.trim()) return
    setSaving(true)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        onboardingComplete: true,
      })
      toast.success('Welcome to PromptLoop!')
      navigate('/dashboard', { replace: true })
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Rocket className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to PromptLoop</CardTitle>
          <CardDescription>Set up your profile to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Display Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1.5"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={user?.email ?? ''} disabled className="mt-1.5" />
          </div>
          <Button className="w-full" onClick={handleComplete} disabled={!name.trim() || saving}>
            {saving ? 'Saving...' : 'Get Started'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
