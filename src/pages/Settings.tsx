import { Sun, Minus } from 'lucide-react'
import { PageHeader } from '../components/shared/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { useSettingsStore } from '../store/settingsStore'
import { isElectron } from '../lib/env'
import { THEME_OPTIONS } from '../lib/theme-config'

export function SettingsPage() {
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const minimizeToTrayOnClose = useSettingsStore((s) => s.minimizeToTrayOnClose)
  const toggleMinimizeToTray = useSettingsStore((s) => s.toggleMinimizeToTray)

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Customize your PromptLoop experience" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="size-5" />
            Theme
          </CardTitle>
          <CardDescription>Choose your preferred appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={theme === value ? 'default' : 'outline'}
                className="flex-1 gap-2"
                onClick={() => setTheme(value)}
              >
                <Icon className="size-4" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {isElectron && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Minus className="size-5" />
              Window
            </CardTitle>
            <CardDescription>Configure window behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={minimizeToTrayOnClose}
                onChange={toggleMinimizeToTray}
                className="size-4"
              />
              <div>
                <p className="text-sm font-medium">Minimize to tray</p>
                <p className="text-xs text-muted-foreground">
                  Keep the app running in the system tray when closing the window
                </p>
              </div>
            </label>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
