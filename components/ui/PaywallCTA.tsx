import { Lock } from 'lucide-react'
import { Button } from './Button'

interface PaywallCTAProps {
  isAuthenticated?: boolean
}

export function PaywallCTA({ isAuthenticated = false }: PaywallCTAProps) {
  return (
    <div className="my-8 rounded-lg border border-border bg-muted/50 p-8 text-center">
      <Lock className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
      {isAuthenticated ? (
        <>
          <h3 className="text-lg font-semibold text-foreground">Unlock all 23 lessons for $49</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            One-time payment, lifetime access. No subscription.
          </p>
          <div className="mt-6">
            <Button href="/pricing">Get Full Access</Button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-foreground">Sign up to unlock all lessons</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The first 3 lessons are free. Unlock all 23 lessons for a one-time payment of $49.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="secondary" href="/sign-up">
              Sign Up Free
            </Button>
            <Button href="/pricing">View Pricing</Button>
          </div>
        </>
      )}
    </div>
  )
}
