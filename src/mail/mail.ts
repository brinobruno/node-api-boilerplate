import { Resend } from 'resend'

import { app } from '@/app'
import { env } from '@/config/env'
import { onboardingEmail } from './templates/onboarding'
import { resetPasswordInstructionsEmail } from './templates/reset-password-instructions'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ISendOnboardingEmail {
  email: string
  name: string
}

export async function sendOnboardingEmail({
  email,
  name,
}: ISendOnboardingEmail) {
  const { data, error } = await resend.emails.send({
    from: 'Easylove <easylove@resend.dev>',
    // to: [email],
    to: [env.ADMIN_USER_EMAIL],
    subject: 'Bem vindo ao Easylove!',
    html: onboardingEmail(name),
  })

  if (error) return app.log.error({ message: 'error sending email', error })

  app.log.info(data)
}

interface ISendPasswordResetInstructionsEmail {
  email: string
  name: string
  resetUrl: string
}

export async function sendPasswordResetInstructionsEmail({
  email,
  name,
  resetUrl,
}: ISendPasswordResetInstructionsEmail) {
  const { data, error } = await resend.emails.send({
    from: 'Easylove <easylove@resend.dev>',
    // to: [email],
    to: [env.ADMIN_USER_EMAIL],
    subject: 'Recuperação de senha',
    html: resetPasswordInstructionsEmail(name, resetUrl),
  })

  if (error) return app.log.error({ message: 'error sending email', error })

  app.log.info(data)
}
