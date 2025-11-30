import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

interface AuthDialogProps {
  open: boolean
  onClose: () => void
}

export function AuthDialog({ open, onClose }: AuthDialogProps) {
  const { signIn, signUp, signInAnon } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
        toast.success('Account created!', {
          description: 'Welcome to PokeMap'
        })
      } else {
        await signIn(email, password)
        toast.success('Signed in successfully!')
      }
      onClose()
      setEmail('')
      setPassword('')
    } catch (error: any) {
      toast.error(isSignUp ? 'Sign up failed' : 'Sign in failed', {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAnonymous = async () => {
    setLoading(true)
    try {
      await signInAnon()
      toast.success('Signed in anonymously')
      onClose()
    } catch (error: any) {
      toast.error('Anonymous sign in failed', {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create Account' : 'Sign In'}</DialogTitle>
          <DialogDescription>
            {isSignUp
              ? 'Create an account to update the map'
              : 'Sign in to contribute to PokeMap'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Email</label>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='w-full px-3 py-2 border rounded-md'
              placeholder='your@email.com'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Password</label>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full px-3 py-2 border rounded-md'
              placeholder='••••••••••'
              required
              minLength={6}
            />
          </div>

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>Or</span>
          </div>
        </div>

        <Button
          variant='outline'
          onClick={handleAnonymous}
          disabled={loading}
          className='w-full'
        >
          Continue as Guest
        </Button>

        <div className='text-center text-sm'>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type='button'
            onClick={() => setIsSignUp(!isSignUp)}
            className='text-primary hover:underline'
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
