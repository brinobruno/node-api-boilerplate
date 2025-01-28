import { env } from '@/config/env'
import { Resend } from 'resend'
import { onboardingEmail } from './templates/onboarding'

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
    from: 'RentalXP <rentalxp@resend.dev>',
    // to: [email],
    to: [env.ADMIN_USER_EMAIL],
    subject: 'Bem vindo ao RentalXP!',
    html: onboardingEmail(name),
  })

  if (error) return console.error({ message: 'error sending email', error })

  console.log(data)
}
