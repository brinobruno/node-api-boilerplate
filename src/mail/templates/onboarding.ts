import { footer } from '../components/footer'
import { header } from '../components/header'
import { styles } from '../components/styles'

export function onboardingEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Welcome to Easylove</title>
        ${styles()}
      </head>
      <body>
        ${header('Bem vindo ao Easylove!')}
          <tr>
            <td>
              <p>Olá, ${name}!</p>
              <p>Seja bem-vindo ao Easylove! Estamos felizes em tê-lo conosco.</p>
              <p>Estamos ansiosos para ajudá-lo a encontrar o imóvel perfeito para você.</p>
              <p>Se precisar de alguma coisa, não hesite em entrar em contato.</p>
              <p>Atenciosamente,</p>
              <p><strong>Equipe Easylove</strong></p>
            </td>
          </tr>
        ${footer()}
      </body>
    </html>
  `
}
